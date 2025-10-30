import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  avatarUrl: {
    type: String, //CDN link
  },
  avatarId: {
    type: String, // Cloudinary public_id
  },
  coverPhotoUrl: {
    type: String,
  },
  coverPhotoId: {
    type: String,
  },
  dateOfBirth: Date,
  gender: String,
  interests: [String],
  location: {
    city: String,
    country: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  followersCount: {
    type: Number,
    default: 0
  },
  followingCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;