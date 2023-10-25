import { Router } from "express";
import { accountController } from "../../controllers/account/accountController";

class AccountRouter{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(){
        this.router.post('/cvu', accountController.account)
        this.router.post('/transaction', accountController.transaction)
    }
}

const accountRouter =new AccountRouter()
export default accountRouter.router;
