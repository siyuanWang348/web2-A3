import { Component, OnInit } from '@angular/core';
import {Category, CategoryService} from '../category-service';
import {Navbar} from '../navbar/navbar';
import {Footer} from '../footer/footer';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-categories',
  imports: [Navbar, Footer, CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories {
  categories: Category[] = [];
  showModal = false;
  modalMode: 'add' | 'edit' = 'add'; // 弹窗类型
  currentCategory: Category = { // 存储当前类型表单输入
    category_name: '',
    description: ''
  }
  error = "" // 错误信息提示

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // 获取类型列表
  loadCategories() {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data;
    });
  }

  // 打开添加弹窗，需要重置表单内容
  openAddModal() {
    this.modalMode = 'add';
    this.currentCategory = {
      category_name: '',
      description: ''
    };
    this.showModal = true;
  }

  // 打开编辑弹窗，需要填充当前类型到输入框
  openEditModal(category: Category) {
    this.modalMode = 'edit';
    this.currentCategory = { ...category };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // 保存类型
  saveCategory() {
    this.error = ""

    // 验证名称输入
    if (!this.currentCategory.category_name.trim()) {
      this.error = "Category name required.";
    }

    // 执行添加或更新，然后重新加载类型列表，关闭弹窗
    if (this.modalMode === 'add') {
      this.categoryService.create(this.currentCategory).subscribe(() => {
        this.loadCategories();
        this.closeModal();
      });
    } else if (this.modalMode === 'edit' && this.currentCategory.category_id) {
      this.categoryService.update(this.currentCategory.category_id, this.currentCategory).subscribe(() => {
        this.loadCategories();
        this.closeModal();
      });
    }
  }

  // 删除类型
  deleteCategory(id?: number) {
    if (!id) return;
    // 确认删除类型
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.delete(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }
}
