import mongoose from "mongoose";
import logger from "../middlewares/logger.js";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    await dropStaleUserIndexes();
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error}`)
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
  console.log("Mongoose connection done")
  logger('Mongoose connection done')
})

mongoose.connection.on("error", function (error) {
  console.log(`Mongoose connection error: ${error}`)
  logger(`Mongoose connection error: ${error}`, 'errorLogs.txt')
})

mongoose.connection.on("disconnected", function () {
  mongoose.connection
    .close()
    .then(r => {
      console.log("Mongoose connection disconnected")
      logger('Mongoose connection disconnected')
    })
})
