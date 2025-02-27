// import { Schema, model, Document } from "mongoose";

// interface IUser extends Document {
//   username: string;
//   twitterId: string;
//   publicKey: string;
//   privateKey: string;
// }

// const UserSchema = new Schema<IUser>({
//   username: { type: String, required: true, unique: true },
//   twitterId: { type: String, required: true },
//   publicKey: { type: String, required: true },
//   privateKey: { type: String, required: true },
// });

// const Users = model<IUser>("Users", UserSchema);
// export default Users;
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  twitterId: { type: String, required: true, unique: true },
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true }
});

const Users = mongoose.model("Users", UserSchema);
export default Users;
