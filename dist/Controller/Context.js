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
exports.ContextService = void 0;
var db_1 = require("./db");
var ContextService = /** @class */ (function () {
    function ContextService() {
    }
    ContextService.GetFormattedTime = function (timestmap) {
        return __awaiter(this, void 0, void 0, function () {
            var date, hours, minutes, seconds, day, months, month, year, formattedTime;
            return __generator(this, function (_a) {
                date = new Date(timestmap);
                hours = date.getHours();
                minutes = "0" + date.getMinutes();
                seconds = "0" + date.getSeconds();
                day = date.getDate();
                months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                month = months[date.getMonth()];
                year = date.getFullYear();
                formattedTime = day + ' ' + month + ' ' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                return [2 /*return*/, formattedTime];
            });
        });
    };
    ContextService.spliceBankFromSettings = function (ctx, field) {
        return __awaiter(this, void 0, void 0, function () {
            var user, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, db_1.UserService.GetUserById(ctx)];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 3];
                        return [4 /*yield*/, db_1.UserService.SpliceBank(ctx, field)
                                .then(function (success) { return ctx.answerCbQuery('Элемент удален из базы данных'); })["catch"](function (unsuccess) { return ctx.answerCbQuery('Не получилось удалить'); })
                            // return this.rerenderAfterSelectBank(ctx)
                        ];
                    case 2: return [2 /*return*/, _a.sent()
                        // return this.rerenderAfterSelectBank(ctx)
                    ];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ContextService.selectBank = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data_1, banks, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!(ctx.updateType == 'callback_query')) return [3 /*break*/, 2];
                        query = ctx.update['callback_query'];
                        if (query.data == 'continue') {
                            // let user: IUser | null | false | undefined = await UserService.GetUserById(ctx)
                            // ctx.wizard.selectStep(3)
                            // await renderSelectCurrency(ctx)
                            ctx.editMessageText("\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0441\u0443\u043C\u043C\u0443 \u0432 \u0440\u0443\u0431\u043B\u044F\u0445");
                            ctx.wizard.selectStep(4);
                        }
                        data_1 = query.data.split(' ');
                        return [4 /*yield*/, db_1.UserService.GetBanks()];
                    case 1:
                        banks = _a.sent();
                        if (query) {
                            if (data_1 && banks.length > 0) {
                                if (data_1[0] !== 'remove_bank') {
                                    banks.forEach(function (element) { return __awaiter(_this, void 0, void 0, function () {
                                        var _this = this;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!(element.callback_data == data_1[0])) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, db_1.UserService.SetBank(ctx, element)
                                                            .then(function (res) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0: return [4 /*yield*/, ContextService.rerenderAfterSelectBank(ctx)];
                                                                case 1:
                                                                    _a.sent();
                                                                    return [2 /*return*/];
                                                            }
                                                        }); }); })["catch"](function (err) { console.log(err); })];
                                                case 1:
                                                    _a.sent();
                                                    _a.label = 2;
                                                case 2: return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                }
                                else {
                                    banks.forEach(function (element) { return __awaiter(_this, void 0, void 0, function () {
                                        var _this = this;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!(element.callback_data == data_1[1])) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, this.spliceBankFromSettings(ctx, element).then(function () { return __awaiter(_this, void 0, void 0, function () {
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, ContextService.rerenderAfterSelectBank(ctx)];
                                                                    case 1:
                                                                        _a.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        }); })];
                                                case 1:
                                                    _a.sent();
                                                    _a.label = 2;
                                                case 2: return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                }
                            }
                        }
                        ctx.answerCbQuery();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        console.log(err_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ContextService.rerenderAfterSelectBank = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var user, message, i, keyboard, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, db_1.UserService.GetUserById(ctx)];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 5];
                        message = "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0430\u043D\u043A\u0438, \u0432 \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043C\u043E\u0436\u0435\u0442\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u044C \u043E\u043F\u043B\u0430\u0442\u0443 \n\u0412\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u0431\u0430\u043D\u043A\u0438: ";
                        // @ts-ignore
                        for (i = 0; i < user.settings.banks.length; i++) {
                            // @ts-ignore
                            message += "\n".concat(i + 1, ". ").concat(user.settings.banks[i].text);
                        }
                        return [4 /*yield*/, ContextService.renderSelectBankKeyboard(ctx)];
                    case 2:
                        keyboard = _a.sent();
                        if (!keyboard) return [3 /*break*/, 4];
                        return [4 /*yield*/, ctx.editMessageText(message, keyboard)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        ctx.scene.enter('home');
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_3 = _a.sent();
                        console.log(err_3);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ContextService.renderSelectBankKeyboard = function (ctx) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var searchDealKeyboard, user_1, banks, temp_1, err_4;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        searchDealKeyboard = {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: []
                            }
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, db_1.UserService.GetUserById(ctx)];
                    case 2:
                        user_1 = _b.sent();
                        if (!user_1) return [3 /*break*/, 4];
                        return [4 /*yield*/, db_1.UserService.GetBanks()];
                    case 3:
                        banks = _b.sent();
                        temp_1 = [];
                        banks.forEach(function (element, index) { return __awaiter(_this, void 0, void 0, function () {
                            var userBanks;
                            var _this = this;
                            var _a;
                            return __generator(this, function (_b) {
                                userBanks = user_1.settings.banks;
                                // console.log(element)
                                if (userBanks) {
                                    userBanks.forEach(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                        var tempvar;
                                        return __generator(this, function (_a) {
                                            tempvar = item.text + ' (удалить)';
                                            if ((item.callback_data === element.callback_data) && (tempvar !== item.text)) {
                                                element.text += ' (удалить)';
                                                element.callback_data = 'remove_bank ' + element.callback_data;
                                            }
                                            return [2 /*return*/];
                                        });
                                    }); });
                                    temp_1.push(element);
                                }
                                if (index % 2 == 1) {
                                    (_a = searchDealKeyboard.reply_markup) === null || _a === void 0 ? void 0 : _a.inline_keyboard.push(temp_1);
                                    temp_1 = [];
                                }
                                return [2 /*return*/];
                            });
                        }); });
                        (_a = searchDealKeyboard.reply_markup) === null || _a === void 0 ? void 0 : _a.inline_keyboard.push([
                            {
                                text: 'Продолжить',
                                callback_data: 'continue'
                            }
                        ]);
                        return [2 /*return*/, searchDealKeyboard];
                    case 4: return [2 /*return*/, ctx.scene.enter('home')];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_4 = _b.sent();
                        console.log(err_4);
                        return [2 /*return*/, searchDealKeyboard];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ContextService.ChangeSearchParams = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var user, message, buyerExtraKeyboard, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!ctx.from) return [3 /*break*/, 2];
                        return [4 /*yield*/, db_1.UserService.GetUserById(ctx)];
                    case 1:
                        user = _a.sent();
                        if (user) {
                            message = "\u0412\u0430\u0448 ID: <code>".concat(user.id, "</code> \n\u0420\u043E\u043B\u044C: <code>").concat(user.role, "</code> \n\u0412\u0430\u0448 e-mail: <code>").concat(user.email, "</code>\n");
                            message += "\u0414\u0430\u0442\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438: ".concat(user.date.registered, " \n\n");
                            buyerExtraKeyboard = {
                                parse_mode: 'HTML',
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            {
                                                text: 'Открыть сделку',
                                                callback_data: 'openDeal'
                                            }
                                        ]
                                    ]
                                }
                            };
                        }
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ContextService;
}());
exports.ContextService = ContextService;
//# sourceMappingURL=Context.js.map