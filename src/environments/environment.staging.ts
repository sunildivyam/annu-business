// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { LibConfig } from '@annu/ng-lib';
import { firebaseAppConfig, firebaseui, firebaseStoreConfig } from '../app/constants/firebase.config.staging';
import { appConfig } from '../app/constants/app.config.staging';
import { dashboardConfig } from '../app/constants/dashboard.config.staging';
import { openaiConfig } from '../app/constants/openai.config.staging';

export const environment = {
  production: false,
  staging: true,
  development: false,
  appConfig,
  libConfig: {
    apiBaseUrl: 'https://annu-business.web.app',
    // apiBaseUrl: 'http://localhost:5000',
    imagesSourceUrl: '/getImage?imageId=',
    firebaseui: { ...firebaseui },
    firebase: { ...firebaseAppConfig, apiKey: '' },
    firebaseStoreConfig,
    firestoreBaseApiUrl: 'https://firestore.googleapis.com/v1/projects/annu-business/databases/(default)/documents',
    fireStorageBaseApiUrl: 'https://firebasestorage.googleapis.com/v0/b/annu-business.appspot.com/o',
    openaiConfig: { ...openaiConfig, apiKey: '' },
  } as LibConfig,
  dashboardConfig,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
