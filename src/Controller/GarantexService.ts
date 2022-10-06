import { response } from "express";
const fetch = require('node-fetch')
var request = require('request');

let jwt = 'eyJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NjUwMDY1MjAsImV4cCI6MTY2NTA5MjkyMCwic3ViIjoic2Vzc2lvbiIsImlzcyI6ImJhcm9uZyIsImF1ZCI6WyJwZWF0aW8iXSwianRpIjoiRUI3RTk1QUI0MkY3MEQ2RDY5Mzg2NzNCIiwidWlkIjoiSUQ4MzE1RTBCNjk3IiwiZW1haWwiOiJtb3lob3Jvc2hlbmtpeUBnbWFpbC5jb20iLCJyb2xlIjoibWVtYmVyIiwibGV2ZWwiOjIsInN0YXRlIjoiYWN0aXZlIiwiYXBpX2tpZCI6IjMxNzlmZTNhLWZjYzctNDliZS05MDUzLTZmMWJlNTM1MGQyZCJ9.jqiKSj5UKnGU-vKp1753eQVTBmPzVIjuuMGv5ryqsbZNpuEqvxwkTLpvcyo1rvMazjyvHcf85qUPcbXNaqVbx6CiFC2YxlYNiCvsZ1t9Z3wCul7qVPjIrgCU7EttUbaDqVI2s_fOal-ag1SlrWqlLaLKn07aIG4DgYJ3fIymmKWfIYlbDhIfFuPXgma796L6GpprHtyceBUSHlICoJNLrCH9r1GnsSL8-Q918PMTpTXIXgvWj7jofUNnGoxxIGr8K0aqLzPCnDAiCCa3bv7f9TuFgJ7pOSYU6cVcweUUy-wF39Eqlkn2AI1kA_Mc58kmYcL0wDfgXc2CaSdPakF3mA'


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
        var options = {
            'method': 'GET',
            'url': 'https://garantex.io/api/v2/otc/chats?limit=100&offset=0',
            'headers': {
                'Authorization': `Bearer ${jwt}`,
                'Cookie': '__ddg1_=uvVccsl1HIYYkwO8qGdP'
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
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