import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { AuthGuard } from '../../shared/auth-guard.services';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'roomrentals' },
        { path: 'roomrentals', loadChildren: () => import('../../pages/roomrentals/roomrentals.routes').then(m => m.ROOMRENTALS_ROUTES), canActivate:[AuthGuard] },
        { path: 'users', loadChildren: () => import('../../pages/users/users.routes').then(m => m.USERS_ROUTES), canActivate:[AuthGuard] },
        { path: 'rolegroups', loadChildren: () => import('../../pages/rolegroups/rolegroups.routes').then(m => m.ROLEGROUP_ROUTES), canActivate:[AuthGuard] },
    ]
  }
];