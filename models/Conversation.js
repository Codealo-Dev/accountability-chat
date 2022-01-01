const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    messages: {
      type: [String],
      default: []
    }
  },
  { timestamps: true },
);

conversationSchema.statics.findByPhoneNumber = async function (phoneNumber) {
  let conversation = await this.findOne({
    phoneNumber
  });

  return conversation;
};

conversationSchema.pre('remove', function(next) {
  this.model('Message').deleteMany({ _id: {'$in': this.messages } }, next);
});



const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;