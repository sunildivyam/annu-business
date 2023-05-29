import { DashboardConfig } from "../interfaces/config.interface";

export const dashboardMetaInfo = {
	"title": "My dashboard",
	"description": "Manage your profile and authored articles.",
	"keywords": "my dashboard, add article, new article, write article",
	"robots": "index, follow",
	"Content-Type": "text/html; charset=utf-8",
	"language": "english",
	"revisit-after": "7 days",
	"author": "Annu Business",
	"type": "website",
	"article:published_time": "2022-12-21T09:12:02.783Z",
	"article:author": "Sunil Kumar",
	"article:section": "technology",
	"article:tag": "my dashboard, add article, new article, write article",
	"image": "",
	"url": "https://annu-business.web.app/dashboard",
	"card": "summary_large_image",
	"site_name": "Annu Business",
	"audio": "",
	"video": ""
};

export const dashboardMyArticlesMetaInfo = {
	...dashboardMetaInfo,
	"title": "My Articles",
	"description": "Manage all of your articles. Add new article or update existing one.",
	"keywords": "my dashboard, add article, new article, write article",
	"article:tag": "my dashboard, add article, new article, write article",
};

export const dashboardMyCategoriesMetaInfo = {
	...dashboardMetaInfo,
	"title": "My Categories",
	"description": "Manage all of your categories. Add new category or update existing one.",
	"keywords": "my dashboard, add category, new category, write category",
	"article:tag": "my dashboard, add category, new category, write category",
};

export const dashboardMyArticleMetaInfo = {
	...dashboardMyArticlesMetaInfo,
	"title": "Manage article",
};

export const dashboardMyCategoryMetaInfo = {
	...dashboardMyCategoriesMetaInfo,
	"title": "Manage category",
};


export const openaiArticlesMetaInfo = {
	...dashboardMetaInfo,
	"title": "Openai Articles",
	"description": "Autogenerates Articles",
	"keywords": "my dashboard, add article, new article, write article, Auto article",
	"article:tag": "my dashboard, add article, new article, write article",
};

export const dashboardConfig: DashboardConfig = { dashboardMetaInfo, dashboardMyArticleMetaInfo, dashboardMyArticlesMetaInfo, dashboardMyCategoriesMetaInfo, dashboardMyCategoryMetaInfo, openaiArticlesMetaInfo };
