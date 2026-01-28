import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/ck-primitive-array/ck-primitive-array.js',
      format: 'umd',
      name: 'WebComponentLibrary',
      sourcemap: true
    },
    {
      file: 'dist/ck-primitive-array/ck-primitive-array.esm.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/ck-primitive-array/ck-primitive-array.min.js',
      format: 'umd',
      name: 'WebComponentLibrary',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    typescript({
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src'
    })
  ]
};
