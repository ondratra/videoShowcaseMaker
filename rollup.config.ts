import glob from 'glob'
import rollupTypescript from '@rollup/plugin-typescript'

const baseConfig = (input: string, output: string) => ({
  input: input,
    output: {
      file: output,
      format: 'es',
    },
    preserveModules: false,
    plugins: [rollupTypescript()],
})

export default [
  baseConfig('src/index.ts', 'dist/index.js'),
  ...glob.sync('examples/*/showcaseScenario.ts')
    .map(item => baseConfig(item, 'dist/' + item.replace('.ts', '.js'))),
];
