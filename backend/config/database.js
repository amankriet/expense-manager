import { connect } from "mongoose";
import "dotenv/config";

console.log(process.env.DATABASE_URL);
connect(process.env.DATABASE_URL);
