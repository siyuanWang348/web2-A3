import { Routes } from '@angular/router';
import {Events} from './events/events';
import {Categories} from './categories/categories';

export const routes: Routes = [
  {
    path: '',
    component: Events
  },
  {
    path: 'categories',
    component: Categories
  }
];
