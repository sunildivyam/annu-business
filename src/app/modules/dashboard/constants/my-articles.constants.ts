import { ArticleFeatures, Filter, FilterTypes } from "@annubiz/ng-lib";

export const MY_ARTICLES_FILTERS: Array<Filter> = [
  {
    id: 'isFeatured',
    title: 'featured?',
    enabled: false,
    type: FilterTypes.SingleSelect,
    filter: {
      yesLabel: 'Yes',
      noLabel: 'No',
      value: true
    }
  },
  {
    id: 'inReview',
    title: 'In-review?',
    enabled: false,
    type: FilterTypes.SingleSelect,
    filter: {
      yesLabel: 'Yes',
      noLabel: 'No',
      value: true
    }
  },
  {
    id: 'isLive',
    title: 'Published?',
    enabled: false,
    type: FilterTypes.SingleSelect,
    filter: {
      yesLabel: 'Live',
      noLabel: 'offline',
      value: true
    }
  }
];


export const MY_ARTICLES_FILTERS_FOR_ADMIN: Array<Filter> = [
  {
    id: 'userId',
    title: 'Author',
    enabled: false,
    type: FilterTypes.SingleSelect,
    filter: {
      yesLabel: 'Mine',
      noLabel: 'Others',
      value: true
    }
  },
  {
    id: 'features',
    title: 'Choose Features',
    enabled: true,
    type: FilterTypes.MultiSelect,
    filter: {
      selectedValues: [],
      values: Object.keys(ArticleFeatures).map(key => ({ id: ArticleFeatures[key], title: ArticleFeatures[key] })),
      keyName: 'id',
      valueName: 'title',
    }
  }
];
