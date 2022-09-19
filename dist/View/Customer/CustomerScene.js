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
exports.renderSearchD = void 0;
var telegraf_1 = require("telegraf");
var __1 = require("../..");
var Context_1 = require("../../Controller/Context");
var db_1 = require("../../Controller/db");
var CustomerGreeting_1 = require("./CustomerGreeting");
require("dotenv").config();
function selectCurrency(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var query, data;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = ctx.update['callback_query'];
                    data = query.data;
                    if (!query) return [3 /*break*/, 3];
                    if (!(data == 'reset')) return [3 /*break*/, 2];
                    return [4 /*yield*/, db_1.UserService.ResetSettings(ctx)
                            .then(function (success) { return ctx.answerCbQuery('Настройки сброшены'); })["catch"](function (error) { console.log(error); return false; })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    __1.currency.forEach(function (element) { return __awaiter(_this, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(element.callback_data == data)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, db_1.UserService.SetCurrency(ctx, element).then(function (res) { console.log(res); })["catch"](function (err) { console.log(err); })];
                                case 1:
                                    res = _a.sent();
                                    return [2 /*return*/, res];
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    _a.label = 3;
                case 3:
                    ctx.answerCbQuery();
                    return [2 /*return*/];
            }
        });
    });
}
function renderSelectCurrency(ctx, user) {
    return __awaiter(this, void 0, void 0, function () {
        var message, i, renderSelectCurrencyKeyboard;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    message = "\u0412\u0430\u043C \u043D\u0443\u0436\u043D\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0430\u043B\u044E\u0442\u0443 \n\n\u0421\u043F\u0438\u0441\u043E\u043A \u0443\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0445 \u0432\u0430\u043C\u0438 \u0431\u0430\u043D\u043A\u043E\u0432";
                    // \n<i>Настройки можно менять в настройках профиля</i>`
                    for (i = 0; i < user.settings.banks.length; i++) {
                        message += "\n".concat(i + 1, ". ").concat(user.settings.banks[i].text);
                    }
                    renderSelectCurrencyKeyboard = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'BTC',
                                        callback_data: 'btc'
                                    },
                                    {
                                        text: 'USDT',
                                        callback_data: 'usdt'
                                    }
                                ],
                                [
                                    {
                                        text: 'Сбросить настройки',
                                        callback_data: 'reset'
                                    }
                                ]
                            ]
                        }
                    };
                    return [4 /*yield*/, ctx.editMessageText(message, renderSelectCurrencyKeyboard)
                        // ctx.wizard.selectStep(
                    ];
                case 1:
                    _a.sent();
                    // ctx.wizard.selectStep(
                    return [2 /*return*/, ctx.wizard.selectStep(ctx.scene.session.cursor + 2)];
            }
        });
    });
}
function renderSearchDeal(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var message, searchDealKeyboard;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    message = "\u0427\u0442\u043E\u0431\u044B \u043D\u0430\u0447\u0430\u0442\u044C \u043F\u043E\u0438\u0441\u043A, \u0412\u0430\u043C \u043D\u0443\u0436\u043D\u043E \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043D\u0435\u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438. \n                    \n<i>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043C\u043E\u0436\u043D\u043E \u043C\u0435\u043D\u044F\u0442\u044C \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u043F\u0440\u043E\u0444\u0438\u043B\u044F</i>";
                    searchDealKeyboard = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Продолжить',
                                        callback_data: 'setSettings'
                                    }
                                ]
                            ]
                        }
                    };
                    return [4 /*yield*/, ctx.editMessageText(message, searchDealKeyboard)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function renderSearchD(ctx) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var user, message, i, i, extra;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, db_1.UserService.GetUserById(ctx)];
                case 1:
                    user = _d.sent();
                    if (!user) return [3 /*break*/, 8];
                    if (!(((_a = user.settings.banks) === null || _a === void 0 ? void 0 : _a.length) == 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, renderSearchDeal(ctx)];
                case 2:
                    _d.sent();
                    return [3 /*break*/, 7];
                case 3:
                    if (!user.settings.banks) return [3 /*break*/, 7];
                    if (!(((_b = user.settings.currency) === null || _b === void 0 ? void 0 : _b.length) !== 0)) return [3 /*break*/, 6];
                    if (!user.settings.currency) return [3 /*break*/, 5];
                    message = 'Выбранные банки: ';
                    for (i = 0; i < user.settings.banks.length; i++) {
                        message += "\n".concat(i + 1, ". ").concat(user.settings.banks[i].text);
                    }
                    message += '\nВыбранные валюты: ';
                    for (i = 0; i < ((_c = user.settings.currency) === null || _c === void 0 ? void 0 : _c.length); i++) {
                        message += "\n".concat(i + 1, ". ").concat(user.settings.currency[i].text);
                    }
                    extra = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Изменить параметры поиска',
                                        callback_data: 'chagneSearchParams'
                                    }
                                ],
                                [
                                    {
                                        text: 'Начать поиск',
                                        callback_data: 'start_search'
                                    }
                                ],
                                [
                                    {
                                        text: 'Назад',
                                        callback_data: 'back'
                                    }
                                ]
                            ]
                        }
                    };
                    return [4 /*yield*/, ctx.editMessageText(message, extra)
                        // return ctx.scene.enter('search')
                    ];
                case 4:
                    _d.sent();
                    _d.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    renderSelectCurrency(ctx, user);
                    _d.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    // Если пользователя нет в базе данных
                    ctx.scene.enter('home');
                    _d.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.renderSearchD = renderSearchD;
