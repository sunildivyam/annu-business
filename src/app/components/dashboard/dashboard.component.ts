import { Component, OnInit } from '@angular/core';
import { Tab } from '@annu/ng-lib';
import { tabs } from './dashboard.config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  tabs: Array<Tab> = [...tabs];
  activeTab: Tab;

  constructor() {
    this.activeTab = this.tabs[0];
  }

  ngOnInit(): void {
  }

  public tabClicked(tab: Tab): void {
    this.activeTab = tab;
  }
}
