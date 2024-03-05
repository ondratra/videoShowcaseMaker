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
    format: 'es',
    //preserveModules: false,
    exports: 'named'
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
      dir: 'dist/types/',
      format: 'es',

      // NOTE: We need to preserve TS modules due to way video plan's type is derived.
      // When modules are mingled to one file and modules are converted to namespaces errors occurs in package consuming
      // this library.
      preserveModules: true,
    },
    plugins: [dts()],
  },

  // examples
  ...glob.sync('examples/*/showcaseScenario.ts')
    .map(item => baseConfig(item, 'dist/' + item.replace('.ts', '.js'), commonPlugins('tsconfig.examples.json'))),
];
