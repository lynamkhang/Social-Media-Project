import Friend from "../models/Friend.js";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;

    const from = req.user._id;

    if (from === to) {
      return res
        .status(400)
        .json({ message: "Không thể gửi lời mời kết bạn cho chính mình" });
    }

    const userExists = await User.exists({ _id: to });

    if (!userExists) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    let userA = from.toString();
    let userB = to.toString();

    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    const [alreadyFriend, existingRequest] = await Promise.all([
      Friend.findOne({ userA, userB }),
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      }),
    ]);

    if (alreadyFriend) {
      return res.status(400).json({ message: "Hai người đã là bạn bè" });
    }

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Đã có lời mời kết bạn đang chờ" });
    }

    const request = await FriendRequest.create({
      from,
      to,
      message,
    });

    return res
      .status(200)
      .json({ message: "Gửi lời mời kết bạn thành công", request });
  } catch (error) {
    console.log("Error when sending friend request", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy lời mời kết bạn" });
    }

    if (request.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền chấp nhận lời mời này" });
    }

    const friend = await Friend.create({
      userA: request.from,
      userB: request.to,
    });

    await FriendRequest.findByIdAndDelete(requestId);

    const from = await User.findById(request.from)
      .select("_id fullName avatarUrl")
      .lean();

    return res.status(200).json({
      message: "Chấp nhận lời mời kết bạn thành công",
      newFriend: {
        _id: from?._id,
        fullName: from?.fullName,
        avatarUrl: from?.avatarUrl,
      },
    });
  } catch (error) {
    console.log("Error when accepting friend request", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy lời mời kết bạn" });
    }
    if (request.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền từ chối lời mời này" });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    return res.sendStatus(204);
  } catch (error) {
    console.log("Error when declining friend request", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const getAllFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friendships = await Friend.find({
      $or: [
        {
          userA: userId,
        },
        {
          userB: userId,
        },
      ],
    })
      .populate("userA", "_id fullName avatarUrl")
      .populate("userB", "_id fullName avatarUrl")
      .lean();

    if (!friendships.length) {
      return res.status(200).json({ friends: [] });
    }

    const friends = friendships.map((f) =>
      f.userA._id.toString() === userId.toString() ? f.userB : f.userA,
    );

    return res.status(200).json({ friends });
  } catch (error) {
    console.log("Error when get all friend", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const populateFields = "_id username fullName avatarUrl";

    const [sent, received] = await Promise.all([
      FriendRequest.find({ from: userId }).populate("to", populateFields),
      FriendRequest.find({ to: userId }).populate("from", populateFields),
    ]);

    return res.status(200).json({ sent, received });
  } catch (error) {
    console.log("Error when get friend request", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const getFriendSuggestion = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = Number(req.query.limit) || 10;

    // Lấy danh sách bạn và lời mời đang chờ
    const [friendships, pendingRequests, currentUser] = await Promise.all([
      Friend.find({ $or: [{ userA: userId }, { userB: userId }] }).lean(),
      FriendRequest.find({ $or: [{ from: userId }, { to: userId }] }).lean(),
      User.findById(userId).select("interests location").lean(),
    ]);

    const myFriendIds = friendships.map((f) =>
      f.userA.toString() == userId.toString()
        ? f.userB.toString()
        : f.userA.toString(),
    );

    const pendingIds = pendingRequests.map((r) =>
      r.from.toString() === userId.toString()
        ? r.to.toString()
        : r.from.toString(),
    );

    // Loại ID bản thân + bạn bè + đang chờ kết bạn
    const excludedIds = new Set([
      userId.toString(),
      ...myFriendIds,
      ...pendingIds,
    ]);

    // Đếm bạn chung (bậc 2)
    const mutualMap = new Map();
    if (myFriendIds.length > 0) {
      const fofList = await Friend.find({
        $or: [{ userA: { $in: myFriendIds } }, { userB: { $in: myFriendIds } }],
      }).lean();

      for (const f of fofList) {
        const a = f.userA.toString();
        const b = f.userB.toString();
        const candidateId = myFriendIds.includes(a) ? b : a;

        if (!excludedIds.has(candidateId)) {
          mutualMap.set(candidateId, (mutualMap.get(candidateId) || 0) + 1);
        }
      }
    }

    // Lấy ứng viên
    const candidates = await User.find({
      _id: { $nin: Array.from(excludedIds) },
    })
      .select(
        "_id username fullName avatarUrl interests location followerCount",
      )
      .limit(100)
      .lean();

    // Chấm điểm: bạn chung > cùng thành phố > sở thích
    const myCity = currentUser?.location?.city?.toLowerCase();
    const myInterests = new Set(currentUser?.interests || []);

    const scored = candidates.map((u) => {
      const mutualFriendsCount = mutualMap.get(u._id.toString()) || 0;
      const sameCity =
        myCity && u.location?.city?.toLowerCase() === myCity ? 1 : 0;
      const commonInterests = (u.interests || []).filter((i) =>
        myInterests.has(i),
      ).length;

      const score =
        mutualFriendsCount * 10 + sameCity * 3 + commonInterests * 2;

      return {
        _id: u._id,
        username: u.username,
        fullName: u.fullName,
        avatarUrl: u.avatarUrl,
        mutualFriendsCount,
        score,
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return res.status(200).json({ suggestions: scored.slice(0, limit) });
  } catch (error) {
    console.error("Lỗi khi đề xuất bạn bè:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const unfriend = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { friendId } = req.params;
    const [userA, userB] =
      userId < friendId ? [userId, friendId] : [friendId, userId];
    const deleted = await Friend.findOneAndDelete({ userA, userB });
    if (!deleted) {
      return res.status(404).json({ message: "Hai người không phải bạn bè" });
    }
    return res.status(200).json({ message: "Đã hủy kết bạn" });
  } catch (error) {
    console.error("Lỗi khi hủy kết bạn:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
