
export interface User {
  id: string;
  username: string;
  avatar_url: string;
  role: 'user' | 'admin';
  hasVoted?: boolean;
  votedFor?: string;
}

export interface Editor {
  id: string;
  name: string;
  videoUrl: string;
  thumbnailUrl: string;
  votes: number;
}

export interface Rating {
  userId: string;
  username: string;
  stars: number;
  timestamp: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface GiftVote {
  userId: string;
  username: string;
  package: string;
  timestamp: number;
}
