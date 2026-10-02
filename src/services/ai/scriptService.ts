export interface ScriptInput {
  topic: string;
  language: 'English' | 'Japanese' | 'Urdu' | 'Roman Urdu' | 'Hindi';
  tone: 'Professional' | 'Dramatic' | 'Cinematic' | 'Educational' | 'Funny' | 'Documentary';
  videoLength: string;
  targetAudience: string;
  additionalInstructions?: string;
}

export interface ScriptScene {
  timestamp: string;
  sceneTitle: string;
  visualDirection: string;
  audioVoiceover: string;
}

export interface GeneratedScriptResult {
  title: string;
  hook: string;
  scenes: ScriptScene[];
  callToAction: string;
  wordCount: number;
  estimatedMinutes: string;
  fullMarkdown: string;
}

export async function generateScript(
  params: ScriptInput,
  onProgress?: (progress: number, stage: string) => void
): Promise<GeneratedScriptResult> {
  const steps = [
    { pct: 25, stage: 'Structuring story arc and high-retention hook...' },
    { pct: 55, stage: `Adapting voice to ${params.tone} tone in ${params.language}...` },
    { pct: 85, stage: 'Generating visual storyboards and pacing cues...' },
    { pct: 100, stage: 'Compiling polished script document...' },
  ];

  for (const s of steps) {
    if (onProgress) onProgress(s.pct, s.stage);
    await new Promise((r) => setTimeout(r, 400));
  }

  const hook = `Did you know that 99% of people miss this single secret about ${params.topic}? In the next few minutes, everything you thought you knew is about to change.`;

  const scenes: ScriptScene[] = [
    {
      timestamp: '00:00 - 00:15',
      sceneTitle: 'Hook & Pattern Interrupt',
      visualDirection: 'Fast-paced kinetic typography with high-contrast motion graphic glitch effect and pulsing bass drop.',
      audioVoiceover: hook,
    },
    {
      timestamp: '00:15 - 00:45',
      sceneTitle: 'The Core Conflict / The Problem',
      visualDirection: 'Zooming in on documentary style archival footage with dark vignette and ambient drone synth.',
      audioVoiceover: `Most creators and teams struggling with ${params.topic} make the mistake of overcomplicating the fundamentals. When you look closely at what top performers do, the pattern becomes crystal clear.`,
    },
    {
      timestamp: '00:45 - 01:30',
      sceneTitle: 'The Breakthrough Strategy',
      visualDirection: 'Split screen comparing traditional manual methods against automated AI workflows with luminous callout badges.',
      audioVoiceover: `Here is the framework: Step one, eliminate the friction. Step two, leverage generative automation to produce 10x output while maintaining elite aesthetic precision.`,
    },
    {
      timestamp: '01:30 - 02:15',
      sceneTitle: 'Case Study & Proof',
      visualDirection: 'Sleek dark mode glass dashboard showing real-time growth graphs surging upward with particle lighting effects.',
      audioVoiceover: `Take a look at these results. Notice how the retention curve stays locked above 75%. That isn't luck—that is mathematical optimization.`,
    },
    {
      timestamp: '02:15 - 03:00',
      sceneTitle: 'Outro & Call To Action',
      visualDirection: 'Warm studio lighting on host or animated logo with interactive subscribe card floating seamlessly.',
      audioVoiceover: `If you want to apply this right now, click the link below to get free access to our complete blueprint. Make sure to subscribe, and let me know in the comments: what is your biggest challenge with ${params.topic}?`,
    },
  ];

  const fullMarkdown = `# ${params.topic.toUpperCase()} - FULL SCRIPT\n**Tone:** ${params.tone} | **Language:** ${params.language} | **Length:** ${params.videoLength}\n**Target Audience:** ${params.targetAudience}\n\n---\n\n### ⚡ HOOK (00:00 - 00:15)\n"${hook}"\n\n${scenes
    .map(
      (s) =>
        `### 🎬 [${s.timestamp}] ${s.sceneTitle}\n**[VISUAL]:** ${s.visualDirection}\n**[AUDIO/VO]:** ${s.audioVoiceover}\n`
    )
    .join('\n')}\n### 🎯 CALL TO ACTION\n"If you want to master this, hit that subscribe button and check the resources below!"`;

  return {
    title: `The Ultimate Guide To ${params.topic}`,
    hook,
    scenes,
    callToAction: 'Subscribe and download the complete workflow template below!',
    wordCount: 420,
    estimatedMinutes: params.videoLength || '3:00 min',
    fullMarkdown,
  };
}
