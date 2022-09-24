import mongoose, { Schema, model, connect } from 'mongoose';
import { Models } from 'mongoose';
import { User } from 'telegraf/typings/core/types/typegram';
import { MyContext } from '../Model/Model';
require("dotenv").config();
let uri = <string>process.env.dbcon;

export interface IBank {
    text: string,
    callback_data: string
}

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
    },
    settings: {
        banks: { text: string, callback_data: string }[] | null,
        currency: { text: string, callback_data: string }[] | null
    },
    settings_buyer: {
        banks: { text: string, callback_data: string }[] | null,
        currency: { text: string, callback_data: string }[] | null,
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
    },
    settings: {
        banks: [Object] || null,
        currency: [Object] || null
    },
    settings_buyer: {
        banks: [Object] || null,
        currency: [Object] || null
    }
}, { timestamps: true });

const bankSchema = new Schema<IBank>({
    text: String,
    callback_data: String
})

// 3. Create a Model.
const UserModel = model<IUser>('User', userSchema);
const BankModel = model<IBank>('Bank', bankSchema);
run().catch(err => console.log(err));

export async function run() {
    // 4. Connect to MongoDB
    await connect(uri + '/bot_exchange');
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
                },
                settings: {
                    banks: [],
                    currency: []
                },
                settings_buyer: {
                    banks: [],
                    currency: []
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

    static async SetBuyerCurrencies(ctx: MyContext) {
        try {
            return await UserModel.findOne({
                id: ctx.from?.id
            }).then(async (document) => {
                if (document) {
                    if (document.settings_buyer.currency) {
                        if (document.settings_buyer.currency.length > 0) {
                            console.log('Существует')
                        } else {
                            await UserModel.findOneAndUpdate({
                                id: ctx.from?.id
                            }, {
                                $addToSet: {
                                    "settings_buyer.currency": console.log(ctx.update['callback_query'].data)
                                }
                            })
                        }
                    } else {
                        return false
                    }
                }
            })
        } catch (err) {

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

    static async SetBank(ctx: MyContext, element) {
        try {
            const res = await UserModel.updateOne({
                id: ctx.from?.id
            }, {
                $addToSet: { "settings.banks": element }
            })
            return res
        } catch (error) {
            console.log(error)
        }
    }

    static async InsertBanks(arr) {
        try {
            arr.forEach(async (element: {}) => {
                const res = await BankModel.updateOne({
                    name: "banks"
                }, {
                    $addToSet: { "data": element }
                })
            });
            // return res
        } catch (error) {
            console.log(error)
        }
    }

    static async SpliceBank(ctx: MyContext, element: { text: string; callback_data: string }) {
        try {

            let user = await this.GetUserById(ctx)
            if (user) {
                if (user.settings.banks) {
                    return await UserModel.updateOne({
                        id: ctx.from?.id
                    }, {
                        $pull: {
                            "settings.banks": {
                                "callback_data": element.callback_data
                            }
                        }
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    static async SetCurrency(ctx: MyContext, element) {
        try {
            const res = await UserModel.updateOne({
                id: ctx.from?.id
            }, {
                $addToSet: { "settings.currency": element }
            })
            return res
        } catch (error) {
            console.log(error)
        }
    }

    static async ResetSettings(ctx) {
        try {
            const res = await UserModel.updateOne({
                id: ctx.from?.id
            }, {
                $unset: { "settings.banks": "" }
            })
            return res
        } catch (err) {
            console.log(err)
        }
    }

    static async SetBanks() {
        try {

            let data: { text: string, callback_data: string }[]= [
                {
                    text: 'АльфаБанк',
                    callback_data: 'alfabank'
                },
                {
                    text: 'СберБанк',
                    callback_data: 'sber'
                },
                {
                    text: 'Тиньков',
                    callback_data: 'tinkoff'
                },
                {
                    text: 'Открытие',
                    callback_data: 'open'
                },
                {
                    text: 'МТС',
                    callback_data: 'mts'
                },
                {
                    text: 'ВТБ',
                    callback_data: 'vtb'
                },
                {
                    text: 'ГазпромБанк',
                    callback_data: 'gazprom'
                },
                {
                    text: 'QIWI',
                    callback_data: 'qiwi'
                }
            ]
            return await BankModel.insertMany(data)
        } catch (err) { return false }
    }

    static async GetBanks() {
        try {
            return await BankModel.find()
        } catch (err) {
            console.log(err)
            return []
        }
    }
}   