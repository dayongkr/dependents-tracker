import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const isWatch = process.argv.includes('-w') || process.argv.includes('--watch');
const sharedConfig = {
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    !isWatch && terser(),
  ],
  external: ['node:fs', 'node:child_process', 'node:path', 'node:url', 'node:worker_threads', 'node:crypto'],
};

export default [
  {
    input: './src/cli/index.ts',
    output: {
      file: 'bin/index.js',
      format: 'es',
    },
    ...sharedConfig,
  },
  {
    input: './src/workers/cloneWorker.ts',
    output: {
      file: 'bin/workers/cloneWorker.js',
      format: 'es',
    },
    ...sharedConfig,
  },
  {
    input: './src/workers/parseWorker.ts',
    output: {
      file: 'bin/workers/parseWorker.js',
      format: 'es',
    },
    ...sharedConfig,
  },
];
