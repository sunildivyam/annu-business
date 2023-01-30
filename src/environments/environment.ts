// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { LibConfig } from "@annu/ng-lib";
import { firebaseAppConfig, firebaseui, firebaseStoreConfig } from "../app/config/firebase.config";
import { appConfig } from "src/app/config/app.config";

export const environment = {
  production: false,
  appConfig,
  libConfig: {
    apiBaseUrl: 'http://localhost:5000',
    // docsJsonUrl: '/data/documentation.json',
    firebaseui: { ...firebaseui },
    firebase: { ...firebaseAppConfig, apiKey: '' },
    firebaseStoreConfig,
    firestoreBaseApiUrl: 'https://firestore.googleapis.com/v1/projects/annu-business/databases/(default)/documents',
  } as LibConfig
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
