import { Routes } from '@angular/router';
import { AuthGuard } from './shared/auth-guard.services';
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', loadChildren: () => import('./layout/login-layout/login-layout.routes').then(m => m.LOGIN_ROUTES) },
  { path: 'main', loadChildren: () => import('./layout/main-layout/main-layout.routes').then(m => m.MAIN_ROUTES), canActivate:[AuthGuard] },
];
