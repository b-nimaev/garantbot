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
exports.greeting = void 0;
var Context_1 = require("../../Controller/Context");
var db_1 = require("../../Controller/db");
function greeting(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!ctx.from) return [3 /*break*/, 2];
                    return [4 /*yield*/, db_1.UserService.GetUserById(ctx)
                            .then(function (user) { return __awaiter(_this, void 0, void 0, function () {
                            var date, message, buyerExtraKeyboard, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!user) return [3 /*break*/, 6];
                                        return [4 /*yield*/, Context_1.ContextService.GetFormattedTime(user.date.registered)];
                                    case 1:
                                        date = _b.sent();
                                        message = "\u0412\u0430\u0448 ID: <code>".concat(user.id, "</code>\n");
                                        message += "\u0420\u043E\u043B\u044C: <code>\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C</code>\n";
                                        buyerExtraKeyboard = {
                                            parse_mode: 'HTML',
                                            reply_markup: {
                                                inline_keyboard: [
                                                    [
                                                        {
                                                            text: 'Создать объявление',
                                                            callback_data: 'create'
                                                        },
                                                    ],
                                                    [
                                                        {
                                                            text: 'Мои объявления',
                                                            callback_data: 'my_ads'
                                                        },
                                                    ]
                                                ]
                                            }
                                        };
                                        // [
                                        //     {
                                        //         text: 'Статистика',
                                        //         callback_data: 'getStats'
                                        //     }
                                        // ], [
                                        //     {
                                        //         text: 'Написать в поддержку',
                                        //         callback_data: 'support'
                                        //     },
                                        // ]
                                        ctx.wizard.selectStep(1);
                                        // ctx.wizard.next()
                                        ctx.update['callback_query'] ? ctx.answerCbQuery() : true;
                                        if (!ctx.update['callback_query']) return [3 /*break*/, 3];
                                        return [4 /*yield*/, ctx.editMessageText(message, buyerExtraKeyboard)];
                                    case 2:
                                        _a = _b.sent();
                                        return [3 /*break*/, 5];
                                    case 3: return [4 /*yield*/, ctx.reply(message, buyerExtraKeyboard)];
                                    case 4:
                                        _a = _b.sent();
                                        _b.label = 5;
                                    case 5:
                                        _a;
                                        _b.label = 6;
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.greeting = greeting;
//# sourceMappingURL=CustomerGreeting.js.map