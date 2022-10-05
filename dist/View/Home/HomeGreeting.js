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
var db_1 = require("../../Controller/db");
// import { messageRenderFunction } from "./HomeScene"
function greeting(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var extra, err_1, message;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    extra = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Продавец',
                                        callback_data: 'seller'
                                    },
                                    {
                                        text: 'Покупатель',
                                        callback_data: 'customer'
                                    }
                                ]
                            ]
                        }
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 6]);
                    if (!ctx.from) return [3 /*break*/, 3];
                    return [4 /*yield*/, db_1.UserService.GetUserById(ctx).then(function (user) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b, message, _c, message, _d;
                            var _e, _f;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        if (!user) return [3 /*break*/, 13];
                                        if (!(user.role == 'customer' || user.role == 'seller')) return [3 /*break*/, 7];
                                        if (!(user.role == 'customer')) return [3 /*break*/, 2];
                                        return [4 /*yield*/, ctx.scene.enter("customer")];
                                    case 1:
                                        _a = _g.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        _a = false;
                                        _g.label = 3;
                                    case 3:
                                        _a;
                                        if (!(user.role == 'seller')) return [3 /*break*/, 5];
                                        return [4 /*yield*/, ctx.scene.enter("seller")];
                                    case 4:
                                        _b = _g.sent();
                                        return [3 /*break*/, 6];
                                    case 5:
                                        _b = false;
                                        _g.label = 6;
                                    case 6:
                                        _b;
                                        return [3 /*break*/, 12];
                                    case 7:
                                        message = "\u041F\u0440\u0438\u0432\u0435\u0442, ".concat((_e = ctx.from) === null || _e === void 0 ? void 0 : _e.first_name, ", \u0432\u044B\u0431\u0435\u0440\u0438 \u0441\u0432\u043E\u044E \u0440\u043E\u043B\u044C \uD83D\uDDE1");
                                        if (!
                                        // @ts-ignore
                                        ctx.update["message"]) 
                                        // @ts-ignore
                                        return [3 /*break*/, 9];
                                        return [4 /*yield*/, ctx.reply(message, extra)];
                                    case 8:
                                        _c = _g.sent();
                                        return [3 /*break*/, 11];
                                    case 9: return [4 /*yield*/, ctx.editMessageText(message, extra)];
                                    case 10:
                                        _c = _g.sent();
                                        _g.label = 11;
                                    case 11:
                                        // @ts-ignore
                                        _c;
                                        _g.label = 12;
                                    case 12: return [3 /*break*/, 19];
                                    case 13: return [4 /*yield*/, db_1.UserService.SaveUser(ctx)];
                                    case 14:
                                        _g.sent();
                                        message = "\u041F\u0440\u0438\u0432\u0435\u0442, ".concat((_f = ctx.from) === null || _f === void 0 ? void 0 : _f.first_name, ", \u0432\u044B\u0431\u0435\u0440\u0438 \u0441\u0432\u043E\u044E \u0440\u043E\u043B\u044C \uD83D\uDDE1");
                                        if (!
                                        // @ts-ignore
                                        ctx.update["message"]) 
                                        // @ts-ignore
                                        return [3 /*break*/, 16];
                                        return [4 /*yield*/, ctx.reply(message, extra)];
                                    case 15:
                                        _d = _g.sent();
                                        return [3 /*break*/, 18];
                                    case 16: return [4 /*yield*/, ctx.editMessageText(message, extra)];
                                    case 17:
                                        _d = _g.sent();
                                        _g.label = 18;
                                    case 18:
                                        // @ts-ignore
                                        _d;
                                        _g.label = 19;
                                    case 19: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [3 /*break*/, 6];
                case 4:
                    err_1 = _b.sent();
                    message = "\u041F\u0440\u0438\u0432\u0435\u0442, ".concat((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.first_name, ", \u0432\u044B\u0431\u0435\u0440\u0438 \u0441\u0432\u043E\u044E \u0440\u043E\u043B\u044C \uD83D\uDDE1");
                    // @ts-ignore
                    return [4 /*yield*/, ctx.reply(message, extra)];
                case 5:
                    // @ts-ignore
                    _b.sent();
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.greeting = greeting;
//# sourceMappingURL=HomeGreeting.js.map