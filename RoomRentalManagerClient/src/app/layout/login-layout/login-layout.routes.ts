import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './login-layout.component';
import { LoginComponent } from '../../pages/login/login.component';

export const LOGIN_ROUTES: Routes = [
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: LoginComponent }
    ]
  }
];