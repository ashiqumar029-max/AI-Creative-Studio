import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import {
  Zap,
  FolderKanban,
  Wand2,
  Bookmark,
  Plus,
  Video,
  Image as ImageIcon,
  Sparkles,
  Mic,
  FileText,
  Megaphone,
  ArrowRight,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserProjects } from '../../services/db/projectService';
import { getUserGenerations } from '../../services/db/generationService';
import type { Project, Generation } from '../../types';

interface OutletContextType {
  openNewProject: () => void;
  openCheckout: () => void;
}

export const DashboardOverviewPage: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const { openNewProject, openCheckout } = useOutletContext<OutletContextType>();

  const [projects, setProjects] = useState<Project[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!userProfile) return;
      try {
        const [pList, gList] = await Promise.all([
          getUserProjects(userProfile.userId),
          getUserGenerations(userProfile.userId),
        ]);
        setProjects(pList || []);
        setGenerations(gList || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userProfile]);

  const quickTools = [
    { label: 'Generate Image', toolId: 'image', icon: ImageIcon, color: 'from-pink-500 to-rose-600', cost: '5 Credits' },
    { label: 'Generate Script', toolId: 'script', icon: FileText, color: 'from-cyan-500 to-blue-600', cost: '5 Credits' },
    { label: 'Create Thumbnail', toolId: 'thumbnail', icon: Sparkles, color: 'from-amber-500 to-orange-600', cost: '8 Credits' },
    { label: 'Generate Voice', toolId: 'voice', icon: Mic, color: 'from-emerald-500 to-teal-600', cost: '10 Credits' },
    { label: 'Create Video', toolId: 'video', icon: Video, color: 'from-purple-500 to-indigo-600', cost: '15 Credits' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#121422] to-cyan-950/30 border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
            <Sparkles className="w-3 h-3 text-purple-300" />
            <span>Workspace Online</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {userProfile?.name?.split(' ')[0] || 'Creator'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            You have <strong className="text-purple-300 font-mono">{userProfile?.credits ?? 0} credits</strong> available on the{' '}
            <span className="capitalize font-semibold text-white">{userProfile?.plan || 'Free'}</span> plan. What would you like to create today?
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 w-full sm:w-auto">
          <button
            onClick={openCheckout}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Recharge Credits</span>
          </button>

          <button
            onClick={openNewProject}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Credits */}
        <div className="p-5 rounded-2xl bg-[#0C0E17] border border-white/10 hover:border-purple-500/30 transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Credits Remaining</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white font-mono">{userProfile?.credits ?? 0}</span>
              <button
                onClick={openCheckout}
                className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold"
              >
                + Add more
              </button>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
        </div>

        {/* Card 2: Total Projects */}
        <div className="p-5 rounded-2xl bg-[#0C0E17] border border-white/10 hover:border-indigo-500/30 transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Total Projects</span>
            <div className="text-2xl font-black text-white font-mono">{projects.length}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        {/* Card 3: Total Generations */}
        <div className="p-5 rounded-2xl bg-[#0C0E17] border border-white/10 hover:border-cyan-500/30 transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">AI Generations</span>
            <div className="text-2xl font-black text-white font-mono">{generations.length}</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-cyan-400" />
          </div>
        </div>

        {/* Card 4: Saved Content */}
        <div className="p-5 rounded-2xl bg-[#0C0E17] border border-white/10 hover:border-emerald-500/30 transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Saved Content</span>
            <div className="text-2xl font-black text-white font-mono">
              {projects.filter((p) => p.status === 'completed').length}
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* QUICK TOOL LAUNCH BAR */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Launch Quick AI Generator</span>
          </h2>
          <Link
            to="/dashboard/tools"
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
          >
            <span>All 7 Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickTools.map((qt) => (
            <button
              key={qt.toolId}
              onClick={() => navigate(`/dashboard/tools?tool=${qt.toolId}`)}
              className="p-4 rounded-xl bg-[#0C0E17] border border-white/10 hover:border-purple-500/40 text-left transition-all duration-200 hover:-translate-y-0.5 group flex flex-col justify-between h-28"
            >
              <div className="flex items-start justify-between w-full">
                <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${qt.color} p-[1px] shadow-sm`}
                >
                  <div className="w-full h-full bg-[#0A0B12] rounded-[7px] flex items-center justify-center">
                    <qt.icon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{qt.cost}</span>
              </div>
              <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                {qt.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* TWO COLUMN GRID: RECENT PROJECTS & RECENT GENERATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Projects */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Recent Projects</h2>
            <Link
              to="/dashboard/projects"
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              View all ({projects.length})
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#0C0E17] border border-white/10 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
                <FolderKanban className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">No projects created yet</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Create your first project container to group generated videos, scripts, and artwork.
              </p>
              <button
                onClick={openNewProject}
                className="mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
              >
                Create First Project
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {projects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate('/dashboard/projects')}
                  className="cursor-pointer p-3.5 rounded-xl bg-[#0C0E17] border border-white/10 hover:border-purple-500/30 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{project.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="capitalize">{project.type}</span>
                        <span>•</span>
                        <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        project.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {project.status.replace('_', ' ')}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Generations */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Recent Generations</h2>
            <Link
              to="/dashboard/history"
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              History ({generations.length})
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : generations.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#0C0E17] border border-white/10 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">No generations yet</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Your AI-generated assets will be archived here for instant retrieval.
              </p>
              <button
                onClick={() => navigate('/dashboard/tools')}
                className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
              >
                Open AI Studio
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {generations.slice(0, 5).map((gen) => (
                <div
                  key={gen.id}
                  onClick={() => navigate('/dashboard/history')}
                  className="cursor-pointer p-3 rounded-xl bg-[#0C0E17] border border-white/10 hover:border-purple-500/30 flex items-center gap-3 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-black/40 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                    {gen.result?.imageUrl || gen.result?.thumbnailUrl ? (
                      <img
                        src={gen.result.imageUrl || gen.result.thumbnailUrl}
                        alt="thumb"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Wand2 className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-purple-400 font-mono">
                        {gen.toolType}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(gen.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-white truncate font-medium">{gen.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
