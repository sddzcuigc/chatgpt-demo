import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const failures = [];
const checks = [];

function record(name, ok, detail) {
  checks.push({ name, ok, detail });
  if (!ok) failures.push(`${name}: ${detail}`);
}

function read(path) {
  return readFileSync(resolve(root, path), 'utf8').trim();
}

const packageJson = JSON.parse(read('package.json'));
record(
  'package.json engines.node',
  packageJson.engines?.node === '>=24 <25',
  `expected ">=24 <25", got ${JSON.stringify(packageJson.engines?.node ?? null)}`,
);

for (const path of ['.nvmrc', '.node-version']) {
  record(path, existsSync(resolve(root, path)) && read(path) === '24', `expected file value "24"`);
}

const textFiles = [
  '.github/workflows/node24.yml',
  'vercel.json',
  'Dockerfile',
].filter((path) => existsSync(resolve(root, path)));

const forbidden = [
  /node-version\s*:\s*['"]?(18|20|22)(?:\.x)?['"]?/i,
  /FROM\s+node:(18|20|22)(?:\b|[-.])/i,
  /"node"\s*:\s*"[^"]*(18|20|22)[^"]*"/i,
];

for (const path of textFiles) {
  const content = read(path);
  const hit = forbidden.find((pattern) => pattern.test(content));
  record(path, !hit, hit ? `contains forbidden non-24 Node declaration matching ${hit}` : 'no forbidden Node 18/20/22 declaration');
}

const runtimeMajor = Number(process.versions.node.split('.')[0]);
record('actual runtime', runtimeMajor === 24, `running Node ${process.versions.node}; expected major 24`);

console.log(JSON.stringify({
  status: failures.length === 0 ? 'pass' : 'fail',
  runtime: process.versions.node,
  checks,
}, null, 2));

if (failures.length) {
  console.error('\nNode.js 24 baseline violations:\n- ' + failures.join('\n- '));
  process.exit(1);
}
