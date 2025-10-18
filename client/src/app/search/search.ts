import { Component } from '@angular/core';
import {Navbar} from '../navbar/navbar';
import {Footer} from '../footer/footer';

@Component({
  selector: 'app-search',
  imports: [Navbar, Footer],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search {

}
