import mongoose from "mongoose";
import logger from "../middlewares/logger.js";

main().catch((err) => console.log(err));

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

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
}
