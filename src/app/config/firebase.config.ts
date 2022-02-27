import { FirebaseConfig, FIREBASE_AUTH_SIGNIN_METHODS } from "@annu/ng-lib";
import { appConfig } from "./app.config";


export const firebaseui = {
    signInFlow: 'popup',  // redirect
    siteName: 'AnnuNgLib Components Library',
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
    projectId: 'annu-business',
    appId: '1:140977750488:web:870df7cc0848f6274ab2ad',
    storageBucket: 'annu-business.appspot.com',
    locationId: 'us-central',
    apiKey: '',
    authDomain: 'annu-business.firebaseapp.com',
    messagingSenderId: '140977750488',
    measurementId: 'G-36J6R2BDWD',
  } as FirebaseConfig
