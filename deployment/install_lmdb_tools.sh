#!/usr/local/env bash
cd ~
git clone https://github.com/LMDB/lmdb
cd lmdb
git checkout 4d2154397afd90ca519bfa102b2aad515159bd50
cd libraries/liblmdb/
make -j  2 
#FreeBSD 11.1+
make -C /usr/ports/databases/lmdb install
#`nproc`
mkdir ~/.bin
echo ' ' >> ~/.bashrc
echo 'export PATH=~/.bin:$PATH' >> ~/.bashrc
for i in mdb_copy mdb_dump mdb_load mdb_stat; do cp $i ~/.bin/; done
echo "Please run source ~/.bashrc to initialize the new LMDB tools.  Thanks for flying Snipa22 Patch Services."
