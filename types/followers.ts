export interface Root {
  followers: Follower[]
  has_next: boolean
  has_prev: boolean
  page: number
  pages: number
  per_page: number
  total: number
}

export interface Follower {
  achievement?: Achievement
  avatar_url: string
  id: number
  is_following: boolean
  is_friend: boolean
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
