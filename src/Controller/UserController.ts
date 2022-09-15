import UserService from "../Model/UserServices";

module.exports = class UserClass {

    static async apiGetAllUsers(req, res, next) {

        try {
            const users = await UserService.GetAllUsers();

            if (!users) {
                res.status(400).json("Пользователей не найдено!")
            }

            res.json(users)

        } catch (error) {
            res.status(500).json({ error: error })
        }
    }

}