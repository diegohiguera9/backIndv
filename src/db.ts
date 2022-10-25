import mongoose from "mongoose";

const connection = mongoose.connection;

async function connect() {

  const MONGODB_URI = process.env.MONGO_URI || 'mongodburl';

  connection.once("open", () => {
    console.log("Connection with mongo OK");
  });

  connection.on("disconnected", () => {
    console.log("Disconnected successfull");
  });

  connection.on("error", (error) => {
    console.log("Something went wrong!", error);
  });
  
  await mongoose.connect(MONGODB_URI);
}

async function disconnected() {
  if (!connection) return;

  await mongoose.disconnect();
}

async function cleanup() {
  for (const collection in connection.collections) {
    await connection.collections[collection].deleteMany({});
  }
}

export {connect, disconnected, cleanup}