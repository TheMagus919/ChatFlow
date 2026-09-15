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
            const notifications = await this.notificationService
                .getByUser(userId);
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
            const userId = req.user?.userId;
            console.log('notificationService:', this.notificationService);
            const notifications = await this.notificationService
                .getByUser(Number(userId));
            console.log('notificationService:', this.notificationService);
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
            const { userId, title, message, type, referenced_id } = req.body;
            if (referenced_id == undefined || '' || "" || null) {
                const notification = await this.notificationService.create(userId, title, message, type);
                res.status(201).json(notification);
            }
            else {
                const notification = await this.notificationService.create(userId, title, message, type, referenced_id);
                res.status(201).json(notification);
            }
        }
        catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
    async markAsRead(req, res) {
        try {
            await this.notificationService
                .markAsRead(Number(req.params.id));
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
            const userId = req.user?.userId;
            await this.notificationService
                .markAllAsRead(Number(userId));
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
            const total = await this.notificationService
                .countUnread(Number(req.params.userId));
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
