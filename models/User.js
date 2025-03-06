import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  twitterId: { type: String, required: true, unique: true },
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true }
});

const Users = mongoose.model("Users", UserSchema);
export default Users;
