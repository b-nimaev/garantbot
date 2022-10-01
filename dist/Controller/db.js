"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.PaymentService = exports.UserService = exports.run = exports.ResponseModel = exports.ADSModel = exports.UserModel = exports.paginate = void 0;
var mongodb_1 = require("mongodb");
var mongoose_1 = require("mongoose");
var CustomerServices_1 = require("../View/Customer/CustomerServices");
require("dotenv").config();
var autoIncrement = require('mongoose-auto-increment');
var uri = process.env.dbcon;
function paginate(array, page_size, page_number) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
            return [2 /*return*/, array.slice((page_number - 1) * page_size, page_number * page_size)];
        });
    });
}
exports.paginate = paginate;
var response_schema = new mongoose_1.Schema({
    date: { type: Number, required: false },
    garantex_id: { type: Number, required: false },
    garantex_link: { type: String, required: false },
    ads_id: { type: mongodb_1.ObjectId, required: false },
    _id: { type: mongodb_1.ObjectId, required: true },
    user_id: { type: Number, required: false }
});
var paySchema = new mongoose_1.Schema({
    text: String,
    callback_data: String
});
var adsSchema = new mongoose_1.Schema({
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
            _id: { type: mongodb_1.ObjectId, required: true },
            user_id: { type: Number, required: false }
        }]
});
// 2. Create a Schema corresponding to the document interface.
var userSchema = new mongoose_1.Schema({
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
    ads: [adsSchema] || undefined || null,
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
            type: mongodb_1.ObjectId,
            required: false
        }
    },
    middleware: {
        opened_ads: {
            type: mongodb_1.ObjectId,
            required: false
        },
        opened_page: {
            type: Number,
            required: false
        }
    }
}, { timestamps: true });
var bankSchema = new mongoose_1.Schema({
    text: String,
    callback_data: String
});
// 3. Create a Model.
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
var BankModel = (0, mongoose_1.model)('Bank', bankSchema);
exports.ADSModel = (0, mongoose_1.model)('ads', adsSchema);
var PayModel = (0, mongoose_1.model)('payment_method', paySchema);
exports.ResponseModel = (0, mongoose_1.model)('response', response_schema);
run()["catch"](function (err) { return console.log(err); });
function run() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 4. Connect to MongoDB
                return [4 /*yield*/, (0, mongoose_1.connect)(uri + '/bot_exchange')];
                case 1:
                    // 4. Connect to MongoDB
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.run = run;
var UserService = /** @class */ (function () {
    function UserService() {
    }
    UserService.get_ads = function (ctx, active_page) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var req, message_1, keyboard, page_size, page, pages, ads, temp, i, err_1, err_2;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 17, , 18]);
                        return [4 /*yield*/, exports.ADSModel.find({
                                user_id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            })];
                    case 1:
                        req = _e.sent();
                        if (!req) return [3 /*break*/, 16];
                        if (!(req.length > 0)) return [3 /*break*/, 13];
                        message_1 = "<b>\u041C\u043E\u0438 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F\n</b>";
                        if (active_page) {
                            message_1 += "<b>\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430: ".concat(active_page, "</b>\n\n");
                        }
                        else {
                            message_1 += "<b>\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430:</b> 1\n\n";
                        }
                        keyboard = {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: []
                            }
                        };
                        page_size = 3;
                        page = 1;
                        pages = req.length / page_size;
                        console.log(req);
                        ads = void 0;
                        if (!active_page) return [3 /*break*/, 3];
                        return [4 /*yield*/, paginate(req, page_size, active_page)];
                    case 2:
                        ads = _e.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, paginate(req, page_size, 1)];
                    case 4:
                        ads = _e.sent();
                        _e.label = 5;
                    case 5:
                        console.log(ads);
                        ads.forEach(function (element, index) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (element.crypto_currency[0]) {
                                    if (element.crypto_currency[0].callback_data) {
                                        // @ts-ignore
                                        message_1 += "<b>_id <code>".concat(element._id, "</code></b>\n");
                                        message_1 += "<b>\u0421\u0443\u043C\u043C\u0430: <code>".concat(element.sum, " \u20BD</code></b>\n");
                                        message_1 += "<b>\u041A\u0440\u0438\u043F\u0442\u043E\u0432\u0430\u043B\u044E\u0442\u0430: ".concat(element.crypto_currency[0].callback_data.toUpperCase(), "</b>\n\n");
                                    }
                                }
                                return [2 /*return*/];
                            });
                        }); });
                        message_1 += "\uD83D\uDCDD \u041E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 _id \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u0438\u043D\u044F \u0434\u043B\u044F \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F";
                        temp = [];
                        if (pages > 1) {
                            for (i = 0; i < pages; i++) {
                                if ((i % 3 == 0) && (i !== 0)) {
                                    temp.push({
                                        text: "".concat(i),
                                        callback_data: "goto ".concat(i)
                                    });
                                    (_b = keyboard.reply_markup) === null || _b === void 0 ? void 0 : _b.inline_keyboard.push(temp);
                                    temp = [];
                                }
                                else {
                                    temp.push({
                                        text: "".concat(i + 1),
                                        callback_data: "goto ".concat(i)
                                    });
                                    console.log(temp);
                                }
                            }
                        }
                        if (temp.length > 0) {
                            (_c = keyboard.reply_markup) === null || _c === void 0 ? void 0 : _c.inline_keyboard.push(temp);
                        }
                        (_d = keyboard.reply_markup) === null || _d === void 0 ? void 0 : _d.inline_keyboard.push([{
                                text: 'На главную',
                                callback_data: 'to_home'
                            }]);
                        _e.label = 6;
                    case 6:
                        _e.trys.push([6, 11, , 12]);
                        if (!(ctx.updateType == 'callback_query')) return [3 /*break*/, 8];
                        return [4 /*yield*/, ctx.editMessageText(message_1, keyboard)];
                    case 7:
                        _e.sent();
                        _e.label = 8;
                    case 8:
                        if (!(ctx.updateType == 'message')) return [3 /*break*/, 10];
                        return [4 /*yield*/, ctx.reply(message_1, keyboard)];
                    case 9:
                        _e.sent();
                        _e.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        err_1 = _e.sent();
                        console.log(err_1);
                        return [3 /*break*/, 12];
                    case 12: return [3 /*break*/, 16];
                    case 13:
                        if (!(ctx.update["callback_query"].data == 'delete')) return [3 /*break*/, 15];
                        return [4 /*yield*/, CustomerServices_1["default"].greeting(ctx)];
                    case 14: return [2 /*return*/, _e.sent()];
                    case 15:
                        ctx.answerCbQuery("Объявлений не найдено!");
                        ctx.wizard.selectStep(1);
                        _e.label = 16;
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        err_2 = _e.sent();
                        console.log(err_2);
                        return [3 /*break*/, 18];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    UserService.FindDoc = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exports.UserModel.find().where("ads").then(function (result) {
                                console.log(result.length);
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        console.log(err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.DeleteAddress = function (ctx, address) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exports.UserModel.findOneAndUpdate({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            }, {
                                $pull: {
                                    "settings.crypto_address": address
                                }
                            }).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    console.log(res);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _b.sent();
                        console.log(err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.PreSaveAddress = function (ctx, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exports.UserModel.findOneAndUpdate({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            }, {
                                $set: {
                                    "settings.pre_save": data
                                }
                            })];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _b.sent();
                        console.log(err_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.SaveCryptoAddress = function (ctx) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var user, err_6;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, exports.UserModel.findOne({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            })];
                    case 1:
                        user = _c.sent();
                        return [4 /*yield*/, exports.UserModel.findOneAndUpdate({
                                id: (_b = ctx.from) === null || _b === void 0 ? void 0 : _b.id
                            }, {
                                $addToSet: {
                                    "settings.crypto_address": user === null || user === void 0 ? void 0 : user.settings.pre_save
                                }
                            })];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _c.sent();
                        console.log(err_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserService.SaveSum = function (ctx, sum) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var err_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.log(sum);
                        return [4 /*yield*/, exports.UserModel.findOneAndUpdate({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            }, {
                                $set: {
                                    "settings.pre_sum": sum
                                }
                            }, {
                                upsert: true
                            })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        err_7 = _b.sent();
                        console.log(err_7);
                        return [2 /*return*/, err_7];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.CreateAds = function (ctx, user) {
        return __awaiter(this, void 0, void 0, function () {
            var item, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        item = {
                            banks: user.settings.banks,
                            currency: user.settings.currency,
                            crypto_currency: user.settings.crypto_currency,
                            payment_method: user.settings.payment_method,
                            sum: user.settings.pre_sum,
                            date: Date.now(),
                            user_id: user.id,
                            responses: []
                        };
                        return [4 /*yield*/, exports.ADSModel.insertMany([item]).then(function (res) {
                                console.log(res);
                                return res;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [2 /*return*/, error_1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.GetCreatedADS = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exports.ADSModel.findOne({
                                _id: id
                            }).then(function (doc) { return doc; })["catch"](function () { return false; })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_8 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Получение всех пользователей
    UserService.GetAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exports.UserModel.find()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        console.log("Could not fetch users ".concat(error_2));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Сохранение пользователя
    UserService.SaveUser = function (ctx) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var newUser, result, error_3;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        newUser = {
                            name: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.first_name,
                            email: "Не указан",
                            lastModified: Date.now(),
                            id: (_b = ctx.from) === null || _b === void 0 ? void 0 : _b.id,
                            is_bot: (_c = ctx.from) === null || _c === void 0 ? void 0 : _c.is_bot,
                            first_name: (_d = ctx.from) === null || _d === void 0 ? void 0 : _d.first_name,
                            role: "",
                            date: {
                                registered: Date.now()
                            },
                            settings: {
                                banks: [],
                                currency: [],
                                pre_sum: 0
                            },
                            settings_buyer: {
                                banks: [],
                                currency: []
                            }
                        };
                        return [4 /*yield*/, new exports.UserModel(newUser).save()];
                    case 1:
                        result = _e.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_3 = _e.sent();
                        console.log("Could not fetch users ".concat(error_3));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.GetUserById = function (ctx) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exports.UserModel.findOne({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_4 = _b.sent();
                        console.log(error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.SetBuyerCurrencies = function (ctx) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var err_9;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exports.UserModel.findOne({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            }).then(function (document) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (!document) return [3 /*break*/, 5];
                                            if (!document.settings_buyer.currency) return [3 /*break*/, 4];
                                            if (!(document.settings_buyer.currency.length > 0)) return [3 /*break*/, 1];
                                            console.log('Существует');
                                            return [3 /*break*/, 3];
                                        case 1: return [4 /*yield*/, exports.UserModel.findOneAndUpdate({
                                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                                            }, {
                                                $addToSet: {
                                                    "settings_buyer.currency": console.log(ctx.update['callback_query'].data)
                                                }
                                            })];
                                        case 2:
                                            _b.sent();
                                            _b.label = 3;
                                        case 3: return [3 /*break*/, 5];
                                        case 4: return [2 /*return*/, false];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        err_9 = _b.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.SetCryptoCurrency = function (ctx, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var err_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exports.UserModel.findOneAndUpdate({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            }, {
                                $set: {
                                    "settings.crypto_currency": data
                                }
                            })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        err_10 = _b.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.SetRole = function (ctx) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var role_1, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        role_1 = ctx.update["callback_query"].data;
                        return [4 /*yield*/, exports.UserModel.updateOne({ id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id }, { $set: { role: role_1 } })
                                .then(function () { ctx.scene.enter(role_1); })];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_5 = _b.sent();
                        console.log(error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.SetBank = function (ctx, element) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exports.UserModel.updateOne({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            }, {
                                $addToSet: { "settings.banks": element }
                            })];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res];
                    case 2:
                        error_6 = _b.sent();
                        console.log(error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.InsertBanks = function (arr) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    arr.forEach(function (element) { return __awaiter(_this, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, BankModel.updateOne({
                                        name: "banks"
                                    }, {
                                        $addToSet: { "data": element }
                                    })];
                                case 1:
                                    res = _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    // return res
                }
                catch (error) {
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    UserService.SpliceBank = function (ctx, element) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var user, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.GetUserById(ctx)];
                    case 1:
                        user = _b.sent();
                        if (!user) return [3 /*break*/, 3];
                        if (!user.settings.banks) return [3 /*break*/, 3];
                        return [4 /*yield*/, exports.UserModel.updateOne({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            }, {
                                $pull: {
                                    "settings.banks": {
                                        "callback_data": element.callback_data
                                    }
                                }
                            })];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_7 = _b.sent();
                        console.log(error_7);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserService.SpliceCurrency = function (ctx, callback_data) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var user, error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.GetUserById(ctx)];
                    case 1:
                        user = _b.sent();
                        if (!user) return [3 /*break*/, 3];
                        if (!user.settings.banks) return [3 /*break*/, 3];
                        return [4 /*yield*/, exports.UserModel.updateOne({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            }, {
                                $pull: {
                                    "settings.currency": {
                                        "callback_data": callback_data
                                    }
                                }
                            })];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_8 = _b.sent();
                        console.log(error_8);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserService.SetCurrency = function (ctx, element) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, error_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exports.UserModel.updateOne({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            }, {
                                $addToSet: { "settings.currency": element }
                            })];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res];
                    case 2:
                        error_9 = _b.sent();
                        console.log(error_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.ResetSettings = function (ctx) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, err_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exports.UserModel.updateOne({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            }, {
                                $unset: { "settings.banks": "", "settings.currency": "" }
                            })];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res];
                    case 2:
                        err_11 = _b.sent();
                        console.log(err_11);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.SetBanks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = [
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
                        ];
                        return [4 /*yield*/, BankModel.insertMany(data)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_12 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.GetBanks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, BankModel.find()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_13 = _a.sent();
                        console.log(err_13);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserService;
}());
exports.UserService = UserService;
var PaymentService = /** @class */ (function () {
    function PaymentService() {
    }
    PaymentService.InsertPayments = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var arr, methods;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        arr = [
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
                        ];
                        return [4 /*yield*/, this.GetPaymentMethods()];
                    case 1:
                        methods = _a.sent();
                        if (!methods) return [3 /*break*/, 5];
                        if (!(methods.length == 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, PayModel.insertMany(arr).then(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, ctx.reply('Способы оплаты записаны в базу данных!')];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, ctx.reply('Способы оплаты существуют в базе данных!')];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PaymentService.SaveMethod = function (ctx, method) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, exports.UserModel.findOneAndUpdate({
                            id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                        }, {
                            $addToSet: {
                                "settings.payment_method": method
                            }
                        })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PaymentService.DeleteMethod = function (ctx, method) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var err_14;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exports.UserModel.findOneAndUpdate({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            }, {
                                $pull: {
                                    "settings.payment_method": {
                                        "callback_data": method.callback_data
                                    }
                                }
                            })];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_14 = _b.sent();
                        console.log(err_14);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PaymentService.GetPaymentMethods = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PayModel.find()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return PaymentService;
}());
exports.PaymentService = PaymentService;
//# sourceMappingURL=db.js.map