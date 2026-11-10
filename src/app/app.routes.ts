import { Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';
import { Singup } from './views/users/singup/singup';
import { Login } from './views/users/login/login';
import { Main } from './views/main/main/main';
import { Blog } from './views/blog/blog/blog';
import { BlogDetailed } from './views/blog/blog-detailed/blog-detailed';
import { Policy } from './views/users/policy/policy';

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
        path: 'blog-detailed/:url',
        component: BlogDetailed,
      },
      {
        path: 'signup',
        component: Singup,
      },
      {
        path: 'login',
        component: Login,
      },
      { path: 'policy', component: Policy },
    ],
  },
];
