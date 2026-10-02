import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  FolderKanban,
  Wand2,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Command,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserProjects } from '../services/db/projectService';
import { getUserGenerations } from '../services/db/generationService';
import type { Project, Generation } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DocArticle {
  id: string;
  title: string;
  category: string;
  snippet: string;
  link: string;
}

const STUDIO_DOCUMENTATION: DocArticle[] = [
  {
    id: 'doc_video_prompts',
    title: 'Cinematic 4K Video Prompting & Camera Motions',
    category: 'Documentation',
    snippet: 'Master dolly in, aerial drone, and orbital 360 camera dynamics for ultra-high retention video clips.',
    link: '/dashboard/tools?tool=video',
  },
  {
    id: 'doc_ctr_thumbnails',
    title: 'Viral YouTube Thumbnail Architecture (90%+ CTR)',
    category: 'Documentation',
    snippet: 'How to utilize high-contrast lighting halos, 3D text overlays, and eye-tracking focal anchors.',
    link: '/dashboard/tools?tool=thumbnail',
  },
  {
    id: 'doc_script_arcs',
    title: 'The 3-Second Pattern Interrupt & Scriptwriting Arc',
    category: 'Documentation',
    snippet: 'Structuring hooks, psychological conflicts, and kinetic visual B-roll cues for maximum retention.',
    link: '/dashboard/tools?tool=script',
  },
  {
    id: 'doc_voice_prosody',
    title: 'Neural Voiceover Synthesis & Speed Calibration',
    category: 'Documentation',
    snippet: 'Selecting multi-speaker models, adjusting pitch contours, and mastering loudness to -14 LUFS.',
    link: '/dashboard/tools?tool=voice',
  },
  {
    id: 'doc_aspect_ratios',
    title: 'Aspect Ratios Guide: 16:9 Landscape vs 9:16 Vertical',
    category: 'Documentation',
    snippet: 'When to target vertical 9:16 for TikTok/Reels/Shorts versus 16:9 for YouTube and cinematic trailers.',
    link: '/dashboard/tools?tool=image',
  },
  {
    id: 'doc_commercial_rights',
    title: 'Commercial Ownership & Distribution Rights',
    category: 'Documentation',
    snippet: 'Full worldwide monetization rights included with all Free, Creator, Pro, and Business tiers.',
    link: '/pricing',
  },
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'projects' | 'generations' | 'docs'>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(false);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Load user data when modal opens
  useEffect(() => {
    if (isOpen && userProfile) {
      setLoading(true);
      Promise.all([
        getUserProjects(userProfile.userId).catch(() => []),
        getUserGenerations(userProfile.userId).catch(() => []),
      ]).then(([pList, gList]) => {
        setProjects(pList || []);
        setGenerations(gList || []);
        setLoading(false);
      });
    }
  }, [isOpen, userProfile]);

  // Filtered search results
  const filteredProjects = useMemo(() => {
    if (!query.trim()) return projects.slice(0, 4);
    const q = query.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.type.toLowerCase().includes(q)
    );
  }, [projects, query]);

  const filteredGenerations = useMemo(() => {
    if (!query.trim()) return generations.slice(0, 4);
    const q = query.toLowerCase();
    return generations.filter(
      (g) =>
        g.prompt.toLowerCase().includes(q) ||
        g.toolType.toLowerCase().includes(q) ||
        (g.result?.title && g.result.title.toLowerCase().includes(q))
    );
  }, [generations, query]);

  const filteredDocs = useMemo(() => {
    if (!query.trim()) return STUDIO_DOCUMENTATION.slice(0, 4);
    const q = query.toLowerCase();
    return STUDIO_DOCUMENTATION.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.snippet.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }, [query]);

  const totalResults =
    (activeTab === 'all' || activeTab === 'projects' ? filteredProjects.length : 0) +
    (activeTab === 'all' || activeTab === 'generations' ? filteredGenerations.length : 0) +
    (activeTab === 'all' || activeTab === 'docs' ? filteredDocs.length : 0);

  const handleSelectProject = (project: Project) => {
    navigate(`/dashboard/tools?tool=${project.type}&project=${project.id}`);
    onClose();
  };

  const handleSelectGeneration = (gen: Generation) => {
    navigate(`/dashboard/history`);
    onClose();
  };

  const handleSelectDoc = (doc: DocArticle) => {
    navigate(doc.link);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0F111D] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-[#0A0C16]">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, AI generations, prompts, and studio documentation..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-500 hover:text-white p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-white/5 bg-[#0C0E18] flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'projects'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Projects ({filteredProjects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('generations')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'generations'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Generations ({filteredGenerations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'docs'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Docs & Guides ({filteredDocs.length})</span>
          </button>
        </div>

        {/* Search Results List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-5">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              QUERYING VAULT & GENERATIVE ARCHIVES...
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-white">No results found</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                No matching projects, generated assets, or guides for "{query}".
              </p>
            </div>
          ) : (
            <>
              {/* Category: Projects */}
              {(activeTab === 'all' || activeTab === 'projects') && filteredProjects.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 px-1">
                    Projects ({filteredProjects.length})
                  </span>
                  <div className="space-y-1">
                    {filteredProjects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProject(p)}
                        className="cursor-pointer p-3 rounded-xl bg-white/[0.02] hover:bg-purple-600/15 border border-white/5 hover:border-purple-500/30 flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
                            <FolderKanban className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-purple-300">
                              {p.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              {p.description || `Type: ${p.type} • Status: ${p.status}`}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-purple-300 uppercase px-2 py-0.5 rounded bg-purple-500/10">
                          {p.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category: Generations */}
              {(activeTab === 'all' || activeTab === 'generations') && filteredGenerations.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 px-1">
                    AI Generations ({filteredGenerations.length})
                  </span>
                  <div className="space-y-1">
                    {filteredGenerations.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => handleSelectGeneration(g)}
                        className="cursor-pointer p-3 rounded-xl bg-white/[0.02] hover:bg-cyan-600/15 border border-white/5 hover:border-cyan-500/30 flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-black/40 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                            {g.result?.imageUrl || g.result?.thumbnailUrl ? (
                              <img
                                src={g.result.imageUrl || g.result.thumbnailUrl}
                                alt="thumb"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Wand2 className="w-4 h-4 text-cyan-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                              "{g.prompt}"
                            </h4>
                            <p className="text-[10px] text-slate-400">
                              Generated {new Date(g.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-300 uppercase px-2 py-0.5 rounded bg-cyan-500/10">
                          {g.toolType}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category: Documentation */}
              {(activeTab === 'all' || activeTab === 'docs') && filteredDocs.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 px-1">
                    Studio Guides & Documentation ({filteredDocs.length})
                  </span>
                  <div className="space-y-1">
                    {filteredDocs.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => handleSelectDoc(doc)}
                        className="cursor-pointer p-3 rounded-xl bg-white/[0.02] hover:bg-amber-500/15 border border-white/5 hover:border-amber-500/30 flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-amber-300">
                              {doc.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              {doc.snippet}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-white/10 bg-[#0A0C16] flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with mouse or arrow keys</span>
          <span className="font-mono">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
