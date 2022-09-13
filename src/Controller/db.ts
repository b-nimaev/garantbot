import mongoose, { Schema, model, connect } from 'mongoose';
import { User } from 'telegraf/typings/core/types/typegram';
require("dotenv").config();
let uri = <string>process.env.dbcon;
// 1. Create an interface representing a document in MongoDB.
interface IUser extends User {
    name: string;
    email: string;
    avatar?: string;
    lastModified: number
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String,
    lastModified: { type: Number, required: true },
}, { timestamps: true });

// 3. Create a Model.
const User = model<IUser>('User', userSchema);

run().catch(err => console.log(err));

export async function run() {
    // 4. Connect to MongoDB
    await connect('mongodb://127.0.0.1:27017/bot_exchane');

    const user = new User({
        name: 'Bill',
        email: 'bill@initech.com',
        avatar: 'https://i.imgur.com/dM7Thhn.png',
        lastModified: Date.now()
    });
    await user.save();

    console.log(user.email); // 'bill@initech.com'
}

module.exports = class UserService {
    static async getAllUsers() {
        try {
            const allArticles = await User.find();
            return allArticles;
        } catch (error) {
            console.log(`Could not fetch users ${error}`)
        }
    }
}   