# App Information - Production Environment.

**App Name:** annuadvent

**Web Url:** www.annuadvent.com

**Firebase app name:** annuadvent-prod

**gmail**: annuadvent@gmail.com

**youtube channel:** @annuadvent

**facebook:** https://www.facebook.com/profile.php?id=100090363930535

**twitter handle:** @annuadvent

**instangram:** https://www.instagram.com/annuadvent/

## Deploy to PROD, firebase project:
1) Publish latest version of `@annubiz/ng-lib` angular library to `npm`, if not already published.

2) Check latest version of `@annubiz/ng-lib` is added/updated in the `package.json`, if not done already.

3) Do a `npm install`.

4) Build the project with prod build config, by running `npm run build:ssr`.

5) Setup firebase if not done already, then only proceed to next step. Follow steps from section `Setting up firebase project for Prod`.

6) Add the firebase project for prod `annuadvent-prod` to your angular app.
Run `firebase use --add`

This allows you to choose another firebase project and a alias to it, that could be prod/staging/dev etc., in our case choose `annadvent-prod` as both the project and alias name.

7) Deploy the build to firebase. From the project root, Run `npm run firebase:deploy`. This would deploy all storage, store, indexes, storage rules, store rules, functions etc. to firebase, if you do not get any error.

## Setting up firebase project for PROD:

1) Create a new project for production deployment, if not already done. Name it `annuadvent-prod`, edit `Project Id` from default to `annuadvent-prod`.

2) Go to `project->settings` and add a new firebase `app` and copy the setting for web to your angular project's file `src/app/constants/firebase.config.prod.ts`.

3) Upgrade your firebase project plan to `Pay as you Go` plan.

**Note:** Angular SSR needs to be deployed to a firebase function and firebase functions feature is available only in `Pay as you Go` plan, and not in Free `Blaze` plan.

4) Go to `Firebase Console`, and create following empty collection with one dummy document each:
    * categories
    * articles
    * categories-bin
    * articles-bin

5) Go to `Firebase Console->Authorization` and enable following authorization providers:
    * Google
    * Email and Password
    * Mobile Number

6) Go to `Firebase Console->Storage`, and enable it, and create a default bucket in the default region.

7) The store indices and rules, and storage rules will be deployed from the app code during firebase deploy.
