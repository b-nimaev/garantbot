import { Composer, Scenes } from "telegraf";
import { MyContext } from "../../Model/Model";
require("dotenv").config()
import { add_coins, getUser, lose_coins } from "../../Controller/UserController";

const handler = new Composer<MyContext>();
const game = new Scenes.WizardScene(
    "game",
    handler,

    // Строка 128
    async (ctx) => {
        console.log(128)
        if (ctx.update["message"]) {

            if (ctx.update["message"].text == 'Линия поддержки') {
                const message = "Ты абсолютно прав, это линия поддержки. так как она проходит по нижним точкам графика цены. Лови свои 500 коинов"
                await add_coins(ctx.from, 500, false)
                // await ctx.replyWithVideo({ source: './src/assets/higher.mp4' })
                await ctx.replyWithSticker("CAACAgIAAxkBAAINlWLw4TfLvzsDawccQvPswpOo0xO7AAJGBAACP5XMCstXCFgVL57DKQQ")
                await ctx.reply(message)
            }

            if (ctx.update["message"].text == 'Линия сопротивления') {
                const message = "К сожалению это неверный ответ( Это не линия сопротивления, а линия поддержки. так как она проходит по нижним точкам графика цены. Но у тебя еще много возможностей заработать. Кстати одна из них пополнить депозит и получить сразу 10 000 коинов на свой счет! Тогда тебе точно хватит на главный приз! Нажимай на кнопку в меню ниже и делай первый шаг в реальную торговлю!"
                await ctx.replyWithSticker("CAACAgIAAxkBAAINlmLw4T1-Kj5aK4SqswLjOJBw0LApAAJaBAACP5XMCu4_V1wQbaG7KQQ")
                await ctx.reply(message)
            }

            const extra = {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [['Выше', 'Ниже']],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            }


            await ctx.reply("А теперь давай попробуем совершить сделку используя технический анализ")
            await ctx.reply("Посмотри на график нашей пары TEA/CFF, я уже добавила на график трендовую линию. Какую, я думаю ты уже знаешь) Как думаешь куда вероятнее всего пойдет котировка актива?")
            // @ts-ignore
            await ctx.replyWithPhoto({ source: './src/assets/131.jpeg' }, extra)
            ctx.wizard.next()
        }
    },

    // Строка 132
    async (ctx) => {
        if (ctx.update["message"]) {

            if (ctx.update["message"].text == 'Выше') {
                const message = "Твой анализ оказался не верным. Скорее всего котировка пошла бы вниз, так как она встретилась с линией сопротивления. Но ты можешь практиковаться дальше!"
                await ctx.reply(message)
            }

            if (ctx.update["message"].text == 'Ниже') {
                const message = "Ты абсолютно прав, котировка достигла линии сопротивлени, и скорее всего пошла бы вниз. Лови свои 455 коинов. Мне нравится твоя ловкость!"
                await add_coins(ctx.from, 455, false)
                await ctx.replyWithVideo({ source: './src/assets/higher.mp4' })
                await ctx.reply(message)
            }

            const extra = {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [['Конечно', 'Позже']],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            }

            // await ctx.replyWithPhoto("AgACAgIAAxkBAAIKbGLwZn96lKvNYrEG8jjpX9Gxl2k_AALhvzEb-yWAS_bHICEy4NbsAQADAgADcwADKQQ")
            // @ts-ignore
            await ctx.reply("Играем дальше?", extra)
            ctx.wizard.next()
        }
    },

    // Строка 138
    async (ctx) => {
        if (ctx.update["message"]) {

            if (ctx.update["message"].text == 'Играть') {
                const message = "Давай тренировать твое знание технического анализа! Буду показывать тебе графики в момент совершения сделки а ты выбирай, куда пойдет цена."
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Давай']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                // @ts-ignore
                await ctx.reply(message, extra)
            }

            if (ctx.update["message"].text == 'Конечно' || (ctx.update['message'].text == 'Давай')) {
                const message = "Отлично! Смотри на еще один график. Теперь он без линий тренда. Попробуй провести линию визуально и оценить куда может пойти цена актива?"
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Выше', 'Ниже']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                await ctx.reply(message)
                // @ts-ignore
                await ctx.replyWithPhoto({ source: './src/assets/139.jpeg' }, extra)
                ctx.wizard.selectStep(ctx.session.__scenes.cursor + 2)
                console.log('asdf')
                // await ctx.wizard.next()
            }

            // AgACAgIAAxkBAAIKbGLwZn96lKvNYrEG8jjpX9Gxl2k_AALhvzEb-yWAS_bHICEy4NbsAQADAgADcwADKQQ

            if (ctx.update["message"].text == 'Позже') {
                const message = "Хорошо. когда тебе напомнить?"
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Через 1 час', 'Через 8 часов', 'Через 12 часов', 'Через 24 часа']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
                // await ctx.wizard.selectStep(ctx.session.__scenes.cursor + 2)
            }

        }
    },

    async (ctx) => {
        if (ctx.update["message"]) {

            let extra = {
                reply_markup: {
                    keyboard: [['Играть']],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            }

            let message = ``

            if (ctx.update["message"].text == "Через 1 час") {
                message += `Хорошо, напишу через час`
            }
            if (ctx.update["message"].text == "Через 8 часов") {
                message += `Хорошо, напишу через 8 часов`
            }
            if (ctx.update["message"].text == "Через 12 часов") {
                message += `Хорошо, напишу через 12 часов`
            }
            if (ctx.update["message"].text == "Через 24 часа") {
                message += `Хорошо, напишу через сутки`
            }

            await ctx.replyWithSticker("CAACAgIAAxkBAAINjGLw4FsIsWDIECUejo7RaAvreJElAAI-BAACP5XMCmXGbS9Z4RFmKQQ")
            await ctx.reply(message, extra)
            ctx.wizard.selectStep(ctx.session.__scenes.cursor - 1)
        }
    },

    async (ctx) => {
        if (ctx.update["message"]) {
            // console.log(ctx.message)
            const extra = {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [['Конечно', 'Позже']],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            }

            if (ctx.update["message"].text == "Выше") {
                let message = `К сожалению это неверный ответ( Здесь видно, что цена достигла уровня сопротивления, а значит с большей вероятностью она пойдет вниз. Не отчаивайся, у меня еще много интересных заданий!`
                // @ts-ignore       
                await ctx.reply(message)
                await ctx.replyWithPhoto({ source: './src/assets/141-2.jpeg' })
                await ctx.replyWithSticker("CAACAgIAAxkBAAIPbWLw7QKCo0orkR8urtNwcJlXmR69AAJXBAACP5XMCj6R_XixcB-qKQQ")
                await ctx.reply(`Ты отлично справился с заданиями! И у тебя уже много практики, которую ты можешь перенести на реальную торговлю. Тренируй технический анализ на демо счете, а затем переходи на реальную торговлю \n\nЧтобы проверить баланс введи /profile`)
                // @ts-ignore
                await ctx.reply("Как насчет того, чтобы потренировать фундаментальный анализ?", extra)
                ctx.wizard.next()
            }

            if (ctx.update["message"].text == "Ниже") {
                let extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Забрать 455 IQ Coins']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                let message = `Ты абсолютно прав, котировка достигла линии сопротивления, и скорее всего пошла бы вниз. Лови свои 455 коинов. Мне нравится твоя ловкость!`
                await add_coins(ctx.from, 455, false)
                await ctx.replyWithPhoto({ source: './src/assets/141-2.jpeg' })
                await ctx.reply(message)
                // @ts-ignore
                await ctx.replyWithVideo({ source: './src/assets/higher.mp4' }, extra)
            }

            if (ctx.update["message"].text == "Забрать 455 IQ Coins") {
                await ctx.replyWithSticker("CAACAgIAAxkBAAIPbWLw7QKCo0orkR8urtNwcJlXmR69AAJXBAACP5XMCj6R_XixcB-qKQQ")
                await ctx.reply(`Ты отлично справился с заданиями! И у тебя уже много практики, которую ты можешь перенести на реальную торговлю. Тренируй технический анализ на демо счете, а затем переходи на реальную торговлю. Помнишь, что за пополнение депозита я начисляю сразу 10000 коинов, и ты на шаг ближе к $1000 для торговли на реальном счете! Нажимай на кнопку в меню внизу, а затем присылай свой Trader ID. `)
                // @ts-ignore
                await ctx.reply("Как насчет того, чтобы потренировать фундаментальный анализ?", extra)
                ctx.wizard.next()
            }

        }
    },

    async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == "Конечно" || ctx.update["message"].text == "Играть") {
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Понял, присылай новость']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                ctx.reply("Здорово! Обожаю игры и мне нравиться что ты такой же, как я, хоть и человек, а не бот.")
                // @ts-ignore
                ctx.reply("Буду присылать тебе новости которые могут влиять на нашу пару TEA/CFF а ты выбирай, куда пойдет котировка. Но помни, что иногда новость может быть неоднозначной, например одинаково влиять сразу на оба товара в паре. В таких случаях может быть сложно определить направление цены и лучше воздержаться от совершения сделки.", extra)
                ctx.wizard.next()
            }
        }
    },

    async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'Понял, присылай новость') {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Выше', 'Ниже'], ['Воздержаться от сделки']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                // @ts-ignore
                ctx.reply(`Новость 1. "Ученый Александр Пимштейн сделал невероятное открытие после 5 лет исследований. У 5000 испытуемых женщин, которые пили по 3 чашки кофе в день замедлились процессы старения в 1,5 раза. Он смог открыть невероятную способность кофе к омоложению организма. Похоже даже любители чая по всему миру начинают переходить на кофе". \n\nКак думаешь, куда вероятнее всего пойдет котировка нашего актива TEA/CFF после этой новости? Выбери направление и открой позицию на 500 IQ Coin.`, extra)
                ctx.wizard.next()
            }
        }
    },

    async (ctx) => {
        if (ctx.update["message"]) {

            const extra = {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [['Понял, присылай следующую новость']],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            }

            let message: string
            if (ctx.update["message"].text == "Выше") {
                message = `К сожалению ты выбрал неверное направление. Если бы наш актив был CFF/TEA то есть кофе был бы базовым товаром, то тогда бы котировка нашего актива пошла вверх, но так как кофе в нашей паре котируемый товар, соответственно его стоимость по отношению к чаю возрастет, то котировка нашего актива после такой новости скорее всего полетит вниз.`
                // await lose_coins(ctx.from, 500, false)
            }

            if (ctx.update["message"].text == 'Ниже') {
                message = `Ты абсолютно прав! Вероятнее всего из-за большого спроса на кофе стоимость его возрастет, а так как это котируемый товар в нашей паре, то котировка актива скорее всего после этой новости полетит вниз. Лови свои 455 IQ Coin`
                await ctx.replyWithVideo({ source: './src/assets/higher.mp4' })
                await add_coins(ctx.from, 455, false)
            }

            if (ctx.update["message"].text == "Воздержаться от сделки") {
                message = `Вероятнее всего из-за большого спроса на кофе стоимость его возрастет, а так как это котируемый товар в нашей паре, то котировка актива скорее всего после этой новости полетит вниз. Но если ты не уверен, лучше не рисковать. Мне нравиться твоя осторожность!`
            }

            // await ctx.replyWithVideo({ source: './src/assets/higher.mp4' })
            // @ts-ignore
            await ctx.reply(message, extra)
            ctx.wizard.next()

        }
    },

    async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update['message'].text == "Понял, присылай следующую новость") {

                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Выше', 'Ниже'], ['Воздержаться от сделки']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                let message = `Лови новость 2. "Самая популярная поп звезда Кэтти Кэндл на свой день рождения устроила большую чайную церемонию. Она сообщила своим гостям, что чай это ее любимый напиток, который помогает ей быть всегда энергичной, и она может давать так много гастролей в том числе благодаря любимому напитку. Похоже фанаты Кэтти Кэндл по всему миру теперь будут пить только чай, позабыв про коллу, кофе и другие напитки"  \n\nКак думаешь, куда вероятнее всего пойдет котировка нашего актива TEA/CFF после этой новости? Выбери направление и открой позицию на 500 IQ Coin.`
                // @ts-ignore
                ctx.reply(message, extra)
                ctx.wizard.next()
            }
        }
    },

    async (ctx) => {
        if (ctx.update["message"]) {


            if (ctx.update['message'].text == "Выше") {
                let message = `Ты абсолютно прав! Здесь ситуация изменилась в другую сторону. Так как данная поп звезда является инфлюенсером, который задает тренды ее заявление может повлиять на спрос на чай, а соответственно и на его стоимость. И так как чай в нашей паре базовый товар, то рост его цены, так же повлияет на рост котировки всего актива TEA/CFF. Возможно ты слышал как Илон Маск не раз влиял на стоимость криптовалюты Dogcoin своими твитами. Здесь в нашем игровом мире, похожая ситуация. Лови свои 455 IQ Coin`
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Здорово, присылай следующую новость!']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                await add_coins(ctx.from, 455, false)
                await ctx.replyWithVideo({ source: './src/assets/higher.mp4' })
                // @ts-ignore
                await ctx.reply(message, extra)
            }

            if (ctx.update['message'].text == 'Ниже') {
                let message = `К сожалению ты выбрал неверное направление. Чай в нашей паре базовый актив, а соответственно повышенный спрос на чай повлияет на рост его цены, и котировка актива TEA/CFF будет вероятнее всего рости после этой новости.`
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Понял, хочу еще тренироваться']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                await lose_coins(ctx.from, 500, false)
                await ctx.replyWithSticker("CAACAgIAAxkBAAIHUmMAAbQ52FmwwPuJE-bOVYMpqj_27QACPQQAAj-VzAq6TgWWNfDg2ykE")
                // @ts-ignore
                await ctx.reply(message, extra)
            }

            if (ctx.update['message'].text == "Воздержаться от сделки") {
                let message = `Чай в нашей паре базовый актив, а соответственно повышенный спрос на чай повлияет на рост его цены, и котировка актива TEA/CFF будет вероятнее всего рости после этой новости. Но если ты не уверен, лучше не рисковать. Мне нравиться твоя осторожность!`
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Я понял, присылай следующую новость!']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                // @ts-ignore
                await ctx.reply(message, extra)
            }

            ctx.wizard.next()
        }
    },

    async (ctx) => {
        const message = "Из-за пандемии Бовидо-вируса ожидаются логистические задержки по всему миру. Особенно это скажется на продовольственных товарах: зерне, масле, чае, кофе и других."
        const extra = {
            parse_mode: 'HTML',
            reply_markup: {
                keyboard: [['Выше', 'Ниже'], ['Воздержаться от сделки']],
                one_time_keyboard: true,
                resize_keyboard: true
            }
        }

        if (ctx.update["message"]) {
            // @ts-ignore
            ctx.reply(message, extra)
            ctx.wizard.next()
        }

    },

    async (ctx) => {
        if (ctx.update["message"]) {


            if (ctx.update['message'].text == "Выше") {
                let message = `Эта новость неоднозначна и не понятно как она могла бы сказаться на движение котировки нашей пары. Эта сделка оказалась рисковой.`
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Я понял']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                // @ts-ignore
                await ctx.reply(message, extra)
            }

            if (ctx.update['message'].text == 'Ниже') {
                let message = `Эта новость неоднозначна и не понятно как она могла бы сказаться на движение котировки нашей пары. Эта сделка оказалась рисковой.`
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Я понял']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                // @ts-ignore
                await ctx.reply(message, extra)
            }

            if (ctx.update['message'].text == "Воздержаться от сделки") {
                let message = `Ты был прав! Эта новость неоднозначна и не понятно как она могла бы сказаться на движение котировки нашей пары.`
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Я понял']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                // @ts-ignore
                await ctx.reply(message, extra)
            }

            ctx.wizard.next()
        }
    },

    async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'Я понял') {
                const message = "Ты отлично справился! Я уже начинаю сомневаться ты точно человек, а не бот? Хотя, если ты бот, напиши мне после игры, окей?"
                const message2 = "Ой, что это я.. Давай поговорим о самом главном для трейдера. О финансовом результате. И как его вывести с платформы когда он положительный."
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Это очень интересно']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                const sticker = "CAACAgIAAxkBAAIHUGMAAbQCd6Skju0odY_N5RgPg3yVlgACXAQAAj-VzApRofnwhTO6ASkE"
                await ctx.reply(message)
                if (sticker) {
                    await ctx.replyWithSticker(sticker)
                }
                // @ts-ignore
                await ctx.reply(message2, extra)
                ctx.wizard.next()
            }
        }
    },

    async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'Это очень интересно') {
                const message = "Когда ты заработаешь деньги на реальном счете ты сможешь вывести свою прибыль. Но перед выводом средств есть один важный шаг."
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Какой?']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                const sticker = null
                if (sticker) {
                    await ctx.replyWithSticker(sticker)
                }
                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }
        }
    },

    async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'Какой?') {
                const message = "Поделиться прибылью со мной, конечно!"
                const message2 = "Шучу! Прямо представила, как ты открыл рот от удивления. На самом деле, важный шаг это верефицировать твой аккаунт или подтвердить личность."
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['А для чего нужна верификация?']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                const sticker = "CAACAgIAAxkBAAIHTmMAAbPqrbWQAAGQUdQ925SlS3fE0f4AAjQEAAI_lcwKIspAoTBLsuopBA"
                await ctx.reply(message)
                if (sticker) {
                    await ctx.replyWithSticker(sticker)
                }
                // @ts-ignore
                await ctx.reply(message2, extra)
                ctx.wizard.next()
            }
        }
    },

    async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'А для чего нужна верификация?') {
                const message = "Это требование международных стандартов и регуляторов. То есть тех органов, которые контралируют работу всех брокеров, в том числе и IQ option. Верификация помогает подтвердить твою личность и защитить финансовые интересы в случае возникновения споров, обезопасить твой счет, а так же не допустить до торговли на финансовых рынках людей, которые не могут ей заниматься, например несовершеннолетних. Для  верификации необходимо предоставление документов подтверждающих личность. Но не беспокойся, брокер надежно хранит эти данные и не передает информацию 3м лицам."
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Хорошо, я спокоен']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }
        }
    },

    async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'Хорошо, я спокоен') {
                const message = "Отлично. Если ты уже внес депозит, то рекомендую пройти верефикацию, чтобы не откладывать на потом. Ведь она занимает 1-3 рабочих дня. Кстати, посмотри это полезное видео о том, как пройти верефикацию. <a href='https://vimeo.com/channels/1002556/331181006'>.</a>"
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Так как вывести деньги?']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                // await ctx.replyWithVideo({ source: './src/assets/last.mp4' })
                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }
        }
    },

    async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'Так как вывести деньги?') {
                const message = "Если ты пополнял свой счет банковской картой, то вывод суммы первоначальной суммы депозита должен быть осуществлен на ту же самую карту, а оставшаяся сумма может быть выведена любым другим способом. Например ты пополнил депозит $100 с банковской карты, и заработал $50 торгуя, значит $100 тебе необходимо вывести на ту же карту, а заработанные деньги любым другим способом. "
                const message2 = "Минимальная сумма доступная для вывода всего $2 (зависит от способа пополнения) максимальная $1000 000. Кстати, трейдеры IQ option ежемесячно выводят сыше $2 000 000 на свои счета!"
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Ух ты, здорово!']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }
                await ctx.reply(message)

                const sticker = "CAACAgIAAxkBAAIHTGMAAbO43uyvSB9-30zjLEpCga3pKwACTwQAAj-VzArpOg_MthLpGikE"

                if (sticker) {
                    await ctx.replyWithSticker(sticker)
                }

                // @ts-ignore
                await ctx.reply(message2, extra)
                ctx.wizard.next()
            }
        }
    },

    async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'Ух ты, здорово!') {
                const message = "Ты просто красавчик! Нравишся мне все больше и больше. Ты блестяще прошел игру, освоил базовые навыки трейдинга и заработал Х коинов. Давай же скорее посмотрим что ты можешь купить за заработанные коины "
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Давай']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                const sticker = "CAACAgIAAxkBAAIHRmMAAUmpv50GE1nXerYteTIUJvdsLwACNQQAAj-VzAo8IRZc9lRTiSkE"
                if (sticker) {
                    await ctx.replyWithSticker(sticker)
                }

                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }
        }
    },

    async (ctx) => {
        if (ctx.update["message"]) {
            if (ctx.update["message"].text == 'Давай') {
                const message = "Участие в розыгрыше $1000 на реальный счет в IQ option - 22000 коинов \n\Консультация с аккаунт менеджером 20000 коинов \nСтратегия 1 для торговли 3000 коинов \nСтратегия 2 для торговли 3000 коинов \nСтратегия 3 для торговли 3000 коинов"
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['Здорово!']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                // @ts-ignore
                await ctx.reply(message, extra)
                ctx.wizard.next()
            }
        }
    },

    async (ctx) => {
        if (ctx.update['message'].text == 'Здорово!') {

            let user = await getUser(ctx.from)

            if (user) {
                if (user.balance) {
                    if (user.balance < 22000) {
                        await ctx.reply('К сожалению, тебе не хватает коинов на главные, и ты не сможешь выиграть $1000 для реальной торговли, но это не беда, ты можешь заработать 10000 коинов всего лишь пополнив депозит. Нажимай на кнопку внизу а потом отправляй свой email на проверку. Я начислю тебе 10 000 коинов.')
                    } else {
                        await ctx.reply("Переходи в меню, кликай на \"Ценные трофеи \" и обменивай заработанные IQ Coins на ценные призы! Ты просто космос, отлично прошел все испытания и выполнил все задания! ")
                    }
                } else {
                    await ctx.reply('К сожалению, тебе не хватает коинов на главные, и ты не сможешь выиграть $1000 для реальной торговли, но это не беда, ты можешь заработать 10000 коинов всего лишь пополнив депозит. Нажимай на кнопку внизу а потом отправляй свой email на проверку. Я начислю тебе 10 000 коинов.')
                }
            }
        }
    }

)

game.enter(async (ctx) => {

    const message = "Сначала простое задание, посмотри на график, какую линию ты видишь? Как всегда за правильный отет тебя ждет 500"
    const extra = {
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [['Линия поддержки', 'Линия сопротивления']],
            one_time_keyboard: true,
            resize_keyboard: true
        }
    }

    await ctx.replyWithPhoto({ source: './src/assets/126.jpeg' })
    // @ts-ignore
    await ctx.reply(message, extra)
    ctx.wizard.selectStep(1)
})
game.hears('/start', async (ctx) => ctx.scene.enter("home"))
game.hears('/register', async (ctx) => ctx.scene.enter("registration"))
game.command("/trophies", async (ctx) => ctx.scene.enter("trophies"))

export default game