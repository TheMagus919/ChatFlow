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
exports.simulateIncoming = exports.markDelivered = exports.getMessagesByConversation = exports.sendMessage = void 0;
const messageService = __importStar(require("../services/messageService"));
const sendMessage = async (req, res) => {
    try {
        const { content, customerId, conversationId } = req.body;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized'
            });
        }
        if (typeof content !== 'string' ||
            !content.trim()) {
            return res.status(400).json({
                error: 'El contenido del mensaje es requerido'
            });
        }
        if (!customerId ||
            !conversationId ||
            !Number.isInteger(Number(customerId)) ||
            !Number.isInteger(Number(conversationId))) {
            return res.status(400).json({
                error: 'customerId y conversationId son requeridos'
            });
        }
        const message = await messageService.sendMessage({
            content: content.trim(),
            customerId: Number(customerId),
            conversationId: Number(conversationId),
            userId
        });
        return res.status(201).json(message);
    }
    catch (error) {
        console.error('Error sending message:', error);
        if (error instanceof Error &&
            error.message === 'CONVERSATION_NOT_FOUND') {
            return res.status(404).json({
                error: 'Conversation not found'
            });
        }
        return res.status(500).json({
            error: 'Error sending message'
        });
    }
};
exports.sendMessage = sendMessage;
const getMessagesByConversation = async (req, res) => {
    try {
        const conversationId = Number(req.params.conversationId);
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
        const messages = await messageService.getMessagesByConversation(conversationId, userId);
        return res.json(messages);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        if (error instanceof Error &&
            error.message === 'CONVERSATION_NOT_FOUND') {
            return res.status(404).json({
                error: 'Conversation not found'
            });
        }
        return res.status(500).json({
            error: 'Error fetching messages'
        });
    }
};
exports.getMessagesByConversation = getMessagesByConversation;
const markDelivered = async (req, res) => {
    try {
        const { messageId } = req.body;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized'
            });
        }
        if (!messageId ||
            !Number.isInteger(Number(messageId))) {
            return res.status(400).json({
                error: 'messageId inválido'
            });
        }
        await messageService.markAsDelivered(Number(messageId), userId);
        return res.json({
            ok: true
        });
    }
    catch (error) {
        console.error('Error updating message:', error);
        if (error instanceof Error &&
            error.message === 'MESSAGE_NOT_FOUND') {
            return res.status(404).json({
                error: 'Message not found'
            });
        }
        return res.status(500).json({
            error: 'Error updating message'
        });
    }
};
exports.markDelivered = markDelivered;
const simulateIncoming = async (req, res) => {
    try {
        const userId = 4; //req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized'
            });
        }
        const message = await messageService.simulateIncoming(req.body, userId);
        return res.json(message);
    }
    catch (error) {
        console.error('Error simulating incoming message:', error);
        if (error instanceof Error &&
            error.message === 'CONVERSATION_NOT_FOUND') {
            return res.status(404).json({
                error: 'Conversation not found'
            });
        }
        return res.status(500).json({
            error: 'Error simulating incoming message'
        });
    }
};
exports.simulateIncoming = simulateIncoming;
