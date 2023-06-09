import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
import * as bodyparser from 'body-parser';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync, writeFile } from 'fs';
import { environment } from 'src/environments/environment';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const website = environment.development
    ? 'firebase-deploy-setup/functions/dist/annu-business/browser'
    : 'dist/annu-business/browser';
  const distFolder = join(process.cwd(), website);
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  server.use(bodyparser.json());

  /*
  ***NOTE: This is commented as sitemap.xml will be updated and served from firebase server function.
 directly to/from firestorage.

  server.post('/api/sitemap', (req, res) => {
    const key = req.query['key'];
    if (key !== environment.libConfig.firebase.apiKey) {
      res.status(401).send({
        code: '401',
        message: 'Unauthorized - You are not authorized',
      });
    } else {
      const sitemapFileUrl = join(distFolder, 'sitemap.xml');
      const sitemapInfoFileUrl = join(distFolder, 'assets/sitemap-info.json');
      const xmlStr = req.body.xmlStr;
      const jsonStr = req.body.jsonStr;
      writeFile(sitemapFileUrl, xmlStr, (error) => {
        if (error) {
          console.log('ERROR WRITING sitemap.xml | ', error);
          res.send({
            status: 500,
            message: 'Failed: Something went wrong while writing sitemap xml',
          });
        } else {
          writeFile(sitemapInfoFileUrl, jsonStr, (error) => {
            if (error) {
              console.log('ERROR WRITING sitemap-info.json | ', error);
              res.send({
                status: 500,
                message:
                  'Failed: Something went wrong while writing sitemap json',
              });
            } else {
              res.send({ status: 200, message: 'Successfull' });
            }
          });
        }
      });
    }
  });
*/

  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // Routes that skips server side rendering
  server.get(['/dashboard', '/dashboard/**'], (req, res) => {
    res.sendFile(join(distFolder, `${indexHtml}`));
  });

  /*
   *All image from /getImage?imageId={} url will be served from firebase storage on prod envs
   * ONLY for DEV env, all images will serve only one image from local assets folder.
   */
  if (environment.development) {
    server.get(['/getImage', '/getImage/**'], (req, res) => {
      res.sendFile(join(distFolder, 'assets', 'local-image.jpg'));
    });
  }

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
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
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
