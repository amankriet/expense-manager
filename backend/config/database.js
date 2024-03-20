import { connect } from "mongoose";
import "dotenv/config";

main().catch((err) => console.log(err));

async function main() {
  await connect(process.env.DATABASE_URL);
}
