import { model, Schema } from "mongoose"
import { MyContext } from "../../Model/Model"
import ICurrency from "../../Model/Services.Currency.Model"
import { IUser, UserService } from "../db"

const CurrenciesShema = new Schema<ICurrency>({
    field: String,
    element: {
        text: String,
        callback_data: String
    }
})

const CurrencyModel = model<ICurrency>('currencie', CurrenciesShema)
const CryptoCurrencyModel = model<ICurrency>('crypto_currencie', CurrenciesShema)

export default class CurrencyService {

    static async spliceCurrency(ctx: MyContext, field: { text: string, callback_data: string }) {
        try {
            await UserService.GetUserById(ctx).then(async (user) => {
                if (user) {
                    return await UserService.SpliceBank(ctx, field)
                        .then(success => { return ctx.answerCbQuery('Элемент удален из базы данных') })
                        .catch(unsuccess => { return ctx.answerCbQuery('Не получилось удалить') })
    
                    // return this.rerenderAfterSelectBank(ctx)
                }
            })

        } catch (err) {
            console.log(err)
        }
    }

    static async GetCryptoCurrenciesArray() {
        try {

            return await CryptoCurrencyModel.find()

        } catch (err) {
            console.log(err)
            return []
        }
    }

    static async SetCryptoCurrenciesArray() {
        try {

            let currency = [ 'btc', 'usdt' ]
            
            let docs: ICurrency[] = []
            currency.forEach(async element => {
                docs.push({
                    field: element,
                    element: {
                        "text": element,
                        "callback_data": element
                    }
                })
            })
            return await CryptoCurrencyModel.insertMany(docs)
        } catch (err) {
            console.log(err)
            return false
        }
    }

    static async SetCurrenciesArray () {
        try {

            const currency = ['usd', 'rub', 'byn', 'euro', 'kzt']

            let docs: ICurrency[] = []
            currency.forEach(async element => {
                docs.push({
                    field: element,
                    element: {
                        "text": element,
                        "callback_data": element
                    }
                })
            })
            console.log(docs)
            return await CurrencyModel.insertMany(docs)
        } catch (err) {
            return false
        }
    }

    static async GetAllCurrencies () {
        try {
            return await CurrencyModel.find()
                .then(async result => {
                    
                    if (result.length == 0) {
                        await this.SetCurrenciesArray()
                        return await this.GetAllCurrencies()
                    } else {
                        // console.log(result)
                        return result
                    }

                })
        } catch (err) {
            console.log(err)
            return false
        }
    }
} 