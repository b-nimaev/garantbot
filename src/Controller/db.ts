import { ObjectID, ObjectId } from 'mongodb';
import mongoose, { Schema, model, connect, STATES } from 'mongoose';
import { Models } from 'mongoose';
import { InlineKeyboardButton, User } from 'telegraf/typings/core/types/typegram';
import { ExtraEditMessageText } from 'telegraf/typings/telegram-types';
import { MyContext } from '../Model/Model';
import ICurrency from '../Model/Services.Currency.Model';
import CustomerService from '../View/Customer/CustomerServices';
require("dotenv").config();
// const autoIncrement = require('mongoose-auto-increment');
let uri = <string>process.env.dbcon;
export async function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}
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
    name?: string;
    email?: string;
    avatar?: string;
    lastModified?: number;
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
        payment_method: payment_method[]
    }[] | null,
    settings_buyer: {
        banks: { text: string, callback_data: string }[],
        currency: { text: string, callback_data: string }[],
        deal_id?: number,
        deal_link?: string,
        selected_ads?: ObjectId
    },
    middleware?: {
        opened_ads?: ObjectId,
        opened_page?: number
    }
}

interface response {
    date?: number,
    garantex_id?: number,
    garantex_link?: string,
    ads_id?: ObjectId,
    user_id?: number,
    _id: ObjectId
}

interface IAds {
    banks: IBank[],
    currency: ICurrency[],
    crypto_currency: ICurrency[],
    amount?: number,
    sum: number,
    date: number,
    payment_method: payment_method[],
    user_id: number,
    responses?: response[]
}

interface newitem extends IAds {
    user_id: number
}

const response_schema = new Schema<response>({
    date: { type: Number, required: false },
    garantex_id: { type: Number, required: false },
    garantex_link: { type: String, required: false },
    ads_id: { type: ObjectId, required: false },
    _id: { type: ObjectId, required: true },
    user_id: { type: Number, required: false }
})

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
    payment_method: [{
        text: String,
        callback_data: String
    }],
    user_id: Number,
    responses: [{
        _id: { type: ObjectId, required: true },
        user_id: { type: Number, required: false }
    }]
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
    ads: [{ type: adsSchema, required: false }],
    settings_buyer: {
        banks: [Object],
        currency: [Object],
        deal_id: {
            type: String,
            required: false
        },
        deal_link: {
            type: String,
            required: false
        },
        selected_ads: {
            type: ObjectId,
            required: false
        }
    },
    middleware: {
        opened_ads: {
            type: ObjectId,
            required: false
        },
        opened_page: {
            type: Number,
            required: false
        }
    }
}, { timestamps: true });

const bankSchema = new Schema<IBank>({
    text: String,
    callback_data: String
})

// 3. Create a Model.
export const UserModel = model<IUser>('User', userSchema);
const BankModel = model<IBank>('Bank', bankSchema);
export const ADSModel = model<IAds>('ads', adsSchema);
const PayModel = model<payment_method>('payment_method', paySchema)
export const ResponseModel = model<response>('response', response_schema)
run().catch(err => console.log(err));

export async function run() {
    // 4. Connect to MongoDB
    await connect(uri + '/bot_exchange');
}

export class UserService {

