import { Tab } from '@annubiz/ng-lib';

export const tabs: Array<Tab> = [
  {
    name: 'my-articles',
    title: 'My Articles',
    disabled: false,
    active: false,
  },
  {
    name: 'my-categories',
    title: 'My Categories',
    disabled: false,
    active: false,
  },
];

export const DASHBOARD_ROUTE_RESOLVER_DATA_KEYS = {
  MY_CATEGORIES_VIEW: 'myCategoriesViewData',
  MY_ARTICLES_VIEW: 'myArticlesViewData',
};
