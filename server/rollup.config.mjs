// rollup.config.mjs
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json'); // ✅ works without import assertion

const normalize = (p) => path.posix.normalize(p);

const entries = [
  'src/bin/www.ts',
  'src/app.ts',
  'src/routes/index.ts',
  'src/routes/users.ts',
  'src/routes/tasks.ts'
];

export default entries.map(entry => ({
  input: normalize(entry),
  output: {
    file: normalize(entry.replace('src', 'dist').replace('.ts', '.js')),
    format: 'esm',
    sourcemap: true
  },
  external: [
    ...Object.keys(pkg.dependencies || {}),
    'path',
    'http',
    'url',
    'fs',
    'net'
  ],
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      emitDeclarationOnly: false,
      target: 'ES2020'
    })
  ]
}));
