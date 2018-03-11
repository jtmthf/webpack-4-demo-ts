import * as express from 'express';
import * as path from 'path';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import * as webpackHotServerMiddleware from 'webpack-hot-server-middleware';

import { createClientConfig, createServerConfig } from './webpack.config';

declare module 'webpack' {
  // tslint:disable-next-line:interface-name
  interface ICompiler {
    name: string;
  }
}

const app = express();

const clientConfig = createClientConfig({ prod: false });
const serverConfig = createServerConfig({ prod: false });

const configs = [clientConfig, serverConfig];

const compiler = webpack(configs);

const clientCompiler = compiler.compilers.find(({ name }) => name === 'client');

const devMiddleware = webpackDevMiddleware(
  compiler as any,
  {
    noInfo: true,
    publicPath: clientConfig.output!.publicPath!,
    serverSideRender: true,
  } as any,
);

app.use(devMiddleware);
app.use(webpackHotMiddleware(clientCompiler!));
app.use(
  webpackHotServerMiddleware(compiler, {
    serverRendererOptions: {
      fileSystem: (clientCompiler as any).outputFileSystem,
      currentDirectory: path.join(__dirname, '..'),
    },
  }),
);

const port = process.env.PORT || 3000;

app.listen(port, (error: Error) => {
  if (error) {
    throw error;
  }
  console.log(`Server started: http://localhost:${port}/`);
});
