import { Composer, Scenes } from "telegraf";
import { MyContext } from "../../Model/Model";
require("dotenv").config()
import * as EmailValidator from 'email-validator';
import { addDeposit, addEmail, add_coins, lose_coins, getEmail, } from "../../Controller/UserController";
import EmailCheck from "./Components/EmailCheck";
import RegistrationGreeting from "./Components/RegistrationGreeting";

const handler = new Composer<MyContext>();

const registration = new Scenes.WizardScene(
    "registration",
    handler,
    // Обучение: О устройстве валютной пары. О двух видах анализа. О риске на сделку.
    (async (ctx) => {
        if (ctx.update["message"]) {


            if (ctx.update["message"].text == "Спасибо!") {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Здорово']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                // @ts-ignore
                await ctx.reply('Хочу тебе рассказать еще немного теории, чтобы тебе было понятно как устроены бинарные опционы. А это знание в будущем добавит ясности как выбирать правильное направление котировки и зарабатывать.', extra)

            }

            if (ctx.update["message"].text == "Здорово") {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['А подробнее?']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'На платформе IQ Option есть разные виды бинарных опционов: на валютные пары, на акции, на товары, на индексы. Самые популярные бинарные опционы у трейдеров на валютные пары, а самая популярная валютная пара или актив в мире EUR/USD. '

                // @ts-ignore
                await ctx.reply(message, extra)

            }


            if (ctx.update["message"].text == "А подробнее?") {
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Понятно!', 'Сложно...']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                const message = `Валютная пара - это отношение цен двух валют. При покупке одной валюты продается другая. Например: EUR/USD \nEUR – базовая валюта, USD – котируемая. Движение графика происходит за счет изменения отношения базовой валюты и котируемой и величина которая влияет на движение графика называется котировкой. \nВалютная пара означает, что за USD – доллар США, мы покупаем EUR – евро.`

                await ctx.replyWithSticker("CAACAgIAAxkBAAIK6GLwmMzjKT42FwVxott3Uvff8tQ8AAJRBAACP5XMCuERUT38lNp6KQQ")
                // @ts-ignore
                await ctx.reply(message, extra)

            }

            if (ctx.update["message"].text == "Понятно!") {
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Здорово, давай  уже играть!']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = `Здорово, тогда тебе будет легко пройти игру, в ней тоже будет своя пара, как на счет чая и кофе? Назовем ее TEA/CFF. Мне нравиться название нашей игровой пары, все как по-настоящему!`

                // @ts-ignore
                await ctx.reply(message, extra)

            }

            if (ctx.update["message"].text == "Сложно...") {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Здорово, давай  уже играть!']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = `Не волнуйся, ты сможешь лучше понять как все устроено в моей игре, в ней тоже будет своя пара, как на счет чая и кофе? Назовем ее TEA/CFF. Мне нравиться название нашей игровой пары, все как по-настоящему!`

                // @ts-ignore
                await ctx.reply(message, extra)

            }

            if (ctx.update["message"].text == "Здорово, давай  уже играть!") {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Хочу узнать']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = `Недавно ты открывал свою первую сделку, но направление ты вибирал без каких либо знаний. В таком случае твой результат зависит от случая, а случай это 50/50. Так как же сделать вероятность получения прибыли выше?`

                // @ts-ignore
                await ctx.reply(message, extra)

            }

            if (ctx.update["message"].text == "Хочу узнать") {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Слышал о них', 'Ничего не знаю об этом']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = `Я очень рада твоей любознательности и все тебе расскажу! Есть два вида анализа,  которые помогают большинству трейдеров принимать решение о выборе направления движения актива - технический и фундаментальный. ?`

                // @ts-ignore
                await ctx.reply(message, extra)

            }

            if (ctx.update["message"].text == "Слышал о них") {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['А можно пример?']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = `Тогда тебе будет проще! Технический анализ - это анализ цены актива, которая представлена графиком изменения ее во времени. Фундаментальный анализ - это анализ рыночной/экономической/политической ситуации влияющей на актив.`

                // @ts-ignore
                await ctx.reply(message, extra)

            }

            if (ctx.update["message"].text == "Ничего не знаю об этом") {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['А можно пример?']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = `Тогда я тебе расскажу! Технический анализ - это анализ цены актива, которая представлена графиком изменения ее во времени. Фундаментальный анализ - это анализ рыночной/экономической/политической ситуации влияющей на актив.`

                // @ts-ignore
                await ctx.reply(message, extra)

            }

            if (ctx.update["message"].text == "А можно пример?") {

                const message = `Конечно! Давай разберемся подробнее с техническим анализом. Как я уже говорила, это анализ цены актива, которая представлена графиком. График можно отобразить линейным или так свечным. Для анализа чаще всего используют свечной график. Кстати, на платформе ты можешь изменить отображение графика в любой момент с линейного на свечной и наоборот. Давай попробуем сделать это прямо сейчас! Заходи на платформу и смени график, как показано на изображении. А потом загрузи скриншот с измененным графиком, и заработай еще 500 IQ coins. Помни, что в конце игры ты сможешь обменять игровые монеты на реальные призы! И даже выиграть $1000 на свой реальный счет в IQ option!`
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Загрузить скриншот']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                await ctx.reply(message)
                // @ts-ignore
                await ctx.replyWithPhoto({ source: "./src/assets/12.jpg" }, extra)
                ctx.wizard.next()

            }

        }
    }),

    // Ожидаем загрузки скриншота
    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].photo) {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Спасибо!']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Какой красивый этот свечной график! Лови еще 500 IQ coins'
                await add_coins(ctx.from, 500, false)
                await ctx.replyWithSticker("CAACAgIAAxkBAAIK7GLwmPeBoVq6Bwc1mbdg7Vvg6caBAAJGBAACP5XMCstXCFgVL57DKQQ")
                // @ts-ignore
                await ctx.reply(message, extra)

                ctx.wizard.next()
            } else {
                await ctx.reply("Нет, нет, такое не подойдет")
                await ctx.reply("Загрузи скриншот с измененным графиком")
            }
        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'Спасибо!') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Посмотрел, что дальше?']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'А теперь я расскажу тебе, какую информацию могут дать тебе японские свечи, да да, именно так они называются. Посмотри это видео и возвращайся'

                await ctx.replyWithVideo({ source: "./src/assets/3.mp4" })
                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }
        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'Посмотрел, что дальше?') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Посмотрел, хочу скорее увидеть на практике, как это работает!']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Ты быстро двигаешся! Самый популярный метод технического анализа - торговля по тренду. Для этого тебе нужно знать, что такое тренд, линия сопротивления, линия поддержки и пробой. Подготовила для тебя подробное видео тут'
                await ctx.replyWithVideo({ source: "./src/assets/4.mp4" })
                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }
        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'Посмотрел, хочу скорее увидеть на практике, как это работает!') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Да, точно']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Конечно! Ведь именно для этого ты и проходишь эту игру) Ну что, пришло время нашей пары TEA/CFF. Посмотри на этот график и на известную уже тебе линию поддержки, как ты думаешь куда пойдет график? Но постой, помнишь что тебе нужно выбрать время экспирации (через какое время сделка закроется с прогнозируемым результатом) и сумму на которую ты хочешь совершить сделку.'

                // @ts-ignore
                await ctx.reply(message, extra)
                await ctx.replyWithPhoto({ url: 'https://telegra.ph/file/5fa845ef7a88860bf3cee.jpg' })
                ctx.wizard.next()
            }
        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'Да, точно') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['А почему не более чем 5%']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Давай договоримся, что в игре мы будем совершать сделку с минимальным временем 1 мин, а твоя сумма на сделку буде не более чем 5% от твоего общего счета.'

                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }
        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'А почему не более чем 5%') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Конечно ознакомлюсь']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Отличный вопрос! Мне нравится твоя любознательность! В трейдинге есть понятие риск-менеджмента. Это набор правил, следование которым помогают сохранить и приумножить капитал трейдера. Одно из понятий риск-менеджмента - риск на сделку. Риск на сделку это максимальный риск в % от твоего депозита на одну сделку. Обычно при торговле бинарными опционами трейдеры рискуют 1-5% от своего капитала. Это лишь малая часть информации о риск-менеджменте, но я приготовила для тебя материал который ты можешь прочитать. Обещай, что обязательно познакомишся с ним.'

                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }
        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'Конечно ознакомлюсь') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Давай, не могу дождаться']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Ты ведь не обманешь меня? Я хоть и бот, но я еще и девушка, и своим ИИ я понимаю, что ты можешь достичь отличных результатов применяя знания полученные в этой игре! Давай же скорее вернемся к графику и к нашей первой сделке.'

                await ctx.replyWithSticker("CAACAgIAAxkBAAIHRmMAAUmpv50GE1nXerYteTIUJvdsLwACNQQAAj-VzAo8IRZc9lRTiSkE")
                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }
        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'Давай, не могу дождаться') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Ниже', 'Выше']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Итак, вот тот самый график нашей пары TEA/CFF, я даже нарисовала для тебя линию ПОДДЕРЖКИ. Как ты думаешь куда пойдет график через 1 мин? Попробуй поставить 500 IQ Coins на рост или падение пары TEA/CFF'

                // @ts-ignore
                await ctx.reply(message, extra)
                await ctx.replyWithPhoto({ url: 'https://telegra.ph/file/5fa845ef7a88860bf3cee.jpg' })
                ctx.wizard.next()
            }
        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'Выше') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Забрать 455 IQ Coins']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                await add_coins(ctx.from, 500, true)
                const message = 'Поздравляю! Ты сам выбрал правильное направление и заработал первые деньги на бинарных опционах. Да, они виртуальные, но ты можешь перенести свои знания на реальную торговлю и реальный счет. А знаешь почему ты заработал? Потому что ты использовал полученные знания. Теперь в твоем арсенале есть первая торговая стратения - Торговля по тренду.'


                await ctx.reply(message)
                // @ts-ignore
                await ctx.replyWithVideo({ source: "./src/assets/higher.mp4" }, extra)

                ctx.wizard.next()
            }

            if (ctx.update["message"].text == 'Ниже') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Давай еще тренироваться']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Вероятнее всего график пошел бы вверх потому как он встретил линию поддержки. Твой прогноз оказался не верным. На твоем счету ХХХ. Видишь как здорово, что твоя сделка была открыта на сумму не более 5% от  счета. Ты потерял совсем немного и это всего лишь виртуальные сделки. Зато приобрел опыт. Не расстраивайся мы еще потренеруемся.'
                await lose_coins(ctx.from, 500, false)
                // @ts-ignore
                await ctx.reply(message, extra)
                await ctx.replyWithPhoto({ url: "https://telegra.ph/file/2acb6a06e02fcb47ca5ad.jpg" })
                ctx.wizard.next()
            }
        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text) {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['А как это сделать?']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Как на счет того, чтобы попробовать открыть сделку по тренду на демо счете на платформе?'

                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }
        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'А как это сделать?') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Сейчас попробую', 'Не помню как это делать']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Не беспокойся, я тебе помогу! Давай откроем знакомую нам пару EUR/USD. Если ты видишь линейный график, то смени его на свечной. Затем ты можешь изменить время одной свечи, допустим на 1 мин. и таймфрейм, допустим на 30 мин., чтобы найти тренд и линию сопротивления или поддержки.'

                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }
        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'Сейчас попробую' || ctx.update["message"].text == 'Понял, сейчас попробую') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Загрузить скриншот']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Здорово! Теперь используя инструмент луч проведи линию сопротивления или поддержки на графике. Как сделаешь это загрузи скриншот и я начислю тебе еще 500  IQ Coins ;)'

                await ctx.replyWithPhoto({ url: "https://telegra.ph/file/4ffb2c0e06a0fc25d3786.jpg" })
                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }

            if (ctx.update["message"].text == 'Не помню как это делать') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Понял, сейчас попробую']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Посмотри еще раз видео про свечи'

                await ctx.replyWithVideo({ source: "./src/assets/5.mp4" })
                // @ts-ignore
                await ctx.reply(message, extra)
            }

        }
    }),

    // Ожидаем загрузки скриншота
    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].photo) {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Я заработал!', 'Я потерял :(']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Лови еще 500 IQCoins, ты отлично двигаешься!'

                await add_coins(ctx.from, 500, false)
                // @ts-ignore
                await ctx.reply(message, extra)
                await ctx.reply("Здорово! Ты быстро учишься. Давай теперь попробуем открыть сделку на демо счете на платформе, опираясь на полученную тобой информацию. Выбери актив: EUR/USD \nВыбери размер позиции: $100 \nВыбери время экспирации: 5 min \nВыбери выше или ниже.Возвращайся как получишь результат.")
                ctx.wizard.next()
            } else {
                await ctx.reply("Загрузи скриншот")
            }
        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {

            if (ctx.update["message"].text == 'Я заработал!') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Пополнить депозит', 'Я ещё потренируюсь']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Вау! Ты все схватываешь на лету! Ты смог заработать на демо счете, а ведь он устроен так же как и реальная торговля. Только деньги с демо счета ты не можешь вывести. Зато если ты перенесешь полученные знания на реальный счет ты сможешь торговать на реальные деньги и сможешь их выводить. Предлагаю не медлить и пополнить депозит. Кстати, за пополнение депозита я начислю тебе сразу 10000 IQ Coins, и это значит что ты сможешь участвовать в розыгрыше $1000! И ксати лови 500 за совершение сделки на демо счете ;)'

                await add_coins(ctx.from, 500, false)
                await ctx.replyWithSticker("CAACAgIAAxkBAAINiGLw3mZJj-9vT1F9_KRyVN_hw454AAJDBAACP5XMCrPB96QaJA_TKQQ")
                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }

            if (ctx.update["message"].text == 'Я потерял :(') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Посмотреть видео про тренд', 'Играть дальше']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Не беда, ты только учишся! Запомни, нет ни одной стратегии которая бы давала 100% результат. Иногда может произойти пробой линии сопротивления или поддержки, может смениться тренд.  Дальше я расскажу, почему это может происходит. Тренируйся еще и ты получишь получишь лучшие результаты.  И ксати лови 500 за совершение сделки на демо счете :)'
                await ctx.replyWithSticker("CAACAgIAAxkBAAINjGLw4FsIsWDIECUejo7RaAvreJElAAI-BAACP5XMCmXGbS9Z4RFmKQQ")
                await add_coins(ctx.from, 500, false)
                // @ts-ignore
                await ctx.reply(message, extra)
            }

            if (ctx.update["message"].text == 'Посмотреть видео про тренд') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Я заработал!', 'Я потерял :(']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Посмотри видео еще раз, а потом можешь потренироваться на демо счете'
                await ctx.replyWithVideo({ source: "./src/assets/50.mp4" })
                // @ts-ignore
                await ctx.reply(message, extra)
            }

            if (ctx.update["message"].text == 'Играть дальше') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [
                            [
                                'Интересно, а как с его помощью можно заработать?'
                            ]
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Здорово! Давай продолжать. И так теперь ты знаешь, что можешь использовать для принятия решений куда пойдет цена технический анализ и самую популярную стратегию торговлю по тренду.  Теперь давай разберемся как можно применять Фундаментальный анализ в торговле. Фундаментальный анализ - это анализ на основе новостей  и данных.'

                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.selectStep(ctx.session.__scenes.cursor + 2)
            }

        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {

            if (ctx.update["message"].text == 'Пополнить депозит') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Готово',
                                    callback_data: 'send_to_check'
                                }
                            ]
                        ]
                    }
                }

                const message = 'Ты не теряешь время зря. Посмотри это видео, которое подробнее рассказывает о том, как пополнить твой счет. Как только пополнишь депозит возвращайся и проверь на пополнение депозита. Я все проверю и начислю тебе 10000 IQ Coins'

                await ctx.replyWithVideo({ source: './src/assets/1.mp4' })
                // @ts-ignore
                await ctx.reply(message, extra)
            }

            if (ctx.update["message"].text == 'Играть дальше' || (ctx.update['message'].text == 'Я ещё потренируюсь')) {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [
                            [
                                'Интересно, а как с его помощью можно заработать?'
                            ]
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const message = 'Здорово! Давай продолжать. И так теперь ты знаешь, что можешь использовать для принятия решений куда пойдет цена технический анализ и самую популярную стратегию торговлю по тренду.  Теперь давай разберемся как можно применять Фундаментальный анализ в торговле. Фундаментальный анализ - это анализ на основе новостей  и данных.'

                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }

        }

        if (ctx.update["callback_query"]) {

            if (ctx.update["callback_query"].data == 'send_to_check') {

                // запись заявки депозита
                let update = ctx.from
                // @ts-ignore
                update.email = await getEmail(ctx.from)
                await addDeposit(update)

                ctx.answerCbQuery()
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Проверить статус',
                                    callback_data: 'check_deposit'
                                }
                            ]
                        ]
                    }
                }

                const message = 'Ты не теряешь время зря. Посмотри это видео, которое подробнее рассказывает о том, как пополнить твой счет. Как только пополнишь депозит возвращайся и проверь на пополнение депозита. Я все проверю и начислю тебе 10000 IQ Coins'
                // const message = 'Уже сособираюсь на встречу в платформой, чтобы проверить твой депозит. Мне потребуется время. Знаешь, платформа такая занятая, я постоянно жду не дождусь, чтобы пообщаться. Но трейдеры для нее на первом месте. Иногда я ревную...Но как только мы встретимся, я вернусь с твоими IQ Coins'

                // await ctx.replyWithSticker("CAACAgIAAxkBAAINkGLw4KY1njQpI5sm8nt94oewD_3-AAJlBAACP5XMClzVsXn7vWCCKQQ")
                // @ts-ignore
                await ctx.editMessageText(message, extra)
                // await ctx.replyWithVideo({ source: './src/assets/1.mp4' })
                // ctx.wizard.next()
            }

            if (ctx.update["callback_query"].data == 'check_deposit') {
                ctx.answerCbQuery()

                const message = 'Получила! Уже сособираюсь на встречу в платформой, чтобы проверить твой депозит. Мне потребуется время. Знаешь, платформа такая занятая, я постоянно жду не дождусь, чтобы пообщаться. Но трейдеры для нее на первом месте. Иногда я ревную...Но как только мы встретимся, я вернусь с твоими IQ Coins'
                await ctx.replyWithSticker("CAACAgIAAxkBAAINkGLw4KY1njQpI5sm8nt94oewD_3-AAJlBAACP5XMClzVsXn7vWCCKQQ")
                // @ts-ignore
                await ctx.editMessageText(message)
                // ctx.wizard.next()
            }

        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == "Интересно, а как с его помощью можно заработать?") {
                const message = "Сейчас расскажу. Значительные экономические,  финансовые, политические новости а так же публикация финансовых отчетов так же влияют на стоимость активов. Ты можешь успешно практиковать технический анализ, но всегда нужно учитывать выход новостей по торгуемому тобой активу. Хочешь пример?"
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [
                            [
                                'Да, конечно'
                            ]
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                // @ts-ignore
                await ctx.reply(message, extra)
            }

            if (ctx.update["message"].text == "Да, конечно") {
                const message = `Давай представим что выходит новость по нашей паре TEA/CFF. "Внимание экстренные новости. Крупнейший поставщик в Китае сообщает о небывалом уражае чая в этом году, склады с чаем заполнены на 75%"`
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [
                            [
                                'И как это повлияет на стоимость пары?'
                            ]
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                // @ts-ignore
                await ctx.reply(message, extra)
            }

            if (ctx.update["message"].text == "И как это повлияет на стоимость пары?") {
                const message = `Давай разбираться. Итак TEA в нашей паре базовый товар, что означает, что стоимость актива прямопропорциональна стоимости базового товара. Если стоимость чая растет, то растет весь актив, если стоимость чая падает, то падает весь актив. В новости говориться о том, что на рынке избыток чая, да еще и склады почти заполнены. Когда чего то в избытке, то стоимость на товар будет падать, чтобы компенсировать перекос. Давай вернемся к нашей первой сделке с парой TEA/CFF. Вот так выглядел график. Теперь давай представим, что в момент выбора направления вышла та самая новость. Давай откроем позицию на 500 IQ Coins и выберем направление.`
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [
                            [
                                'Выше',
                                'Ниже'
                            ]
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                await ctx.replyWithSticker("CAACAgIAAxkBAAIHY2MB3kwxaemAXPw2d7NA1oo35CA8AAJRBAACP5XMCuERUT38lNp6KQQ")
                await ctx.replyWithPhoto({ source: './src/assets/66-74.jpeg' })
                // @ts-ignore
                await ctx.reply(message, extra)
            }


            if (ctx.update["message"].text == "Выше") {
                const message = `Ты был близок! Но к сожалению выбрал не верное направление(. Да, исходя из технического анализа, с высокой вероятнойстью котировка нашей пары должна была отскочить от линии поддержки и пойти выше. Но в момент заключения сделки вышла новость, которая свидетельствовала о том, что на рынке избыток чая (нашего базового товара), а соответственно котировка нашей пары устремилась вниз. Произошел пробой линии сопротивления. Ты потерял 500 IQ Coins, но не беспокойся ты сможешь восполнить потери в следующих этапах игры.`
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [
                            [
                                'Хорошо'
                            ]
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                await ctx.replyWithSticker("CAACAgIAAxkBAAINlGLw4S3GrisSBakjyi6pw7kHEvpyAAJTBAACP5XMCpUsffVEA7pxKQQ")
                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }

            if (ctx.update["message"].text == "Ниже") {
                const message = `Это верное напрвление! Забирай свои 425 IQ Coins. Да, котировка нашей пары подшла к линии поддержки, и исходя из технического анализа, с высокой вероятнойстью она должна была отскочить от линии поддержки и пойти выше. Однако, в этот момент вышла новость, которая свидетельствовала о том, что на рынке избыток чая (нашего базового товара), а соответственно котировка нашей пары устремилась вниз. Произошел пробой линии сопротивления.`
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [
                            [
                                'Здорово!'
                            ]
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                await ctx.replyWithVideo({ source: './src/assets/higher.mp4' })
                await ctx.replyWithSticker("CAACAgIAAxkBAAINlWLw4TfLvzsDawccQvPswpOo0xO7AAJGBAACP5XMCstXCFgVL57DKQQ")
                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }
        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == "Хорошо" || ctx.update["message"].text == "Здорово!") {
                const message = "Теперь ты знаешь, что оба вида анализа - и технический и фундаментальный могут быть очень полезными в твоей торговле. Как насчет небольшого тестирования и возможности еще подзаработать IQ Coins?"
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [
                            [
                                'Хочу заработать!',
                                'Позже'
                            ]
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }
        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == "Хочу заработать!") {
                const message = "Мне нравится твой энтузиазм!"
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [
                            [
                                'Играть'
                            ]
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }

            if (ctx.update["message"].text == "Позже") {
                const message = "Хорошо, я напомню, что нужно продолжить. Когда тебе напомнить?"
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [
                            [
                                'Через 1 час',
                                'Через 8 часов',
                                'Через 12 часов',
                                'Через 24 часа'
                            ]
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }
        }
    }),

    (async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == "Играть") {
                await ctx.scene.enter("game")
            }

            if (ctx.update["message"].text == "Через 1 час" || ctx.update["message"].text == "Через 8 часов" || ctx.update["message"].text == "Через 12 часов" || ctx.update["message"].text == "Через 24 часа") {
                const message = 'Скорее возвращайся в игру, пора зарабатывать!';
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [
                            [
                                'Играть'
                            ]
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                // @ts-ignore
                await ctx.reply(message, extra)
                await ctx.scene.enter("game")
            }

        }
    }),

);

