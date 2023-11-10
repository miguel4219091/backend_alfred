"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../../controllers/user/userController");
class UserRouter {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/register', userController_1.userController.register);
        this.router.get('/', userController_1.userController.index);
    }
}
const userRouter = new UserRouter();
exports.default = userRouter.router;
