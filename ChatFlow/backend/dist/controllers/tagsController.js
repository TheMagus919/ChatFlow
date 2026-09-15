"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsController = void 0;
const tagService_1 = require("../services/tagService");
const customerTagService_1 = require("../services/customerTagService");
class TagsController {
    constructor() {
        this.tagService = new tagService_1.TagService();
        this.customerTagService = new customerTagService_1.CustomerTagService();
    }
    // ✅ HELPER: Extraer userId SAFE
    getUserId(req) {
        console.log('🔍 getUserId - req.user:', req.user); // DEBUG
        if (!req.user?.id) {
            throw new Error('Unauthorized');
        }
        return req.user.id;
    }
    async getAll(req, res) {
        try {
            const userId = req.user?.userId;
            const tags = await this.tagService.findAll();
            console.log('Fetched tags for userId', userId, ':', tags); // DEBUG
            res.json({ success: true, data: tags });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            const userId = req.user.userId;
            const { name, color, description } = req.body;
            const tag = await this.tagService.create(name, color, description);
            res.status(201).json({ success: true, data: tag });
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Tag name already exists' });
            }
            res.status(500).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const userId = req.user.userId;
            const id = req.params.id;
            const updates = req.body;
            const tag = await this.tagService.update(id, updates);
            if (!tag) {
                return res.status(404).json({ error: 'Tag not found' });
            }
            res.json({ success: true, data: tag });
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Tag name already exists' });
            }
            res.status(500).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            const userId = req.user.userId;
            const id = req.params.id;
            await this.tagService.delete(id, userId);
            res.json({ success: true, message: 'Tag deleted successfully' });
        }
        catch (error) {
            if (error.message.includes('used by')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
    async getCustomersByTag(req, res) {
        try {
            const userId = req.user.userId;
            const tagId = req.params.tagId;
            const customers = await this.tagService.findCustomersByTag(tagId, userId);
            res.json({ success: true, data: customers });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getPopularTags(req, res) {
        try {
            const userId = req.user.userId;
            const tags = await this.tagService.getPopularTags(userId);
            res.json({ success: true, data: tags });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const id = req.params.id;
            const tag = await this.customerTagService.findTagsByCustomer(id);
            res.json({ success: true, data: tag });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.TagsController = TagsController;
