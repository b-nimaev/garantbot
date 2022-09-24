import { model, Schema } from "mongoose"
import ICurrency from "../../Model/Services.Currency.Model"

const CurrenciesShema = new Schema<ICurrency>({
    field: String,
    element: {
        text: String,
        callback_data: String
    }
})

const CurrencyModel = model<ICurrency>('currencie', CurrenciesShema)

export default class CurrencyService {

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