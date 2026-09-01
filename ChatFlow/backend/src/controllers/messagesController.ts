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

    const userId = (req as any).user.id;

    if (!content || !customerId || !conversationId) {
      return res.status(400).json({
        error: 'Missing fields'
      });
    }

    const message = await messageService.sendMessage({
      content,
      customerId,
      conversationId,
      userId
    });

    return res.status(201).json(message);

  } catch (error) {

    console.error(error);

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

    const { conversationId } = req.params;

    const messages =
      await messageService.getMessagesByConversation(
        Number(conversationId)
      );

    return res.json(messages);

  } catch (error) {

    console.error(error);

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

    const { messageId } = req.body;

    await messageService.markAsDelivered(messageId);

    return res.json({
      ok: true
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Error updating message'
    });

  }
};

export const simulateIncoming = async (
  req: Request,
  res: Response
) => {
  const message =
    await messageService
      .simulateIncoming(
        req.body
      );
  res.json(message);

}