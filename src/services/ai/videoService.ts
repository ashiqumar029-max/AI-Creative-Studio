export interface VideoInput {
  prompt: string;
  duration: '5s' | '10s' | '15s' | '30s';
  aspectRatio: '16:9' | '9:16' | '1:1';
  style: 'Cinematic Film' | 'Cyberpunk' | '3D Animation' | 'Documentary' | 'Commercial';
  cameraMovement: 'Dolly In' | 'Pan Left' | 'Pan Right' | 'Aerial Drone' | 'Orbital 360' | 'Static';
  music: 'Synthwave Ambient' | 'Epic Orchestral' | 'Lo-Fi Chill' | 'Uplifting SaaS' | 'None';
  voiceover: boolean;
}

export type VideoGenerationStage = 'Preparing' | 'Generating' | 'Processing' | 'Completed';

export interface GeneratedVideoResult {
  videoUrl: string;
  posterUrl: string;
  prompt: string;
  duration: string;
  resolution: string;
  fps: number;
  cameraMovement: string;
  musicTrack: string;
  settings: VideoInput;
}

const VIDEO_DEMO_SOURCES: { poster: string; video: string; title: string }[] = [
  {
    title: 'Cyberpunk Skyline',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1280&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    title: 'Cinematic Space Sequence',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1280&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    title: 'Architectural Flight',
    poster: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1280&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
];

export async function generateVideo(
  params: VideoInput,
  onStageChange?: (stage: VideoGenerationStage, progress: number) => void
): Promise<GeneratedVideoResult> {
  const sequence: { stage: VideoGenerationStage; pct: number; delay: number }[] = [
    { stage: 'Preparing', pct: 15, delay: 600 },
    { stage: 'Generating', pct: 45, delay: 900 },
    { stage: 'Processing', pct: 80, delay: 800 },
    { stage: 'Completed', pct: 100, delay: 400 },
  ];

  for (const item of sequence) {
    if (onStageChange) onStageChange(item.stage, item.pct);
    await new Promise((r) => setTimeout(r, item.delay));
  }

  const sample = VIDEO_DEMO_SOURCES[Math.floor(Math.random() * VIDEO_DEMO_SOURCES.length)];

  return {
    videoUrl: sample.video,
    posterUrl: sample.poster,
    prompt: params.prompt,
    duration: params.duration,
    resolution: params.aspectRatio === '9:16' ? '1080x1920 (Vertical 4K)' : '3840x2160 (Cinematic 4K)',
    fps: 60,
    cameraMovement: params.cameraMovement,
    musicTrack: params.music,
    settings: params,
  };
}
