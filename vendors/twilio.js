const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;
const phone = process.env.TWILIO_PHONE;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SID;

const client = new twilio(accountSid, authToken);

async function sendMessage(to, body){
  try {
    const msg = await client.messages
      .create({
        body,
        to, // Text this number
        from: phone, // From a valid Twilio number,
        messagingServiceSid
      });
      return msg;
  } catch (err) {
    console.log(err);
  }
}

async function getMessageResources(mid) {
  try {
    console.log('retrieving for', mid);
    const msg = await client.messages(mid).fetch();
    return msg;
  } catch(err) {
    console.log('ERROR getting Message');
    throw err;
  }
}

module.exports = {
  sendMessage, getMessageResources
}