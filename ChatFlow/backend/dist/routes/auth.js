"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new authController_1.AuthController();
// ✅ Arrow functions evitan el problema de 'this'
router.post('/register', (req, res) => controller.register(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', auth_1.authenticateToken, (req, res) => controller.logout(req, res));
router.get('/me', auth_1.authenticateToken, (req, res) => controller.me(req, res));
exports.default = router;
