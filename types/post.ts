export interface Root {
  comments: Comment[]
  post: Post
}

export interface Comment {
  content: string
  id: number
  image: string
  is_deleted: boolean
  likes_count: number
  replies: Reply[]
  timestamp: string
  user: User2
  user_id: number
  user_liked: boolean
}

export interface Reply {
  content: string
  id: number
  image: any
  is_deleted: boolean
  likes_count: number
  parent_reply_id?: number
  timestamp: string
  user: User
  user_id: number
  user_liked: boolean
}

export interface User {
  achievement: Achievement
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

export interface User2 {
  achievement: Achievement2
  avatar_url: string
  id: number
  name: string
  photo: string
  username: string
  verification: any
}

export interface Achievement2 {
  bage: string
  image_path: string
}

export interface Post {
  comments_count: number
  content: string
  id: number
  image: string
  images: string[]
  is_liked: boolean
  is_owner: boolean
  likes_count: number
  music: any
  recipient_id: any
  timestamp: string
  total_comments_count: number
  type: string
  user: User3
  user_id: number
  video: any
  views_count: number
}

export interface User3 {
  achievement: Achievement3
  avatar_url: string
  id: number
  name: string
  photo: string
  username: string
  verification: Verification2
}

export interface Achievement3 {
  bage: string
  image_path: string
}

export interface Verification2 {
  date: string
  status: number
}
