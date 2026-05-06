import mongoose from "mongoose";
import logger from "../middlewares/logger.js";

let isConnected = false;

export async function connectDB() {
  try {
    if (isConnected) {
      return;
    }

    const db = await mongoose.connect(process.env.DATABASE_URL, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = db.connections[0].readyState === 1;

    await dropStaleUserIndexes();
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error}`);
    logger(`Error connecting to MongoDB: ${error}`, "errorLogs.txt");

    isConnected = false;
  }
}

async function dropStaleUserIndexes() {
  const usersCollection = mongoose.connection.collection("usermodels");
  const indexes = await usersCollection.indexes();
  const hasStaleMobileNumberIndex = indexes.some(
    (index) => index.name === "mobileNumber_1"
  );

  if (!hasStaleMobileNumberIndex) {
    return;
  }

  await usersCollection.dropIndex("mobileNumber_1");
  console.log("Dropped stale usermodels.mobileNumber_1 index");
  logger("Dropped stale usermodels.mobileNumber_1 index");
}

mongoose.connection.on("connected", function () {
  isConnected = true;
  console.log("Mongoose connection done")
  logger('Mongoose connection done')
})

mongoose.connection.on("reconnected", function () {
  isConnected = true;
  console.log("Mongoose reconnected");
  logger("Mongoose reconnected");
});

mongoose.connection.on("error", function (error) {
  isConnected = false;
  console.log(`Mongoose connection error: ${error}`)
  logger(`Mongoose connection error: ${error}`, 'errorLogs.txt')
})

mongoose.connection.on("disconnected", function () {
  isConnected = false;
  console.log("Mongoose connection disconnected");
  logger("Mongoose connection disconnected");
});
