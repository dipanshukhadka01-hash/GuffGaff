import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';

export const listConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'username profileImageUrl')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (req, res, next) => {
  try {
    const { participantIds, title } = req.body;
    const conversation = await Conversation.create({
      participants: [req.user._id, ...participantIds],
      title,
      isGroup: participantIds.length > 1,
    });

    res.status(201).json(conversation);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { content, audioUrl } = req.body;
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      content,
      audioUrl,
    });

    conversation.lastMessageAt = message.createdAt;
    await conversation.save();

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const messages = await Message.find({ conversation: conversation._id })
      .populate('sender', 'username profileImageUrl')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};
