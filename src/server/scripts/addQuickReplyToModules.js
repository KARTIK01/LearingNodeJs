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

let botId = "587738297b88312de5b8537b";
let baseUrl = `http://chatteron.io/api/bots/${botId}/modules`;
let authToken = "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODc3MzdkODYwM2NmMjlkNzY4ZmM5NGIiLCJyb2xlcyI6W10sImlhdCI6MTQ4NDIwODA4OH0.iENQ2jL7cXchAC0l3NBm28Qjj7jba6zjmGI4iSI_sGI";


let modules = ["001"];

/** User's says **/
let quickReplies = {
    "dynamic":false, "items":[
        { "type":"text", "title":"Star Cast", "index":0 },
        { "type":"text", "title":"Songs", "index":1 },
        { "type":"text", "title":"Trailer", "index":2 },
        { "type":"text", "title":"Photo Gallery", "index":3 },
        { "type":"text", "title":"Director", "index":4 },
        { "type":"text", "title":"Producer", "index":5 },
        { "type":"text", "title":"Latest Movies", "index":6 },
    ]
};

let targets = ["022", "002", "004", "034", "035", "036", "039"];


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
                console.log("response1() : ", module, response);

                let options = {
                    uri    :`${baseUrl}/${module}/edges`,
                    method :'PUT',
                    headers:{
                        'Authorization':authToken
                    },
                    json   :true
                };

                let connections = _.map(quickReplies.items, (quickReply, index) => {
                    return {
                        source    :module,
                        target    :targets[index],
                        strict    :false,
                        activation:{
                            type      :"click",
                            button    :{ "param":{ "value":"" }, "items":[] },
                            quickReply:{ "param":{ "type":"text", "value":"" }, "items":[{ "title":quickReply.title }] }
                        }
                    };
                });
                options.body = {
                    edges:connections
                };

                return request(options);
            })
            .then(response => {
                console.log("response2() : ", module, response);
            })
            .catch(err => {
                console.log("ERRROR() : ", err);
            });

    });

    console.log("************************TASK DONE******************************");
});

init();