const { Router } = require('express');
const router = Router();
const twilio = require('../vendors/twilio');
const conversationModel = require('../models/Conversation');
const messageModel = require('../models/Message');

router.post('/', async (req, res) => {
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

module.exports = router;