import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Search,
  Trash2,
  ExternalLink,
  Eye,
  X,
  Video,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Mic,
  Megaphone,
} from 'lucide-react';
import { adminGetAllProjects, deleteProject } from '../../services/db/projectService';
import type { Project, ProjectType } from '../../types';

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const list = await adminGetAllProjects();
      if (list && list.length > 0) {
        setProjects(list);
      } else {
        // Fallback demo projects
        setProjects([
          {
            id: 'proj_demo_1',
            userId: 'user_1',
            name: 'Cyberpunk Film Teaser 2026',
            type: 'video',
            description: '4K trailer sequence featuring volumetric rain and futuristic lighting.',
            status: 'completed',
            createdAt: '2026-09-29T12:00:00Z',
            updatedAt: '2026-10-01T15:00:00Z',
          },
          {
            id: 'proj_demo_2',
            userId: 'user_2',
            name: 'Viral TikTok UGC Campaign',
            type: 'advertisement',
            description: 'E-commerce product hook and conversion scene blueprints.',
            status: 'in_progress',
            createdAt: '2026-10-01T08:00:00Z',
            updatedAt: '2026-10-01T10:00:00Z',
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to load admin projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this project?')) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (viewingProject?.id === id) setViewingProject(null);
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Global Project Vault
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Inspect, audit, and curate all user-generated workspaces and media containers
        </p>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-[#0B0D15] border border-white/10 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects across all creators..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full md:w-auto px-4 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500 capitalize"
        >
          <option value="all">All Media Types</option>
          <option value="video">Video</option>
          <option value="image">Image</option>
          <option value="thumbnail">Thumbnail</option>
          <option value="script">Script</option>
          <option value="voiceover">Voiceover</option>
          <option value="advertisement">Advertisement</option>
          <option value="social_media">Social Media</option>
          <option value="branding">Branding</option>
        </select>
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0B0D15] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Owner ID</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-white">{p.name}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-sm mt-0.5">
                      {p.description || 'No description'}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] uppercase font-mono font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                      {p.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        p.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {p.userId.slice(0, 10)}...
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingProject(p)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(p.id, e)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Project Modal */}
      {viewingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0F111B] border border-white/10 shadow-2xl p-6 space-y-4">
            <button
              onClick={() => setViewingProject(null)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-500/10">
                {viewingProject.type}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">ID: {viewingProject.id}</span>
            </div>

            <h2 className="text-xl font-bold text-white">{viewingProject.name}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {viewingProject.description || 'No creative brief entered.'}
            </p>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs text-slate-400">
              <p>Owner ID: <span className="text-white font-mono">{viewingProject.userId}</span></p>
              <p>Status: <span className="capitalize text-white font-semibold">{viewingProject.status}</span></p>
              <p>Created: <span className="text-white">{new Date(viewingProject.createdAt).toLocaleString()}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
