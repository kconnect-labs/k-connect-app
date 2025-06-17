export interface Root {
  badges: Badge[]
}

export interface Badge {
  copies_sold: number
  creator: Creator
  creator_id: number
  description: string
  id: number
  image_path: string
  is_sold_out: any
  max_copies?: number
  name: string
  price: number
  purchases: Purchase[]
}

export interface Creator {
  avatar_url: string
  id: number
  name: string
  username: string
}

export interface Purchase {
  buyer: Buyer
  buyer_id: number
  purchase_date: string
}

export interface Buyer {
  avatar_url: string
  id: number
  name: string
  username: string
}
