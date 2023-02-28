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
      "description": "We, Annu Advent are one of the world's best business and technology consultants and we are bound to provide several benefits to you and your organization. We as Business and technology consultants bring a wealth of knowledge and experience to the table. We provide valuable insights and recommendations to help your company improve its operations and reach it's goals.",
      "keywords": "Annu Advent, Business consultants, technology consultants, Business ideas, Start Business, New Business, Business Plan",
      "robots": "index, follow",
      "Content-Type": "text/html; charset=utf-8",
      "language": "english",
      "revisit-after": "7 days",
      "author": "Annu Advent",
      "type": "article",
      "article:published_time": "2023-01-01T17:53:35.868Z",
      "article:author": "Annu Advent",
      "article:section": "business",
      "article:tag": "Annu Advent, Business consultants, technology consultants, Business ideas, Start Business, New Business, Business Plan",
      "image": "https://www.annuadvent.com/assets/annu-advent-logo.png",
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
