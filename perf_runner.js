const cp = require('child_process');

const runs = 10;
const categories = [
  'abort_controller',
  'assert',
  'async_hooks',
  'blob',
  'buffers',
  'child_process',
  'cluster',
  'crypto',
  'dgram',
  'diagnostics_channel',
  'dns',
  'domain',
  'error',
  'es',
  'esm',
  'events',
  'fs',
  'http',
  'http2',
  'https',
  'mime',
  'misc',
  'module',
  'napi',
  'net',
  'os',
  'path',
  'perf_hooks',
  'permission',
  'process',
  'querystring',
  'readline',
  'streams',
  'string_decoder',
  'test_runner',
  'timers',
  'tls',
  'url',
  'util',
  'v8',
  'validators',
  'vm',
  'websocket',
  'webstreams',
  'worker',
  'zlib',
];

console.log(`${new Date()} - Running benchmarks`);

for (const category of categories) {
  try {
    console.log(`${new Date()} - Running benchmark for ${category}`);
    cp.execSync(
      `node .\\benchmark\\compare.js --new ..\\_benchmark\\node_clang_release.exe --old ..\\_benchmark\\node_msvc_release.exe --runs ${runs} ${category} > ..\\_benchmark\\${category}.csv 2> nul`
    );

    try {
      console.log(
        `${new Date()} - Running benchmark comparison for ${category}`
      );
      cp.execSync(
        `rscript .\\benchmark\\compare.R < ..\\_benchmark\\${category}.csv > ..\\_benchmark\\${category}.txt`
      );
    } catch (e) {
      console.log(
        `${new Date()} - ERROR while running benchmark comparison for ${category}: ${e}`
      );
    } finally {
      console.log(
        `${new Date()} - Finished benchmark comparison for ${category}`
      );
    }
  } catch (e) {
    console.log(
      `${new Date()} - ERROR while running benchmark for ${category}: ${e}`
    );
  } finally {
    console.log(`${new Date()} - Finished benchmark for ${category}`);
  }
}

console.log(`${new Date()} - Finished benchmarks`);
