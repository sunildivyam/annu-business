import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EditorElementData,
  EditorElement,
  OpenaiService,
  Html2JsonService,
  AuthFirebaseService,
  Article,
  Category,
  MetaService,
  ArticlesFirebaseHttpService,
  FIREBASE_AUTH_ROLES,
  CategoriesFirebaseHttpService,
  UtilsService,
  OpenaiPrompt,
  OpenaiPromptType,
  ArticleEditorService,
  LibConfig,
} from '@annu/ng-lib';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
const { appConfig } = environment;
const dashboardMyArticleMetaInfo =
  environment.dashboardConfig.dashboardMyArticleMetaInfo;
const imageSpecs = environment.libConfig.firebaseStoreConfig;

@Component({
  selector: 'app-my-article',
  templateUrl: './my-article.component.html',
  styleUrls: ['./my-article.component.scss'],
})
export class MyArticleComponent implements OnInit, OnDestroy {
  article: Article | null = null;
  articleId: string = '';
  categories: Array<Category> = [];

  error: any = null;
  found: boolean = false;
  loading: boolean = true;
  paramsSubscription: Subscription;
  showUpdateConfirmationModal: boolean = false;
  ADD_ARTICLE: string = 'add';
  isAdmin: boolean = false;
  isAuthor: boolean = false;
  postfixUniqueId: boolean = true;
  showModal: boolean = false;
  imageHelpText: string = '';

  //Open Ai
  openaiPrompts: Array<OpenaiPrompt> = [];
  showOpenAi: boolean = false;

  // Autogenerate Open Ai article
  showOpenAiAutogenerate: boolean = false;
  openaiPromptsToAutogenerate: Array<OpenaiPrompt> = [];
  autoGenerateLoading: boolean = false;

  autoGenerateTimer: any;
  autoGenerateStartTime: number = 0;
  autoGenerateExpectedTimeToFinish: number = 0;
  autoGenerateTimeEllapsed: number = 0;

  constructor(
    private articlesHttp: ArticlesFirebaseHttpService,
    private categoriesHttp: CategoriesFirebaseHttpService,
    private authFireSvc: AuthFirebaseService,
    private route: ActivatedRoute,
    private router: Router,
    private utilsSvc: UtilsService,
    private metaService: MetaService,
    private openaiService: OpenaiService,
    private html2jsonService: Html2JsonService,
    private articleEditorService: ArticleEditorService,
    private libConfig: LibConfig,
  ) {
    this.imageHelpText = this.utilsSvc.getImageSpecsString(imageSpecs);
    this.paramsSubscription = this.route.params.subscribe(async (params) => {
      this.error = null;
      this.found = true;
      this.articleId = params['id'];
      this.isAdmin = await this.authFireSvc.currentUserHasRole(
        FIREBASE_AUTH_ROLES.ADMIN
      );
      this.isAuthor = await this.authFireSvc.currentUserHasRole(
        FIREBASE_AUTH_ROLES.AUTHOR
      );
      this.getCategories();
      this.getArticle(this.articleId);
    });
  }

