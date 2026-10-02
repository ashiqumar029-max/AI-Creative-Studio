import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Copy,
  Trash2,
  Edit2,
  ExternalLink,
  Video,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Mic,
  Megaphone,
  Share2,
  Palette,
  CheckCircle2,
  MoreVertical,
  X,
  Download,
  FileDown,
  Archive,
  Tag,
  Globe,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  getUserProjects,
  updateProject,
  deleteProject,
  duplicateProject,
} from '../../services/db/projectService';
import { exportProjectAsZip, exportProjectAsPdf } from '../../services/exportService';
import { getUserGenerations } from '../../services/db/generationService';
import { ShareProjectModal } from '../../components/ShareProjectModal';
import type { Project, ProjectType, ProjectStatus } from '../../types';

interface OutletContextType {
  openNewProject: () => void;
  openCheckout: () => void;
}

const DEFAULT_TAGS = ['Work', 'Personal', 'Draft'];

export const ProjectsPage: React.FC = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { openNewProject } = useOutletContext<OutletContextType>();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [exportingId, setExportingId] = useState<string | null>(null);

  // Share Modal State
  const [sharingProject, setSharingProject] = useState<Project | null>(null);

  // Edit Modal state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editStatus, setEditStatus] = useState<ProjectStatus>('draft');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState('');
  const [editIsPublic, setEditIsPublic] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [userProfile]);

  const loadProjects = async () => {
    if (!userProfile) return;
    setLoading(true);
    try {
      const list = await getUserProjects(userProfile.userId);
      setProjects(list || []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Collect all unique tags across projects
  const availableTags = useMemo(() => {
    const set = new Set<string>(DEFAULT_TAGS);
    projects.forEach((p) => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach((t) => set.add(t));
      }
    });
    return Array.from(set);
  }, [projects]);

  const handleDuplicate = async (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userProfile) return;
    try {
      await duplicateProject(project, userProfile.userId);
      await loadProjects();
      toast.success('Project Duplicated', `Created a copy of "${project.name}"`);
    } catch (err) {
      console.error('Failed to duplicate:', err);
      toast.error('Duplication Failed', 'Could not duplicate project.');
    }
  };

  const handleDelete = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this project?')) return;
    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.info('Project Deleted', 'Project container removed from vault.');
    } catch (err) {
      console.error('Failed to delete project:', err);
      toast.error('Deletion Failed', 'Could not delete project.');
    }
  };

  const handleStatusChange = async (
    projectId: string,
    newStatus: ProjectStatus,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    e.stopPropagation();
    try {
      await updateProject(projectId, { status: newStatus });
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
      );
      toast.success('Status Updated', `Project marked as ${newStatus.replace('_', ' ')}.`);
    } catch (err) {
      console.error('Failed to update project status:', err);
      toast.error('Update Failed', 'Could not change status.');
    }
  };

  const handleExportZip = async (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userProfile) return;
    setExportingId(project.id);
    try {
      const gens = await getUserGenerations(userProfile.userId);
      const projectGens = gens.filter((g) => g.projectId === project.id);
      await exportProjectAsZip(project, projectGens);
      toast.success('ZIP Export Complete', `Downloaded bundle for "${project.name}"`);
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Export Failed', 'Unable to bundle project assets.');
    } finally {
      setExportingId(null);
    }
  };

  const handleExportPdf = async (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userProfile) return;
    try {
      const gens = await getUserGenerations(userProfile.userId);
      const projectGens = gens.filter((g) => g.projectId === project.id);
      exportProjectAsPdf(project, projectGens);
      toast.info('Generating PDF', `Preparing printable dossier for "${project.name}"`);
    } catch (err) {
      console.error('PDF error:', err);
      toast.error('PDF Generation Failed', 'Unable to prepare dossier.');
    }
  };

  const openEditModal = (p: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(p);
    setEditName(p.name);
    setEditDesc(p.description || '');
    setEditStatus(p.status);
    setEditTags(p.tags || ['Work']);
    setEditIsPublic(p.isPublic ?? false);
  };

  const handleAddEditTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = editTagInput.trim().replace(/^#/, '');
      if (trimmed && !editTags.includes(trimmed)) {
        setEditTags([...editTags, trimmed]);
      }
      setEditTagInput('');
    }
  };

  const handleRemoveEditTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((t) => t !== tagToRemove));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsUpdating(true);
    try {
      await updateProject(editingProject.id, {
        name: editName,
        description: editDesc,
        status: editStatus,
        tags: editTags,
        isPublic: editIsPublic,
      });
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProject.id
            ? {
                ...p,
                name: editName,
                description: editDesc,
                status: editStatus,
                tags: editTags,
                isPublic: editIsPublic,
              }
            : p
        )
      );
      setEditingProject(null);
      toast.success('Project Saved', 'Project details and settings updated successfully.');
    } catch (err) {
      console.error('Failed to save project edits:', err);
      toast.error('Save Failed', 'Could not save project changes.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getTypeIcon = (type: ProjectType) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-purple-400" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-pink-400" />;
      case 'thumbnail':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'script':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'voiceover':
        return <Mic className="w-4 h-4 text-emerald-400" />;
      case 'advertisement':
        return <Megaphone className="w-4 h-4 text-rose-400" />;
      case 'social_media':
        return <Share2 className="w-4 h-4 text-blue-400" />;
      case 'branding':
        return <Palette className="w-4 h-4 text-orange-400" />;
      default:
        return <FolderKanban className="w-4 h-4 text-purple-400" />;
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || p.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    const matchesTag =
      selectedTag === 'all' || (p.tags && p.tags.includes(selectedTag));
    return matchesSearch && matchesType && matchesStatus && matchesTag;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            My Projects
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize, categorize with tags, share unique links, and export your generative campaigns
          </p>
        </div>

        <button
          onClick={openNewProject}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0C0E17] border border-white/10 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by name or brief keywords..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full md:w-auto px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 capitalize"
            >
              <option value="all">All Types</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="thumbnail">Thumbnail</option>
              <option value="script">Script</option>
              <option value="voiceover">Voiceover</option>
              <option value="advertisement">Advertisement</option>
              <option value="social_media">Social Media</option>
              <option value="branding">Branding</option>
            </select>

            {/* Status filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full md:w-auto px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 capitalize"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Tag Categorization Filter Pill Row */}
        <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3 text-purple-400" />
            Tags:
          </span>
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedTag === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All Tags ({projects.length})
          </button>
          {availableTags.map((tag) => {
            const count = projects.filter((p) => p.tags && p.tags.includes(tag)).length;
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? 'all' : tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>#{tag}</span>
                <span className="text-[10px] opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#0C0E17] border border-white/10 space-y-4">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-white">No matching projects</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Try adjusting your search query, type, status, or tag filter, or create a new workspace container.
            </p>
          </div>
          <button
            onClick={openNewProject}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
          >
            Create New Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-[#0F111D] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between group shadow-xl hover:shadow-purple-950/20"
            >
              <div className="space-y-4">
                {/* Header badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                      {getTypeIcon(p.type)}
                    </span>
                    <span className="text-[11px] font-mono text-purple-300 uppercase px-2 py-0.5 rounded bg-purple-500/10">
                      {p.type.replace('_', ' ')}
                    </span>
                    {/* Public / Private Badge */}
                    {p.isPublic ? (
                      <span
                        title="Publicly accessible via unique share link"
                        className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1"
                      >
                        <Globe className="w-2.5 h-2.5" />
                        Public
                      </span>
                    ) : (
                      <span
                        title="Private project (only visible to you)"
                        className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-semibold flex items-center gap-1"
                      >
                        <Lock className="w-2.5 h-2.5" />
                        Private
                      </span>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={p.status}
                    onChange={(e) => handleStatusChange(p.id, e.target.value as ProjectStatus, e)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border focus:outline-none cursor-pointer ${
                      p.status === 'completed'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : p.status === 'in_progress'
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                        : p.status === 'archived'
                        ? 'bg-slate-800 border-slate-700 text-slate-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}
                  >
                    <option value="draft">Draft</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {p.description || 'No description provided.'}
                  </p>
                </div>

                {/* Custom Tags on Project Card */}
                {p.tags && p.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {p.tags.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTag(tag)}
                        title={`Filter by #${tag}`}
                        className="px-2 py-0.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[11px] font-medium border border-purple-500/20 transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer info & action buttons */}
              <div className="pt-4 mt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Updated: {new Date(p.updatedAt).toLocaleDateString()}</span>
                  <span>ID: {p.id.slice(-6)}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate(`/dashboard/tools?tool=${p.type}&project=${p.id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-purple-600/30 hover:border-purple-500/40 text-xs font-semibold text-slate-200 hover:text-white border border-white/10 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in Tool</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {/* Share Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSharingProject(p);
                        }}
                        title="Share project & manage public link"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDuplicate(p, e)}
                        title="Duplicate project"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => openEditModal(p, e)}
                        title="Edit project metadata & settings"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(p.id, e)}
                        title="Delete project"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Bulk Export Row */}
                  <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                    <button
                      onClick={(e) => handleExportZip(p, e)}
                      disabled={exportingId === p.id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 text-[11px] font-semibold transition-colors disabled:opacity-50"
                      title="Download project brief, metadata, and asset list as a .ZIP archive"
                    >
                      <Archive className="w-3 h-3 text-purple-400" />
                      <span>{exportingId === p.id ? 'Archiving...' : 'Export ZIP'}</span>
                    </button>

                    <button
                      onClick={(e) => handleExportPdf(p, e)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold transition-colors"
                      title="Generate printable executive dossier and PDF"
                    >
                      <FileDown className="w-3 h-3 text-cyan-400" />
                      <span>Export PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Project Modal */}
      <ShareProjectModal
        isOpen={Boolean(sharingProject)}
        project={sharingProject}
        onClose={() => setSharingProject(null)}
        onProjectUpdated={(updated) => {
          setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          setSharingProject(updated);
        }}
      />

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0F111D] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingProject(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white">Edit Project Settings</h2>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ProjectStatus)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="draft">Draft</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Public / Private Toggle */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {editIsPublic ? (
                    <Globe className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-white">
                      {editIsPublic ? 'Public Workspace (Link Sharing)' : 'Private Workspace'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {editIsPublic
                        ? 'Unique share link is active for this project.'
                        : 'Only accessible in your private dashboard.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditIsPublic(!editIsPublic)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    editIsPublic ? 'bg-purple-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      editIsPublic ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Tag Categorization */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Custom Labels & Tags</span>
                  <span className="text-[10px] text-slate-400">Type & press Enter to add</span>
                </label>
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {editTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-medium border border-purple-500/30 flex items-center gap-1.5"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveEditTag(tag)}
                        className="hover:text-red-400 text-slate-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editTagInput}
                    onChange={(e) => setEditTagInput(e.target.value)}
                    onKeyDown={handleAddEditTag}
                    placeholder="Add label (e.g. Work, Personal, Draft)..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = editTagInput.trim().replace(/^#/, '');
                      if (trimmed && !editTags.includes(trimmed)) {
                        setEditTags([...editTags, trimmed]);
                        setEditTagInput('');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-200 border border-white/10 font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Description / Creative Brief
                </label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-xs font-medium hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Update Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
