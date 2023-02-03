import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  returnUrl: string = '';
  code: string = 'UNKNOWN';
  message: string = 'Something went wrong.'
  stack: string = '';

  constructor(private router: Router, private location: Location, private route: ActivatedRoute) {
    this.route.params.subscribe(() => this.setError())
  }

  ngOnInit(): void {
  }


  private setError() {
    const error = this.router.getCurrentNavigation()?.extras?.state?.error;
    this.code = error?.code || 'UNKNOWN';
    this.message = error?.message || 'Something went wrong.';
    this.returnUrl = error?.target?.url || error?.targetUrl || '';
    this.stack = !environment.production && error?.stack;
  }
}
