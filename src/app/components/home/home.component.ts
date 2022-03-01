import { Component, OnInit } from '@angular/core';
import { ArticlesFirebaseService, QueryConfig } from '@annu/ng-lib';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private articleFireSvc: ArticlesFirebaseService) { }

  ngOnInit(): void {
  }

  private async loadPageData() {
    const cats = await this.getAllCategories() || [];
  }

  private async getAllCategories() {
    const queryConfig: QueryConfig = {
      isLive: true,
    }

    return await this.articleFireSvc.getCategories(queryConfig);
  }
}
