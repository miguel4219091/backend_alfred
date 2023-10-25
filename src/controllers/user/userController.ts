import { Request, Response } from "express";
import rand from "csprng";
import pbkdf2 from "pbkdf2";
import { v4 as uuidv4 } from 'uuid';
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

class UserController {
    public async index(req: Request, res: Response) {
        const id = req.query.id as string;

        try {
            const userData = await executeQuery(`SELECT * FROM users WHERE user_id = ${id}`);
            res.json({
                code: 400,
                status: true,
                data: userData
            });   
        } catch (error) {
        console.error('Error executing MySQL query:', error);
        res.status(500).send('Internal Server Error');
        }
    }
    
    public async register (req: Request, res: Response) {
        
        // Cifrado de password
        const pass = 'Alfredpay01-*';
        const salt = rand(160, 36);
        const hash = pbkdf2.pbkdf2Sync(pass, salt, 10000, 64, 'sha512').toString('hex');
        const email: string = req.body.email;
        const name: string = req.body.name;
        const phone_number: string = req.body.phone_number;
        const cuit: string = req.body.cuit;
        const dni: string = req.body.dni;
        const address_province: string = req.body.address_province;
        const address_street: string = req.body.address_street;
        const address_city: string = req.body.address_city;
        const address_postal_code: string = req.body.address_postal_code;
        const fiscal_situacion: string = req.body.fiscal_situacion;
        const gender: string = req.body.gender;

        // validar usuario: 

        const sqlValidator = `SELECT * FROM users WHERE email = '${email}'`
        const validate_email = await executeQuery(sqlValidator);  

        console.log({validate_email: validate_email.length})
        const sqlValidatorphone = `SELECT * FROM users WHERE phone_number = '${phone_number}'`
        const validate_phone = await executeQuery(sqlValidatorphone);  
        console.log({validate_phone: validate_phone.length})

        if (validate_email.length > 0) {
            res.json({
                code: 400,
                status: true,
                message: 'Correo existente',
                data: null
            });
        }

        if (validate_phone.length > 0) {
            res.json({
                code: 400,
                status: true,
                message: 'Telefono existente',
                data: null
            });
        }


        const sqlUnserRegister = `INSERT INTO users (
            email,
            name,
            phone_number,
            cuit,
            status,
            creation_date,
            hash,
            salt,
            dni,
            terms_and_conditions_accepted,
            address_country,
            address_province,
            address_street,
            address_city,
            address_postal_code,
            occupation_non_os,
            occupation_non_pep,
            gender,
            operates_crypto,
            operates_fiat,
            fiscal_situation,
            uuid
        ) VALUES (
            '${email}',
            '${name}',
            '${phone_number}',
            '${cuit}',
            'active',
            NOW(),
            '${hash}',
            '${salt}',
            '${dni}',
            1,
            1,
            '${address_province}',
            '${address_street}',
            '${address_city}',
            '${address_postal_code}',
            0,
            1,
            '${gender}',
            1,
            0,
            '${fiscal_situacion}',
            '${uuidv4()}'
        )`
        ;

        // inserta registro en la tabla user
        const userData = await executeQuery(sqlUnserRegister);   
       
        const sqlUserRole =
        `INSERT INTO user_roles (
            user_id, 
            role
        ) VALUES (
            '${userData.insertId}',
            'user'
        )`;
        
        // inserta registro en la tabla user_role
        await executeQuery(sqlUserRole);   

        // consulta la tabla de seller
        const seller_fees_for_user_level = `SELECT * FROM seller_fees WHERE seller_level = 1`
        const sellerFeesData = await executeQuery(seller_fees_for_user_level); 


        const sqlUserSellerFee =
        `INSERT INTO user_seller_fees (
            user_id, 
            chronos_seller_fees_percentage,
            level1_seller_fees_percentage,
            level2_seller_fees_percentage,
            iva_included,
            days_available,
            enabled,
            operation_type
        ) VALUES (
            '${userData.insertId}',
            '${sellerFeesData[0].chronos_seller_percentage ? sellerFeesData[0].chronos_seller_percentage : null}',
            ${sellerFeesData[0].level1_seller_percentage ? sellerFeesData[0].level1_seller_percentage : null},
            ${sellerFeesData[0].level2_seller_percentage ? sellerFeesData[0].level2_seller_percentage : null},
            '${sellerFeesData[0].iva_included}',
            '${sellerFeesData[0].days_available}',
            '${sellerFeesData[0].enabled}',
            '${sellerFeesData[0].operation_type}'
        )`;

        await executeQuery(sqlUserSellerFee); 

        res.json({
            code: 400,
            status: true,
            message: 'Registro Exitoso',
            data: {
                user_id: userData.insertId
            }
        });
    }
    
}

export const userController = new UserController()