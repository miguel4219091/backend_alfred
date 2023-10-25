import connection from "../config/db";


class UserServices {
    async getId(){
        connection.query('SELECT user_id FROM users limit 0, 500', (err, rows) => {
            if (err) {
              console.error('Error executing MySQL query:', err);
             return err
            } else {
              return rows
            }
        });
    }

    async getVarifyUser(username: string, phone: string){
        const sql = `SELECT * FROM users where email = '${username}' or phone_number = '${phone}'`;
        connection.query(sql, (err, rows) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                return err
            } else {
                return rows
            }
        })
    }
}

const userServices = new UserServices()
export default userServices