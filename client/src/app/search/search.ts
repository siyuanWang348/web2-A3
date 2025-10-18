import {Component, OnInit} from '@angular/core';
import {Navbar} from '../navbar/navbar';
import {Footer} from '../footer/footer';
import {HttpClient} from '@angular/common/http';
import {Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [Navbar, Footer, CommonModule, FormsModule, RouterModule],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit {
  categories: any[] = [];
  results: any[] = [];
  loading = false;
  errorMessage = '';

  filters = {
    date: '',
    location: '',
    category_id: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // 加载类别下拉框数据
  loadCategories(): void {
    this.http.get<any[]>('http://localhost:3001/api/categories').subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  // 搜索事件
  handleSearch(): void {
    this.errorMessage = '';
    this.loading = true;

    const params = new URLSearchParams();
    if (this.filters.date) params.append('date', this.filters.date);
    if (this.filters.location) params.append('location', this.filters.location);
    if (this.filters.category_id) params.append('category_id', this.filters.category_id);

    const url = `http://localhost:3001/api/search?${params.toString()}`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Search error:', err);
        this.errorMessage = 'An error occurred while searching.';
        this.loading = false;
      }
    });
  }

  // 清空筛选条件
  clearFilters(): void {
    this.filters = { date: '', location: '', category_id: '' };
    this.results = [];
    this.errorMessage = '';
  }

  // 跳转详情页
  viewEvent(eventId: number): void {
    this.router.navigate(['/event'], { queryParams: { event_id: eventId } });
  }
}
