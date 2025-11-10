import User from "../models/User.js";
import Follow from "../models/Follow.js";

export const authMe = async (req, res) => {
  try {
    const user = req.user; //Get from authMiddleware

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error when calling authMe", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { identifier } = req.params;
    const currentUserId = req.user._id;

    const user = await User.findOne({
      $or: [{ username: identifier.toLowerCase() }, { _id: identifier }],
    }).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    isFollowing = await Follow.exists({
      followerId: currentUserId,
      followingId: user._id,
    });

    const isOwnProfile = currentUserId.equals(user._id);
    const canViewProfile = isOwnProfile || !user.isPrivate || isFollowing;

    if (!canViewProfile) {
      return res.status(403).json({
        message: "This profile is private",
        user: {
          _id: user._id,
          username: user.username,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
          isPrivate: user.isPrivate,
          followersCount: user.followersCount,
          followingCount: user.followingCount,
        },
        isFollowing: false,
        isOwnProfile: false,
      });
    }

    return res.status(200).json({
      user,
      isFollowing: !!isFollowing,
      isOwnProfile,
    });
  } catch (error) {
    console.error("Error when calling getUserProfile", error);
    return res.status(500).json({ message: "System error" });
  }
};
