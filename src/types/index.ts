export type UserRole = 'user' | 'admin';
export type UserPlan = 'free' | 'creator' | 'pro' | 'business';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  plan: UserPlan;
  credits: number;
  status?: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export type ProjectType =
  | 'video'
  | 'image'
  | 'thumbnail'
  | 'script'
  | 'voiceover'
  | 'advertisement'
  | 'social_media'
  | 'branding';

export type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'archived';

export interface Project {
  id: string;
  userId: string;
  name: string;
  type: ProjectType;
  description: string;
  status: ProjectStatus;
  thumbnail?: string;
  contentData?: any;
  isPublic?: boolean;
  shareSlug?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ToolType =
  | 'image'
  | 'script'
  | 'thumbnail'
  | 'voice'
  | 'video'
  | 'ad'
  | 'social_media';

export interface Generation {
  id: string;
  userId: string;
  projectId?: string;
  toolType: ToolType;
  prompt: string;
  settings: Record<string, any>;
  result: Record<string, any>;
  status: 'generating' | 'completed' | 'failed';
  createdAt: string;
}

export type PortfolioCategory =
  | 'all'
  | 'videos'
  | 'thumbnails'
  | 'images'
  | 'advertisements'
  | 'social_media'
  | 'branding';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: Exclude<PortfolioCategory, 'all'>;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  featured: boolean;
  tags?: string[];
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail?: string;
  plan: string;
  amount: number;
  credits: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  createdAt: string;
}

export interface UserSettings {
  userId: string;
  theme: 'dark' | 'light' | 'system';
  emailNotifications: boolean;
  generationNotifications: boolean;
  autoSave: boolean;
}