    static async get_ads(ctx: MyContext, active_page?: number) {
        try {
            let req = await ADSModel.find({
                user_id: ctx.from?.id
            });

            if (req) {
                if (req.length > 0) {

                    let message = `<b>?????? ????????????????????\n</b>`
                    if (active_page) {
                        message += `<b>????????????????: ${active_page}</b>\n\n`
                    } else {
                        message += `<b>????????????????:</b> 1\n\n`
                    }

                    let keyboard: ExtraEditMessageText = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: []
                        }
                    }

                    let page_size = 3
                    let page = 1
                    let pages = req.length / page_size
                    console.log(req)
                    let ads

                    if (active_page) {
                        ads = await paginate(req, page_size, active_page)
                    } else {
                        ads = await paginate(req, page_size, 1)
                    }

                    console.log(ads)
                    ads.forEach(async (element, index) => {

                        if (element.crypto_currency[0]) {
                            if (element.crypto_currency[0].callback_data) {
                                // @ts-ignore
                                message += `<b>_id <code>${element._id}</code></b>\n`
                                message += `<b>??????????: <code>${element.sum} ???</code></b>\n`
                                message += `<b>????????????????????????: ${element.crypto_currency[0].callback_data.toUpperCase()}</b>\n\n`

                            }
                        }
                    })

                    message += `???? ?????????????????? _id ???????????????????? ?????? ????????????????????????????`

                    let temp: InlineKeyboardButton[] = []
                    if (pages > 1) {
                        for (let i = 0; i < pages; i++) {
                            if ((i % 3 == 0) && (i !== 0)) {
                                temp.push({
                                    text: `${i}`,
                                    callback_data: `goto ${i}`
                                })
                                keyboard.reply_markup?.inline_keyboard.push(temp)
                                temp = []
                            }
    
                            else {
                                temp.push({
                                    text: `${i + 1}`,
                                    callback_data: `goto ${i}`
                                })
    
                                console.log(temp)
                            }
                        }
                    }

                    if (temp.length > 0) {
                        keyboard.reply_markup?.inline_keyboard.push(temp)
                    }

                    keyboard.reply_markup?.inline_keyboard.push([{
                        text: '???? ??????????????',
                        callback_data: 'to_home'
                    }])

                    try {
                        if (ctx.updateType == 'callback_query') {
                            await ctx.editMessageText(message, keyboard)
                        }
                        
                        if (ctx.updateType == 'message') {
                            await ctx.reply(message, keyboard)
                        }
                    } catch (err) {
                        console.log(err)
                    }
                    // console.log(document.ads)

                } else {

                    if (ctx.update["callback_query"].data == 'delete') {
                        return await CustomerService.greeting(ctx)
                    }

                    ctx.answerCbQuery("???????????????????? ???? ??????????????!")
                    ctx.wizard.selectStep(1)
                }
            }

        } catch (err) {
            console.log(err)
        }
    }

    static async FindDoc(id: any) {
        try {
            await UserModel.find().where("ads").then(result => {
                console.log(result.length)
            })
        } catch (err) {
            console.log(err)
        }
    }

    static async DeleteAddress(ctx: MyContext, address: string) {

        try {
            await UserModel.findOneAndUpdate({
                id: ctx.from?.id
            }, {
                $pull: {
                    "settings.crypto_address": address
                }
            }).then(async (res) => {
                console.log(res)
            })
        } catch (err) {
            console.log(err)
        }

    }

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

    static async CreateAds(ctx: MyContext, user: any) {
        try {

            let item: IAds = {
                banks: user.settings.banks,
                currency: user.settings.currency,
                crypto_currency: user.settings.crypto_currency,
                payment_method: user.settings.payment_method,
                sum: user.settings.pre_sum,
                date: Date.now(),
                user_id:  user.id,
                responses: []
            }

            return await ADSModel.insertMany([item]).then((res) => {
                console.log(res)
                return res
            })

        } catch (error) {
            console.log(error)
            return error
        }
    }

    static async GetCreatedADS(id: ObjectId) {
        try {
            return await ADSModel.findOne({
                _id: id
            }).then((doc) => { return doc }).catch(() => { return false })
        } catch (err) {
            return false
        }
    }

    // ?????????????????? ???????? ??????????????????????????
    static async GetAllUsers() {
        try {
            return await UserModel.find();
        } catch (error) {
            console.log(`Could not fetch users ${error}`)
        }
    }

    // ???????????????????? ????????????????????????
    static async SaveUser(ctx: MyContext) {
        try {
            let newUser: IUser = {
                name: ctx.from?.first_name,
                email: "???? ????????????",
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
                            console.log('????????????????????')
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

    static async SetRole(ctx: MyContext, handle?: 'unset') {
        try {

            if (ctx.updateType == 'callback_query') {
                let role = ctx.update["callback_query"].data
                console.log(role)
                return await UserModel.updateOne({ id: ctx.from?.id }, { $set: { role: role } })
                    .then(() => { ctx.scene.enter(role) })
            }

            if (ctx.updateType == 'message') {
                if (handle == 'unset') {
                    await UserModel.updateOne({ id: ctx.from?.id }, { $unset: { role: "" } })
                }
            }

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
                    text: '??????????????????',
                    callback_data: 'alfabank'
                },
                {
                    text: '????????????????',
                    callback_data: 'sber'
                },
                {
                    text: '??????????????',
                    callback_data: 'tinkoff'
                },
                {
                    text: '????????????????',
                    callback_data: 'open'
                },
                {
                    text: '??????',
                    callback_data: 'mts'
                },
                {
                    text: '??????',
                    callback_data: 'vtb'
                },
                {
                    text: '??????????????????????',
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
                text: '?????????????? ???? ??????????',
                callback_data: 'card'
            },
            {
                text: '?????????????? ?????????????? ????????????????',
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
                    await ctx.reply('?????????????? ???????????? ???????????????? ?? ???????? ????????????!')
                })
            } else {
                await ctx.reply('?????????????? ???????????? ???????????????????? ?? ???????? ????????????!')
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