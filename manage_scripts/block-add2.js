"use strict";

const argv = require('minimist')(process.argv.slice(2));

//if (!argv.height) {
//	console.log("Please specify block height arg1 ");
	// process.exit(1);
//}
//const height = argv.height;

//if (!argv.body) {
//	console.log("Please specify block body");
//	process.exit(1);
//}
const body = argv.body;

    const body2 = {
        hash: "86c2211fc4e83215aeb4555fdd4b644e70ea89065b100d0e17d787f84be4d450",
        difficulty: 10574249777,
        shares: 1,
        timestamp: 1542938179000,  // Date.now(),
        poolType: 0, //global.protos.POOLTYPE.PPLNS,
        unlocked: false,
        valid: true,
        port: 38081,
        value:19283148696420,
        paymentAddress:"5hvLre4ry2MALdUE7wF2TDj5EHGsnuMWWVwjuP1fX3oaMAxkZfc6FEcLoW3ZsYPZmEQ7yUAqpnScsN9D4eQ2PptZ5e1DGKQ",
        worker:"x"
    };
 const height=316867;

//try { body2 = JSON.parse(body); } catch(e) {
//	console.log("Can't parse arg2 json block body: " + body);
	// process.exit(1);
//}


require("../init_mini.js").init(function() {
	const body3 = {
		"hash":       body2.hash,
		"difficulty": body2.difficulty,
		"shares":     body2.shares,
		"timestamp":  body2.timestamp,
		"poolType":   body2.poolType,
		"unlocked":   body2.unlocked,
		"port":       body2.port,
		"valid":      body2.valid,
		"value":      body2.value,
                "paymentAddress":      body2.paymentAddress,
		"worker":     body2.worker
	};
	if (typeof (body3.hash) === 'undefined' ||
	    typeof (body3.difficulty) === 'undefined' ||
	    typeof (body3.shares) === 'undefined' ||
	    typeof (body3.timestamp) === 'undefined' ||
	    typeof (body3.poolType) === 'undefined' ||
	    typeof (body3.unlocked) === 'undefined' ||
	    typeof (body3.valid) === 'undefined' ||
	    typeof (body3.value) === 'undefined') {
		console.error("Block body is invalid: " + JSON.stringify(body3));
		process.exit(1);
        }
	const body4 = global.protos.Block.encode(body3);
        let txn = global.database.env.beginTxn();
	txn.putBinary(global.database.blockDB, height, body4);
        txn.commit();
	console.log("Block on " + height + " added! Exiting!");
	process.exit(0);
});
