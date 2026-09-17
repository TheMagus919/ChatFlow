"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new customerController_1.CustomerController();
router.get('/', auth_1.authenticateToken, controller.getCustomers.bind(controller));
router.get('/pipeline', auth_1.authenticateToken, controller.getByStatus.bind(controller));
router.get('/pipeline', auth_1.authenticateToken, controller.getByStatus.bind(controller));
router.patch('/:id/status', auth_1.authenticateToken, controller.updateStatus.bind(controller));
router.post('/:customerId/tags', auth_1.authenticateToken, controller.assignTags.bind(controller));
router.get('/:customerId/tags', auth_1.authenticateToken, controller.getCustomerTags.bind(controller));
//ABM
router.post('/', auth_1.authenticateToken, controller.create.bind(controller));
router.put('/:id', auth_1.authenticateToken, controller.update.bind(controller));
router.delete('/:id', auth_1.authenticateToken, controller.delete.bind(controller));
exports.default = router;
