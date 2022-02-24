import { Routes } from "@angular/router";
import { HomeComponent, ContactUsComponent, LoginComponent, MyProfileComponent, TncComponent, PrivacyPolicyComponent } from "./components";


// Main Nav Routes
export const mainRoutes = [
  { path: 'home', component: HomeComponent, data: { title: 'Home' } },
  { path: 'contact-us', component: ContactUsComponent, data: { title: 'Contact Us' } },
  { path: 'my-profile', component: MyProfileComponent, data: { title: 'My Profile' } },
]

// Auth Routes
export const authRoutes = [
  { path: 'login', component: LoginComponent, data: { title: 'Sign In' } },
]

// tNc Routes
export const tNcRoutes = [
  { path: 'tnc', component: TncComponent, data: { title: 'Terms and Conditions' } },
  { path: 'privacy-policy', component: PrivacyPolicyComponent, data: { title: 'Privacy Policy' } },
]

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Main Routes
  ...mainRoutes,

  // Auth Routes
  ...authRoutes,

  // tNc Routes
  ...tNcRoutes,
];
