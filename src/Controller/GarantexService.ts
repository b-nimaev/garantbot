import get_token from "../get_token";

const fetch = require('node-fetch')
var request = require('request');

export default class Garantex {
    static async get_user(nickname) {

        var options = {
            'method': 'GET',
            'url': `https://garantex.io/api/v2/otc/profiles?nickname=${nickname}`,
            'headers': {
                'Cookie': '__ddg1_=uvVccsl1HIYYkwO8qGdP'
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
        });

    }

    static async get_chats() {
        let url = `https://garantex.io/api/v2/otc/chats?limit=100&offset=0`
        return await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + await get_token()
            }
        }, function (error, response) {
            if (error) throw new Error(error);
            return response.body
        });
    }

    static async get_ads(direction: 'sell' | 'buy', only_available: boolean) {
        var options = {
            'method': 'GET',
            'url': `https://stage.garantex.biz/api/v2/otc/ads?direction=${direction}&only_available=${only_available}`,
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
        });

    }

    static async ads(ctx, id) {
        var options = {
            'url': ``
        };

        return await fetch(`https://stage.garantex.biz/api/v2/otc/ads/${id}`)
            .then(res => res.json())
            .then(json => { return json })
            .catch(err => {
                console.error(err)
            })

    }
}