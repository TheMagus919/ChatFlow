import { Request, Response } from 'express';
import * as messageService from '../services/messageService';

export const sendMessage = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      content,
      customerId,
      conversationId
    } = req.body;

    const userId =
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    if (
      typeof content !== 'string' ||
      !content.trim()
    ) {
      return res.status(400).json({
        error: 'El contenido del mensaje es requerido'
      });
    }

    if (
      !customerId ||
      !conversationId ||
      !Number.isInteger(Number(customerId)) ||
      !Number.isInteger(Number(conversationId))
    ) {
      return res.status(400).json({
        error: 'customerId y conversationId son requeridos'
      });
    }

    const message =
      await messageService.sendMessage({
        content: content.trim(),
        customerId: Number(customerId),
        conversationId: Number(conversationId),
        userId
      });

    return res.status(201).json(message);

  } catch (error) {

    console.error(
      'Error sending message:',
      error
    );

    if (
      error instanceof Error &&
      error.message === 'CONVERSATION_NOT_FOUND'
    ) {
      return res.status(404).json({
        error: 'Conversation not found'
      });
    }

    return res.status(500).json({
      error: 'Error sending message'
    });
  }
};


export const getMessagesByConversation = async (
  req: Request,
  res: Response
) => {

  try {

    const conversationId =
      Number(req.params.conversationId);

    const userId =
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    if (
      !Number.isInteger(conversationId) ||
      conversationId <= 0
    ) {
      return res.status(400).json({
        error: 'Invalid conversation ID'
      });
    }

    const messages =
      await messageService.getMessagesByConversation(
        conversationId,
        userId
      );

    return res.json(messages);

  } catch (error) {

    console.error(
      'Error fetching messages:',
      error
    );

    if (
      error instanceof Error &&
      error.message === 'CONVERSATION_NOT_FOUND'
    ) {
      return res.status(404).json({
        error: 'Conversation not found'
      });
    }

    return res.status(500).json({
      error: 'Error fetching messages'
    });
  }
};


export const markDelivered = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      messageId
    } = req.body;

    const userId =
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    if (
      !messageId ||
      !Number.isInteger(Number(messageId))
    ) {
      return res.status(400).json({
        error: 'messageId inválido'
      });
    }

    await messageService.markAsDelivered(
      Number(messageId),
      userId
    );

    return res.json({
      ok: true
    });

  } catch (error) {

    console.error(
      'Error updating message:',
      error
    );

    if (
      error instanceof Error &&
      error.message === 'MESSAGE_NOT_FOUND'
    ) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    return res.status(500).json({
      error: 'Error updating message'
    });
  }
};


export const simulateIncoming = async (
  req: Request,
  res: Response
) => {

  try {

    const userId = 4;//req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    const message =
      await messageService.simulateIncoming(
        req.body,
        userId
      );

    return res.json(message);

  } catch (error) {

    console.error(
      'Error simulating incoming message:',
      error
    );

    if (
      error instanceof Error &&
      error.message === 'CONVERSATION_NOT_FOUND'
    ) {
      return res.status(404).json({
        error: 'Conversation not found'
      });
    }

    return res.status(500).json({
      error: 'Error simulating incoming message'
    });
  }
};