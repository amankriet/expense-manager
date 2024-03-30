import mongoose from "mongoose";

main().catch((err) => console.log(err));

mongoose.connection.on("connected", function () {
  console.log("Mongoose connection done")

  // const Admin = mongoose.mongo.Admin;

  // // Use the Admin object to list the databases
  // const admin = new Admin(mongoose.connections[0].db);

  // admin.listDatabases((err, databases) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log(databases);
  //   }

  //   // Close the connection
  //   mongoose.connection.close();
  // });
})

mongoose.connection.on("error", function (error) {
  console.log(`Mongoose connection error: ${error}`)
})

mongoose.connection.on("disconnected", function () {
  mongoose.connection.close()
})

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
}
