"use strict";
let mysql = require("promise-mysql");
let fs = require("fs");
let argv = require('minimist')(process.argv.slice(2));
let config = fs.readFileSync("../config.json");
let coinConfig = fs.readFileSync("../coinConfig.json");
let protobuf = require('protocol-buffers');
const request = require('request');

global.support = require("../lib/support.js")();
global.config = JSON.parse(config);
global.mysql = mysql.createPool(global.config.mysql);
global.protos = protobuf(fs.readFileSync('../lib/data.proto'));
let comms;
let coinInc;


// Config Table Layout
// <module>.<item>

global.mysql.query("SELECT * FROM config").then(function (rows) {
    rows.forEach(function (row){
        if (!global.config.hasOwnProperty(row.module)){
            global.config[row.module] = {};
        }
        if (global.config[row.module].hasOwnProperty(row.item)){
            return;
        }
        switch(row.item_type){
            case 'int':
                global.config[row.module][row.item] = parseInt(row.item_value);
                break;
            case 'bool':
                global.config[row.module][row.item] = (row.item_value === "true");
                break;
            case 'string':
                global.config[row.module][row.item] = row.item_value;
                break;
            case 'float':
                global.config[row.module][row.item] = parseFloat(row.item_value);
                break;
        }
    });
}).then(function(){
    global.config['coin'] = JSON.parse(coinConfig)[global.config.coin];
    coinInc = require("." + global.config.coin.funcFile);
    global.coinFuncs = new coinInc();
    if (argv.module === 'pool'){
        comms = require('../lib/remote_comms');
    } else {
        comms = require('../lib/local_comms');
    }
    global.database = new comms();
    global.database.initEnv();
    global.coinFuncs.blockedAddresses.push(global.config.pool.address);
    global.coinFuncs.blockedAddresses.push(global.config.payout.feeAddress);
}).then(function(){
    /*
     message Block {
     required string hash = 1;
     required int64 difficulty = 2;
     required int64 shares = 3;
     required int64 timestamp = 4;
     required POOLTYPE poolType = 5;
     required bool unlocked = 6;
     required bool valid = 7;
     optional int64 value = 8;
     }
     */
    let b321428 = global.protos.Block.encode({
        hash: "4cdbf2d1570dc930eef18b5e319a7735f635bfffc48f2dfc5a90c42abc3dc2d4",
        difficulty: 10574249777,
        shares: 1,
        timestamp: 1543484613,
        poolType: 0,
        unlocked: false,
        valid: true,
        value: 19165676678443
    });
    let wsData = global.protos.WSData.encode({
        msgType: global.protos.MESSAGETYPE.BLOCK,
        key: global.config.api.authKey,
        msg: b321428,
        exInt: 1
    });
    request.post({url: global.config.general.shareHost, body: wsData}, function (error, response, body) {
        console.log(error);
        console.log(JSON.stringify(response));
        console.log(JSON.stringify(body));
        console.log(JSON.stringify(wsData));
    });
//process.exit (0);

});