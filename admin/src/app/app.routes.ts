import { Routes } from '@angular/router';
import {Events} from './events/events';
import {Categories} from './categories/categories';
import {Registrations} from './registrations/registrations';

export const routes: Routes = [
  {
    path: '',
    component: Events
  },
  {
    path: 'categories',
    component: Categories
  },
  {
    path: 'registrations',
    component: Registrations
  }
];
