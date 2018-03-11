import * as express from 'express';
import * as path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';

import App from '../App';

interface ServerRendererArguments {
  fileSystem: { readFileSync: (path: string) => Buffer };
  currentDirectory: string;
}

export default function serverRender({
  fileSystem,
  currentDirectory,
}: ServerRendererArguments): express.RequestHandler {
  const runtime = fileSystem
    .readFileSync(path.join(currentDirectory, 'dist/assets/js/runtime.js'))
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
          <script defer src="/assets/js/vendor.js"></script>
          <script defer src="/assets/js/main.js"></script>
        </body>
      </html>
    `);
  };
}
