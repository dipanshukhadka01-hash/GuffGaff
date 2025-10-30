import createError from 'http-errors';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

export const listConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ members: req.user.id })
      .sort({ updatedAt: -1 })
      .populate('members', 'username profilePicture');
    res.json({ conversations });
  } catch (error) {
    next(error);
  }
};

export const startConversation = async (req, res, next) => {
  try {
    const { memberIds, title } = req.body;
    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return next(createError(400, 'A conversation requires at least one partner.'));
    }

    const conversation = await Conversation.create({
      members: Array.from(new Set([...memberIds, req.user.id])),
      isGroup: memberIds.length > 1,
      title
    });

    const populated = await Conversation.findById(conversation.id).populate(
      'members',
      'username profilePicture'
    );
    res.status(201).json({ conversation: populated });
  } catch (error) {
    next(error);
  }
};

export const postMessage = async (req, res, next) => {
  try {
    const { content, audioUrl } = req.body;
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return next(createError(404, 'Conversation not found.'));
    if (!conversation.members.some((memberId) => memberId.equals(req.user.id))) {
      return next(createError(403, 'You are not part of this conversation.'));
    }

    const message = await Message.create({
      conversation: conversation.id,
      sender: req.user.id,
      content,
      audioUrl,
      readBy: [req.user.id]
    });

    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populated = await Message.findById(message.id)
      .populate('sender', 'username profilePicture')
      .populate('conversation');

    const socketServer = req.app.get('socketServer');
    conversation.members.forEach((memberId) => {
      if (!memberId.equals(req.user.id)) {
        socketServer?.pushNotification({
          userId: memberId,
          type: 'message',
          message: `${req.user.username} sent you a message.`,
          link: `/chat`
        });
      }
    });
    socketServer?.io.to(conversation.id.toString()).emit('chat:message', populated);

    res.status(201).json({ message: populated });
  } catch (error) {
    next(error);
  }
};

export const listMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return next(createError(404, 'Conversation not found.'));
    if (!conversation.members.some((memberId) => memberId.equals(req.user.id))) {
      return next(createError(403, 'You are not part of this conversation.'));
    }

    const messages = await Message.find({ conversation: conversation.id })
      .sort({ createdAt: 1 })
      .populate('sender', 'username profilePicture');
    res.json({ messages });
  } catch (error) {
    next(error);
  }
};
