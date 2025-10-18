import { Routes } from '@angular/router';
import {Home} from './home/home';
import {Search} from './search/search';
import {Event} from './event/event';
import {EventRegistration} from './event-registration/event-registration';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'search',
    component: Search
  },
  {
    path: 'event',
    component: Event
  },
  {
    path: 'event-registration',
    component: EventRegistration
  }
];
