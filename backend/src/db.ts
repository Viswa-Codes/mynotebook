import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mynotebook";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to Mongo Successfully");
  } catch (error) {
    console.error("Error connecting to Mongo:", error);
    process.exit(1);
  }
};

export default connectToMongo;
