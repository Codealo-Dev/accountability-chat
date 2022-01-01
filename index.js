const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const twilio = require('./twilio');
const app = express();
const port = 3000;

const conversationModel = require('./models/Conversation');
const messageModel = require('./models/Message');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./database');

app.get('/', async (req, res) => {
  res.send("Program Running 🚀");
});

app.post('/send', async (req, res) => {

});

app.post('/reply', async (req, res) => {
  try {
    const { body } = req;

    const messageResources = await twilio.getMessageResources(body['MessageSid']);

    let conversation = await conversationModel.findByPhoneNumber(messageResources.from);

    if (!conversation) {
      conversation = new conversationModel({
        phoneNumber: messageResources.from
      });
      await conversation.save();
    }
    let newMessage = new messageModel({
      conversation: conversation._id,
      body: messageResources.body,
      twilioData: JSON.stringify(messageResources),
      phoneNumber: messageResources.from
    });
    await newMessage.save();

    await conversationModel.updateOne(
      { _id: conversation._id },
      { '$addToSet': { 'messages': newMessage._id } }
    );

    return res.json({
      success: true,
      conversation: conversation.id,
      message: newMessage.id
    });
  }
  catch (err) {
    console.log('ERROR WITH TWILIO REPLY');
    console.log(err);
    res.status(500);
    res.send(err);
  }
});

app.listen(port, async () => {
  await db.connect();
  console.log(`Example app listening at http://localhost:${port}`)
})