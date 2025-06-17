export interface Root {
  data: Data
  success: boolean
}

export interface Data {
  current_owner: CurrentOwner
  ownership_history: OwnershipHistory[]
  username: string
  users: Users
}

export interface CurrentOwner {
  id: number
  name: string
  username: string
}

export interface OwnershipHistory {
  buyer_id: number
  buyer_username: string
  price: number
  seller_id: any
  seller_username: string
  timestamp: string
}

export interface Users {
  [key: string]: {
    id: number
    is_verified: boolean
    name: string
    photo: string
    username: string
  }
}
