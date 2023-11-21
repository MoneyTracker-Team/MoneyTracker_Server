import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connect = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECT_DB_TESTING_URL);
    console.log('Connect DB successfully!!!');
  } catch (err) {
    console.log('Connect DB failure!!!');
  }
};

export { connect };
