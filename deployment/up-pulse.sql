USE pool;


REPLACE INTO pool.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'address', '127.0.0.1', 'string', 'Monero Daemon RPC IP') ;
REPLACE INTO pool.config (module, item, item_value, item_type, Item_desc) VALUES ('daemon', 'port', '20393', 'int', 'Monero Daemon RPC Port') ;
REPLACE INTO pool.config (module, item, item_value, item_type, Item_desc) VALUES ('wallet', 'port', '20394', 'int', 'Monero Daemon RPC Wallet Port') ;
REPLACE INTO pool.config (module, item, item_value, item_type, Item_desc) VALUES ('general', 'coinCode', 'ETNXP', 'string', 'Coincode to be loaded up w/ the shapeshift getcoins argument.') ;
REPLACE INTO pool.config (module, item, item_value, item_type, Item_desc) VALUES ('pool', 'address_20393', '', 'string', 'Address to mine to for 20393 (ETNXP) port.');
REPLACE INTO pool.users (username, pass, email, admin, payout_threshold) VALUES ('Adm', '123', '123', 1, 0) ;
