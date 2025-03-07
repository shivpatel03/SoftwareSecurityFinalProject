const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

const routes = require('./routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

app.use('/api', routes);