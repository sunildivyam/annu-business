import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {

  }

  public onOutletActivated():void {
  }
}
