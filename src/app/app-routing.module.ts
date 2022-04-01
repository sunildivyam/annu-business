import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routes as allRoutes } from './app.routes';
import { RouteGuardsModule } from '@annu/ng-lib';

const routes: Routes = allRoutes;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
    RouteGuardsModule,
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule { }
