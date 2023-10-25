import { Request, Response } from "express";
import rand from "csprng";
import pbkdf2 from "pbkdf2";
// import userServices from "../../services/users";
import connection from "../../config/db";

class UserController {
    // private userSrv: any;

    // constructor() {
    //     this.userSrv = userServices;
    // }

    public async index (req: Request, res: Response) {
        const id = req.query.id;
        
        connection.query(`SELECT * FROM users where user_id = ${id}`,  (err, rows) => {
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
    
    public register (req: Request, res: Response) {
        console.log(req)
        // Cifrado de password
        const salt = rand(160, 36);
        const pass = 'Alfredpay01-*';
        const hash = pbkdf2.pbkdf2Sync(pass, salt, 10000, 64, 'sha512').toString('hex');
        
        res.json({message: hash})
    }

    
}

export const userController = new UserController()