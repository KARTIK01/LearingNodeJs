'use strict';
/* eslint-disable global-require, no-process-env */

// Register babel hook so we can write the real entry file (server.js) in ES6
// In production, the es6 code is pre-transpiled so it doesn't need it
if (process.env.NODE_ENV !== 'production') {
    require("source-map-support").install();
    require('babel-register');
}

if (process.env.NODE_ENV === 'production') {
    require('newrelic');
}

// The BabelJS polyfill is needed in production too
require('babel-polyfill');

// Setup Bluebird as the global promise library
global.Promise = require('bluebird');

const request = require("request-promise");
const _ = require("lodash");


const co = Promise.coroutine;

let botId = "588c42058415991eb8e08584";
let baseUrl = `http://staging.chatteron.io/api/bots/${botId}/modules`;
let authToken = "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODYxNjg5ZThiZGM3OTQzN2Q2MjgyMzIiLCJpYXQiOjE0ODU1MTk4MjJ9.SrLqUbIagQRX0REAIM1o0ULrAlU9Y6E2b9xBPS0oS8g";
let modules = ["001", "002", "003"];

/** User's says **/
let quickReplies = {
    "dynamic":false, "items":[
        { "type":"text", "title":"QR1", "index":0 },
        { "type":"text", "title":"QR2", "index":1 },
        { "type":"text", "title":"QR3", "index":2 },
        { "type":"text", "title":"QR4", "index":3 },
        { "type":"text", "title":"QR5", "index":4 }
    ]
};

/** BOT's says **/
let connections = {
    "edges":[{
        "source":"001", "target":"005", "strict":false, "activation":{
            "type"      :"click", "button":{ "param":{ "value":"" }, "items":[] },
            "quickReply":{ "param":{ "type":"text", "value":"" }, "items":[{ "title":"QR1" }] }
        }, "_id":"32396ef0-894b-4f17-934c-08fc62394d6a"
    }, {
        "source":"001", "target":"006", "strict":false, "activation":{
            "type"      :"click", "button":{ "param":{ "value":"" }, "items":[] },
            "quickReply":{ "param":{ "type":"text", "value":"" }, "items":[{ "title":"QR2" }] }
        }, "_id":"a88362a9-f843-425f-ba35-5f89885b20c3"
    }, {
        "source":"001", "target":"007", "strict":false, "activation":{
            "type"      :"click", "button":{ "param":{ "value":"" }, "items":[] },
            "quickReply":{ "param":{ "type":"text", "value":"" }, "items":[{ "title":"QR3" }] }
        }, "_id":"ef4721cb-5efa-4c3c-beec-4d1c905127ae"
    }, {
        "source":"001", "target":"008", "strict":false, "activation":{
            "type"      :"click", "button":{ "param":{ "value":"" }, "items":[] },
            "quickReply":{ "param":{ "type":"text", "value":"" }, "items":[{ "title":"QR4" }] }
        }, "_id":"114465ca-dcf8-4b34-baba-c87b680af14e"
    }, {
        "source":"001", "target":"009", "strict":false, "activation":{
            "type"      :"click", "button":{ "param":{ "value":"" }, "items":[] },
            "quickReply":{ "param":{ "type":"text", "value":"" }, "items":[{ "title":"QR5" }] }
        }, "_id":"e3c5062c-19a9-4a16-a486-1ea6cd1cbb49"
    }]
};

let options = {
    method :'GET',
    headers:{
        'Authorization':authToken
    },
    json   :true
};

let init = co(function*() {
    _.map(modules, module => {
        options.method = "GET";
        options.uri = `${baseUrl}/${module}`;


        request(options)
            .then(response => {
                let newAction = response.module.botActions;

                newAction[newAction.length - 1].message.quickReplies = quickReplies;

                let newOptions = {
                    uri    :`${baseUrl}/${module}`,
                    method :'PUT',
                    headers:{
                        'Authorization':authToken
                    },
                    json   :true
                };

                newOptions.body = {
                    node:{
                        botActions:newAction
                    }
                };

                return request(newOptions);
            })
            .then(response => {
                console.log("response() : ", response);
            })
            .catch(err => {
                console.log("ERRROR() : ", err);
            });

    });
});

init();