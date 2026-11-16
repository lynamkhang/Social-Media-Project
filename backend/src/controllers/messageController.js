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

    //Phải có nội dung hoặc file đính kèm
    if (!trimmedContent && !hasMedia) {
      return res.status(400).json({ message: "Tin nhắn không được để trống" });
    }

    let conversation;

    //TH1: Có conversationId -> tìm và xác thực
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
          .json({ message: "Cuộc trò chuyện không tồn tại" });
      }

      // Người gửi có phải là thành viên của cuộc trò chuyện không
      const isParticipant = conversation.participants.some(
        (p) => p.userId.toString() === senderId.toString(),
      );

      if (!isParticipant) {
        return res
          .status(403)
          .json({
            message:
              "Bạn không có quyền gửi tin nhắn trong cuộc trò chuyện này",
          });
      }
    } else {
      //TH2: Không có conversationId -> tìm hoặc tạo cuộc trò chuyện 1-1
      if (!recipientId || !mongoose.Types.ObjectId.isValid(recipientId)) {
        return res.status(400).json({ message: "ID người nhận không hợp lệ" });
      }

      if (recipientId.toString() === senderId.toString()) {
        return res
          .status(400)
          .json({ message: "Bạn không thể gửi tin nhắn cho chính mình" });
      }

      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [senderId, recipientId] },
      });
    }

    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() },
        ],
        lastMessage: new Date(),
        unreadCounts: new Map(),
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content,
      messageType,
      mediaUrls,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();

    return res.status(201).json({ message });
  } catch (error) {
    console.error("Lỗi xảy ra khi gửi tin nhăn trực tiếp", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const sendGroupMessage = async (req, res) => {};
