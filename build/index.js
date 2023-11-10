"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
require('dotenv').config();
const db_1 = __importDefault(require("./config/db"));
const db_alfred_1 = __importDefault(require("./config/db_alfred"));
// routes
const user_1 = __importDefault(require("./routes/user"));
const account_1 = __importDefault(require("./routes/account"));
const transaction_1 = __importDefault(require("./routes/transaction"));
class Server {
    constructor() {
        this.app = express_1.application;
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/user', user_1.default);
        this.app.use('/account', account_1.default);
        this.app.use('/transaction', transaction_1.default);
        this.app.get('/ping', (_req, res) => {
            // Perform a simple query to the MySQL database
            db_1.default.query('SELECT user_id FROM users limit 0, 500', (err, rows) => {
                if (err) {
                    console.error('Error executing MySQL query:', err);
                    res.status(500).send('Internal Server Error');
                }
                else {
                    const result = rows[0];
                    res.send(`Ping successful. Result userId:${result.user_id}`);
                }
            });
        });
    }
    start() {
        if (!db_1.default)
            throw 'No ahi conexion con la BD';
        if (!db_alfred_1.default)
            throw 'No ahi conexion con la BD alfred';
        this.app.listen(this.app.get('port'), () => {
            console.log(`Server is running on port ${this.app.get('port')}`);
        });
    }
}
const server = new Server();
server.start();
