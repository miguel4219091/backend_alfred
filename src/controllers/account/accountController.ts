import { Request, Response } from "express";
// import accountServices from "../../services/account";
import connection from "../../config/db";

class AccountController {
    // private accountSrv: any;

    constructor() {
        // this.accountSrv = accountServices;
    }

    public async account (req: Request, res: Response) {
        const cvu = req.body.cvu

        connection.query(`SELECT * FROM cvu_accounts where cvu = ${cvu}`,  (err, rows) => {
            if (err) {
              console.error('Error executing MySQL query:', err);
              res.status(500).send('Internal Server Error');
            } else {
              const result = rows[0];
              res.json({
                code: 400,
                status: true,
                data: result
              });
            }
        }); 
    }
    
    public transaction (req: Request, res: Response) {
        const cvu = req.body.cvu

        connection.query(`
            SELECT t.*
            FROM cvu_account_transactions AS t
            JOIN cvu_accounts AS a ON t.cvu_account_id = a.cvu_account_id
            WHERE a.cvu = ${cvu} order by cvu_account_transaction_id desc
            `, (err, rows) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                res.status(500).send('Internal Server Error');
            } else {
                const result = rows;
                res.json({
                code: 400,
                status: true,
                data: result
                });
            }
        });
        
    }

    
}

export const accountController = new AccountController()