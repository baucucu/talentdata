import HomePage from '../pages/home';
import NotFoundPage from '../pages/404';
import Candidates from '../pages/Candidates';

export default [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/candidates/:collection',
    component: Candidates,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];
