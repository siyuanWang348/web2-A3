import { Component } from '@angular/core';
import {Navbar} from '../navbar/navbar';
import {Carousel} from '../carousel/carousel';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Carousel, Navbar, CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  upcomingEvents: any[] = [];
  pastEvents: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  // 获取活动列表
  loadEvents(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.http.get<any[]>('http://localhost:3001/api/events').subscribe({
      next: (events) => {
        const validEvents = events.filter(e => !e.is_violating_policy);

        this.upcomingEvents = validEvents.filter(e => new Date(e.event_date) >= today);
        this.pastEvents = validEvents.filter(e => new Date(e.event_date) < today);
      },
      error: (err) => {
        console.error('Error loading events:', err);
      }
    });
  }
}
