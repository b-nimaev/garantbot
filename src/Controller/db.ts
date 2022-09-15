import mongoose, { Schema, model, connect } from 'mongoose';
import { Models } from 'mongoose';
import { User } from 'telegraf/typings/core/types/typegram';
import { MyContext } from '../Model/Model';
require("dotenv").config();
let uri = <string>process.env.dbcon;

// 1. Create an interface representing a document in MongoDB.
export interface IUser extends User {
    name: string | undefined;
    email: string;
    avatar?: string;
    lastModified: number;
    id: any;
    is_bot: any;
    first_name: any;
    role: string;
    date: {
        registered: number
    }
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
    id: Number || undefined,
    name: String || undefined,
    email: String,
    avatar: String,
    is_bot: Boolean,
    role: String,
    first_name: String || undefined,
    lastModified: { type: Number, required: true },
    date: {
        registered: Number
    }
}, { timestamps: true });

// 3. Create a Model.
const UserModel = model<IUser>('User', userSchema);
run().catch(err => console.log(err));

export async function run() {
    // 4. Connect to MongoDB
    await connect('mongodb://127.0.0.1:27017/bot_exchange');
}

export class UserService {

    // Получение всех пользователей
    static async GetAllUsers() {
        try {
            const allArticles = await UserModel.find();
            return allArticles;
        } catch (error) {
            console.log(`Could not fetch users ${error}`)
        }
    }

    // Сохранение пользователя
    static async SaveUser(ctx: MyContext) {
        try {
            let newUser: IUser = {
                name: ctx.from?.first_name,
                email: "Не указан",
                lastModified: Date.now(),
                id: ctx.from?.id,
                is_bot: ctx.from?.is_bot,
                first_name: ctx.from?.first_name,
                role: "",
                date: {
                    registered: Date.now()
                }
            }

            const result = await new UserModel(newUser).save()
            return result;
        } catch (error) {
            console.log(`Could not fetch users ${error}`)
        }
    }

    static async GetUserById(ctx: MyContext) {
        try {
            const res: IUser | null = await UserModel.findOne({
                id: ctx.from?.id
            })
            return res
        } catch (error) {
            console.log(error)
        }
    }

    static async SetRole(ctx: MyContext) {
        try {
            const res = await UserModel.updateOne({
                id: ctx.from?.id
            }, { $set: { role: ctx.update["callback_query"].data } })
            return res
        } catch (error) {
            console.log(error)
        }
    }
}   