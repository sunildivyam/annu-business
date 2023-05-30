import { LibConfig } from "@annu/ng-lib";
import { firebaseAppConfig, firebaseui, firebaseStoreConfig } from "../app/constants/firebase.config.prod";
import { appConfig } from "../app/constants/app.config.prod";
import { dashboardConfig } from "../app/constants/dashboard.config.prod";
import { openaiConfig } from "../app/constants/openai.config.prod";

export const environment = {
  production: true,
  staging: false,
  development: false,
  appConfig,
  libConfig: {
    apiBaseUrl: 'https://www.annuadvent.com',  // When running prod on hosting server
    // apiBaseUrl: 'http://localhost:5000',
    imagesSourceUrl: '/getImage?imageId=',
    firebaseui: { ...firebaseui },
    firebase: { ...firebaseAppConfig, apiKey: '' },
    firebaseStoreConfig,
    firestoreBaseApiUrl: 'https://firestore.googleapis.com/v1/projects/annuadvent-prod/databases/(default)/documents',
    fireStorageBaseApiUrl: 'https://firebasestorage.googleapis.com/v0/b/annuadvent-prod.appspot.com/o',
    openaiConfig: { ...openaiConfig, apiKey: '' },
  } as LibConfig,
  dashboardConfig,
};
