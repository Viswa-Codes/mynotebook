import mongoose from 'mongoose';

const mongoURI = "mongodb+srv://admin:NeoTOp8kQFCOCILz@cluster0.zd0tboz.mongodb.net/mynotebook?appName=Cluster0" ;

const connectToMongo = async () => {
  try {
    console.log(mongoURI);
    await mongoose.connect(mongoURI);
    console.log("Connected to Mongo Successfully");
  } catch (error) {
    console.error("Error connecting to Mongo:", error);
    process.exit(1);
  }
};

export default connectToMongo;
