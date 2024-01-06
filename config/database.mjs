import mongoose from "mongoose";

const connectDatabase = () => {

        mongoose.connect(process.env.DB_URI).then((data)=>{console.log(`Connected to MongoDB server: ${data.connection.host}`)})};

export default connectDatabase;