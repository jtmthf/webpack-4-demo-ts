import * as express from 'express';
import * as path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';

import App from '../App';

interface ServerRendererArguments {
  fileSystem: {
    readFileSync: (path: string) => Buffer;
    readdirSync: (path: string) => string[];
  };
  currentDirectory: string;
}

export default function serverRender({
  fileSystem,
  currentDirectory,
}: ServerRendererArguments): express.RequestHandler {
  const assets = fileSystem.readdirSync(
    path.join(currentDirectory, 'dist/assets/js'),
  );

  const runtimePath = assets.find(asset =>
    /runtime(?:\.[0-9a-f]+)?\.js/.test(asset),
  );
  const vendorPath = assets.find(asset =>
    /vendor(?:\.[0-9a-f]+)?\.js/.test(asset),
  );
  const mainPath = assets.find(asset => /main(?:\.[0-9a-f]+)?\.js/.test(asset));

  const runtime = fileSystem
    .readFileSync(path.join(currentDirectory, `dist/assets/js/${runtimePath}`))
    .toString();

  return (req, res) => {
    const html = renderToString(<App />);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Webpack 4 TypeScript</title>
        </head>
        <body>
          <div id="root">${html}</div>
          <script>${runtime}</script>
          <script defer src="/assets/js/${vendorPath}"></script>
          <script defer src="/assets/js/${mainPath}"></script>
        </body>
      </html>
    `);
  };
}
