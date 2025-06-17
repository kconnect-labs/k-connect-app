export interface Root {
  has_next: boolean;
  has_prev: boolean;
  page: number;
  pages: number;
  per_page: number;
  posts: Post[];
  total: number;
}

export interface Post {
  comments_count: number;
  content: string;
  id: number;
  image?: string;
  images: string[];
  is_liked: boolean;
  is_owner: boolean;
  likes_count: number;
  music?: Music[];
  timestamp: string;
  total_comments_count: number;
  user: User;
  video: any;
  views_count: number;
}

export interface Music {
  artist: string;
  cover_path: string;
  duration: number;
  file_path: string;
  id: number;
  title: string;
}

export interface User {
  achievement: Achievement;
  avatar_url: string;
  id: number;
  name: string;
  photo: string;
  username: string;
  verification: Verification;
}

export interface Achievement {
  bage: string;
  image_path: string;
}

export interface Verification {
  date: string;
  status: number;
}
