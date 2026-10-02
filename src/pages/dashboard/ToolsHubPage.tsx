import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wand2,
  Video,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Mic,
  Megaphone,
  Share2,
  Play,
  Pause,
  Download,
  Copy,
  Check,
  RefreshCw,
  Bookmark,
  Zap,
  Loader2,
  AlertCircle,
  Eye,
  Sliders,
  Layers,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { generateImage, type ImageGenerationSettings, type GeneratedImageResult } from '../../services/ai/imageService';
import { generateScript, type ScriptInput, type GeneratedScriptResult } from '../../services/ai/scriptService';
import { generateThumbnail, type ThumbnailInput, type GeneratedThumbnailResult } from '../../services/ai/thumbnailService';
import { generateVoice, playSyntheticVoice, type VoiceInput, type GeneratedVoiceResult } from '../../services/ai/voiceService';
import { generateVideo, type VideoInput, type VideoGenerationStage, type GeneratedVideoResult } from '../../services/ai/videoService';
import { generateAdvertisement, type AdInput, type GeneratedAdResult } from '../../services/ai/adService';
import { generateSocialContent, type SocialInput, type GeneratedSocialResult } from '../../services/ai/socialService';
import { saveGeneration } from '../../services/db/generationService';
import { getUserProjects } from '../../services/db/projectService';
import type { Project, ToolType } from '../../types';