function searchScreen(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var user, message, buyerExtraKeyboard;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.UserService.GetUserById(ctx)];
                case 1:
                    user = _a.sent();
                    if (!user) return [3 /*break*/, 3];
                    message = "\u0412\u0430\u0448 ID: <code>".concat(user.id, "</code> \n\u0420\u043E\u043B\u044C: <code>").concat(user.role, "</code> \n\u0412\u0430\u0448 e-mail: <code>").concat(user.email, "</code>\n");
                    message += "\u0414\u0430\u0442\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438: ".concat(user.date.registered, " \n\n");
                    message += "\u0427\u0442\u043E\u0431\u044B \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043F\u043E\u0438\u0441\u043A \u043C\u043E\u0436\u043D\u043E \u043D\u0430\u0436\u0430\u0442\u044C \u043D\u0430 \u043A\u043D\u043E\u043F\u043A\u0443 \u043D\u0438\u0436\u0435 <b>\u041E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043F\u043E\u0438\u0441\u043A</b>, \n\n<b>\u0438\u043B\u0438</b> \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043A\u043E\u043C\u0430\u043D\u0434\u0443 /stop_search \n\n";
                    message += "... \u0418\u0434\u0451\u0442 \u043F\u043E\u0438\u0441\u043A \uD83D\uDD0E";
                    buyerExtraKeyboard = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Остановить поиск',
                                        callback_data: 'stop_search'
                                    }
                                ]
                            ]
                        }
                    };
                    return [4 /*yield*/, ctx.editMessageText(message, buyerExtraKeyboard)];
                case 2:
                    _a.sent();
                    ctx.answerCbQuery();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Поиск сделок
function searchDeal(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var query, data, message, searchDealKeyboard_1, banks_1, temp_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = ctx.update['callback_query'];
                    data = query.data;
                    if (!query) return [3 /*break*/, 11];
                    // // Получение данных пользователя
                    ctx.answerCbQuery();
                    if (!(data == 'searchDeal')) return [3 /*break*/, 2];
                    return [4 /*yield*/, renderSearchD(ctx)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!(data == 'start_search')) return [3 /*break*/, 4];
                    return [4 /*yield*/, searchScreen(ctx)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    if (!(data == 'stop_search')) return [3 /*break*/, 6];
                    return [4 /*yield*/, renderSearchD(ctx)];
                case 5: return [2 /*return*/, _a.sent()];
                case 6:
                    if (data == 'chagneSearchParams') {
                        return [2 /*return*/, ctx.scene.enter('chagneSearchParams')];
                    }
                    if (!(data == 'back')) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, CustomerGreeting_1.greeting)(ctx)];
                case 7: return [2 /*return*/, _a.sent()];
                case 8:
                    if (!(data == 'setSettings')) return [3 /*break*/, 10];
                    message = "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0430\u043D\u043A\u0438, \u0432 \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043C\u043E\u0436\u0435\u0442\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u044C \u043E\u043F\u043B\u0430\u0442\u0443";
                    searchDealKeyboard_1 = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: []
                        }
                    };
                    return [4 /*yield*/, db_1.UserService.GetBanks().then(function (response) {
                            return response[0].data;
                        })];
                case 9:
                    banks_1 = _a.sent();
                    temp_1 = [];
                    banks_1.forEach(function (element, index) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            temp_1.push(element);
                            if (index % 2 == 1) {
                                (_a = searchDealKeyboard_1.reply_markup) === null || _a === void 0 ? void 0 : _a.inline_keyboard.push(temp_1);
                                temp_1 = [];
                            }
                            if (index == banks_1.length - 1) {
                                (_b = searchDealKeyboard_1.reply_markup) === null || _b === void 0 ? void 0 : _b.inline_keyboard.push(temp_1);
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    ctx.editMessageText(message, searchDealKeyboard_1);
                    ctx.wizard.next();
                    _a.label = 10;
                case 10:
                    if (data == 'getStats') {
                        ctx.answerCbQuery('Получение статистики');
                    }
                    if (data == 'support') {
                        ctx.answerCbQuery('Техподдержка');
                    }
                    _a.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    });
}
var handler = new telegraf_1.Composer(); // function
var customer = new telegraf_1.Scenes.WizardScene("customer", handler, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, searchDeal(ctx)];
}); }); }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, Context_1.ContextService.selectBank(ctx)];
}); }); }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, selectCurrency(ctx)];
}); }); });
handler.action('searchDeal', function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, searchDeal(ctx)];
}); }); });
// handler.action('back', async (ctx) => ctx.scene.enter('customer'))
customer.leave(function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, console.log("customer scene leave")];
}); }); });
customer.enter(function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, (0, CustomerGreeting_1.greeting)(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
customer.start(function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ctx.scene.enter('home')];
}); }); });
exports["default"] = customer;
//# sourceMappingURL=CustomerScene.js.map