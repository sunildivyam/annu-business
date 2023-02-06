import { FirebaseConfig, FirebaseStoreConfig, FIREBASE_AUTH_SIGNIN_METHODS } from "@annu/ng-lib";
import { appConfig } from "./app.config.prod";


export const firebaseui = {
  signInFlow: 'popup',  // redirect
  siteName: 'Annu Advent',
  tosUrl: appConfig.tNcUrl, // Terms of service page url
  privacyPolicyUrl: appConfig.privacyPolicyUrl,  // Privacy policy url
  // signInSuccessUrl: '/components/auth/login-status',  // User is redirected to this url after successful login.

  // Callback methods, on login events, like success, failure etc. and
  // can be set to handler functions from Login component consumer.
  callbacks: {
    signInSuccessWithAuthResult: null,  // set handler from Login component consumer.
    signInFailure: null,  // set handler from Login component consumer.
    uiShown: null,  // set handler from Login component consumer.
  },
  signInOptions: [
    // List of OAuth providers supported.
    // Sign in with Email & Password
    {
      provider: FIREBASE_AUTH_SIGNIN_METHODS.EMAIL_PASSWORD,
      // signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      requireDisplayName: true,
    },
    // Using Phone number
    {
      provider: FIREBASE_AUTH_SIGNIN_METHODS.PHONE,
      recaptchaParameters: {
        type: 'image', // or 'audio'
        size: 'normal', // or 'invisible' or 'compact'
        badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
      },
      defaultCountry: 'IN',
      loginHint: '+91-1234567890',
    },
    // Sign in with Google
    {
      provider: FIREBASE_AUTH_SIGNIN_METHODS.GOOGLE,
    },
    // Sign in with Facebook
    // {
    //   provider: FIREBASE_AUTH_SIGNIN_METHODS.FACEBOOK,
    // },

    // Sign in with Twitter
    // {
    //   provider: FIREBASE_AUTH_SIGNIN_METHODS.TWITTER,
    // },
    // Sign in with Github
    // {
    //   provider: FIREBASE_AUTH_SIGNIN_METHODS.GITHUB,
    // },
  ]
};

export const firebaseAppConfig = {
  apiKey: "AIzaSyC5dVLk20wMQz8GWd2nYs-Sg6OrnTQsblU",
  authDomain: "annuadvent-prod.firebaseapp.com",
  projectId: "annuadvent-prod",
  storageBucket: "annuadvent-prod.appspot.com",
  messagingSenderId: "354458643335",
  appId: "1:354458643335:web:37b32c501e514509598122",
  measurementId: "G-RKZTBE5D10"
} as FirebaseConfig


export const firebaseStoreConfig: FirebaseStoreConfig = {
  baseStoreUrl: 'annuadvent-prod/articles',
  maxKBs: 1024,
  maxWidth: 900,
  maxHeight: 600,
  minWidth: 100,
  minHeight: 100,
}
