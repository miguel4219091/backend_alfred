import express, { application } from 'express';
import morgan from "morgan";
import cors from "cors";

require('dotenv').config();
import connection from "./config/db";
import connection_alfred from "./config/db_alfred";

// routes
import userRoter from "./routes/user";
import accountRoter from "./routes/account";

class Server {
  public app = application

  constructor(){
    this.app = express();
    this.config();
    this.routes();
  }

  config(): void{
    this.app.set('port', process.env.PORT || 3000);
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: false}));
  }

  routes():void{
    this.app.use('/user', userRoter);
    this.app.use('/account', accountRoter);
    
    this.app.get('/ping', (_req, res) => {
      // Perform a simple query to the MySQL database
      connection.query('SELECT user_id FROM users limit 0, 500', (err, rows) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).send('Internal Server Error');
        } else {
          const result = rows[0];
          res.send(`Ping successful. Result userId:${result.user_id}`);
        }
      });
    });
  }

  start():void{
    if (!connection) throw 'No ahi conexion con la BD'
    if (!connection_alfred) throw 'No ahi conexion con la BD alfred'
      
    this.app.listen(this.app.get('port'), () => {
      console.log(`Server is running on port ${this.app.get('port')}`);
    });
  }
}

const server = new Server();
server.start()