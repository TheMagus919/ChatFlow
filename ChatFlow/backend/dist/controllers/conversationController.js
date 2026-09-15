"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversation = exports.getConversationById = exports.getConversations = void 0;
const conversationService = __importStar(require("../services/conversationService"));
const getConversations = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized'
            });
        }
        const conversations = await conversationService.getConversations(userId);
        return res.json(conversations);
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        return res.status(500).json({
            error: 'Error fetching conversations'
        });
    }
};
exports.getConversations = getConversations;
const getConversationById = async (req, res) => {
    try {
        const conversationId = Number(req.params.id);
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized'
            });
        }
        if (!Number.isInteger(conversationId) ||
            conversationId <= 0) {
            return res.status(400).json({
                error: 'Invalid conversation ID'
            });
        }
        const conversation = await conversationService.getConversationById(conversationId, userId);
        if (!conversation) {
            return res.status(404).json({
                error: 'Conversation not found'
            });
        }
        return res.json(conversation);
    }
    catch (error) {
        console.error('Error fetching conversation:', error);
        return res.status(500).json({
            error: 'Error fetching conversation'
        });
    }
};
exports.getConversationById = getConversationById;
const createConversation = async (req, res) => {
    try {
        const { customerId } = req.body;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized'
            });
        }
        if (!customerId ||
            !Number.isInteger(Number(customerId)) ||
            Number(customerId) <= 0) {
            return res.status(400).json({
                error: 'customerId inválido'
            });
        }
        const conversation = await conversationService.createConversation({
            customerId: Number(customerId),
            userId
        });
        return res.status(201).json(conversation);
    }
    catch (error) {
        console.error('Error creating conversation:', error);
        return res.status(500).json({
            error: 'Error creating conversation'
        });
    }
};
exports.createConversation = createConversation;
/*
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
*/ 
