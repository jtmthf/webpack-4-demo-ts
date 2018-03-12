import * as path from 'path';

import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as webpack from 'webpack';
import * as nodeExternals from 'webpack-node-externals';

interface Options {
  prod?: boolean;
}

const resolve: webpack.Resolve = {
  extensions: ['.js', '.ts', '.tsx'],
};

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

export const createClientConfig: FunctionConfig = ({ prod = false }) => ({
  mode: prod ? 'production' : 'development',
  name: 'client',
  get entry() {
    const entry = ['./src/client'];
    if (process.env.NODE_ENV === 'development') {
      return ['webpack-hot-middleware/client', ...entry];
    }

    return entry;
  },
  output: {
    path: path.join(process.cwd(), 'dist/assets'),
    filename: prod ? 'js/[name].[chunkhash].js' : 'js/[name].js',
    chunkFilename: prod ? 'js/[name].[chunkhash].js' : 'js/[name].js',
    publicPath: '/assets/',
  },
  resolve,
  module: {
    rules: createRules({ target: 'client' }),
  },
  get plugins() {
    if (process.env.NODE_ENV === 'development') {
      return [new webpack.HotModuleReplacementPlugin()];
    } else {
      return [
        new CleanWebpackPlugin('dist', {
          root: process.cwd(),
        }),
        new webpack.HashedModuleIdsPlugin(),
      ];
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendor',
        },
      } as any,
    },
    runtimeChunk: { name: 'runtime' },
  },
});

export const createServerConfig: FunctionConfig = ({ prod = false }) => ({
  mode: prod ? 'production' : 'development',
  name: 'server',
  entry: prod ? './src/server/prod-server' : './src/server',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  output: { filename: 'server.js', libraryTarget: 'commonjs2' },
  resolve,
  module: {
    rules: createRules({ target: 'server' }),
  },
  externals: [nodeExternals()],
});

export default [createClientConfig, createServerConfig];
