import { model, Schema } from "mongoose";
import { IUser } from "../Controller/db";

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String,
    lastModified: { type: Number, required: true },
}, { timestamps: true });

// 3. Create a Model.
const User = model<IUser>('User', userSchema);

export default class UserService {

    static async GetAllUsers() {
        try {
            const doc = await User.find()
            return doc
        } catch (err) {
            console.log(err)
        }
    }

}