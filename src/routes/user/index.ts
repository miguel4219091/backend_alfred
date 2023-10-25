import { Router } from "express";
import { userController } from "../../controllers/user/userController";

class UserRouter{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(){
        this.router.post('/register', userController.register)
        this.router.get('/', userController.index)
    }
}

const userRouter =new UserRouter()
export default userRouter.router;

