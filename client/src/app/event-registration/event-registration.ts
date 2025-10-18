import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Navbar} from '../navbar/navbar';
import {Footer} from '../footer/footer';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-event-registration',
  imports: [Navbar, Footer, CommonModule, FormsModule],
  templateUrl: './event-registration.html',
  styleUrl: './event-registration.css'
})
export class EventRegistration implements OnInit {
  eventId: string | null = null;
  event: any = null;
  error: string | null = null;

  registration = {
    user_name: '',
    user_email: '',
    user_phone: '',
    tickets: 1,
    notes: ''
  };

  successMsg = '';
  errorMsg = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // 从URL参数获取event_id
    this.eventId = this.route.snapshot.queryParamMap.get('event_id');

    if (this.eventId) {
      this.fetchEventDetails(this.eventId);
    } else {
      this.error = 'No valid event ID provided.';
    }
  }

  // 获取事件详情
  fetchEventDetails(id: string) {
    this.http.get(`http://localhost:3001/api/events/${id}`).subscribe({
      next: (res) => {
        this.event = res;
        this.error = null;
      },
      error: (err) => {
        console.error('Error loading event details:', err);
        this.event = null;
        this.error = 'Error loading event details.';
      }
    });
  }

  // 格式化日期
  formatDate(dateString: string): string {
    return dateString ? new Date(dateString).toLocaleString() : 'N/A';
  }

  // 提交注册
  submitRegistration() {
    this.successMsg = '';
    this.errorMsg = '';
    const eventId = this.eventId;

    // 检查字段是否填写
    if (!this.registration.user_name) {
      this.errorMsg = 'User name required!';
      return;
    }
    if (!this.registration.user_email) {
      this.errorMsg = 'User email required!';
      return;
    }
    if (!this.registration.tickets) {
      this.errorMsg = 'Tickets required!';
      return;
    }

    // 为活动添加注册
    this.http.post(`http://localhost:3001/api/events/${eventId}/register`, this.registration)
      .subscribe({
        next: (res: any) => {
          this.successMsg = 'Registration successful!';
          // 重置表单
          this.registration = {
            user_name: '',
            user_email: '',
            user_phone: '',
            tickets: 1,
            notes: ''
          };
        },
        error: (err) => {
          this.errorMsg = err.error?.error || 'Registration failed.';
        }
      });
  }
}
