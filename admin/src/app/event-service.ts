import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventItem {
  event_id?: number;
  title: string;
  description?: string;
  event_date: string;
  location: string;
  ticket_price?: number;
  is_active?: number;
  charity_goal: number;
  current_progress?: number;
  org_id: number;
  category_id: number;
  org_name?: string;
  category_name?: string;
  latitude?: number | null;
  longitude?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3001/api/events';

  constructor(private http: HttpClient) {}

  // 获取所有事件
  getAll(): Observable<EventItem[]> {
    return this.http.get<EventItem[]>(`${this.apiUrl}/all`);
  }

  // 创建事件
  create(event: EventItem): Observable<any> {
    return this.http.post(this.apiUrl, event);
  }

  // 更新事件
  update(id: number, event: EventItem): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, event);
  }

  // 删除事件
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
