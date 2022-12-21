import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFirebaseService, FIREBASE_AUTH_ROLES } from '@annu/ng-lib';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isAuthor: boolean = false;
  isAdmin: boolean = false;

  constructor(public route: ActivatedRoute, private router: Router, public authFireSvc: AuthFirebaseService) {

  }

  ngOnInit(): void {
    this.isAuthorFn();
    this.isAdminFn();
  }

  public async isAuthorFn(): Promise<boolean> {
    this.isAuthor = await this.authFireSvc.currentUserHasRole(FIREBASE_AUTH_ROLES.AUTHOR);

    return this.isAuthor;
  }

  public async isAdminFn(): Promise<boolean> {
    this.isAdmin = await this.authFireSvc.currentUserHasRole(FIREBASE_AUTH_ROLES.ADMIN);

    return this.isAdmin;
  }

  public onOutletActivated(): void {
  }
}
