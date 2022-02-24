# Annu Business (annu-business)
Annu Business serves users with business consulation, how to start a business, how to run a business, what business you can start.

## Features included with this repository.
* Angular 13 App
* Server Side Rendering (SSR) using angular
* Theme enabled Web.
* Cordova enabled Apps for Web, Android, & IOS.
* Annu-ng-Lib components and services library.
  * UI Components
  * Feature Components & Services eg. Articles, Employment etc..
  * Firebase Auth
  * Firebase firestore
* Ready to deploy on Google firebase Cloud.

## Get Started
* Fork/clone the repository.
* Edit the `src/app/config/app.config.ts`, as per your need.
* Edit the `src/app/config/firebase.config.ts`, as per your need.
* Replace the empty `apiKey` with real firebase `apiKey` in the `src/environments/[environment.ts | environment.prod.ts]` files.
* In `package.json`, replace the `@anu/ng-lib` path to your local folder from annu-ng-lib repository's `/dist` folder. Or set it to the annu-ng-lib library's prod package url.
* Set scss variable `$app-width` in the `app.component.scss` file, if needed.
* run-  `npm install`
* Here you go, run- `npm run dev:ssr` or other commands from scripts from `package.json`, as per your need. Your local server should be running and serving your app.


## Additional Information
### Setting up cordova
* Install Android studio
* Veryfy `cordova\platforms\android\cdv-gradle-config.json` for sdk, jdk, gradle etc. versions and install them using Android SDK manager.
* Ensure android sdk build tools, gradle, jdk are in OS path variable.
* Run the emulator from Android studio.
* Run `npm run build android from project root`, this will generate build into `/cordova/www/` folder.
* Run `cd cordova` and `cordova run android`.
* you should see your app loaded into emulator.
