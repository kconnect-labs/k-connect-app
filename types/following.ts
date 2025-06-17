export interface Root {
  following: Following[]
  has_next: boolean
  has_prev: boolean
  page: number
  pages: number
  per_page: number
  total: number
}

export interface Following {
  achievement?: Achievement
  avatar_url: string
  current_user_follows: boolean
  current_user_is_friend: boolean
  follows_back: boolean
  id: number
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
