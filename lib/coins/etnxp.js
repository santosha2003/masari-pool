"use strict";
const bignum = require('bignum');
const cnUtil = require('cryptonote-util');
const multiHashing = require('cryptonight-hashing');
const crypto = require('crypto');
const debug = require('debug')('coinFuncs');
const process = require('process');

let hexChars = new RegExp("[0-9a-f]+");

var reXMRig = /XMRig\/(\d+)\.(\d+)\./;
var reXMRSTAK = /xmr-stak(?:-[a-z]+)\/(\d+)\.(\d+)/;
var reXMRSTAK2 = /xmr-stak(?:-[a-z]+)\/(\d+)\.(\d+)\.(\d+)/;
var reXNP = /xmr-node-proxy\/(\d+)\.(\d+)\.(\d+)/;
var reCCMINER = /ccminer-cryptonight\/(\d+)\.(\d+)/;
                                                    
function Coin(data){
    this.bestExchange = global.config.payout.bestExchange;
    this.data = data;
    //let instanceId = crypto.randomBytes(4);
    let instanceId = new Buffer(4);
    instanceId.writeUInt32LE( ((global.config.pool_id % (1<<16)) << 16) + (process.pid  % (1<<16)) );
    console.log("Generated instanceId: " + instanceId.toString('hex'));
    this.coinDevAddress = "etnkHfFuanNeTe3q9dux4d9cRiLkUR4hDffvhfTp6nbhEJ5R8TY4vdyZjT4BtWxnvSJ5nfD64eCAQfKMJHSym2dj8PQqeiKmBM";  // ETNX Developers Address
    this.poolDevAddress = "etnkHfFuanNeTe3q9dux4d9cRiLkUR4hDffvhfTp6nbhEJ5R8TY4vdyZjT4BtWxnvSJ5nfD64eCAQfKMJHSym2dj8PQqeiKmBM";  // ETNX Address

    this.blockedAddresses = [
        this.coinDevAddress,
        this.poolDevAddress
    ];

    this.exchangeAddresses = [
    ]; // These are addresses that MUST have a paymentID to perform logins with.

    this.prefix = 18018;
    this.subPrefix = 42;
    this.intPrefix = 18019;

    if (global.config.general.testnet === true){
        this.prefix = 18018;
        this.subPrefix = 42;
        this.intPrefix = 18019;
    }

    this.supportsAutoExchange = true;

    this.niceHashDiff = 400000;

    this.getPortBlockHeaderByID = function(port, blockId, callback){
        global.support.rpcPortDaemon(port, 'getblockheaderbyheight', {"height": blockId}, function (body) {
            if (body.hasOwnProperty('result')){
                return callback(null, body.result.block_header);
            } else {
                console.error(JSON.stringify(body));
                return callback(true, body);
            }
        });
    };

    this.getBlockHeaderByID = function(blockId, callback){
        return this.getPortBlockHeaderByID(global.config.daemon.port, blockId, callback);
    };

    this.getPortBlockHeaderByHash = function(port, blockHash, callback){
        global.support.rpcPortDaemon(port, 'getblock', {"hash": blockHash}, function (body) {
            if (typeof(body) !== 'undefined' && body.hasOwnProperty('result')) {
                if (port != 20189 && port != 48782 && port != 11181 && port != 22023) { // Stellite/Intense/Aeon/loki have composite based miner_tx
                    const blockJson = JSON.parse(body.result.json);
                    body.result.block_header.reward = 0;

                    const minerTx = blockJson.miner_tx;

                    for (var i=0; i<minerTx.vout.length; i++) {
                        if (minerTx.vout[i].amount > body.result.block_header.reward) {
                            body.result.block_header.reward = minerTx.vout[i].amount;
                        }
                    }
                }
                else if (port == 22023) { // Stellite/Intense/Aeon have composite based miner_tx
                    const blockJson = JSON.parse(body.result.json);
                    body.result.block_header.reward = 0;

                    const minerTx = blockJson.miner_tx;

                    body.result.block_header.reward = minerTx.vout[0].amount;
                }
                return callback(null, body.result.block_header);
            } else {
                console.error(JSON.stringify(body));
                return callback(true, body);
            }
        });
    };

    this.getBlockHeaderByHash = function(blockHash, callback){
        return this.getPortBlockHeaderByHash(global.config.daemon.port, blockHash, callback);
    };

    this.getPortInfoLastBlockHeader = function(port, callback){ // this func is for worker
		let getInfo;
		global.support.rpcPortDaemon(port, 'get_info', [], function (body) {
            if (typeof(body) !== 'undefined' && body.hasOwnProperty('result')){
                getInfo = body.result;
            } else {
                console.error(JSON.stringify(body));
            }
			global.support.rpcPortDaemon(port, 'getlastblockheader', [], function (body) {
				if (typeof(body) !== 'undefined' && body.hasOwnProperty('result')){
					if (getInfo) {
						body.result.block_header.height = getInfo.height;
						body.result.block_header.difficulty = getInfo.difficulty;
					}
					return callback(null, body.result.block_header);
				} else {
					console.error(JSON.stringify(body));
					return callback(true, body);
				}
			});
        });
    };
	
    this.getPortLastBlockHeader = function(port, callback){
          let getInfo;
          global.support.rpcPortDaemon(port, 'get_info', [], function (body) {
            if (typeof(body) !== 'undefined' && body.hasOwnProperty('result')){
                getInfo = body.result;
            } else {
                console.error(JSON.stringify(body));
            }
          global.support.rpcPortDaemon(port, 'getlastblockheader', [], function (body) {
            if (typeof(body) !== 'undefined' && body.hasOwnProperty('result')){
                if (getInfo) {
                       body.result.block_header.height = getInfo.height;
                       body.result.block_header.difficulty = getInfo.difficulty;
                }
                //console.log("alternate height: " + body.result.block_header.height);
                return callback(null, body.result.block_header);
            } else {
                //console.log("alternate height error: " + body.result.block_header.height);
                console.error(JSON.stringify(body));
                return callback(true, body);
            }
        });
      });
    };

    this.getLastBlockHeader = function(callback){
        return this.getPortLastBlockHeader(global.config.daemon.port, callback);
    };
	
    this.getPortBlockTemplate = function(port, callback){
        global.support.rpcPortDaemon(port, 'getblocktemplate', {
            reserve_size: 17,
            wallet_address: global.config.pool[port == global.config.daemon.port ? "address" : "address_" + port.toString()]
        }, function(body){
            return callback(body);
        });
    };

    this.getBlockTemplate = function(callback){
        return this.getPortBlockTemplate(global.config.daemon.port, callback);
    };

    this.baseDiff = function(){
        return bignum('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16);
    };

    this.validatePlainAddress = function(address){
        // This function should be able to be called from the async library, as we need to BLOCK ever so slightly to verify the address.
        address = new Buffer(address);
        let code = cnUtil.address_decode(address);
        return code === this.prefix || code === this.subPrefix;
    };

    this.validateAddress = function(address){
        if (this.validatePlainAddress(address)) return true;
        // This function should be able to be called from the async library, as we need to BLOCK ever so slightly to verify the address.
        address = new Buffer(address);
        return cnUtil.address_decode_integrated(address) === this.intPrefix;
    };

    this.portBlobType = function(port, version) {
        switch (port) {
            case 12211: return 4; // RYO
            case 22023: return version >= 9 ? 5 : 0; // LOKI
            case 38081: return 3; // MSR
	     case 12090: return 3; // ETNX
            case 21090: return 3; // ETNXP
            default:    return 0;
        }
    }

    this.convertBlob = function(blobBuffer, port){
        return cnUtil.convert_blob(blobBuffer, this.portBlobType(port, blobBuffer[0]));
    };

    this.constructNewBlob = function(blockTemplate, NonceBuffer, port){
        return cnUtil.construct_block_blob(blockTemplate, NonceBuffer, this.portBlobType(port, blockTemplate[0]));
    };

    this.getBlockID = function(blockBuffer, port){
        return cnUtil.get_block_id(blockBuffer, this.portBlobType(port, blockBuffer[0]));
    };

    this.BlockTemplate = function(template) {
        /*
        Generating a block template is a simple thing.  Ask for a boatload of information, and go from there.
        Important things to consider.
        The reserved space is 16 bytes long now in the following format:
        Assuming that the extraNonce starts at byte 130:
        |130-133|134-137|138-141|142-145|
        |minerNonce/extraNonce - 4 bytes|instanceId - 4 bytes|clientPoolNonce - 4 bytes|clientNonce - 4 bytes|
        This is designed to allow a single block template to be used on up to 4 billion poolSlaves (clientPoolNonce)
        Each with 4 billion clients. (clientNonce)
        While being unique to this particular pool thread (instanceId)
        With up to 4 billion clients (minerNonce/extraNonce)
        Overkill?  Sure.  But that's what we do here.  Overkill.
         */

        // Set this.blob equal to the BT blob that we get from upstream.
        this.blob = template.blocktemplate_blob;
        this.idHash = crypto.createHash('md5').update(template.blocktemplate_blob).digest('hex');
        // Set this.diff equal to the known diff for this block.
        this.difficulty = template.difficulty;
        // Set this.height equal to the known height for this block.
        this.height = template.height;
        // Set this.reserveOffset to the byte location of the reserved offset.
        this.reserveOffset = template.reserved_offset;
        // Set this.buffer to the binary decoded version of the BT blob.
        this.buffer = new Buffer(this.blob, 'hex');
        // Copy the Instance ID to the reserve offset + 4 bytes deeper.  Copy in 4 bytes.
        instanceId.copy(this.buffer, this.reserveOffset + 4, 0, 4);
        // Generate a clean, shiny new buffer.
        this.previous_hash = new Buffer(32);
        // Copy in bytes 7 through 39 to this.previous_hash from the current BT.
        this.buffer.copy(this.previous_hash, 0, 7, 39);
        // Reset the Nonce. - This is the per-miner/pool nonce
        this.extraNonce = 0;
        // The clientNonceLocation is the location at which the client pools should set the nonces for each of their clients.
        this.clientNonceLocation = this.reserveOffset + 12;
        // The clientPoolLocation is for multi-thread/multi-server pools to handle the nonce for each of their tiers.
        this.clientPoolLocation = this.reserveOffset + 8;
        // this is current algo type
        this.algo = template.algo;
        // this is current daemon port
        this.port = template.port;
        this.nextBlob = function () {
            // Write a 32 bit integer, big-endian style to the 0 byte of the reserve offset.
            this.buffer.writeUInt32BE(++this.extraNonce, this.reserveOffset);
            // Convert the blob into something hashable.
            return global.coinFuncs.convertBlob(this.buffer, this.port).toString('hex');
        };
        // Make it so you can get the raw block blob out.
        this.nextBlobWithChildNonce = function () {
            // Write a 32 bit integer, big-endian style to the 0 byte of the reserve offset.
            this.buffer.writeUInt32BE(++this.extraNonce, this.reserveOffset);
            // Don't convert the blob to something hashable.  You bad.
            return this.buffer.toString('hex');
        };
    };

    // returns true if algo array reported by miner is OK or error string otherwise
    this.algoCheck = function(algos) {
        return algos.includes("cn/1") || algos.includes("cn/2") || algos.includes("cryptonight/1") || algos.includes("cryptonight/2") ?
               true : "algo array should include cn/1, cn/2, cryptonight/1 or cryptonight/2";
    }

    this.cryptoNight = function(convertedBlob, port) {
        switch (port) {
            case 11181: return multiHashing.cryptonight_light(convertedBlob, 1); // Aeon
            case 12211: return multiHashing.cryptonight_heavy(convertedBlob, 0); // RYO
            case 17750: return multiHashing.cryptonight_heavy(convertedBlob, 1); // Haven
            case 18081: return multiHashing.cryptonight(convertedBlob, convertedBlob[0] >= 8 ? 8 : 1); // XMR
            case 20189: return multiHashing.cryptonight(convertedBlob, 3);       // Stellite
            case 22023: return multiHashing.cryptonight_heavy(convertedBlob, 0); // LOKI
            case 24182: return multiHashing.cryptonight_heavy(convertedBlob, 2); // BitTube
            case 38081: return multiHashing.cryptonight(convertedBlob, 4);       // MSR
            case 12090: return multiHashing.cryptonight(convertedBlob, 4);       // ETNX
            case 21090: return multiHashing.cryptonight(convertedBlob, 4);       // ETNXP
            default:    return multiHashing.cryptonight(convertedBlob, 1);
        }
    }

    this.blobTypeStr = function(port, version) {
        switch (port) {
            case 12211: return "cryptonote_ryo";  // RYO
            case 22023: return version >= 9 ? "cryptonote_loki" : "cryptonote"; // LOKI
            case 38081: return "cryptonote2";     // MSR
            case 12090: return "cryptonote2";     // ETNX
            case 21090: return "cryptonote2";     // ETNXP
            default:    return "cryptonote";
        }
    }

    this.algoTypeStr = function(port, version) {
        switch (port) {
            case 11181: return "cryptonight-lite/1";     // Aeon
            case 12211: return "cryptonight-heavy/0";    // RYO
            case 17750: return "cryptonight-heavy/xhv";  // Haven
            case 18081: return version >= 8 ? "cryptonight/2" : "cryptonight/1"; // XMR
            case 20189: return "cryptonight/xtl";        // Stellite
            case 22023: return "cryptonight-heavy/0";    // LOKI
            case 24182: return "cryptonight-heavy/tube"; // BitTube
            case 38081: return "cryptonight/msr";        // MSR
            case 12090: return "cryptonight/msr";        // ETNX
            case 21090: return "cryptonight/msr";        // ETNXP
            default:    return "cryptonight/1";
        }
    }

    this.algoShortTypeStr = function(port, version) {
        switch (port) {
            case 11181: return "cn-lite/1";     // Aeon
            case 12211: return "cn-heavy/0";    // RYO
            case 17750: return "cn-heavy/xhv";  // Haven
            case 18081: return version >= 8 ? "cn/2" : "cn/1"; // XMR
            case 20189: return "cn/xtl";        // Stellite
            case 22023: return "cn-heavy/0";    // LOKI
            case 24182: return "cn-heavy/tube"; // BitTube
            case 38081: return "cn/msr";        // MSR
            case 12090: return "cn/msr";        // ETNX
            case 21090: return "cn/msr";        // ETNXP
            default:    return "cn/1";
        }
    }

    this.variantValue = function(port, version) {
        switch (port) {
            case 12211: return "0";    // RYO
            case 17750: return "xhv";  // Haven
            case 18081: return version >= 8 ? "2" : "1";    // XMR
            case 20189: return "xtl";  // Stellite
            case 22023: return "0";    // LOKI
            case 24182: return "tube"; // BitTube
            case 38081: return "msr";  // MSR
            case 12090: return "msr";  // ETNX
            case 21090: return "msr";  // ETNXP
            default:    return "1";
        }
    }

    this.isMinerSupportPortAlgo = function(port, algos, version) {
        if (this.algoShortTypeStr(port, version) in algos || this.algoTypeStr(port, version) in algos) return true;
        switch (port) {
            case 12211: // RYO
            case 22023: // LOKI
                return "cryptonight-heavy" in algos || "cn-heavy" in algos;
            default: return false;
        }
    }

    this.get_miner_agent_notification = function(agent) {
        let m;
        if (m = reXMRig.exec(agent)) {
            let majorv = parseInt(m[1]) * 100;
            let minorv = parseInt(m[2]);
            if (majorv + minorv < 205) {
                return "Please update your XMRig miner (" + agent + ") to v2.6.1+";
            }
        } else if (m = reXMRSTAK.exec(agent)) {
            let majorv = parseInt(m[1]) * 100;
            let minorv = parseInt(m[2]);
            if (majorv + minorv < 203) {
                return "Please update your xmr-stak miner (" + agent + ") to v2.4.3+ (and use cryptonight_v7 in config)";
            }
        } else if (m = reXNP.exec(agent)) {
            let majorv = parseInt(m[1]) * 10000;
            let minorv = parseInt(m[2]) * 100;
            let minorv2 = parseInt(m[3]);
            if (majorv + minorv + minorv2 < 2) {
                return "Please update your xmr-node-proxy (" + agent + ") to version v0.3.0+ (from https://github.com/MoneroOcean/xmr-node-proxy repo)";
            }
        } else if (m = reCCMINER.exec(agent)) {
            let majorv = parseInt(m[1]) * 100;
            let minorv = parseInt(m[2]);
            if (majorv + minorv < 300) {
                return "Please update ccminer-cryptonight miner to v3.02+";
            }
        }
        return false;
    };
    
    this.get_miner_agent_warning_notification = function(agent) {
        let m;
        if (m = reXMRSTAK2.exec(agent)) {
            let majorv = parseInt(m[1]) * 10000;
            let minorv = parseInt(m[2]) * 100;
            let minorv2 = parseInt(m[3]);
            if (majorv + minorv + minorv2 < 20403) {
                return "Please update your xmr-stak miner (" + agent + ") to v2.4.3+ (and use cryptonight_v7 in config)";
            }
        } else if (m = reXNP.exec(agent)) {
            let majorv = parseInt(m[1]) * 10000;
            let minorv = parseInt(m[2]) * 100;
            let minorv2 = parseInt(m[3]);
            if (majorv + minorv + minorv2 < 200) {
                 return "Please update your xmr-node-proxy (" + agent + ") to version v0.2.0+ by doing 'cd xmr-node-proxy && ./update.sh' (or check https://github.com/MoneroOcean/xmr-node-proxy repo)";
            }
        }
        return false;
    };
}

module.exports = Coin;
