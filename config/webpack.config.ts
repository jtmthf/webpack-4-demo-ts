import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

interface Options {
  prod?: boolean;
}

interface RuleOptions {
  target: 'server' | 'client';
}

const createRules: (env: RuleOptions) => webpack.Rule[] = ({ target }) => [
  {
    test: /(\.ts|\.tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets: [
          '@babel/preset-typescript',
          '@babel/preset-react',
          [
            '@babel/preset-env',
            {
              useBuiltins: 'usage',
              modules: false,
              targets:
                target === 'server'
                  ? { node: 'current' }
                  : { browsers: ['> 1%', 'ie 11'] },
            },
          ],
        ],
        plugins: ['react-hot-loader/babel'],
      },
    },
  },
];

type FunctionConfig = (env: Options) => webpack.Configuration;

const createClientConfig: FunctionConfig = ({ prod = false }) => ({
  mode: prod ? 'production' : 'development',
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: createRules({ target: 'client' }),
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
});

export default [createClientConfig];
