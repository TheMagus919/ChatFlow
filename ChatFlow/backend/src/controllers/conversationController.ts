import { Request, Response } from 'express';

import * as conversationService
from '../services/conversationService';

export const getConversations = async (
  req: Request,
  res: Response
) => {

  try {

    const userId =
      (req as any).user?.userId;

    if (!userId) {

      return res.status(401).json({
        error: 'Unauthorized'
      });

    }

    const conversations =
      await conversationService
        .getConversations(userId);

    return res.json(conversations);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Error fetching conversations'
    });

  }

};

export const getConversationById = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } = req.params;

    const conversation =
      await conversationService
        .getConversationById(
          Number(id)
        );

    if (!conversation) {

      return res.status(404).json({
        error: 'Conversation not found'
      });

    }

    return res.json(conversation);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Error fetching conversation'
    });

  }

};

export const createConversation = async (
  req: Request,
  res: Response
) => {

  try {

    const { customerId } = req.body;

    const userId =
      (req as any).user?.userId;

    if (!userId) {

      return res.status(401).json({
        error: 'Unauthorized'
      });

    }

    if (!customerId) {

      return res.status(400).json({
        error: 'customerId is required'
      });

    }

    // crear o devolver existente
    const conversation =
      await conversationService
        .createConversation({
          customerId: Number(customerId),
          userId: Number(userId)
        });

    return res.status(201).json(
      conversation
    );

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Error creating conversation'
    });

  }

};