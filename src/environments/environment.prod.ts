import { LibConfig } from "@annu/ng-lib";
import { firebaseAppConfig, firebaseui, firebaseStoreConfig } from "../app/constants/firebase.config.prod";
import { appConfig } from "../app/constants/app.config.prod";
import { dashboardConfig } from "../app/constants/dashboard.config.prod";

export const environment = {
  production: true,
  appConfig,
  libConfig: {
    apiBaseUrl: 'http://localhost:5000',  // This should be the hosted url
    firebaseui: { ...firebaseui },
    firebase: { ...firebaseAppConfig, apiKey: '' },
    firebaseStoreConfig,
    firestoreBaseApiUrl: 'https://firestore.googleapis.com/v1/projects/annu-business/databases/(default)/documents',
  } as LibConfig,
  dashboardConfig,
};
