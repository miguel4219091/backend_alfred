import cron from 'node-cron';
import connection_alfred from "../config/db_alfred";
import connection from "../config/db";
import axios from 'axios';

export function executeQueryAlfred(query: string): Promise<any> {
    return new Promise((resolve, reject) => {
        connection_alfred.query(query, (err: any, rows: any) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
}

export function executeQueryChronos(query: string): Promise<any> {
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

export function scheduleCronJobsTransacctions() {
    cron.schedule('*/5 * * * *', async () => {
        try {
            const trans_alfred = await executeQueryAlfred(`SELECT * FROM transaction where status = 'COMPLETED'`);
            console.log({trans_alfred});

            const response = await axios.post(`${process.env.URL_BACK_RAMPS}/webhook/alfredPay`, trans_alfred);
            console.log(response?.data);
           
        } catch (error) {
            console.error('Error executing cron job:', error);
        }
    });
}
