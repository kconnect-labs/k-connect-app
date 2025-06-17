export interface Root {
  has_next: boolean
  page: number
  pages: number
  posts: Post[]
  total: number
}

export interface Post {
  comments_count: number
  content: string
  id: number
  image?: string
  images?: string[]
  is_liked: boolean
  is_owner: boolean
  likes_count: number
  music: any
  recipient_id: any
  timestamp: string
  total_comments_count: number
  type: string
  user: User
  user_id: number
  video: any
  views_count: number
}

export interface User {
  achievement?: Achievement
  avatar_url: string
  id: number
  name: string
  photo: string
  username: string
  verification?: Verification
}

export interface Achievement {
  bage: string
  image_path: string
}

export interface Verification {
  date: string
  status: number
}
