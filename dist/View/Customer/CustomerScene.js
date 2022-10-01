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
exports.renderSelectCurrency = void 0;
var telegraf_1 = require("telegraf");
var db_1 = require("../../Controller/db");
var Currecny_Services_1 = require("../../Controller/Services/Currecny.Services");
var CustomerGreeting_1 = require("./CustomerGreeting");
var CustomerServices_1 = require("./CustomerServices");
require("dotenv").config();
function SelectCryptoCurrency(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var crypto_currency, user, message, renderSelectCurrencyKeyboard, temp_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Currecny_Services_1["default"].GetCryptoCurrenciesArray()];
                case 1:
                    crypto_currency = _a.sent();
                    return [4 /*yield*/, db_1.UserService.GetUserById(ctx)];
                case 2:
                    user = _a.sent();
                    message = "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u043A\u0440\u0438\u043F\u0442\u043E\u0432\u0430\u043B\u044E\u0442\u0443 \u043A\u043E\u0442\u043E\u0440\u0443\u044E \u0445\u043E\u0442\u0438\u0442\u0435 \u043F\u0440\u0438\u043E\u0431\u0440\u0435\u0441\u0442\u0438";
                    renderSelectCurrencyKeyboard = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: []
                        }
                    };
                    if (user) {
                        if (user.settings) {
                            temp_1 = [];
                            crypto_currency.forEach(function (currency, index) {
                                // @ts-ignore
                                // if (user.settings.crypto_currency) {
                                //     // @ts-ignore
                                //     user.settings.crypto_currency.forEach((element, index) => {
                                //         let tempvar = element.text + ' (удалить)'
                                //         if ((element.callback_data === currency.element.callback_data)) {
                                //             currency.element.text += ' (удалить)'
                                //             currency.element.callback_data = 'remove_currency ' + currency.element.callback_data
                                //             // splice
                                //             // return render
                                //         }
                                //     });
                                // }
                                var _a;
                                temp_1.push(currency.element);
                                if (index % 2 == 1) {
                                    (_a = renderSelectCurrencyKeyboard.reply_markup) === null || _a === void 0 ? void 0 : _a.inline_keyboard.push(temp_1);
                                    temp_1 = [];
                                }
                            });
                        }
                    }
                    return [4 /*yield*/, ctx.editMessageText(message, renderSelectCurrencyKeyboard)];
                case 3:
                    _a.sent();
                    ctx.wizard.selectStep(5);
                    return [2 /*return*/];
            }
        });
    });
}
function selectCurrencyHandler(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var query, data_1, currency, currency, err_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    query = ctx.update['callback_query'];
                    data_1 = query.data.split(' ');
                    if (!query) return [3 /*break*/, 8];
                    if (!(data_1[0] == 'continue')) return [3 /*break*/, 2];
                    return [4 /*yield*/, SelectCryptoCurrency(ctx)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!(data_1[0] == 'reset')) return [3 /*break*/, 4];
                    return [4 /*yield*/, db_1.UserService.ResetSettings(ctx)
                            .then(function (success) { ctx.answerCbQuery('Настройки сброшены'); ctx.scene.enter("home"); })["catch"](function (error) { console.log(error); return false; })];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    if (!(data_1[0] !== 'remove_currency')) return [3 /*break*/, 6];
                    return [4 /*yield*/, Currecny_Services_1["default"].GetAllCurrencies()];
                case 5:
                    currency = _a.sent();
                    currency.forEach(function (item) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(item.element.callback_data == data_1[0])) return [3 /*break*/, 2];
                                    return [4 /*yield*/, db_1.UserService.SetCurrency(ctx, item.element)
                                            .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, ctx.answerCbQuery(data_1[0] + ' записан в бд')];
                                                    case 1:
                                                        _a.sent();
                                                        return [4 /*yield*/, renderSelectCurrency(ctx)];
                                                    case 2: return [2 /*return*/, _a.sent()];
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
                    _a.label = 6;
                case 6:
                    if (!(data_1[0] == 'remove_currency')) return [3 /*break*/, 8];
                    return [4 /*yield*/, Currecny_Services_1["default"].GetAllCurrencies()];
                case 7:
                    currency = _a.sent();
                    currency.forEach(function (item) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(item.element.callback_data == data_1[1])) return [3 /*break*/, 2];
                                    console.log(item.element.callback_data);
                                    return [4 /*yield*/, db_1.UserService.SpliceCurrency(ctx, item.element.callback_data)
                                            .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, ctx.answerCbQuery(data_1[1] + ' удален из бд')];
                                                    case 1:
                                                        _a.sent();
                                                        return [4 /*yield*/, renderSelectCurrency(ctx)];
                                                    case 2: return [2 /*return*/, _a.sent()];
                                                }
                                            });
                                        }); })];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    _a.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
