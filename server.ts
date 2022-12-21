import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

// Server side polyfills
(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xhr2');

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/annu-business/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  console.log('STARTING SERVER APP')
  console.log('INDEX FILENAME - ', indexHtml)
  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // Routes that skips server side rendering
  server.get(['/dashboard', '/dashboard/**'], (req, res)=> {
    res.sendFile(join(distFolder, `${indexHtml}.html`));
  });

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    console.log('RENDERING INDEX.HTML - STARTING - ', indexHtml, ' *** REQ URL-', req.url)
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }]
    },
      (error, html) => {
        if (error) {
          res.status(500).send(error);
          console.log('RENDERING INDEX.HTML - ERROR - ', indexHtml, ' *** REQ URL-', req.url, ' *** WITH HeaderSent - ', res.headersSent);
        } else {
          // console.log('HTML --- ', html);
          res.status(200).send(html);
          console.log('RENDERING INDEX.HTML - ENDED - ', indexHtml, ' *** REQ URL-', req.url, ' *** WITH HeaderSent - ', res.headersSent);
        }

      });
    console.log('SERVER ROUTE EXIT - *** REQ-', req.url)
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
