#/* passwords change; authKey secKey */

-- one server 3 different pools - Etnx Etnxp Masari

USE pool1;


-- REPLACE INTO pool.users (username, pass, email, admin, payout_threshold) VALUES ('Adm', '123', '123', 1, 1) ;
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('pool', 'maxDifficulty', '50000000', 'int', 'Maximum difficulty for VarDiff');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('pool', 'minDifficulty', '20000', 'int', 'Minimum difficulty for VarDiff');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('pool', 'varDiffVariance', '700', 'int', 'Percentage out of the target time that difficulty changes');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('pool', 'varDiffMaxChange', '3000', 'int', 'Percentage amount that the difficulty may change');
REPLACE INTO pool1.port_config (poolPort, difficulty, portDesc, portType, hidden, `ssl`) VALUES (5550, 80000, 'Medium-Range Hardware (160 h/s +)', 'pplns', 0, 0);
REPLACE INTO pool1.port_config (poolPort, difficulty, portDesc, portType, hidden, `ssl`) VALUES (7770, 100000, 'High-End Hardware (Anything else!)', 'pplns', 0, 0);
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('api','authKey','00007CfqiQLxMUD8GAtNBiAxTRdYI656','string','Auth key sent with all Websocket frames for validation.');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('api','secKey','00007CfqiQLxMUD8GAtNBiAxTRdYI656','string','sec key .');
-- REPLACE INTO pool.config (module, item, item_value, item_type, Item_desc) VALUES ('api','authKey','','string','Auth key sent with all Websocket frames for validation.');
-- REPLACE INTO pool.config (module, item, item_value, item_type, Item_desc) VALUES ('api','secKey','','string','sec key .');
-- 38081 port - Masari
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'address', '127.0.0.1', 'string', 'Monero Daemon RPC IP');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'port', '38081', 'int', 'Masari Daemon RPC Port');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'activePort', '38081', 'int', 'Masari Daemon RPC Port');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'activePortMSR', '38081', 'int', 'Masari Daemon RPC Port');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('pool','address','5nJHfA7Q1a6DnX6EzHCzwDVQQP3TijyVhYXrT9ii3jhaQMf3t56qUhNgH23oTaABoQDWWDwE6J8YcWfXwGhAExNa1Ki9Hjk','string','a');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('pool','feeAddress','5hvLre4ry2MALdUE7wF2TDj5EHGsnuMWWVwjuP1fX3oaMAxkZfc6FEcLoW3ZsYPZmEQ7yUAqpnScsN9D4eQ2PptZ5e1DGKQ','string','A.');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('payout','feeAddress','5hvLre4ry2MALdUE7wF2TDj5EHGsnuMWWVwjuP1fX3oaMAxkZfc6FEcLoW3ZsYPZmEQ7yUAqpnScsN9D4eQ2PptZ5e1DGKQ','string','A.');
-- remote address - receive shares (or local) For leaf pool - correct domain name + port access (firewall)
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('general','shareHost','http://127.0.0.1:8000/leafApi','string','api');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'activePortRYO',  '0', 'int', 'Ryo coin daemon RPC port or 0');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'activePortLOKI', '0', 'int', 'Loki coin daemon RPC port or 0');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'activePortXRN', '0', 'int', 'Saronite coin daemon RPC port or 0');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'activePortWOW', '0', 'int', 'Wownero coin daemon RPC port or 0');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'activePortTUBE', '0', 'int', 'BitTube coin daemon RPC port or 0');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'activePortXHV',  '0', 'int', 'Haven coin daemon RPC port or 0');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'activePortAEON', '0', 'int', 'Aeon coin daemon RPC port or 0');
-- REPLACE INTO pool.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'activePortMSR',  '0', 'int', 'Masari coin daemon RPC port or 0');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'activePortXTL',  '0', 'int', 'Stellite coin daemon RPC port or 0');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'activePortLTHN',  '0', 'int', 'Lethean coin daemon RPC port or 0');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'activePortGRFT',  '0', 'int', 'Graft coin daemon RPC port or 0');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'activePortTRTL',  '0', 'int', 'Turtle coin daemon RPC port or 0');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'coinHashFactorRYO',  '0', 'float', 'Ryo algo hash price factor relative to coinHashFactor');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'coinHashFactorLOKI', '0', 'float', 'Loki algo hash price factor relative to coinHashFactor');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'coinHashFactorXRN', '0', 'float', 'Saronite algo hash price factor relative to coinHashFactor');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'coinHashFactorWOW', '0', 'float', 'Wownero algo hash price factor relative to coinHashFactor');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'coinHashFactorTUBE', '0', 'float', 'BitTube algo hash price factor relative to coinHashFactor');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'coinHashFactorXHV',  '0', 'float', 'Haven algo hash price factor relative to coinHashFactor');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'coinHashFactorAEON', '0', 'float', 'Aeon algo hash price factor relative to coinHashFactor');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'coinHashFactorMSR',  '0', 'float', 'Masari algo hash price factor relative to coinHashFactor');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'coinHashFactorXTL',  '0', 'float', 'Stellite algo hash price factor relative to coinHashFactor');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'coinHashFactorLTHN',  '0', 'float', 'Lethean algo hash price factor relative to coinHashFactor');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'coinHashFactorGRFT',  '0', 'float', 'Graft algo hash price factor relative to coinHashFactor');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'coinHashFactorTRTL',  '0', 'float', 'Turtle algo hash price factor relative to coinHashFactor');
REPLACE INTO pool1.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'enableAlgoSwitching', 'false', 'bool', 'Enable smart miners (need additional altblockManager module)');
