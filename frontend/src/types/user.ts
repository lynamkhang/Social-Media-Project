export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  avatarId?: string;
  coverPhotoUrl?: string;
  coverPhotoId?: string;
  bio?: string;
  dateOfBirth?: Date;
  gender?: string;
  interests?: string[];
  location?: {
    city: string;
    country: string;
  };
  isVerified: boolean;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  createdAt: string;
  updatedAt: string;
}