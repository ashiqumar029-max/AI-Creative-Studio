import React, { useState } from 'react';
import {
  X,
  Share2,
  Globe,
  Lock,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { updateProject } from '../services/db/projectService';
import { useToast } from '../context/ToastContext';
import type { Project } from '../types';

interface ShareProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onProjectUpdated?: (updated: Project) => void;
}

export const ShareProjectModal: React.FC<ShareProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onProjectUpdated,
}) => {
  const { toast } = useToast();
  const [isPublic, setIsPublic] = useState<boolean>(project?.isPublic ?? false);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if project changes
  React.useEffect(() => {
    if (project) {
      setIsPublic(project.isPublic ?? false);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const shareUrl = `${window.location.origin}/share/${project.id}`;

  const handleTogglePublic = async (nextState: boolean) => {
    setIsPublic(nextState);
    setIsSaving(true);
    try {
      await updateProject(project.id, { isPublic: nextState });
      const updated: Project = { ...project, isPublic: nextState };
      if (onProjectUpdated) onProjectUpdated(updated);
      toast.success(
        nextState ? 'Project Made Public' : 'Project Made Private',
        nextState
          ? 'Anyone with the unique link can now view this workspace.'
          : 'Access is now restricted to your private account only.'
      );
    } catch (e) {
      setIsPublic(!nextState);
      toast.error('Update Failed', 'Could not update visibility setting.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link Copied', 'Unique share URL copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0F111D] border border-white/15 shadow-2xl p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Share Project Workspace</h2>
            <p className="text-xs text-slate-400">"{project.name}"</p>
          </div>
        </div>

        {/* Public / Private Toggle Switch */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isPublic ? (
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-white">
                  {isPublic ? 'Public Visibility Enabled' : 'Private (Confidential)'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isPublic
                    ? 'Anyone with this unique link can view the brief and deliverables.'
                    : 'Only you and workspace admins can access this project.'}
                </p>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleTogglePublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isPublic ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isPublic ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Unique Link Field (Active when public) */}
        {isPublic ? (
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Unique Shareable Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-purple-300 font-mono focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-purple-600/20"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline font-medium"
              >
                <span>Open Public Showcase in New Tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[11px] text-slate-500 font-mono">Verified SSL</span>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
            <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <p>
              To generate and share a public link with clients or team members, enable the Public Visibility toggle above.
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
