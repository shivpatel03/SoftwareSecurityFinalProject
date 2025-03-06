const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const routes = require('./routes');

app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

app.use('/api', routes);