import { Router } from "express";
import { transactionController } from "../../controllers/transaction/transactionController";

class TransactionRouter{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(){
        this.router.post('/register', transactionController.register)
        this.router.get('/', transactionController.index)
    }
}

const transactionRouter =new TransactionRouter()
export default transactionRouter.router;