  ngOnInit(): void {
    this.metaService.setPageMeta({
      ...dashboardMyArticleMetaInfo,
      title: `${appConfig.metaInfo.title} - ${dashboardMyArticleMetaInfo.title}`,
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  public get isNewArticlePage(): boolean {
    return this.articleId === this.ADD_ARTICLE;
  }

  public async getArticle(id: string) {
    this.error = null;
    this.loading = true;
    this.found = true;
    this.article = null;

    if (id !== this.ADD_ARTICLE) {
      const getArticlePromise: Promise<Article> = this.isAdmin
        ? this.articlesHttp.getArticle(id)
        : this.articlesHttp.getUsersArticle(
            this.authFireSvc.getCurrentUserId(),
            id
          );

      getArticlePromise
        .then((art: Article) => {
          if (art) {
            this.article = { ...art };
          } else {
            this.found = false;
            this.error = {
              code: '404',
              message: `Article does not exist - ${id}`,
            };
          }

          this.loading = false;
        })
        .catch((error) => {
          this.error = error;
          this.loading = false;
          this.found = false;
        });
    } else {
      this.found = true;
      this.loading = false;
      this.article = null;
    }
  }

  public async getCategories() {
    const pageCategories =
      await this.categoriesHttp.getAllUsersOnePageShallowCategories(
        this.isAdmin ? null : true
      );
    this.categories = pageCategories.categories || [];
  }

  public saveClicked(article: Article): void {
    this.article = { ...article };
    this.error = null;
    this.loading = true;
    let savePromise;
    if (this.isNewArticlePage) {
      savePromise = this.articlesHttp.addArticle(this.article);
    } else {
      savePromise = this.articlesHttp.updateArticle(this.article);
    }

    savePromise
      .then((art: Article) => {
        this.article = { ...art };
        this.loading = false;
        if (this.isNewArticlePage) {
          this.router.navigate([this.article.id], {
            relativeTo: this.route.parent,
          });
        }
      })
      .catch((error) => {
        this.error = error;
        this.loading = false;
      });
  }

  public isLiveClicked(article: Article): void {
    this.article = { ...article };
    this.error = null;
    this.loading = true;
    if (!this.isNewArticlePage) {
      this.articlesHttp
        .setArticleLive(this.article)
        .then((art: Article) => {
          this.article = { ...art };
          this.loading = false;
        })
        .catch((error) => {
          this.error = error;
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  public inReviewClicked(article: Article): void {
    this.article = { ...article };
    this.error = null;
    this.loading = true;
    if (!this.isNewArticlePage) {
      this.articlesHttp
        .setArticleUpForReview(this.article)
        .then((art: Article) => {
          this.article = { ...art };
          this.loading = false;
        })
        .catch((error) => {
          this.error = error;
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  public deleteClicked(category: Category): void {
    this.showModal = true;
  }

  public deleteCancelled(): void {
    this.showModal = false;
  }

  public deleteConfirmed(): void {
    this.showModal = false;
    this.loading = true;
    this.error = null;
    this.articlesHttp
      .deleteArticle(this.article)
      .then((success) => {
        if (success === true) {
          this.router.navigate(['.'], { relativeTo: this.route.parent });
        } else {
          throw new Error('Something went wrong, please try again later.');
        }
        this.loading = false;
      })
      .catch((error) => {
        this.error = error;
        this.loading = false;
      });
  }

  public articleChanged(article: Article): void {
    article.metaInfo.site_name = appConfig.metaInfo.title;
    article.metaInfo['article:author'] =
      article.metaInfo['article:author'] ||
      appConfig.metaInfo['article:author'];
    article.metaInfo.author =
      article.metaInfo.author || appConfig.metaInfo.author;

    article.categories = article.categories || [];
    const canonicalCategoryId = article.categories.length
      ? article.categories[0]
      : '';
    article.metaInfo.url = this.utilsSvc.getCanonicalUrl(this.libConfig,canonicalCategoryId,article.id);
  }

  public openAiClick(prompts: Array<OpenaiPrompt>): void {
    this.openaiPrompts = this.utilsSvc.deepCopy(prompts);
    this.getOpenaiPromptResults();
  }

  public async getOpenaiPromptResults(): Promise<void> {
    this.loading = true;

    // Reform the prompts as per new article/ existing article
    if (this.isNewArticlePage) {
      if (this.openaiPrompts.length === 1) {
        this.openaiPrompts[0].promptType = OpenaiPromptType.content;
      } else {
        const currentPrompt = this.openaiPrompts[this.openaiPrompts.length - 1];
        if (
          [OpenaiPromptType.keywords, OpenaiPromptType.description].includes(
            currentPrompt.promptType
          )
        ) {
          this.openaiPrompts[this.openaiPrompts.length - 1].prompt =
            this.article.metaInfo.title;
        }
      }
    } else {
      const currentPrompt = this.openaiPrompts[this.openaiPrompts.length - 1];
      if (
        [OpenaiPromptType.keywords, OpenaiPromptType.description].includes(
          currentPrompt.promptType
        )
      ) {
        this.openaiPrompts[this.openaiPrompts.length - 1].prompt =
          this.article.metaInfo.title;
      }
    }

    let currentPrompt = this.openaiPrompts[this.openaiPrompts.length - 1];
    // fetch prompt results
    // prepend prompts with promptTypes, then make a call to openai api
    const mdStr = await this.openaiService.getChatResponse(
      this.openaiPrompts.map(
        (p) =>
          `${p.promptType ? p.promptType + ' "' : ''}${p.prompt}${
            p.promptType ? '"' : ''
          }`
      )
    );

    //Connverts to json
    const htmlStr = this.html2jsonService.md2html(mdStr);
    const jsonEl: EditorElement = this.html2jsonService.html2json(htmlStr);

    if (this.isNewArticlePage) {
      this.article = this.article || {};
      const metaInfo = (this.article.metaInfo = this.article.metaInfo || {});
    }

    if (currentPrompt.promptType === OpenaiPromptType.description) {
      // For type description, fill/update only description.
      jsonEl.children.forEach((el) => {
        if (el.tagName.toLowerCase() === 'p') {
          this.article.metaInfo.description = el.data?.text;
        }
      });
    } else if (currentPrompt.promptType === OpenaiPromptType.keywords) {
      // For keywrds type, fill only article keywords.
      const keyWords: Array<string> = [];
      jsonEl.children.forEach((el) => {
        if (['ul', 'ol'].includes(el.tagName.toLowerCase())) {
          el.children.forEach((liEl) => {
            if (liEl.tagName === 'li') {
              keyWords.push(liEl.data?.text);
            }
          });
        }
      });
      this.article.metaInfo.keywords = keyWords.join(', ');
    } else {
      if (this.isNewArticlePage) {
        // For the new article, set title and body for the first prompt only
        this.article.metaInfo.title = this.openaiPrompts[0].prompt;
        if (this.openaiPrompts.length === 1) {
          this.article.body = jsonEl;
        } else {
          // For new article, 2nd and onwards prompts append body children only.
          this.article.body.children = [].concat(
            this.article.body.children,
            [this.createHeadingFromPrompt(currentPrompt.prompt)],
            jsonEl.children
          );
        }
      } else {
        // For existing this.article, append body children only.
        this.article.body.children = [].concat(
          this.article.body.children,
          [this.createHeadingFromPrompt(currentPrompt.prompt)],
          jsonEl.children
        );
      }
    }

    // Updates article with openAi Info.
    this.article = { ...this.article };

    currentPrompt = {
      ...currentPrompt,
      message: {
        mdText: mdStr,
        htmlText: htmlStr,
        jsonText: JSON.stringify(jsonEl, null, '\t'),
      },
    };
    this.openaiPrompts[this.openaiPrompts.length - 1] = currentPrompt;
    this.openaiPrompts = [...this.openaiPrompts];

    this.loading = false;
    return;
  }

  private createHeadingFromPrompt(promptText: string): EditorElement {
    const editorEl: EditorElement = {
      name: `h2-${Date.now()}`,
      tagName: 'h2',
      isContainer: false,
      focused: false,
      data: { text: promptText } as EditorElementData,
    };

    return editorEl;
  }

  public openAiAutogenerateClick(prompts: Array<OpenaiPrompt>): void {
    this.openaiPromptsToAutogenerate = this.utilsSvc.deepCopy(prompts);
    const articleTitle =
      this.openaiPromptsToAutogenerate[
        this.openaiPromptsToAutogenerate.length - 1
      ]?.prompt;
    if (!articleTitle) throw new Error('Invalid article title');

    this.autoGenerateArticle(articleTitle);
  }

  public async autoGenerateArticle(articleTitle: string): Promise<Article> {
    const progressSubscription = this.articleEditorService.article.subscribe(
      (articleInProgress) => {
        this.article = articleInProgress;

        // calculates expected time to be taken, based on keywrds/ subtopics to search.
        const keywords = this.article?.metaInfo?.keywords || '';
        if (keywords) {
          this.autoGenerateExpectedTimeToFinish =
            60 + Math.ceil(keywords.split(', ').length / 3) * 60;
        }
      }
    );

    this.autoGenerateLoading = true;
    this.startAutoGenerateTimer();
    this.autoGenerateExpectedTimeToFinish = 60;

    const article = await this.articleEditorService.generateArticleFromOpenai(
      articleTitle,
      appConfig,
      '',
      '',
      ''
    );

    this.article = article;
    progressSubscription.unsubscribe();
    clearInterval(this.autoGenerateTimer);
    this.autoGenerateLoading = false;
    this.saveClicked(this.article);
    return article;
  }

  public startAutoGenerateTimer() {
    clearInterval(this.autoGenerateTimer);
    this.autoGenerateStartTime = Date.now();
    this.autoGenerateTimeEllapsed = 0;

    this.autoGenerateTimer = setInterval(() => {
      this.autoGenerateTimeEllapsed =
        (Date.now() - this.autoGenerateStartTime) / 1000;
    }, 1000);
  }
}
