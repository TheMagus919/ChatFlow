"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statisticsController_1 = require("../controllers/statisticsController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticateToken, statisticsController_1.getDashboardStats);
exports.default = router;
