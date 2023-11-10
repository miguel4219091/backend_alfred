import { Request, Response } from "express";
import connection_alfred from "../../config/db_alfred";

function executeQuery(query: string): Promise<any> {
    return new Promise((resolve, reject) => {
      connection_alfred.query(query, (err: any, rows: any, ) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
}

function executeQueryInsert(query: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      connection_alfred.query(query, data, (err: any, rows: any, ) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
}

class TransactionController {
    public async index(req: Request, res: Response) {
        const id = req.query.id as string;

        try {
            const userData = await executeQuery(`SELECT * FROM transaction WHERE user_id = ${id}`);
            res.json({
                code: 200,
                status: true,
                message: 'Consulta Exitosa',
                data: userData
            });   
        } catch (error) {
        console.error('Error executing MySQL query:', error);
        res.status(500).json({
            code: 500,
            status: false,
            message: 'Internal Server Error',
            data: null
        });
        }
    }
    public async register (req: Request, res: Response) {
        // Data
        const movementType = req.body.movementType;
        const amount = req.body.amount;
        const transactionReference = req.body.transactionReference;
        const description = req.body.description;
        const fax = req.body.fax;
        const transactionType = req.body.transactionType;
        const status = req.body.status;
        const createdAt = req.body.createdAt;
        const userId = req.body.userId;
        const fee = req.body.fee;
        const total = req.body.total;
        const currentBalance = req.body.currentBalance;
        const newBalance = req.body.newBalance;
        const type = req.body.type;
        const from = req.body.from;
        const to = req.body.to;
        const successful = req.body.successful;
        const memo = req.body.memo;
        const refPayment = req.body.refPayment;
        const idUserBank = req.body.idUserBank;
        const businessId = req.body.businessId;
        const pinId = req.body.pinId;
        const transacctionId = req.body.transacctionId;
        const bankId = req.body.bankId;
        const idTransactionProcess = req.body.idTransactionProcess;


        const dataTransaction = {
            movementType: movementType,
            amount: amount,
            transactionReference: transactionReference,
            description: description,
            fax: fax,
            transactionType: transactionType,
            status: status,
            createdAt: new Date(createdAt),
            userId: userId,
            fee: fee,
            total: total,
            currentBalance: currentBalance,
            newBalance: newBalance,
            type: type,
            from: from,
            to: to,
            successful: successful,
            memo: memo,
            refPayment: refPayment,
            idUserBank: idUserBank,
            businessId: businessId,
            pinId: pinId,
            transacctionId: transacctionId,
            bankId: bankId,
            idTransactionProcess: idTransactionProcess
          };
          console.log({dataTransaction})

        const validate_transaction = await executeQuery(`SELECT * FROM transaction WHERE transacctionId = '${transacctionId}'`);

        if (validate_transaction.length > 0) {
            return res.status(402).json({
                code: 200,
                status: true,
                message: 'Ya existe transaccion con ese id',
                data: null
            });
        }

        const result = await executeQueryInsert(`INSERT INTO transaction SET ?`, dataTransaction); 
        
        if (result.insertId > 0) {
            return res.status(200).json({
                code: 200,
                status: true,
                message: 'Registro Exitoso',
                data: {
                    transaction_id: result.insertId
                }
            });
        }else{
            return res.status(403).json({
                code: 403,
                status: true,
                message: 'Falla al cargar el registro',
                data: null
            });
        }
    }
}

export const transactionController = new TransactionController()