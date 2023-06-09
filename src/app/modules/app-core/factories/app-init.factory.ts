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
  return () =>
    Promise.all([
      appDataService.getMainNavCategories(),
      appDataService.getFooterNavCategories(),
    ]);
}
