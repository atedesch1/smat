"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const app = (0, express_1.default)();
const postgresString = process.env.DATABASE_URL || process.env.DB_URL;
const pool = new pg_1.Pool({
    connectionString: postgresString
});
const connectWithRetry = () => {
    pool
        .connect()
        .then(() => console.log('successfully connected to db'))
        .catch((e) => {
        console.log(e);
        setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/api/testpost', async (req, res) => {
    try {
        const { text } = req.body;
        const newTest = await pool.query('INSERT INTO test (text) VALUES ($1)', [text]);
        res.json(newTest.rows[0]);
    }
    catch (err) {
        console.error(err.message);
    }
});
app.get('/api/testget', async (req, res) => {
    try {
        const tests = await pool.query('SELECT * FROM test');
        res.json(tests.rows);
    }
    catch (err) {
        console.error(err.message);
    }
});
app.get('/api/', (req, res) => { return res.json({ message: 'Api Working!' }); });
const PORT = process.env.NODE_PORT || 3333;
app.listen(PORT, () => { console.log(`NodeApp listening on http://localhost:${PORT}`); });
