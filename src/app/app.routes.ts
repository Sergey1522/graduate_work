import { Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';
import { Singup } from './views/users/singup/singup';
import { Login } from './views/users/login/login';
import { Main } from './views/main/main/main';
import { Blog } from './views/blog/blog/blog';

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
        path: 'blog',
        component: Blog,
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
