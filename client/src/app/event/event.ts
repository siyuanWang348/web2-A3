import { Component } from '@angular/core';
import {Navbar} from '../navbar/navbar';
import {Footer} from '../footer/footer';

@Component({
  selector: 'app-event',
  imports: [Navbar, Footer],
  templateUrl: './event.html',
  styleUrl: './event.css'
})
export class Event {

}
