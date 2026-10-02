import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  FolderKanban,
  Tag,
  Share2,
  Check,
  Copy,
  Lock,
  Globe,
  ExternalLink,
  Archive,
  FileDown,
  ArrowRight,
  Shield,
  Layers,
  Calendar,
} from 'lucide-react';
import { getPublicProject } from '../services/db/projectService';
import { exportProjectAsZip, exportProjectAsPdf } from '../services/exportService';
import { getUserGenerations } from '../services/db/generationService';
import { useToast } from '../context/ToastContext';
import type { Project, Generation } from '../types';

export const PublicSharedProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!projectId) return;
      setLoading(true);
      try {
        const p = await getPublicProject(projectId);
        setProject(p);
        if (p) {
          // Attempt to load associated generations
          const gens = await getUserGenerations(p.userId).catch(() => []);
          setGenerations(gens.filter((g) => g.projectId === p.id));
        }
      } catch (err) {
        console.error('Error loading public project:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [projectId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Share Link Copied', 'Public showcase URL copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportZip = async () => {
    if (!project) return;
    setIsExporting(true);
    try {
      await exportProjectAsZip(project, generations);
      toast.success('ZIP Downloaded', 'Bundled project assets downloaded.');
    } catch (e) {
      toast.error('Export Error', 'Unable to bundle ZIP.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = () => {
    if (!project) return;
    exportProjectAsPdf(project, generations);
    toast.info('Generating PDF', 'Preparing printable asset dossier.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090A0F] text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs font-mono text-slate-400">LOADING PUBLIC WORKSPACE...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#090A0F] text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-5 p-8 rounded-2xl bg-[#0C0E17] border border-white/10 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Private or Unavailable</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              This project is currently marked as private by its creator, or the link has expired.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all"
            >
              <span>Explore AI Creative Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 p-[1px]">
            <div className="w-full h-full bg-[#090A0F] rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-bold text-sm text-white">AI Creative Studio</span>
            <p className="text-[10px] text-purple-400 font-mono">aicreativestudio.com</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>

          <Link
            to="/signup"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/25 transition-all"
          >
            <span>Create Studio Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Project Header Dossier */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0F111D] border border-white/15 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px] font-semibold">
                <Globe className="w-3 h-3" />
                <span>PUBLIC SHOWCASE</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-semibold uppercase">
                {project.type.replace('_', ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10 text-[11px] font-mono">
                STATUS: {project.status.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {project.name}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Updated {new Date(project.updatedAt).toLocaleDateString()}
              </span>
              <span>ID: {project.id.slice(-8)}</span>
            </div>
          </div>

          {/* Bulk Export Actions */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={handleExportZip}
              disabled={isExporting}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <Archive className="w-3.5 h-3.5 text-purple-400" />
              <span>{isExporting ? 'Archiving...' : 'Download ZIP'}</span>
            </button>
            <button
              onClick={handleExportPdf}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-colors"
            >
              <FileDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Tags Section */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3 text-purple-400" />
              Tags:
            </span>
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Creative Brief */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Creative Brief & Vision
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {project.description || 'No creative brief provided for this project.'}
          </p>
        </div>
      </div>

      {/* Linked Generative Deliverables */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Project Assets ({generations.length})</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Verified Studio Outputs</span>
        </div>

        {generations.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0C0E17] border border-white/10 text-center space-y-2">
            <FolderKanban className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No standalone outputs linked yet</p>
            <p className="text-xs text-slate-400">
              The project container has been configured and is awaiting direct media synthesis.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generations.map((g) => (
              <div
                key={g.id}
                className="p-4 rounded-xl bg-[#0C0E17] border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold uppercase font-mono">
                    {g.toolType}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {new Date(g.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {g.result?.imageUrl && (
                  <div className="aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/40">
                    <img
                      src={g.result.imageUrl}
                      alt="Output"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold text-white line-clamp-2">"{g.prompt}"</p>
                  {g.result?.hook && (
                    <p className="text-[11px] text-emerald-400 mt-1">Hook: {g.result.hook}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Public Footer Callout */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-black border border-purple-500/30 text-center space-y-3">
        <h3 className="text-lg font-bold text-white">Create Your Own AI Media with AI Creative Studio</h3>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          Generate photorealistic images, 4K videos, viral YouTube thumbnails, scripts, and natural voiceovers with commercial licensing included.
        </p>
        <div className="pt-2">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
          >
            <span>Start Free with 100 Credits</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
