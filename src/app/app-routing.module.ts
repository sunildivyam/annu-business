import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routes as allRoutes } from './app.routes';
import { IsLoggedInGuard } from '@annu/ng-lib';

const routes: Routes = allRoutes;

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule],
  providers: [IsLoggedInGuard],
})
export class AppRoutingModule { }
