# How to generate sitemap.xml dynamically and strategy to keep it updated as new articles and categories are added.

## Strategy to update sitemap.xml
* Pages should be available for all Live categories and Live articles of these categories.
* **Urls for Categories** - Get list of `ids` only of all Live categories, and form urls for them
    * `https://[hosturl]/[categoryId]`

* **Urls of Articles** - Get list of `ids` and `categories[catid1, catid2, ...]` of all live articles.
    * `https://[hosturl]/[catid1]/articleId`
    * `https://[hosturl]/[catid2]/articleId`
    * ...

* But not a good idea to fetch all categories and articles on every new category or article.
* We should fetch categories and articles only those added after the last `sitemap.xml` update. So we should store last updated datetime somewhere in database or a file on filesystem.
* Append urls to xml only those added after the last sitemap update.
Another question is when to update `sitemap.xml`?
    * On every Category & Article creation?
    * **On need basis by Admin? using Http/FS.**
    * On an interval (a day, 7 days, or so) automatically by a firebase function.

## Steps to update sitemap.xml
### Step 1:
**sitemapService**
* `getLastUpdatedInfo()` - gets the last updated datetime by an http call to `assets/sitemap-info.json`.

JSON Contract:

{

    lastUpdated: 'datetimevalue'

}

* `setLastUpdatedInfo()` - saves the currentDateTime stamp to `assets/sitemap-info.json` file using a POST http call. This needs to be called once sitemap.xml is updated and written back to filesystem.

* `readSitemapXml()` - Using `get http` request at client and Using `fs` at server side (Server side means, `server.js` of the SSR angular app), read `sitemap.xml` from the project root.

* `writeSitemapXml()` - Using `post http` request at client and Using `fs` at server side (Server side means, `server.js` of the SSR angular app), write updated `sitemap.xml` to the project root.

* `convertXmlToJson()` - Using `xml2json` javascript library, convert xml string to json.

* `convertJsonToXml()` - Using `xml2json` javascript library, convert json to xml string.

* `appendXml(newUrls[])` - append new urls to JSON converted xml.

* `getUrlsFromStaticRoutes()` - generates urls from app static routes, should be read from `app-routes.ts`.

* `getUrlsFromCategories()` - generates urls for all Live categories, should use methods from `CategoriesFirebaseHttpService` from `@annu/ng-lib`. Use `sitemapLatUpdatedInfo` timestamp to fetch records only added post sitemap update.

* `getUrlsFromArticles()` - generates urls for all Live articles, should use methods from `ArticlesFirebaseHttpService` from `@annu/ng-lib`. Use `sitemapLatUpdatedInfo` timestamp to fetch records only added post sitemap update.

### Step2:
**sitemapXmlComponent**

* Provide an UI to trigger `sitemap.xml` generation. This should be visible to `Admin` role only.


## Allow CORS for storage bucket

### Step 1:
Open Google Cloud Shell `https://console.cloud.google.com/welcome?project=annu-business&cloudshell=true`
### Step 2:
Create a file `cors.json` in the shell editor.
### Step 3:
Run the following command in the Shell terminal
`gsutil cors set cors.json gs://[bucket name]`
ex.
bucket name = annu-business.appspot.com (staging)
bucket name = annuadvent-prod.appspot.com (production)

### cors-prod.json
[
    {
        "origin": [
            "https://annuadvent-prod.web.app/",
            "https://annuadvent-prod.firebaseapp.com/",
            "https://annuadvent.com",
            "https://www.annuadvent.com"
        ],
        "method": [
            "GET"
        ],
        "maxAgeSeconds": 3600
    }
]


### cors.json
[
    {
        "origin": [
            "http://localhost:*",
            "https://annu-business.web.app/",
            "https://annu-business.firebaseapp.com/"
        ],
        "method": [
            "GET"
        ],
        "maxAgeSeconds": 3600
    }
]
