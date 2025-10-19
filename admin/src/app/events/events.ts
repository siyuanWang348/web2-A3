import { Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EventService, EventItem } from '../event-service';
import { CategoryService } from '../category-service'; // 你已有的 category service
import { OrganizationService, Organization } from '../organization-service';


@Component({
  selector: 'app-events',
  imports: [Navbar, Footer, CommonModule, FormsModule],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class Events implements OnInit {
  events: EventItem[] = []; // 存储事件列表
  categories: any[] = []; // 存类别用于下拉选择
  organisations: Organization[] = []; // 存机构用于下拉选择
  showModal = false; // 控制弹窗显示
  modalMode: 'add' | 'edit' = 'add'; // 弹窗模式
  error = ''; // 错误提示信息

  // 当前编辑/新增的事件对象，字段对应后端
  currentEvent: EventItem = {
    title: '',
    description: '',
    event_date: '',
    location: '',
    ticket_price: 0.00,
    is_active: 1,
    charity_goal: 0.00,
    current_progress: 0.00,
    org_id: 0,
    category_id: 0,
    latitude: null,
    longitude: null
  };

  constructor(
    private eventService: EventService,
    private categoryService: CategoryService,
    private organisationService: OrganizationService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadCategories();
    this.loadOrganisations();
  }

  // 获取事件列表
  loadEvents() {
    this.eventService.getAll().subscribe(data => {
      this.events = data;
    }, err => {
      console.error('加载事件失败', err);
    });
  }

  // 获取类别列表
  loadCategories() {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data;
    }, err => {
      console.error('加载类别失败', err);
    });
  }

  // 获取机构列表
  loadOrganisations() {
    this.organisationService.getAll().subscribe(data => {
      this.organisations = data;
    }, err => {
      console.warn('加载机构失败', err);
      this.organisations = [];
    });
  }

  // 打开添加弹窗，重置表单
  openAddModal() {
    this.modalMode = 'add';
    this.currentEvent = {
      title: '',
      description: '',
      event_date: '',
      location: '',
      ticket_price: 0.00,
      is_active: 1,
      charity_goal: 0.00,
      current_progress: 0.00,
      org_id: 0,
      category_id: 0,
      latitude: null,
      longitude: null
    };
    this.error = '';
    this.showModal = true;
  }

  // 打开编辑弹窗，填充数据
  openEditModal(evt: EventItem) {
    this.modalMode = 'edit';
    // 保持 event_date 的字符串格式
    this.currentEvent = {
      ...evt,
      event_date: evt.event_date.replace('T', ' ').replace('Z', '')
    };
    this.error = '';
    this.showModal = true;
  }

  // 关闭弹窗
  closeModal() {
    this.showModal = false;
  }

  // 保存事件
  saveEvent() {
    this.error = '';

    // 基本校验
    if (!this.currentEvent.title || !this.currentEvent.event_date || !this.currentEvent.location) {
      this.error = 'Missing required fields: title, event_date, location.';
      return;
    }
    if (!this.currentEvent.charity_goal || Number(this.currentEvent.charity_goal) <= 0) {
      this.error = 'Charity goal must be greater than 0.';
      return;
    }
    if (!this.currentEvent.org_id || !this.currentEvent.category_id) {
      this.error = 'Please select organisation and category.';
      return;
    }

    // 将字段格式化为后端格式。
    const payload: EventItem = {
      ...this.currentEvent,
      ticket_price: Number(this.currentEvent.ticket_price) || 0.00,
      is_active: Number(this.currentEvent.is_active) ? 1 : 0,
      charity_goal: Number(this.currentEvent.charity_goal),
      current_progress: Number(this.currentEvent.current_progress) || 0.00,
      latitude: this.currentEvent.latitude === null ? null : Number(this.currentEvent.latitude),
      longitude: this.currentEvent.longitude === null ? null : Number(this.currentEvent.longitude)
    };

    if (this.modalMode === 'add') {
      this.eventService.create(payload).subscribe(() => {
        this.loadEvents();
        this.closeModal();
      }, err => {
        console.error('添加事件失败', err);
        this.error = err?.error?.error || 'Failed to create event.';
      });
    } else if (this.modalMode === 'edit' && this.currentEvent.event_id) {
      this.eventService.update(this.currentEvent.event_id, payload).subscribe(() => {
        this.loadEvents();
        this.closeModal();
      }, err => {
        console.error('更新事件失败', err);
        this.error = err?.error?.error || 'Failed to update event.';
      });
    }
  }

  // 删除事件
  deleteEvent(id?: number) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.delete(id).subscribe(() => {
        this.loadEvents();
      }, err => {
        console.error('删除事件失败', err);
        alert(err?.error?.error || 'Failed to delete event.');
      });
    }
  }
}