export const ToolsHubPage: React.FC = () => {
  const { userProfile, deductCredits } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Active Tool selection - initialize from URL without router rerender lock
  const [activeTool, setActiveTool] = useState<ToolType>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('tool');
      if (p) return p as ToolType;
    }
    return 'image';
  });

  // User projects for "Save to Project"
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('project') || '';
    }
    return '';
  });

  // UI States
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [progressPct, setProgressPct] = useState(0);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio Player State for Voice Tool
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioController, setAudioController] = useState<{ stop: () => void } | null>(null);

  // Video Stepper State
  const [videoStage, setVideoStage] = useState<VideoGenerationStage>('Preparing');

  // TOOL 1: IMAGE STATE
  const [imagePrompt, setImagePrompt] = useState('A cinematic Japanese city at night, realistic photography, neon reflections on wet asphalt, volumetric mist, 8k');
  const [imageSettings, setImageSettings] = useState<ImageGenerationSettings>({
    aspectRatio: '16:9',
    style: 'Cinematic',
    quality: 'HD',
  });
  const [imageResult, setImageResult] = useState<GeneratedImageResult | null>(null);

  // TOOL 2: SCRIPT STATE
  const [scriptInput, setScriptInput] = useState<ScriptInput>({
    topic: 'How to build an AI content agency in 2026',
    language: 'English',
    tone: 'Cinematic',
    videoLength: '3-5 minutes',
    targetAudience: 'Digital creators and agency founders',
    additionalInstructions: 'Include a shocking hook and dynamic B-roll visual cues.',
  });
  const [scriptResult, setScriptResult] = useState<GeneratedScriptResult | null>(null);

  // TOOL 3: THUMBNAIL STATE
  const [thumbnailInput, setThumbnailInput] = useState<ThumbnailInput>({
    title: 'I Tested 100 AI Tools (Here is What Happened)',
    style: 'Clickbait Neon',
    mood: 'Shocking',
    aspectRatio: '16:9',
    overlayText: '100 AI TOOLS TESTED',
    overlayPosition: 'bottom',
    textSize: 'lg',
    badgeText: 'RESULTS REVEALED',
  });
  const [thumbnailResult, setThumbnailResult] = useState<GeneratedThumbnailResult | null>(null);

  // TOOL 4: VOICE STATE
  const [voiceInput, setVoiceInput] = useState<VoiceInput>({
    text: 'Welcome to the future of creative intelligence. With AI Creative Studio, turning your ideas into broadcast-ready content takes seconds, not weeks.',
    language: 'English',
    voice: 'Marcus (Deep Cinematic)',
    tone: 'Cinematic',
    speed: 1.0,
  });
  const [voiceResult, setVoiceResult] = useState<GeneratedVoiceResult | null>(null);

  // TOOL 5: VIDEO STATE
  const [videoInput, setVideoInput] = useState<VideoInput>({
    prompt: 'A zero-gravity orbital camera orbiting a neon-lit cyber satellite with planetary sunrise in the background',
    duration: '10s',
    aspectRatio: '16:9',
    style: 'Cinematic Film',
    cameraMovement: 'Orbital 360',
    music: 'Synthwave Ambient',
    voiceover: false,
  });
  const [videoResult, setVideoResult] = useState<GeneratedVideoResult | null>(null);

  // TOOL 6: AD STATE
  const [adInput, setAdInput] = useState<AdInput>({
    productName: 'FlowSync AI',
    productDescription: 'An automated creative automation tool that synchronizes video scripts and thumbnail variants.',
    targetAudience: 'E-commerce founders and digital creators',
    platform: 'TikTok',
    adDuration: '30s',
    tone: 'Energetic',
  });
  const [adResult, setAdResult] = useState<GeneratedAdResult | null>(null);

  // TOOL 7: SOCIAL MEDIA STATE
  const [socialInput, setSocialInput] = useState<SocialInput>({
    platform: 'Instagram',
    goal: 'Viral Growth',
    topic: '10x Content Production Framework with Generative AI',
    tone: 'Punchy',
    format: 'Carousel Slides',
  });
  const [socialResult, setSocialResult] = useState<GeneratedSocialResult | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      if (!userProfile) return;
      try {
        const list = await getUserProjects(userProfile.userId);
        setUserProjects(list || []);
      } catch (e) {
        console.error('Error fetching user projects:', e);
      }
    }
    fetchProjects();
  }, [userProfile]);

  // Instantaneous lag-free tab switcher
  const switchTool = (tool: ToolType) => {
    setActiveTool(tool);
    setErrorMessage(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tool', tool);
      window.history.replaceState(null, '', url.pathname + url.search);
    }
  };

  // GENERATION HANDLERS
  const handleGenerate = async () => {
    if (!userProfile) {
      navigate('/login');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    setProgressPct(10);
    setProgressStage('Initializing neural compute queue...');

    try {
      if (activeTool === 'image') {
        const cost = imageSettings.quality === 'HD' ? 10 : 5;
        const hasCredits = await deductCredits(cost);
        if (!hasCredits) {
          throw new Error(`Insufficient credits. You need ${cost} credits to generate an ${imageSettings.quality} image.`);
        }
        const res = await generateImage(imagePrompt, imageSettings, (pct, stage) => {
          setProgressPct(pct);
          setProgressStage(stage);
        });
        setImageResult(res);

        // Record generation in database
        await saveGeneration({
          userId: userProfile.userId,
          projectId: selectedProjectId || undefined,
          toolType: 'image',
          prompt: imagePrompt,
          settings: imageSettings,
          result: res,
        });
      } else if (activeTool === 'script') {
        const cost = 5;
        const hasCredits = await deductCredits(cost);
        if (!hasCredits) throw new Error(`Insufficient credits. You need ${cost} credits to generate a script.`);
        const res = await generateScript(scriptInput, (pct, stage) => {
          setProgressPct(pct);
          setProgressStage(stage);
        });
        setScriptResult(res);

        await saveGeneration({
          userId: userProfile.userId,
          projectId: selectedProjectId || undefined,
          toolType: 'script',
          prompt: scriptInput.topic,
          settings: scriptInput,
          result: res,
        });
      } else if (activeTool === 'thumbnail') {
        const cost = 8;
        const hasCredits = await deductCredits(cost);
        if (!hasCredits) throw new Error(`Insufficient credits. You need ${cost} credits to create a thumbnail.`);
        const res = await generateThumbnail(thumbnailInput, (pct, stage) => {
          setProgressPct(pct);
          setProgressStage(stage);
        });
        setThumbnailResult(res);

        await saveGeneration({
          userId: userProfile.userId,
          projectId: selectedProjectId || undefined,
          toolType: 'thumbnail',
          prompt: thumbnailInput.title,
          settings: thumbnailInput,
          result: res,
        });
      } else if (activeTool === 'voice') {
        const cost = 10;
        const hasCredits = await deductCredits(cost);
        if (!hasCredits) throw new Error(`Insufficient credits. You need ${cost} credits to synthesize voice narration.`);
        const res = await generateVoice(voiceInput, (pct, stage) => {
          setProgressPct(pct);
          setProgressStage(stage);
        });
        setVoiceResult(res);

        await saveGeneration({
          userId: userProfile.userId,
          projectId: selectedProjectId || undefined,
          toolType: 'voice',
          prompt: voiceInput.text.slice(0, 100),
          settings: voiceInput,
          result: res,
        });
      } else if (activeTool === 'video') {
        const cost = 15;
        const hasCredits = await deductCredits(cost);
        if (!hasCredits) throw new Error(`Insufficient credits. You need ${cost} credits to render 4K video.`);
        const res = await generateVideo(videoInput, (stage, pct) => {
          setVideoStage(stage);
          setProgressPct(pct);
          setProgressStage(`Pipeline stage: ${stage}...`);
        });
        setVideoResult(res);

        await saveGeneration({
          userId: userProfile.userId,
          projectId: selectedProjectId || undefined,
          toolType: 'video',
          prompt: videoInput.prompt,
          settings: videoInput,
          result: res,
        });
      } else if (activeTool === 'ad') {
        const cost = 8;
        const hasCredits = await deductCredits(cost);
        if (!hasCredits) throw new Error(`Insufficient credits. You need ${cost} credits to generate an ad campaign.`);
        const res = await generateAdvertisement(adInput, (pct, stage) => {
          setProgressPct(pct);
          setProgressStage(stage);
        });
        setAdResult(res);

        await saveGeneration({
          userId: userProfile.userId,
          projectId: selectedProjectId || undefined,
          toolType: 'ad',
          prompt: `${adInput.productName} for ${adInput.platform}`,
          settings: adInput,
          result: res,
        });
      } else if (activeTool === 'social_media') {
        const cost = 5;
        const hasCredits = await deductCredits(cost);
        if (!hasCredits) throw new Error(`Insufficient credits. You need ${cost} credits to generate social content.`);
        const res = await generateSocialContent(socialInput, (pct, stage) => {
          setProgressPct(pct);
          setProgressStage(stage);
        });
        setSocialResult(res);

        await saveGeneration({
          userId: userProfile.userId,
          projectId: selectedProjectId || undefined,
          toolType: 'social_media',
          prompt: `${socialInput.topic} (${socialInput.platform})`,
          settings: socialInput,
          result: res,
        });
      }

      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      toast.success(
        'Generation Successful',
        selectedProjectId
          ? 'Creative deliverable generated and saved to selected project.'
          : 'Creative deliverable synthesized and added to generation history.'
      );
    } catch (err: any) {
      console.error('Generation failure:', err);
      const msg = err.message || 'Generation failed. Please try again.';
      setErrorMessage(msg);
      toast.error('Generation Error', msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.info('Copied to Clipboard', 'Text content copied to your system clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVoicePlay = () => {
    if (isPlayingAudio && audioController) {
      audioController.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      toast.info('Audio Playback Started', 'Synthesizing voice prosody in real time.');
      const ctrl = playSyntheticVoice(voiceInput.text, voiceInput.speed, 1.0, () => {
        setIsPlayingAudio(false);
      });
      setAudioController(ctrl);
    }
  };

  const handleDownloadAsset = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Download Initialized', `Saving ${filename} to your device.`);
  };

  const toolsList: { id: ToolType; label: string; icon: React.ComponentType<{ className?: string }>; credits: string }[] = [
    { id: 'image', label: 'AI Image Generator', icon: ImageIcon, credits: '5-10 Credits' },
    { id: 'script', label: 'AI Script Generator', icon: FileText, credits: '5 Credits' },
    { id: 'thumbnail', label: 'AI Thumbnail Generator', icon: Sparkles, credits: '8 Credits' },
    { id: 'voice', label: 'AI Voice Generator', icon: Mic, credits: '10 Credits' },
    { id: 'video', label: 'AI Video Generator', icon: Video, credits: '15 Credits' },
    { id: 'ad', label: 'AI Advertisement Generator', icon: Megaphone, credits: '8 Credits' },
    { id: 'social_media', label: 'Social Media Generator', icon: Share2, credits: '5 Credits' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 mb-1">
            <Wand2 className="w-3.5 h-3.5" />
            <span>Generative AI Engine Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Creative Tools
          </h1>
          <p className="text-xs text-slate-400">
            Generate high-impact digital assets with neural models and professional controls
          </p>
        </div>

        {/* Project Selector for Quick Linking */}
        <div className="flex items-center gap-2 bg-[#0C0E17] border border-white/10 p-2 rounded-xl">
          <span className="text-xs text-slate-400 pl-1 hidden sm:inline">Save outputs to:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="">No Project (General History)</option>
            {userProjects.map((p) => (
              <option key={p.id} value={p.id}>
                📁 {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tool Navigation Horizontal Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
        {toolsList.map((t) => {
          const isSelected = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => switchTool(t.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400'
                  : 'bg-[#0C0E17] text-slate-400 hover:text-white hover:bg-white/5 border border-white/10'
              }`}
            >
              <t.icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-purple-400'}`} />
              <span>{t.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isSelected ? 'bg-purple-700 text-purple-200' : 'bg-white/5 text-slate-400'}`}>
                {t.credits}
              </span>
            </button>
          );
        })}
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5 animate-in shake">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* TOOL INTERFACES CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================
            LEFT COLUMN: TOOL CONTROLS & INPUT FORM
        ======================================================== */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0C0E17] border border-white/10 space-y-5">
          {/* TOOL 1: IMAGE */}
          {activeTool === 'image' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Image Prompt *
                </label>
                <textarea
                  rows={4}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Describe your scene in vivid detail..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Aspect Ratio
                  </label>
                  <select
                    value={imageSettings.aspectRatio}
                    onChange={(e) =>
                      setImageSettings({
                        ...imageSettings,
                        aspectRatio: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="16:9">16:9 Landscape</option>
                    <option value="1:1">1:1 Square</option>
                    <option value="9:16">9:16 Vertical / Reel</option>
                    <option value="4:3">4:3 Standard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Quality
                  </label>
                  <select
                    value={imageSettings.quality}
                    onChange={(e) =>
                      setImageSettings({
                        ...imageSettings,
                        quality: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="Standard">Standard (5 Credits)</option>
                    <option value="HD">HD Lossless (10 Credits)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Visual Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Realistic', 'Cinematic', 'Anime', '3D', 'Illustration', 'Product Photography'].map(
                    (s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          setImageSettings({
                            ...imageSettings,
                            style: s as any,
                          })
                        }
                        className={`p-2 rounded-lg text-xs font-medium text-left border transition-all ${
                          imageSettings.style === s
                            ? 'border-purple-500 bg-purple-950/40 text-purple-300 ring-1 ring-purple-500'
                            : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TOOL 2: SCRIPT */}
          {activeTool === 'script' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Topic / Concept *
                </label>
                <input
                  type="text"
                  value={scriptInput.topic}
                  onChange={(e) => setScriptInput({ ...scriptInput, topic: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Language
                  </label>
                  <select
                    value={scriptInput.language}
                    onChange={(e) =>
                      setScriptInput({ ...scriptInput, language: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="English">English</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Roman Urdu">Roman Urdu</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Tone
                  </label>
                  <select
                    value={scriptInput.tone}
                    onChange={(e) =>
                      setScriptInput({ ...scriptInput, tone: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="Cinematic">Cinematic</option>
                    <option value="Professional">Professional</option>
                    <option value="Dramatic">Dramatic</option>
                    <option value="Educational">Educational</option>
                    <option value="Funny">Funny</option>
                    <option value="Documentary">Documentary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Video Length
                  </label>
                  <input
                    type="text"
                    value={scriptInput.videoLength}
                    onChange={(e) =>
                      setScriptInput({ ...scriptInput, videoLength: e.target.value })
                    }
                    placeholder="e.g. 60s Reel or 10 min YouTube"
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={scriptInput.targetAudience}
                    onChange={(e) =>
                      setScriptInput({ ...scriptInput, targetAudience: e.target.value })
                    }
                    placeholder="e.g. Tech Founders"
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Additional Instructions
                </label>
                <textarea
                  rows={2}
                  value={scriptInput.additionalInstructions}
                  onChange={(e) =>
                    setScriptInput({ ...scriptInput, additionalInstructions: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* TOOL 3: THUMBNAIL */}
          {activeTool === 'thumbnail' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Video Title *
                </label>
                <input
                  type="text"
                  value={thumbnailInput.title}
                  onChange={(e) =>
                    setThumbnailInput({ ...thumbnailInput, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Visual Style
                  </label>
                  <select
                    value={thumbnailInput.style}
                    onChange={(e) =>
                      setThumbnailInput({ ...thumbnailInput, style: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="Clickbait Neon">Clickbait Neon</option>
                    <option value="3D Render">3D Render</option>
                    <option value="Minimalist Bold">Minimalist Bold</option>
                    <option value="Cinematic Dark">Cinematic Dark</option>
                    <option value="Gaming Extreme">Gaming Extreme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Mood
                  </label>
                  <select
                    value={thumbnailInput.mood}
                    onChange={(e) =>
                      setThumbnailInput({ ...thumbnailInput, mood: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="Shocking">Shocking</option>
                    <option value="Energetic">Energetic</option>
                    <option value="Mysterious">Mysterious</option>
                    <option value="Professional">Professional</option>
                    <option value="Euphoric">Euphoric</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                  Text Overlay Customizer
                </span>
                <div>
                  <input
                    type="text"
                    value={thumbnailInput.overlayText || ''}
                    onChange={(e) =>
                      setThumbnailInput({ ...thumbnailInput, overlayText: e.target.value })
                    }
                    placeholder="Overlay badge text (e.g. 10X GROWTH)"
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Position</span>
                    <select
                      value={thumbnailInput.overlayPosition}
                      onChange={(e) =>
                        setThumbnailInput({
                          ...thumbnailInput,
                          overlayPosition: e.target.value as any,
                        })
                      }
                      className="w-full px-2 py-1 rounded bg-[#12141F] border border-white/10 text-white text-xs"
                    >
                      <option value="top">Top</option>
                      <option value="center">Center</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Size</span>
                    <select
                      value={thumbnailInput.textSize}
                      onChange={(e) =>
                        setThumbnailInput({
                          ...thumbnailInput,
                          textSize: e.target.value as any,
                        })
                      }
                      className="w-full px-2 py-1 rounded bg-[#12141F] border border-white/10 text-white text-xs"
                    >
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                      <option value="xl">Extra Bold</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 4: VOICE */}
          {activeTool === 'voice' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Narration Script Text *
                </label>
                <textarea
                  rows={4}
                  value={voiceInput.text}
                  onChange={(e) => setVoiceInput({ ...voiceInput, text: e.target.value })}
                  placeholder="Enter narration text to be spoken..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Voice Actor
                  </label>
                  <select
                    value={voiceInput.voice}
                    onChange={(e) => setVoiceInput({ ...voiceInput, voice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="Marcus (Deep Cinematic)">Marcus (Deep Cinematic)</option>
                    <option value="Elena (Warm Storyteller)">Elena (Warm Storyteller)</option>
                    <option value="Kai (Futuristic AI)">Kai (Futuristic AI)</option>
                    <option value="Sophia (Professional Tech)">Sophia (Professional Tech)</option>
                    <option value="Aria (Energetic Dynamic)">Aria (Energetic Dynamic)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Language
                  </label>
                  <select
                    value={voiceInput.language}
                    onChange={(e) => setVoiceInput({ ...voiceInput, language: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="English">English</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Tone Prosody
                  </label>
                  <select
                    value={voiceInput.tone}
                    onChange={(e) => setVoiceInput({ ...voiceInput, tone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="Cinematic">Cinematic</option>
                    <option value="Confident">Confident</option>
                    <option value="Calm">Calm</option>
                    <option value="Emotional">Emotional</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Speed ({voiceInput.speed}x)
                  </label>
                  <input
                    type="range"
                    min="0.75"
                    max="1.5"
                    step="0.05"
                    value={voiceInput.speed}
                    onChange={(e) =>
                      setVoiceInput({ ...voiceInput, speed: parseFloat(e.target.value) })
                    }
                    className="w-full accent-purple-500 cursor-pointer mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TOOL 5: VIDEO */}
          {activeTool === 'video' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Video Cinematic Prompt *
                </label>
                <textarea
                  rows={3}
                  value={videoInput.prompt}
                  onChange={(e) => setVideoInput({ ...videoInput, prompt: e.target.value })}
                  placeholder="Describe the visual action, lighting, and movement..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Duration
                  </label>
                  <select
                    value={videoInput.duration}
                    onChange={(e) =>
                      setVideoInput({ ...videoInput, duration: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="5s">5 Seconds (Short Loop)</option>
                    <option value="10s">10 Seconds (Standard)</option>
                    <option value="15s">15 Seconds (Story)</option>
                    <option value="30s">30 Seconds (Commercial)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Aspect Ratio
                  </label>
                  <select
                    value={videoInput.aspectRatio}
                    onChange={(e) =>
                      setVideoInput({ ...videoInput, aspectRatio: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="16:9">16:9 Landscape (YouTube)</option>
                    <option value="9:16">9:16 Vertical (Shorts/Reels)</option>
                    <option value="1:1">1:1 Square (Feed)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Camera Motion
                  </label>
                  <select
                    value={videoInput.cameraMovement}
                    onChange={(e) =>
                      setVideoInput({ ...videoInput, cameraMovement: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="Orbital 360">Orbital 360</option>
                    <option value="Dolly In">Dolly In</option>
                    <option value="Pan Left">Pan Left</option>
                    <option value="Pan Right">Pan Right</option>
                    <option value="Aerial Drone">Aerial Drone</option>
                    <option value="Static">Static Lock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Background Score
                  </label>
                  <select
                    value={videoInput.music}
                    onChange={(e) =>
                      setVideoInput({ ...videoInput, music: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="Synthwave Ambient">Synthwave Ambient</option>
                    <option value="Epic Orchestral">Epic Orchestral</option>
                    <option value="Lo-Fi Chill">Lo-Fi Chill</option>
                    <option value="Uplifting SaaS">Uplifting SaaS</option>
                    <option value="None">None (Silent)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 6: ADVERT */}
          {activeTool === 'ad' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Product / Service Name *
                </label>
                <input
                  type="text"
                  value={adInput.productName}
                  onChange={(e) => setAdInput({ ...adInput, productName: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Product Description *
                </label>
                <textarea
                  rows={2}
                  value={adInput.productDescription}
                  onChange={(e) => setAdInput({ ...adInput, productDescription: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Target Platform
                  </label>
                  <select
                    value={adInput.platform}
                    onChange={(e) =>
                      setAdInput({ ...adInput, platform: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Duration
                  </label>
                  <select
                    value={adInput.adDuration}
                    onChange={(e) =>
                      setAdInput({ ...adInput, adDuration: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="15s">15s Short-Form</option>
                    <option value="30s">30s Standard Ad</option>
                    <option value="60s">60s In-Depth Pitch</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 7: SOCIAL MEDIA */}
          {activeTool === 'social_media' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Content Topic / Core Idea *
                </label>
                <input
                  type="text"
                  value={socialInput.topic}
                  onChange={(e) => setSocialInput({ ...socialInput, topic: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Platform
                  </label>
                  <select
                    value={socialInput.platform}
                    onChange={(e) =>
                      setSocialInput({ ...socialInput, platform: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube Shorts">YouTube Shorts</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="X/Twitter">X / Twitter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Format
                  </label>
                  <select
                    value={socialInput.format}
                    onChange={(e) =>
                      setSocialInput({ ...socialInput, format: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#12141F] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="Carousel Slides">Carousel Slides</option>
                    <option value="Shorts/Reel Script">Shorts/Reel Script</option>
                    <option value="Long-Form Post">Long-Form Post</option>
                    <option value="Thread">Viral Thread</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* MAIN GENERATE ACTION BUTTON */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing ({progressPct}%)...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Content</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: PREVIEW STAGE & RESULTS
        ======================================================== */}
        <div className="lg:col-span-7 space-y-4">
          {/* Progress / Loading Indicator Card */}
          {isGenerating && (
            <div className="p-6 rounded-2xl bg-[#0C0E17] border border-purple-500/40 shadow-xl shadow-purple-950/20 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-purple-300">{progressStage}</span>
                <span className="font-mono text-white font-bold">{progressPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              {activeTool === 'video' && (
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span className={videoStage === 'Preparing' ? 'text-purple-400 font-bold' : ''}>
                    1. Preparing
                  </span>
                  <span>→</span>
                  <span className={videoStage === 'Generating' ? 'text-purple-400 font-bold' : ''}>
                    2. Generating
                  </span>
                  <span>→</span>
                  <span className={videoStage === 'Processing' ? 'text-purple-400 font-bold' : ''}>
                    3. Processing
                  </span>
                  <span>→</span>
                  <span className={videoStage === 'Completed' ? 'text-purple-400 font-bold' : ''}>
                    4. Completed
                  </span>
                </div>
              )}
            </div>
          )}

          {/* RESULT 1: IMAGE PREVIEW */}
          {activeTool === 'image' && (
            <div className="rounded-2xl bg-[#0C0E17] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-pink-400" />
                  <span>Image Canvas Output</span>
                </h3>
                {imageResult && (
                  <span className="text-[11px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                    {imageResult.width}x{imageResult.height}px
                  </span>
                )}
              </div>

              {imageResult ? (
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden aspect-video bg-black/60 border border-white/10 relative group">
                    <img
                      src={imageResult.imageUrl}
                      alt={imageResult.prompt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() =>
                          handleDownloadAsset(imageResult.imageUrl, 'ai_creative_studio_image.png')
                        }
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download 4K</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-400 truncate max-w-sm">"{imageResult.prompt}"</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleDownloadAsset(imageResult.imageUrl, 'ai_creative_studio_image.png')
                        }
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                  <ImageIcon className="w-8 h-8 text-slate-600" />
                  <p className="text-xs">Adjust your prompt on the left and click Generate Content</p>
                </div>
              )}
            </div>
          )}

          {/* RESULT 2: SCRIPT PREVIEW */}
          {activeTool === 'script' && (
            <div className="rounded-2xl bg-[#0C0E17] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Generated Script Editor</span>
                </h3>
                {scriptResult && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(scriptResult.fullMarkdown)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([scriptResult.fullMarkdown], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);
                        handleDownloadAsset(url, 'script_production_bible.md');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export MD</span>
                    </button>
                  </div>
                )}
              </div>

              {scriptResult ? (
                <div className="space-y-4">
                  {/* Hook callout */}
                  <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1">
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">
                      ⚡ Retention Hook (0:00 - 0:15)
                    </span>
                    <p className="text-xs text-white italic">"{scriptResult.hook}"</p>
                  </div>

                  {/* Scene breakdown list */}
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {scriptResult.scenes.map((scene, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-purple-300">{scene.sceneTitle}</span>
                          <span className="font-mono text-slate-400 text-[10px]">{scene.timestamp}</span>
                        </div>
                        <div className="text-xs text-slate-300">
                          <span className="text-cyan-400 font-semibold block text-[10px] uppercase">
                            Visual Direction:
                          </span>
                          {scene.visualDirection}
                        </div>
                        <div className="text-xs text-slate-200 bg-black/40 p-2.5 rounded-lg border border-white/5">
                          <span className="text-purple-400 font-semibold block text-[10px] uppercase">
                            Audio / Narration:
                          </span>
                          "{scene.audioVoiceover}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-64 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                  <FileText className="w-8 h-8 text-slate-600" />
                  <p className="text-xs">Provide a topic and hit generate to draft structured scenes</p>
                </div>
              )}
            </div>
          )}

          {/* RESULT 3: THUMBNAIL PREVIEW */}
          {activeTool === 'thumbnail' && (
            <div className="rounded-2xl bg-[#0C0E17] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Thumbnail Canvas Preview</span>
                </h3>
                {thumbnailResult && (
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    {thumbnailResult.ctrScore}% Predicted CTR
                  </span>
                )}
              </div>

              {thumbnailResult ? (
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-white/15 shadow-2xl">
                    <img
                      src={thumbnailResult.thumbnailUrl}
                      alt={thumbnailResult.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-4">
                      {/* Badge */}
                      {thumbnailInput.badgeText && (
                        <div className="self-start px-3 py-1 rounded-md bg-red-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg">
                          {thumbnailInput.badgeText}
                        </div>
                      )}
                      {/* Text Overlay */}
                      <div
                        className={`text-white font-black tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,1)] uppercase text-center ${
                          thumbnailInput.textSize === 'xl'
                            ? 'text-3xl sm:text-4xl'
                            : thumbnailInput.textSize === 'lg'
                            ? 'text-2xl sm:text-3xl'
                            : 'text-xl'
                        }`}
                      >
                        <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-pink-300 text-transparent bg-clip-text">
                          {thumbnailInput.overlayText || thumbnailInput.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">1280x720 16:9 Broadcast PNG</span>
                    <button
                      onClick={() =>
                        handleDownloadAsset(thumbnailResult.thumbnailUrl, 'youtube_thumbnail.png')
                      }
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Thumbnail</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                  <Sparkles className="w-8 h-8 text-slate-600" />
                  <p className="text-xs">Configure text overlays to preview high-converting YouTube visuals</p>
                </div>
              )}
            </div>
          )}

          {/* RESULT 4: VOICE PREVIEW */}
          {activeTool === 'voice' && (
            <div className="rounded-2xl bg-[#0C0E17] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>Voice Synthesis Player</span>
                </h3>
                {voiceResult && (
                  <span className="text-xs text-slate-400 font-mono">
                    ~{voiceResult.durationSeconds}s duration
                  </span>
                )}
              </div>

              {voiceResult ? (
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-5">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleVoicePlay}
                      className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition-transform active:scale-95"
                    >
                      {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <div>
                      <h4 className="text-sm font-bold text-white">{voiceResult.voiceName}</h4>
                      <p className="text-xs text-purple-300">48kHz Mastered Audio</p>
                    </div>
                  </div>

                  {/* Waveform graphic */}
                  <div className="flex items-center gap-1 h-12 bg-black/40 px-3 rounded-xl border border-white/5">
                    {voiceResult.waveform.map((bar, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full transition-all ${
                          isPlayingAudio ? 'bg-gradient-to-t from-purple-500 to-cyan-400' : 'bg-white/20'
                        }`}
                        style={{ height: `${bar}%` }}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-slate-300 italic bg-white/5 p-3 rounded-lg">
                    "{voiceResult.text}"
                  </p>
                </div>
              ) : (
                <div className="h-48 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                  <Mic className="w-8 h-8 text-slate-600" />
                  <p className="text-xs">Type voiceover script text and synthesize audio to test playback</p>
                </div>
              )}
            </div>
          )}

          {/* RESULT 5: VIDEO PREVIEW */}
          {activeTool === 'video' && (
            <div className="rounded-2xl bg-[#0C0E17] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-400" />
                  <span>Cinematic Video Player</span>
                </h3>
                {videoResult && (
                  <span className="text-[11px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                    {videoResult.resolution}
                  </span>
                )}
              </div>

              {videoResult ? (
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden aspect-video bg-black border border-white/10 shadow-2xl relative">
                    <video
                      src={videoResult.videoUrl}
                      poster={videoResult.posterUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      Camera: <span className="text-white font-medium">{videoResult.cameraMovement}</span> • Music: <span className="text-white font-medium">{videoResult.musicTrack}</span>
                    </div>
                    <button
                      onClick={() =>
                        handleDownloadAsset(videoResult.videoUrl, 'cinematic_video.mp4')
                      }
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download MP4</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                  <Video className="w-8 h-8 text-slate-600" />
                  <p className="text-xs">Specify camera movement and aspect ratio to render 4K video clips</p>
                </div>
              )}
            </div>
          )}

          {/* RESULT 6: AD PREVIEW */}
          {activeTool === 'ad' && (
            <div className="rounded-2xl bg-[#0C0E17] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-rose-400" />
                  <span>Generated Ad Campaign Kit</span>
                </h3>
                {adResult && (
                  <button
                    onClick={() => handleCopy(adResult.script)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Ad Copy</span>
                  </button>
                )}
              </div>

              {adResult ? (
                <div className="space-y-4">
                  {/* Hook Card */}
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">
                      Viral Hook
                    </span>
                    <p className="text-xs font-bold text-white">"{adResult.hook}"</p>
                  </div>

                  {/* Scenes list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {adResult.scenes.map((sc, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5 text-xs">
                        <span className="text-[10px] font-mono text-purple-400 font-bold">{sc.timecode}</span>
                        <p className="text-slate-300">{sc.visual}</p>
                        <p className="text-slate-400 italic">Audio: {sc.audio}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA & Caption */}
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                      Call to Action & Caption
                    </span>
                    <p className="text-xs text-white font-medium">{adResult.cta}</p>
                    <p className="text-xs text-slate-400">{adResult.caption}</p>
                  </div>
                </div>
              ) : (
                <div className="h-64 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                  <Megaphone className="w-8 h-8 text-slate-600" />
                  <p className="text-xs">Fill product details to generate hooks, scene ideas, and viral CTAs</p>
                </div>
              )}
            </div>
          )}

          {/* RESULT 7: SOCIAL MEDIA PREVIEW */}
          {activeTool === 'social_media' && (
            <div className="rounded-2xl bg-[#0C0E17] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-blue-400" />
                  <span>Social Content Blueprint</span>
                </h3>
                {socialResult && (
                  <button
                    onClick={() => handleCopy(socialResult.content)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Content</span>
                  </button>
                )}
              </div>

              {socialResult ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-1">
                    <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">
                      Headline & Viral Hook
                    </span>
                    <h4 className="text-sm font-bold text-white">{socialResult.headline}</h4>
                    <p className="text-xs text-slate-300 italic">{socialResult.hook}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                    {socialResult.content}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {socialResult.hashtags.map((h, i) => (
                      <span key={i} className="text-[11px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
                        {h}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-400 border-t border-white/5 pt-2">
                    Optimal Posting Time: <span className="text-white font-medium">{socialResult.bestPostingTime}</span>
                  </div>
                </div>
              ) : (
                <div className="h-64 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                  <Share2 className="w-8 h-8 text-slate-600" />
                  <p className="text-xs">Select your platform and format to craft viral engagement carousels</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
