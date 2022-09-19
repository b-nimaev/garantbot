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
exports.UserService = exports.run = void 0;
var mongoose_1 = require("mongoose");
require("dotenv").config();
var uri = process.env.dbcon;
// 2. Create a Schema corresponding to the document interface.
var userSchema = new mongoose_1.Schema({
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
    }
}, { timestamps: true });
var dataSchema = new mongoose_1.Schema({
    name: String,
    data: [Object]
});
// 3. Create a Model.
var UserModel = (0, mongoose_1.model)('User', userSchema);
var DataModel = (0, mongoose_1.model)('Data', dataSchema);
run()["catch"](function (err) { return console.log(err); });
function run() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 4. Connect to MongoDB
                return [4 /*yield*/, (0, mongoose_1.connect)('mongodb://127.0.0.1:27017/bot_exchange')];
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
    // Получение всех пользователей
    UserService.GetAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allArticles, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, UserModel.find()];
                    case 1:
                        allArticles = _a.sent();
                        return [2 /*return*/, allArticles];
                    case 2:
                        error_1 = _a.sent();
                        console.log("Could not fetch users ".concat(error_1));
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
            var newUser, result, error_2;
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
                                currency: []
                            }
                        };
                        return [4 /*yield*/, new UserModel(newUser).save()];
                    case 1:
                        result = _e.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_2 = _e.sent();
                        console.log("Could not fetch users ".concat(error_2));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.GetUserById = function (ctx) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, UserModel.findOne({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            })];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res];
                    case 2:
                        error_3 = _b.sent();
                        console.log(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.SetRole = function (ctx) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, UserModel.updateOne({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            }, { $set: { role: ctx.update["callback_query"].data } })];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res];
                    case 2:
                        error_4 = _b.sent();
                        console.log(error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.SetBank = function (ctx, element) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, UserModel.updateOne({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            }, {
                                $addToSet: { "settings.banks": element }
                            })];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res];
                    case 2:
                        error_5 = _b.sent();
                        console.log(error_5);
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
                                case 0: return [4 /*yield*/, DataModel.updateOne({
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
        return __awaiter(this, void 0, void 0, function () {
            var user, error_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.GetUserById(ctx)];
                    case 1:
                        user = _a.sent();
                        if (user) {
                            if (user.settings.banks) {
                                user.settings.banks.forEach(function (search_element, index) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                if (!(search_element == element)) return [3 /*break*/, 2];
                                                return [4 /*yield*/, UserModel.updateOne({
                                                        id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                                                    }, {
                                                        $pull: {
                                                            "settings.banks": null
                                                        }
                                                    })];
                                            case 1: return [2 /*return*/, _b.sent()];
                                            case 2: return [2 /*return*/];
                                        }
                                    });
                                }); });
                            }
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.log(error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.SetCurrency = function (ctx, element) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, UserModel.updateOne({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            }, {
                                $addToSet: { "settings.currency": element }
                            })];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res];
                    case 2:
                        error_7 = _b.sent();
                        console.log(error_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.ResetSettings = function (ctx) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, UserModel.updateOne({
                                id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
                            }, {
                                $unset: { "settings.banks": "" }
                            })];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res];
                    case 2:
                        err_1 = _b.sent();
                        console.log(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.GetBanks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, DataModel.find({
                                "name": "banks"
                            })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 2:
                        err_2 = _a.sent();
                        console.log(err_2);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=db.js.map