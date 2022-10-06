// Модули
const axios = require("axios"); // npm i axios
const jwt = require("jsonwebtoken"); // npm i jsonwebtoken
const crypto = require("crypto");

// Константы
require("dotenv").config()

const host = "garantex.io"; // для тестового сервера используйте stage.garantex.biz
const privateKey = <string>process.env.private_key; // приватный ключ, полученный на этапе создания API ключей
const uid = process.env.uuid; // UID, полученный на этапе создания API ключей


// Получаем токен
const getToken = async () => {
    try {
        let { data } = await axios.post(
            "https://dauth." + host + "/api/v1/sessions/generate_jwt",
            {
                kid: uid,
                jwt_token: jwt.sign(
                    {
                        exp: Math.round(Date.now() / 1000) + 30 * 60, // JWT Request TTL: 30 minutes
                        jti: crypto.randomBytes(12).toString("hex"),
                    },
                    Buffer.from(privateKey, "base64").toString("ascii"),
                    { algorithm: "RS256" }
                ),
            }
        );
        console.log(`${Date.now()} токен сгенерирован`)
        return data.token;
    } catch (e) {
        console.error(e);
        return false;
    }
};

export default getToken