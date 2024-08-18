import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const isWatch = process.argv.includes('-w') || process.argv.includes('--watch');

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: '../../tsconfig.json',
    }),
    !isWatch && terser(),
  ],
  external: ['node:fs', 'node:child_process', 'node:path', 'node:url'],
};
