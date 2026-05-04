import mongoose from "mongoose";
import logger from "../middlewares/logger.js";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error}`)
  }
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