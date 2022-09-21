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
    static async GetAllCurrencies () {
        try {
            return await CurrencyModel.find()
        } catch (err) {
            console.log(err)
            return false
        }
    }
}