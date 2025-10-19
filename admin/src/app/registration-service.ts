import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Registration {
  registration_id?: number;
  event_id: number;
  event_title?: number;
  user_name: string;
  user_email: string;
  user_phone?: string;
  tickets: number;
  notes?: string;
  registered_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:3001/api/registrations';

  constructor(private http: HttpClient) {}

  // 获取所有注册
  getAll(): Observable<Registration[]> {
    return this.http.get<Registration[]>(this.apiUrl);
  }

  // 删除注册
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
