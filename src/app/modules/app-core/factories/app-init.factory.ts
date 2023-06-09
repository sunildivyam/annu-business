import { AppDataService } from '../services/app-data.service';

/**
 * A factory to provide application data, before the app starts, like app config, menu items etc.
 * This factory should be provided in app module as APP_INITIALIZER, so that it runs before app runs.
 * @date 6/8/2023 - 4:20:26 PM
 *
 * @export
 * @param {AppDataService} appDataService
 * @returns {() => any}
 */
export function appInit(appDataService: AppDataService) {
  // Sequential promises are needed here for navCategories. For other you can have parallel promises.
  const promise = new Promise<boolean>((resolve, reject) => {
    appDataService
      .getMainNavCategories()
      .then((cats) => {
        console.log('Fact', cats.length);
        appDataService
          .getFooterNavCategories()
          .then((cats) => {
            console.log('Fact Foot', cats.length);
            resolve(true);
          })
          .catch(reject);
      })
      .catch(reject);
  });

  return () => promise;
}
