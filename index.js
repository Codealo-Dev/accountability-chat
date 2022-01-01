require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;

const replyController = require('./controllers/reply');
const sendController = require('./controllers/send');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./database');

app.use('/reply', replyController);
app.use('/send', sendController);

app.get('/', async (req, res) => {
  res.send("Program Running 🚀");
});

app.listen(port, async () => {
  await db.connect();
  console.log(`Example app listening at http://localhost:${port}`)
})