registration.leave(async (ctx) => console.log("registration scene leave"))
registration.hears("/start", async (ctx) => ctx.scene.enter("home"))

// @ts-ignore
// registration.enter(async (ctx) => ctx.wizard.next())



handler.on("message", async (ctx) => {
    if (ctx.update["message"]) {
        console.log(ctx)

        const extra = {
            parse_mode: 'HTML',
            reply_markup: {
                keyboard: [['Спасибо!']],
                one_time_keyboard: true,
                resize_keyboard: true
            }
        }
        // @ts-ignore
        if (ctx.update["message"].text == "Я заработал!") {
            await add_coins(ctx.from, 500, false)
            // @ts-ignore
            await ctx.reply('Поздравляю, твоя первая успешная сделка, которая принесла тебе виртуальную прибыль! Однако понми, что сейчас тебе просто повезло. Торговля это не казино и не азартная игра, это прежде всего финансовая деятельность основанная на знаниях. Именно знания я дам тебе в игре, которые помогут тебе анализировать движение графика и выбирать правильное направление. А сейчас лови еще 500 IQ coins за выполнение задания и совершение первой сделки.', extra)
            await ctx.replyWithSticker("CAACAgIAAxkBAAIK4GLwmG_f9q6hNqLRAX_mNYI_NMopAAJVBAACP5XMCi-iLW04pRSXKQQ")
            ctx.wizard.next()
        }
        // @ts-ignore
        if (ctx.update["message"].text == "Я потерял :(") {
            await add_coins(ctx.from, 500, false)
            // @ts-ignore
            await ctx.reply("Так бывает, все потому, что торговля это не казино и не азартная игра, это прежде всего финансовая деятельность основанная на знаниях. Многие теряют в торговле, потому что открывают сделки без анализа ситуации, графика, без учета информации - без знаний. Именно знания я дам тебе в игре, которые помогут тебе анализировать движение графика и выбирать правильное направление. А сейчас лови еще 500 IQ coins за выполнение задания и совершение первой сделки.", extra)
            await ctx.replyWithSticker("CAACAgIAAxkBAAIK5GLwmKEuwfKrr95QderXWhJeSDjOAAJSBAACP5XMCk0qTC6hfBCAKQQ")
            ctx.wizard.next()
        }
    }
})

handler.action("exit", async (ctx) => await RegistrationGreeting(ctx))
registration.command("/start", async (ctx) => ctx.scene.enter("home"))
registration.command("/trophies", async (ctx) => ctx.scene.enter("trophies"))


export default registration