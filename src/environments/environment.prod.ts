import { LibConfig } from "@annu/ng-lib";
import { firebaseAppConfig, firebaseui, firebaseStoreConfig } from "../app/config/firebase.config";

export const environment = {
  production: true,
  libConfig: {
    // docsJsonUrl: '/data/documentation.json',
    firebaseui: { ...firebaseui },
    firebase: { ...firebaseAppConfig, apiKey: '' },
    firebaseStoreConfig,
  } as LibConfig
};
