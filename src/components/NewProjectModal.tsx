import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  FolderPlus,
  Video,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Mic,
  Megaphone,
  Share2,
  Palette,
  Tag,
  Globe,
  Lock,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createProject } from '../services/db/projectService';
import type { ProjectType } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: () => void;
}

const PRESET_TAGS = ['Work', 'Personal', 'Draft', 'Campaign', 'Client', 'YouTube', 'Social'];

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [type, setType] = useState<ProjectType>('video');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Work']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const projectTypes: { id: ProjectType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'video', label: 'AI Video', icon: <Video className="w-4 h-4 text-purple-400" />, desc: 'Cinematic shorts, YouTube, and commercial loops' },
    { id: 'image', label: 'AI Image', icon: <ImageIcon className="w-4 h-4 text-pink-400" />, desc: 'Photorealism, 3D artwork, and brand visuals' },
    { id: 'thumbnail', label: 'YouTube Thumbnail', icon: <Sparkles className="w-4 h-4 text-amber-400" />, desc: 'CTR-boosted 3D badges and viral overlays' },
    { id: 'script', label: 'Script & Story', icon: <FileText className="w-4 h-4 text-cyan-400" />, desc: 'YouTube scripts, storytelling arcs, and hooks' },
    { id: 'voiceover', label: 'AI Voiceover', icon: <Mic className="w-4 h-4 text-emerald-400" />, desc: 'Studio narration with custom emotional prosody' },
    { id: 'advertisement', label: 'Ad Campaign', icon: <Megaphone className="w-4 h-4 text-rose-400" />, desc: 'TikTok, Reels, and YouTube conversion ads' },
    { id: 'social_media', label: 'Social Media', icon: <Share2 className="w-4 h-4 text-blue-400" />, desc: 'Viral carousel outlines and multi-channel posts' },
    { id: 'branding', label: 'Branding Kit', icon: <Palette className="w-4 h-4 text-orange-400" />, desc: 'Vector logomarks, typography, and stationery' },
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = customTagInput.trim().replace(/^#/, '');
      if (trimmed && !selectedTags.includes(trimmed)) {
        setSelectedTags([...selectedTags, trimmed]);
      }
      setCustomTagInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a project name');
      return;
    }
    if (!userProfile) {
      setError('You must be logged in to create a project');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createProject(userProfile.userId, {
        name: name.trim(),
        type,
        description: description.trim(),
        status: 'in_progress',
        tags: selectedTags.length > 0 ? selectedTags : ['Work'],
        isPublic,
      });

      if (onProjectCreated) onProjectCreated();
      onClose();
      toast.success('Project Created', `Workspace container "${name.trim()}" ready.`);
      navigate('/dashboard/projects');
    } catch (err) {
      console.error('Failed to create project:', err);
      setError('Failed to create project. Please try again.');
      toast.error('Project Creation Failed', 'Unable to create project container.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0F111D] border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Create New Project</h2>
            <p className="text-xs text-slate-400">Initialize a workspace container with custom labels and visibility</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cyberpunk Cinematic Series, Viral Hook Automation"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Creative Medium / Type
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {projectTypes.map((pt) => {
                const isSelected = type === pt.id;
                return (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => setType(pt.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-950/30 ring-1 ring-purple-500/60'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">{pt.icon}</div>
                    <div>
                      <p className="text-xs font-bold text-white">{pt.label}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{pt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project Categorization Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-purple-400" />
                Category Labels / Tags
              </span>
              <span className="text-[10px] text-slate-400">Click to toggle or type custom tag</span>
            </label>
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              {PRESET_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={handleAddCustomTag}
                placeholder="Type custom tag & press Enter (e.g. Q3Launch)..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => {
                  const trimmed = customTagInput.trim().replace(/^#/, '');
                  if (trimmed && !selectedTags.includes(trimmed)) {
                    setSelectedTags([...selectedTags, trimmed]);
                    setCustomTagInput('');
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-200 border border-white/10 font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Public / Private Toggle */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isPublic ? (
                <Globe className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-4 h-4 text-slate-400" />
              )}
              <div>
                <p className="text-xs font-bold text-white">
                  {isPublic ? 'Public Workspace (Link Sharing Enabled)' : 'Private Workspace (Default)'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {isPublic
                    ? 'Generates a unique shareable link for clients and collaborators.'
                    : 'Only you can view and edit this project.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isPublic ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isPublic ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Description / Creative Brief (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key notes, target audience, style preferences, and aesthetic direction..."
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-xs font-medium hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              <FolderPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Creating...' : 'Initialize Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
