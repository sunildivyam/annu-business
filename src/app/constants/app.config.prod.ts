import { AppConfig } from "@annu/ng-lib";

export const appConfig: AppConfig = {
    name: 'annuadvent',
    copyrightText: 'copyright©annuadvent',
    themeName: 'skyBlue',
    loginUrl: '/login',
    logoutUrl: '/login',
    profileUrl: '/dashboard',
    adminEmail: 'sunil.divyam@gmail.com',
    defaultPageSize: 5,
    tNcUrl: '/tnc/terms-and-conditions',
    privacyPolicyUrl: '/privacy/privacy-policy',
    metaInfo: {
      "title": "Annu Advent",
      "description": "Annu Advent serves you with business consultation, how to start a business, how to run a business, what business you can start.",
      "keywords": "Annu Advent, Business ideas, Start Business, New Business, Business Plan",
      "robots": "index, follow",
      "Content-Type": "text/html; charset=utf-8",
      "language": "english",
      "revisit-after": "7 days",
      "author": "Annu Advent",
      "type": "article",
      "article:published_time": "2022-02-06T17:53:35.868Z",
      "article:author": "Annu Advent",
      "article:section": "business",
      "article:tag": "Annu Advent, Business ideas, Start Business, New Business, Business Plan",
      "image": "image/url",
      "url": "https://www.annuadvent.com",
      "card": "summary_large_image",
      "site_name": "Annu Advent",
      "audio": "",
      "video": ""
    },
    mainMenuItems: [
      {
        title: 'Technology as business',
        href: ['./technology'],
      },
      {
        title: 'Business Techniques',
        href: ['./business-techniques'],
      },
      {
        title: 'Research',
        href: ['./research'],
      }
    ]
  };
