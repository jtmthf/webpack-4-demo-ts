import * as fs from 'fs';
import * as path from 'path';

import * as express from 'express';

import serverRender from '.';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(
  serverRender({
    currentDirectory: path.join(__dirname, '..'),
    fileSystem: fs,
  }),
);

const port = process.env.PORT || 3000;

app.listen(port, (error: Error) => {
  if (error) {
    throw error;
  }
  console.log(`Server started: http://localhost:${port}/`);
});
