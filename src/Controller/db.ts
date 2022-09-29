import mongoose, { Schema, model, connect } from 'mongoose';
import { Models } from 'mongoose';
import { User } from 'telegraf/typings/core/types/typegram';
import { MyContext } from '../Model/Model';
import ICurrency from '../Model/Services.Currency.Model';
require("dotenv").config();
const autoIncrement = require('mongoose-auto-increment');
let uri = <string>process.env.dbcon;

export interface IBank {
    text: string,
    callback_data: string
}

export interface payment_method {
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
        banks: { text: string, callback_data: string }[],
        currency: { text: string, callback_data: string }[],
        crypto_currency?: { text: string, callback_data: string }[],
        payment_method?: payment_method[],
        crypto_address?: [string],
        pre_sum: number,
        pre_save?: string | number
    },
    ads?: {
        banks: { text: string, callback_data: string }[],
        currency: { text: string, callback_data: string }[],
        crypto_currency: { text: string, callback_data: string }[],
        amount: number,
        sum: number,
        date: number,
    }[] | null,
    settings_buyer: {
        banks: { text: string, callback_data: string }[],
        currency: { text: string, callback_data: string }[],
    }
}

interface IAds {
    banks: IBank[],
    currency: ICurrency[],
    crypto_currency: ICurrency[],
    amount: number,
    sum: number,
    date: number,
}

const paySchema = new Schema<payment_method>({
    text: String,
    callback_data: String
})

const adsSchema = new Schema<IAds>({
    banks: [{ text: String, callback_data: String }],
    currency: [{ text: String, callback_data: String }],
    crypto_currency: [{ text: String, callback_data: String }],
    amount: Number,
    sum: Number,
    date: Number,
})

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
    id: Number,
    name: String,
    email: String,
    avatar: String,
    is_bot: Boolean,
    role: String,
    first_name: String,
    lastModified: { type: Number, required: true },
    date: {
        registered: Number
    },
    settings: {
        banks: [Object],
        currency: [Object],
        crypto_currency: [{ text: String, callback_data: String }],
        crypto_address: [String] || undefined || null,
        payment_method: [{
            text: String,
            callback_data: String
        }] || undefined || null,
        pre_sum: Number,
        pre_save: String || Number || undefined || null
    },
    ads: [adsSchema],
    settings_buyer: {
        banks: [Object],
        currency: [Object]
    }
}, { timestamps: true });

const bankSchema = new Schema<IBank>({
    text: String,
    callback_data: String
})

// 3. Create a Model.
const UserModel = model<IUser>('User', userSchema);
const BankModel = model<IBank>('Bank', bankSchema);
const ADSModel = model<IAds>('ads', adsSchema);
const PayModel = model<payment_method>('payment_method', paySchema)

run().catch(err => console.log(err));

export async function run() {
    // 4. Connect to MongoDB
    await connect(uri + '/bot_exchange');
}

export class UserService {

    static async PreSaveAddress(ctx: MyContext, data: any) {
        try {
            await UserModel.findOneAndUpdate({
                id: ctx.from?.id
            }, {
                $set: {
                    "settings.pre_save": data
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    static async SaveCryptoAddress(ctx: MyContext) {
        try {
            let user = await UserModel.findOne({
                id: ctx.from?.id
            })

            await UserModel.findOneAndUpdate({
                id: ctx.from?.id
            }, {
                $addToSet: {
                    "settings.crypto_address": user?.settings.pre_save
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    static async SaveSum(ctx: MyContext, sum: number) {
        try {
            console.log(sum)
            return await UserModel.findOneAndUpdate({
                id: ctx.from?.id
            }, {
                $set: {
                    "settings.pre_sum": sum
                }
            }, {
                upsert: true
            })

        } catch (err) {
            console.log(err)
            return err
        }
    }

    static async CreateAds(ctx: MyContext, user: IUser) {
        try {

            let item: any = {
                banks: user.settings.banks,
                currency: user.settings.currency,
                crypto_currency: user.settings.crypto_currency,
                sum: user.settings.pre_sum,
                date: Date.now()
            }

            await UserModel.findOneAndUpdate({
                id: ctx.from?.id
            }, {
                $addToSet: {
                    "ads": item
                }
            })

            return await UserModel.findOne({
                id: ctx.from?.id
            }).then(async (document) => {
                if (document) {
                    if (document.ads) {
                        return document?.ads[document.ads.length - 1]
                    }
                }
            })
        } catch (error) {
            console.log(error)
            return error
        }
    }

    // Получение всех пользователей
    static async GetAllUsers() {
        try {
            return await UserModel.find();
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
                    currency: [],
                    pre_sum: 0,
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
            return await UserModel.findOne({
                id: ctx.from?.id
            })
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

    static async SetCryptoCurrency(ctx: MyContext, data: { text: string, callback_data: string }) {
        try {
            return await UserModel.findOneAndUpdate({
                id: ctx.from?.id
            }, {
                $set: {
                    "settings.crypto_currency": data
                }
            })
        } catch (err) {

        }
    }

    static async SetRole(ctx: MyContext) {
        try {
            let role = ctx.update["callback_query"].data
            return await UserModel.updateOne({ id: ctx.from?.id }, { $set: { role: role } })
                .then(() => { ctx.scene.enter(role) })
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

    static async SpliceCurrency(ctx: MyContext, callback_data: string) {
        try {

            let user = await this.GetUserById(ctx)
            if (user) {
                if (user.settings.banks) {
                    return await UserModel.updateOne({
                        id: ctx.from?.id
                    }, {
                        $pull: {
                            "settings.currency": {
                                "callback_data": callback_data
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
                $unset: { "settings.banks": "", "settings.currency": "" }
            })
            return res
        } catch (err) {
            console.log(err)
        }
    }

    static async SetBanks() {
        try {

            let data: { text: string, callback_data: string }[] = [
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

export class PaymentService {
    static async InsertPayments(ctx: MyContext) {
        let arr: payment_method[] = [
            {
                text: 'Перевод по карте',
                callback_data: 'card'
            },
            {
                text: 'Система быстрых платежей',
                callback_data: 'spb'
            },
            {
                text: 'NFS',
                callback_data: 'nfs'
            }
        ]

        let methods = await this.GetPaymentMethods()

        if (methods) {
            if (methods.length == 0) {
                await PayModel.insertMany(arr).then(async () => {
                    await ctx.reply('Способы оплаты записаны в базу данных!')
                })
            } else {
                await ctx.reply('Способы оплаты существуют в базе данных!')
            }
        }
    }

    static async SaveMethod(ctx: MyContext, method: payment_method) {
        await UserModel.findOneAndUpdate({
            id: ctx.from?.id
        }, {
            $addToSet: {
                "settings.payment_method": method
            }
        })

    }

    static async DeleteMethod(ctx: MyContext, method: payment_method) {
        
        try {
            await UserModel.findOneAndUpdate({
                id: ctx.from?.id
            }, {
                $pull: {
                    "settings.payment_method": {
                        "callback_data": method.callback_data
                    }
                }
            })
        } catch (err) {
            console.log(err)
        }

    }

    static async GetPaymentMethods() {
        return await PayModel.find()
    }
}