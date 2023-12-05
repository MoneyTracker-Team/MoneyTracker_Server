import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.CONNECT_DB_TESTING_URL);
    console.log('Connect DB Test successfully!!!');
  } catch (err) {
    console.log('Connect DB Test failure!!!');
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log('Connect DB Test successfully!!!');
  } catch (err) {
    console.log('DisConnect DB Test failure!!!');
  }
};

export default { connect, disconnect };
