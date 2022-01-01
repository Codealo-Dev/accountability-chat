var mongoose = require('mongoose');

const mongoDB = process.env['DATABASE_URL']

async function connect() {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected without issues');
  } catch(err) {
    console.log('ERROR connecting to database');
  }
}

module.exports = { connect };

