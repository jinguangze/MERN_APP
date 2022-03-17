const express = require('express');
const bodyParser = require("body-parser");
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const posts = require('./routes/api/posts');
const users = require('./routes/api/users');

const app = express();

connectDB();

app.use(bodyParser.json());

app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Hello world!'));

app.use('/api/posts', posts);
app.use('/api/users', users);

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Server running on port ${port}`));