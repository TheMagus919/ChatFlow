"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notificationService_1 = require("../services/notificationService");
class NotificationController {
    constructor() {
        this.notificationService = new notificationService_1.NotificationService();
    }
    async getByUser(req, res) {
        try {
            const userId = Number(req.params.userId);
            if (!Number.isInteger(userId) ||
                userId <= 0) {
                res.status(400).json({
                    error: 'Usuario inválido'
                });
                return;
            }
            const notifications = await this.notificationService.getByUser(userId);
            res.json(notifications);
        }
        catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
    async getNotifications(req, res) {
        try {
            const userId = Number(req.user?.userId);
            if (!Number.isInteger(userId) ||
                userId <= 0) {
                res.status(401).json({
                    error: 'Usuario no autenticado'
                });
                return;
            }
            const notifications = await this.notificationService.getByUser(userId);
            res.json(notifications);
        }
        catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
    async create(req, res) {
        try {
            const userId = Number(req.user?.userId);
            if (!Number.isInteger(userId) ||
                userId <= 0) {
                res.status(401).json({
                    error: 'Usuario no autenticado'
                });
                return;
            }
            const { title, message, type, reference_id } = req.body;
            if (typeof title !== 'string' ||
                !title.trim()) {
                res.status(400).json({
                    error: 'El título es obligatorio'
                });
                return;
            }
            if (typeof message !== 'string' ||
                !message.trim()) {
                res.status(400).json({
                    error: 'El mensaje es obligatorio'
                });
                return;
            }
            if (typeof type !== 'string' ||
                !type.trim()) {
                res.status(400).json({
                    error: 'El tipo es obligatorio'
                });
                return;
            }
            const notification = await this.notificationService.create(userId, title.trim(), message.trim(), type.trim(), reference_id);
            res.status(201).json(notification);
        }
        catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
    async markAsRead(req, res) {
        try {
            const userId = Number(req.user?.userId);
            const notificationId = Number(req.params.id);
            if (!Number.isInteger(userId) ||
                userId <= 0) {
                res.status(401).json({
                    error: 'Usuario no autenticado'
                });
                return;
            }
            if (!Number.isInteger(notificationId) ||
                notificationId <= 0) {
                res.status(400).json({
                    error: 'ID de notificación inválido'
                });
                return;
            }
            await this.notificationService.markAsRead(notificationId, userId);
            res.json({
                message: 'Notification updated'
            });
        }
        catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
    async markAllAsRead(req, res) {
        try {
            const userId = Number(req.user?.userId);
            if (!Number.isInteger(userId) ||
                userId <= 0) {
                res.status(401).json({
                    error: 'Usuario no autenticado'
                });
                return;
            }
            await this.notificationService.markAllAsRead(userId);
            res.json({
                message: 'All notifications updated'
            });
        }
        catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
    async countUnread(req, res) {
        try {
            const userId = Number(req.user?.userId);
            if (!Number.isInteger(userId) ||
                userId <= 0) {
                res.status(401).json({
                    error: 'Usuario no autenticado'
                });
                return;
            }
            const total = await this.notificationService.countUnread(userId);
            res.json({
                total
            });
        }
        catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
}
exports.NotificationController = NotificationController;
