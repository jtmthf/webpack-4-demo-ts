import * as express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';

import App from '../App';

export default function serverRender(): express.RequestHandler {
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
          <script src="/assets/js/main.js"></script>
        </body>
      </html>
    `);
  };
}
