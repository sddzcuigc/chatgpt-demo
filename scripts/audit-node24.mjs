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

function majorOf(value) {
  const match = String(value ?? '').match(/(?:^|\D)(\d{1,2})(?:\.x|\.\d+|$)/);
  return match ? Number(match[1]) : null;
}

function findEvidencePath() {
  const index = process.argv.indexOf('--evidence');
  return index >= 0 ? process.argv[index + 1] : null;
}

const packageJson = JSON.parse(read('package.json'));
record(
  'package.json engines.node',
  packageJson.engines?.node === '>=24 <25',
  `expected ">=24 <25", got ${JSON.stringify(packageJson.engines?.node ?? null)}`,
);

for (const path of ['.nvmrc', '.node-version']) {
  record(path, existsSync(resolve(root, path)) && read(path) === '24', 'expected file value "24"');
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

const evidencePath = findEvidencePath();
if (evidencePath) {
  if (!existsSync(resolve(root, evidencePath))) {
    record('evidence file', false, `file not found: ${evidencePath}`);
  } else {
    const evidence = JSON.parse(read(evidencePath));
    const requiredSignals = [
      ['repositoryDeclaration', evidence.repositoryDeclaration],
      ['localRuntime', evidence.localRuntime],
      ['vercelProjectSetting', evidence.vercelProjectSetting],
      ['vercelBuildRuntime', evidence.vercelBuildRuntime],
    ];

    for (const [name, value] of requiredSignals) {
      record(`evidence.${name}`, majorOf(value) === 24, `expected Node 24.x evidence, got ${JSON.stringify(value ?? null)}`);
    }

    record(
      'evidence deployment',
      Boolean(evidence.deploymentId && evidence.deploymentUrl && evidence.checkedAt),
      'deploymentId, deploymentUrl and checkedAt are required',
    );
  }
}

console.log(JSON.stringify({
  status: failures.length === 0 ? 'pass' : 'fail',
  runtime: process.versions.node,
  evidencePath,
  checks,
}, null, 2));

if (failures.length) {
  console.error('\nNode.js 24 baseline violations:\n- ' + failures.join('\n- '));
  process.exit(1);
}
