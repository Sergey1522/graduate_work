import { Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';
import { Singup } from './views/users/singup/singup';
import { Login } from './views/users/login/login';
import { Main } from './views/main/main/main';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Main,
      },
      {
        path: 'signup',
        component: Singup,
      },
      {
        path: 'login',
        component: Login,
      },
    ],
  },
];
