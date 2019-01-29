{
  "targets": [
    {
      "target_name": "node-lmdb",
	  'win_delay_load_hook': 'false',
      "sources": [
        "dependencies/lmdb/libraries/liblmdb/mdb.c",
        "dependencies/lmdb/libraries/liblmdb/midl.c",
        "src/node-lmdb.cpp",
        "src/env.cpp",
        "src/misc.cpp",
        "src/txn.cpp",
        "src/dbi.cpp",
        "src/cursor.cpp"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "dependencies/lmdb/libraries/liblmdb"
      ],
          "cflags": [
            "-fPIC",
            "-O3",
            "-D_WANT_SEMUN"
          ],
          "cflags_cc": [
            "-fvisibility-inlines-hidden",
            "-std=c++0x",
            "-D_WANT_SEMUN"
          ],
      "conditions": [
        ["OS=='linux'", {
          "ldflags": [
            "-O3",
            "-rdynamic"
          ],
          "cflags": [
            "-fPIC",
            "-O3",
            "-D_WANT_SEMUN"
          ],
          "cflags_cc": [
            "-fvisibility-inlines-hidden",
            "-std=c++0x",
            "-D_WANT_SEMUN"
          ]
        }],
        ["OS=='mac'", {
          "xcode_settings": {
            "OTHER_CPLUSPLUSFLAGS" : ["-std=c++11"],
            "MACOSX_DEPLOYMENT_TARGET": "10.7",
            "OTHER_LDFLAGS": ["-std=c++11"],
            "CLANG_CXX_LIBRARY": "libc++"
          }
        }],
		["OS=='win'", {
			"libraries": ["ntdll.lib"]
		}],
      ],
    }
  ]
}
