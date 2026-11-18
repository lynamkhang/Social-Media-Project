import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { updateConversationAfterCreateMessage } from "../utils/messageHelper.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const {
      recipientId,
      content,
      conversationId,
      messageType = "text",
      mediaUrls = [],
    } = req.body;

    const senderId = req.user?._id;

    if (!senderId) {
      return res.status(401).json({ message: "Yêu cầu đăng nhập" });
    }

    const trimmedContent = content?.trim();
    const hasMedia = Array.isArray(mediaUrls) && mediaUrls.length > 0;

    if (!trimmedContent && !hasMedia) {
      return res.status(400).json({ message: "Tin nhắn không được để trống" });
    }

    let conversation;

    // TH1: Client gửi kèm conversationId (tiếp tục cuộc trò chuyện cũ)
    if (conversationId) {
      if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return res
          .status(400)
          .json({ message: "ID cuộc trò chuyện không hợp lệ" });
      }

      conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy cuộc trò chuyện" });
      }

      // Chặn IDOR: sender phải nằm trong participants
      const isMember = conversation.participants.some(
        (p) => p.userId.toString() === senderId.toString(),
      );

      if (!isMember) {
        return res
          .status(403)
          .json({
            message:
              "Bạn không có quyền gửi tin nhắn trong cuộc trò chuyện này",
          });
      }
    }
    // TH2: Tin nhắn mới – tìm conversation đã tồn tại hoặc tạo mới
    else {
      if (!recipientId || !mongoose.Types.ObjectId.isValid(recipientId)) {
        return res
          .status(400)
          .json({ message: "ID người nhận không hợp lệ hoặc bị thiếu" });
      }

      if (recipientId.toString() === senderId.toString()) {
        return res
          .status(400)
          .json({ message: "Không thể tự gửi tin nhắn cho chính mình" });
      }

      // Tìm conversation direct đã tồn tại giữa 2 user
      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [senderId, recipientId] },
      });

      // Nếu chưa có -> Tạo mới
      if (!conversation) {
        conversation = new Conversation({
          type: "direct",
          participants: [
            { userId: senderId, joinedAt: new Date() },
            { userId: recipientId, joinedAt: new Date() },
          ],
          lastMessageAt: new Date(),
          unreadCounts: new Map([
            [senderId.toString(), 0],
            [recipientId.toString(), 0],
          ]),
        });
        await conversation.save();
      }
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content: trimmedContent || "",
      messageType,
      mediaUrls,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.save();

    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error("Lỗi xảy ra khi gửi tin nhắn trực tiếp:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { content, messageType = "text", mediaUrls = [] } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation; // Được gán bởi checkGroupMembership middleware

    const trimmedContent = content?.trim();
    const hasMedia = Array.isArray(mediaUrls) && mediaUrls.length > 0;

    if (!trimmedContent && !hasMedia) {
      return res.status(400).json({ message: "Tin nhắn không được để trống" });
    }

    const message = await Message.create({
      conversationId: conversation._id, // Dùng từ conversation đã xác thực, không tin client
      senderId,
      content: trimmedContent || "",
      messageType,
      mediaUrls,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.save();

    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error("Lỗi xảy ra khi gửi tin nhắn nhóm:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
