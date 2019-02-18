"use strict";

let range = require('range');
const args = require('minimist')(process.argv.slice(2));

let user;

if (!args.user) {
        console.error("Please specify user address to dump ");
 user = "5hvLre4ry2MALdUE7wF2TDj5EHGsnuMWWVwjuP1fX3oaMAxkZfc6FEcLoW3ZsYPZmEQ7yUAqpnScsN9D4eQ2PptZ5e1DGKQ";
    //    process.exit(1);
 } else {
    user = args.user;
        }

console.dir(args);
    console.log(args.user);

let worker;
if (args.worker) worker = args.worker;

let depth = 10;
if (args.depth) depth = args.depth;

require("../init_mini.js").init(function() {

        global.coinFuncs.getLastBlockHeader(function (err, body) {
                if (err !== null) {
                        console.error("Invalid block header");
                        process.exit(1);
                }
                let lastBlock = body.height + 1;
                let txn = global.database.env.beginTxn({readOnly: true});
                let cursor = new global.database.lmdb.Cursor(txn, global.database.shareDB);
                range.range(lastBlock, lastBlock - depth, -1).forEach(function (blockID) {
                        for (let found = (cursor.goToRange(parseInt(blockID)) === blockID); found; found = cursor.goToNextDup()) {
                                cursor.getCurrentBinary(function(key, data){  // jshint ignore:line
                                        let shareData = global.protos.Share.decode(data);
                                        if (shareData.paymentAddress === user && (!worker || shareData.identifier === worker)) {
                                                var d = new Date(shareData.timestamp);
                                                console.log(d.toString() + ": " + JSON.stringify(shareData))
                                        }
                                });
                        }
                });
                cursor.close();
                txn.commit();
                process.exit(0);
        });
});
