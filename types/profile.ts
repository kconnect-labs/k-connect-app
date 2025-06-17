export interface Root {
  achievement: Achievement;
  followers_count: number;
  following_count: number;
  friends_count: number,
  is_following: boolean;
  notifications_enabled: boolean;
  posts_count: number;
  socials: Social[];
  subscription: Subscription;
  user: User;
  verification: Verification;
}

export interface Achievement {
  bage: string;
  image_path: string;
}

export interface Social {
  link: string;
  name: string;
}

export interface Subscription {
  active: boolean;
  expires_at: string;
  subscription_date: string;
  type: string;
}

export interface User {
  registration_date: string,
  about: string;
  avatar_url: string;
  banner_url: string;
  cover_photo: string;
  element_connected: boolean;
  element_id: string;
  followers_count: number;
  following_count: number;
  id: number;
  interests: string;
  name: string;
  photo: string;
  photos_count: number;
  posts_count: number;
  purchased_usernames: PurchasedUsername[];
  status_color: string;
  status_text: string;
  total_likes: number;
  username: string;
  verification_status: number;
}

export interface PurchasedUsername {
  id: number;
  is_active: boolean;
  price_paid: number;
  purchase_date: string;
  username: string;
}

export interface Verification {
  date: string;
  status: number;
}
