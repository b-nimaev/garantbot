import { MongoClient, PushOperator, WithId } from "mongodb";
require("dotenv").config();

const dbname = process.env.dbname;
let uri = <string>process.env.dbcon;
const client = new MongoClient(uri);

interface DocumentForCoins extends WithId<Document> {
    balance: number
}

export const registerUser = async function (update) {

    update.balance = 0
    update.date = Date.now()

    try {
        await client.connect()
        return await client.db(dbname)
            .collection("users")
            .insertOne(update)
    } catch (err) {
        return false
    }
}


export const getUser = async function (update) {
    try {
        await client.connect()
        return await client.db(dbname)
            .collection("users")
            .findOne({ id: update.id })
            .then(async (user) => {
                if (user) {
                    return user
                } else {
                    return false
                }
            })
    } catch (err) {
        return false
    }
}

export const addEmail = async function (update, email) {
    try {
        await client.connect()
        return await client.db(dbname)
            .collection("users")
            .updateOne({ id: update.id }, { $set: { "balance": 0, "email": email } }, { upsert: true })
    } catch (err) {
    }
}

export const addDeposit = async function (update) {
    try {
        await client.connect()
        return await client.db(dbname)
            .collection("deposits")
            .insertOne(update)
    } catch (err) {
        console.log(err)
    }
}

export const getEmail = async function (update) {
    try {
        await client.connect()
        return await client.db(dbname)
            .collection("users")
            .findOne({ id: update.id })
            .then(async (document) => {
                if (document) {
                    if (document.email) {
                        return document.email
                    } else {
                        return 'no e-mail'
                    }
                } else {
                    return 'no user'
                }
            })
    } catch (err) {
        return err
    }
}

export const add_coins = async function (user, count, percentaly: boolean) {
    try {
        await client.connect()

        return await client
            .db(dbname)
            .collection("users")
            .findOne({ id: user.id })
            .then(async (res) => {
                if (res) {
                    console.log(count)
                    if (res.balance || res.balance == 0) {
                        if (percentaly) {
                            return await client.db(dbname)
                                .collection("users")
                                .findOneAndUpdate({
                                    id: user.id
                                }, {
                                    "$set": {
                                        "balance": <number>res.balance + ((<number>count / 100) * 91)
                                    } as unknown as PushOperator<Document>
                                }, { upsert: true })
                                .then(async (result) => console.log(result))
                        }

                        return await client.db(dbname)
                            .collection("users")
                            .findOneAndUpdate({
                                id: user.id
                            }, {
                                "$set": {
                                    "balance": parseInt(res.balance) + parseInt(count)
                                } as unknown as PushOperator<Document>
                            }, { upsert: true })
                            .then(res => {
                                console.log("s^ " + count)
                                return res
                            })
                    }
                }
            })


    } catch (err) { return err }
}

export const lose_coins = async function (user, count: number, percentaly: boolean) {

    try {
        await client.connect()

        return await client
            .db(dbname)
            .collection("users")
            .findOne({ id: user.id })
            .then(async (res: DocumentForCoins) => {
                if (res) {
                    if (res.balance) {

                        let fin = <number>res.balance - ((count / 100) * 100)

                        if (percentaly) {
                            await client.db(dbname)
                                .collection("users")
                                .findOneAndUpdate({
                                    "id": user.id
                                }, {
                                    "$set": {
                                        "balance": fin
                                    } as unknown as PushOperator<Document>
                                })
                                .then(async (result) => console.log(result))
                        }

                        await client.db(dbname)
                            .collection("users")
                            .findOneAndUpdate({
                                "id": user.id
                            }, {
                                "$set": {
                                    "balance": fin
                                } as unknown as PushOperator<Document>
                            })
                            .then(async (result) => console.log(result))
                    }
                }
            })



    } catch (err) { return err }
}

export const removeBalance = async function (user) {

    try {
        await client.connect()

        return await client
            .db(dbname)
            .collection("users")
            .findOne({ id: user.id })
            .then(async (res: DocumentForCoins) => {
                if (res) {
                    if (res.balance) {

                        await client.db(dbname)
                            .collection("users")
                            .findOneAndUpdate({
                                "id": user.id
                            }, {
                                "$set": {
                                    "balance": 0, "email": ''
                                } as unknown as PushOperator<Document>
                            })
                            .then(async (result) => console.log(result))
                    }
                }
            })



    } catch (err) { return err }
}


export const getInterface = async function (ctx) {

    try {
        await client.connect().then(() => console.log("connected to db"))

        if (ctx.update["message"]) {
            if (ctx.update["message"].text) {
                if (ctx.update["message"].text == '/start') {
                    return await client.db("broker_dev").collection("steps").findOne({ id: 0 })
                }
            }
        }

        if (ctx.update["callback_query"]) {
            if (ctx.update["callback_query"].data) {
                return await client.db("broker_dev").collection("steps").findOne({ id: parseInt(ctx.update["callback_query"].data) })
            }
        }

    } catch (err) {
        return err
    }
}