// Выбор валюты. 3 cursor
function selectCurrency(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ctx.updateType == 'message' ? ctx.scene.enter("home") : '';
                    if (!(ctx.updateType == 'callback_query')) return [3 /*break*/, 2];
                    return [4 /*yield*/, selectCurrencyHandler(ctx)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = '';
                    _b.label = 3;
                case 3:
                    _a;
                    return [2 /*return*/];
            }
        });
    });
}
function renderSelectCurrency(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.UserService.GetUserById(ctx)
                        .then(function (user) { return __awaiter(_this, void 0, void 0, function () {
                        var message_1, i, i, renderSelectCurrencyKeyboard_1, currency, temp_2;
                        var _this = this;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!user) return [3 /*break*/, 3];
                                    if (!user.settings) return [3 /*break*/, 3];
                                    message_1 = "\u0421\u043F\u0438\u0441\u043E\u043A \u0443\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0445 \u0432\u0430\u043C\u0438 \u0431\u0430\u043D\u043A\u043E\u0432:";
                                    for (i = 0; i < user.settings.banks.length; i++) {
                                        message_1 += "\n".concat(i + 1, ". ").concat(user.settings.banks[i].text);
                                    }
                                    message_1 += "\n\n\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0432\u0430\u043B\u044E\u0442\u0443:";
                                    for (i = 0; i < ((_a = user.settings.currency) === null || _a === void 0 ? void 0 : _a.length); i++) {
                                        message_1 += "\n".concat(i + 1, ". ").concat(user.settings.currency[i].text);
                                    }
                                    renderSelectCurrencyKeyboard_1 = {
                                        parse_mode: 'HTML',
                                        reply_markup: {
                                            inline_keyboard: []
                                        }
                                    };
                                    return [4 /*yield*/, Currecny_Services_1["default"].GetAllCurrencies()];
                                case 1:
                                    currency = _c.sent();
                                    temp_2 = [];
                                    currency.forEach(function (currency, index) {
                                        var _a;
                                        user.settings.currency.forEach(function (element, index) {
                                            var tempvar = element.text + ' (удалить)';
                                            if ((element.callback_data === currency.element.callback_data)) {
                                                currency.element.text += ' (удалить)';
                                                currency.element.callback_data = 'remove_currency ' + currency.element.callback_data;
                                                // splice
                                                // return render
                                            }
                                        });
                                        temp_2.push(currency.element);
                                        if (index % 2 == 1) {
                                            (_a = renderSelectCurrencyKeyboard_1.reply_markup) === null || _a === void 0 ? void 0 : _a.inline_keyboard.push(temp_2);
                                            temp_2 = [];
                                        }
                                    });
                                    if (user.settings.currency.length > 0) {
                                        // Добавление Кнопки сброса после рендера кнопок
                                        (_b = renderSelectCurrencyKeyboard_1.reply_markup) === null || _b === void 0 ? void 0 : _b.inline_keyboard.push([
                                            {
                                                text: 'Сбросить настройки',
                                                callback_data: 'reset'
                                            },
                                            {
                                                text: 'Продолжить',
                                                callback_data: 'continue'
                                            }
                                        ]);
                                    }
                                    // console.log(ctx)
                                    return [4 /*yield*/, ctx.editMessageText(message_1, renderSelectCurrencyKeyboard_1)["catch"](function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, ctx.reply(message_1, renderSelectCurrencyKeyboard_1)];
                                                case 1: return [2 /*return*/, _a.sent()];
                                            }
                                        }); }); })];
                                case 2:
                                    // console.log(ctx)
                                    _c.sent();
                                    ctx.wizard.selectStep(3);
                                    _c.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.renderSelectCurrency = renderSelectCurrency;
var handler = new telegraf_1.Composer(); // function
var customer = new telegraf_1.Scenes.WizardScene("customer", handler, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, CustomerServices_1["default"].main(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, CustomerServices_1["default"].selectBank(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, selectCurrency(ctx)];
}); }); }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, CustomerServices_1.SumService.checkSum(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, CustomerServices_1.CCurrencies.handler(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, CustomerServices_1["default"].choosePaymentMethodHandler(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, CustomerServices_1["default"].check_wallet(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, CustomerServices_1["default"].select_exists_wallet(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        ctx.editMessageText('Укажите сумму');
        return [2 /*return*/];
    });
}); }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, CustomerServices_1.AService.select_page(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, CustomerServices_1.AService.single_ads(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
handler.action('create', function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, CustomerServices_1["default"].main(ctx)];
        case 1: return [2 /*return*/, _a.sent()];
    }
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