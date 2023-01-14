import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { routes as allRoutes } from './app.routes';

const routes: Routes = allRoutes;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking'}),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
