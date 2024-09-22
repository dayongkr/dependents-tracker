import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const isWatch = process.argv.includes('-w') || process.argv.includes('--watch');

export default [
  {
    input: './src/cli/index.ts',
    output: {
      file: 'bin/index.js',
      format: 'es',
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
      }),
      !isWatch && terser(),
    ],
    external: ['node:fs', 'node:child_process', 'node:path', 'node:url'],
  },
];
