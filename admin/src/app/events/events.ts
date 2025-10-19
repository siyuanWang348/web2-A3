import { Component } from '@angular/core';
import {Navbar} from '../navbar/navbar';
import {Footer} from '../footer/footer';

@Component({
  selector: 'app-events',
  imports: [Navbar, Footer],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class Events {

}
