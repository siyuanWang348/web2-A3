import { Component } from '@angular/core';
import {Navbar} from '../navbar/navbar';
import {Carousel} from '../carousel/carousel';

@Component({
  selector: 'app-home',
  imports: [Carousel, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
