import * as path from 'path'
import {glob} from 'glob'
import rollupTypescript from '@rollup/plugin-typescript'
import dts from "rollup-plugin-dts";
import {Plugin as RollupPlugin} from 'rollup';

// basic rollup config setup
const baseConfig = (input: string, output: string, plugins: RollupPlugin[]) => ({
  input: input,
  output: {
    file: output,
    format: 'cjs',
  },
  plugins,
})

// common plugins setup
const commonPlugins = (tsconfigPath: string) => [
  rollupTypescript({tsconfig: tsconfigPath})
]

export default [
  // library
  baseConfig('src/index.ts', 'dist/index.js', commonPlugins('tsconfig.core.json')),

  // library typings
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'cjs',
    },
    plugins: [dts()],
  },

  // examples
  ...glob.sync('examples/*/showcaseScenario.ts')
    .map(item => baseConfig(item, 'dist/' + item.replace('.ts', '.js'), commonPlugins('tsconfig.examples.json'))),
];
