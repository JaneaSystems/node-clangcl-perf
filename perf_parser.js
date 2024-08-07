const fs = require('fs');

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

const sortData = (data) =>
  data.sort((item1, item2) => {
    if (item1.confidence > item2.confidence) {
      return -1;
    } else if (item1.confidence < item2.confidence) {
      return 1;
    } else {
      if (item1.improvement > item2.improvement) {
        return -1;
      } else if (item1.improvement < item2.improvement) {
        return 1;
      } else {
        return 0;
      }
    }
  });

const data = [];
const confidences = {};
for (const category of categories) {
  try {
    const categoryLines = fs
      .readFileSync(`..\\_benchmark\\${category}.txt`)
      .toString()
      .split('\r\n')
      .slice(1, -8);
    const categoryData = categoryLines.map((line) => {
      const chunks = line.split(' ').filter(Boolean);
      const confidenceString = chunks[chunks.length - 1 - 5];
      const confidence =
        confidenceString.startsWith('*') && confidenceString.endsWith('*')
          ? confidenceString.length
          : 0;
      const improvementString = chunks[chunks.length - 1 - 4];
      const improvement = +improvementString;
      if (!confidences[confidence]) {
        confidences[confidence] = [];
      }
      confidences[confidence].push(improvement);
      return { line, confidence, improvement };
    });
    data.push(...categoryData);
    const categorySortedData = sortData(categoryData);
    const categoryText = categorySortedData.reduce(
      (txt, dat) => (txt ? `${txt}\r\n${dat.line}` : dat.line),
      ''
    );
    fs.writeFileSync(`..\\_benchmark\\${category}_res.txt`, categoryText);
  } catch (e) {}
}

for (const [confidence, improvements] of Object.entries(confidences)) {
  const sum = improvements.reduce((sum, val) => sum + val, 0);
  const avg = sum / improvements.length;
  console.log(
    `Confidence level ${confidence} has ${improvements.length} benchamrks and an an average improvement of ${avg.toFixed(2)} %`
  );
}
