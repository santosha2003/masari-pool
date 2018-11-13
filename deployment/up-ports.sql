USE pool;


REPLACE INTO pool.users (username, pass, email, admin, payout_threshold) VALUES ('Adm', 'x', 'root@santoshapro.me', 1, 1) ;
REPLACE INTO pool.config (module, item, item_value, item_type, Item_desc) VALUES ('pool', 'maxDifficulty', '5000000', 'int', 'Maximum difficulty for VarDiff');
REPLACE INTO pool.config (module, item, item_value, item_type, Item_desc) VALUES ('pool', 'minDifficulty', '1000', 'int', 'Minimum difficulty for VarDiff');
REPLACE INTO pool.config (module, item, item_value, item_type, Item_desc) VALUES ('pool', 'varDiffVariance', '200', 'int', 'Percentage out of the target time that difficulty changes');
REPLACE INTO pool.config (module, item, item_value, item_type, Item_desc) VALUES ('pool', 'varDiffMaxChange', '2000', 'int', 'Percentage amount that the difficulty may change');
REPLACE INTO pool.port_config (poolPort, difficulty, portDesc, portType, hidden, `ssl`) VALUES (5550, 80000, 'Medium-Range Hardware (160 h/s +)', 'pplns', 0, 0);
REPLACE INTO pool.port_config (poolPort, difficulty, portDesc, portType, hidden, `ssl`) VALUES (7770, 100000, 'High-End Hardware (Anything else!)', 'pplns', 0, 0);
