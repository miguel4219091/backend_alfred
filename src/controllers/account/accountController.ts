import { Request, Response } from "express";
// import accountServices from "../../services/account";
import connection from "../../config/db";


function executeQuery(query: string): Promise<any> {
    return new Promise((resolve, reject) => {
      connection.query(query, (err: any, rows: any) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
}


class AccountController {
    // private accountSrv: any;

    constructor() {
        // this.accountSrv = accountServices;
    }

    public async account (req: Request, res: Response) {
        const cvu = req.body.cvu

        const accountData = await executeQuery(`SELECT * FROM cvu_accounts where cvu = '${cvu}'`);
        
        return res.json({
            code: 200,
            status: true,
            message: 'Successful Consultation',
            data: accountData
        });  
       
    }
    
    public async transaction (req: Request, res: Response) {
        const cvu = req.body.cvu

        if(!cvu) {
            return res.status(500).json({
                code: 500,
                status: false,
                message: 'Non-existent CVU',
                data: null
              });
        }

        const accountData = await executeQuery(`SELECT a.amount,b.transaction_type, a.transaction_datetime FROM transactions b, 
            cvu_account_transactions a 
            where b.account_transaction_id = a.cvu_account_transaction_id and b.user_id = 3319 order by 3 desc`);

        return res.json({
            code: 200,
            status: true,
            message: 'Successful Consultation',
            data: accountData
        });  
        
    }

    
}

export const accountController = new AccountController()