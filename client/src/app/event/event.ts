import {Component, OnInit} from '@angular/core';
import {Navbar} from '../navbar/navbar';
import {Footer} from '../footer/footer';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-event',
  imports: [Navbar, Footer, CommonModule],
  templateUrl: './event.html',
  styleUrl: './event.css'
})
export class Event implements OnInit {
  event: any = null;
  eventId: string | null = null;
  error: string | null = null;

  // 天气信息
  weather: any = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // 从URL参数获取event_id
    this.eventId = this.route.snapshot.queryParamMap.get('event_id');

    if (this.eventId) {
      this.fetchEventDetails(this.eventId);
    } else {
      this.error = 'No valid event ID provided.';
    }
  }

  // 计算进度百分比
  calculateProgress(current: number, goal: number): number {
    if (!goal) return 0;
    return Math.min(Math.round((current / goal) * 100), 100);
  }

  // 格式化日期
  formatDate(dateString: string): string {
    return dateString ? new Date(dateString).toLocaleString() : 'N/A';
  }

  // 手动输入加载
  loadEventByManualId(input: HTMLInputElement) {
    const id = input.value.trim();
    if (id && !isNaN(Number(id))) {
      this.fetchEventDetails(id);
    } else {
      alert('Please enter a valid event ID');
    }
  }

  // 获取事件详情
  fetchEventDetails(id: string) {
    this.http.get(`http://localhost:3001/api/events/${id}`).subscribe({
      next: (res) => {
        this.event = res;
        this.error = null;

        // 获取天气信息
        if (this.event.latitude && this.event.longitude) {
          this.fetchWeather(this.event.latitude, this.event.longitude);
        }
      },
      error: (err) => {
        console.error('Error loading event details:', err);
        this.event = null;
        this.error = 'Error loading event details.';
      }
    });
  }

  // 获取天气
  fetchWeather(lat: number, lon: number) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Australia/Sydney`;
    this.http.get(url).subscribe({
      next: (res: any) => {
        // 我们只取当天数据
        if (res.daily && res.daily.time && res.daily.time.length > 0) {
          this.weather = {
            date: res.daily.time[0],
            temp_max: res.daily.temperature_2m_max[0],
            temp_min: res.daily.temperature_2m_min[0]
          };
        }
      },
      error: (err) => {
        console.error('Error fetching weather:', err);
        this.weather = null;
      }
    });
  }

  // 跳转到注册页面
  register() {
    this.router.navigate(['event-registration'], { queryParams: { event_id: this.event.event_id } })
  }
}
