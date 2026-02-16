
export interface Product {
  id: string;
  name: string;
  nameFon?: string; // Nom en langue Fon
  price: number;
  originalPrice?: number;
  category: 'livre' | 'accessoire' | 'rituel' | 'animal' | 'vegetal';
  image: string;
  images?: string[];
  description: string;
  fullDescription?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Trainer {
  name: string;
  bio: string;
  avatar: string;
}

export interface CourseReview {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CourseComment {
  id: string;
  user: string;
  avatar?: string;
  text: string;
  date: string;
  replies?: {
    trainer: string;
    text: string;
    date: string;
  }[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  isCompleted?: boolean;
}

export interface Course {
  id: string;
  title: string;
  type: 'ebook_free' | 'ebook_paid' | 'video_free' | 'video_paid';
  level: number; // 1 to 5
  price: number;
  completed: boolean;
  content?: string;
  description: string;
  duration?: string;
  rating: number;
  reviewCount: number;
  trainer: Trainer;
  benefits?: string[];
  videoUrl?: string;
  reviews?: CourseReview[];
  isBestSeller?: boolean;
  isMostFollowed?: boolean;
  lessons?: Lesson[];
  comments?: CourseComment[];
  prerequisites?: string[];
  requiredTools?: { id: string, name: string }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'bokonon';
  xp: number;
  level: number;
  badges: string[];
  enrolledCourses: string[];
  birthDate?: string;
  faSign?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: 'spiritual' | 'community';
  image: string;
}

export interface FaSign {
  id: number;
  name: string;
  symbol: string; // ASCII representation or description
  meaning: string;
}
