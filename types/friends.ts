export interface Root {
  friends: Friend[]
  has_next: boolean
  has_prev: boolean
  page: number
  pages: number
  per_page: number
  total: number
}

export interface Friend {
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
