cmd_Release/obj.target/node-lmdb.node := c++ -shared -pthread -rdynamic -m64 -Wl,--export-dynamic  -Wl,-soname=node-lmdb.node -o Release/obj.target/node-lmdb.node -Wl,--start-group Release/obj.target/node-lmdb/dependencies/lmdb/libraries/liblmdb/mdb.o Release/obj.target/node-lmdb/dependencies/lmdb/libraries/liblmdb/midl.o Release/obj.target/node-lmdb/src/node-lmdb.o Release/obj.target/node-lmdb/src/env.o Release/obj.target/node-lmdb/src/misc.o Release/obj.target/node-lmdb/src/txn.o Release/obj.target/node-lmdb/src/dbi.o Release/obj.target/node-lmdb/src/cursor.o -Wl,--end-group -lelf
