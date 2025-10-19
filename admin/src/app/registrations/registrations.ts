import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { Registration, RegistrationService } from '../registration-service';

@Component({
  selector: 'app-registrations',
  imports: [Navbar, Footer, CommonModule, FormsModule],
  templateUrl: './registrations.html',
  styleUrl: './registrations.css'
})
export class Registrations implements OnInit {
  registrations: Registration[] = [];
  error = '';

  constructor(
    private registrationService: RegistrationService
  ) {}

  ngOnInit(): void {
    this.loadRegistrations();
  }

  loadRegistrations() {
    this.registrationService.getAll().subscribe(data => this.registrations = data);
  }

  deleteRegistration(id?: number) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this registration?')) {
      this.registrationService.delete(id).subscribe(() => {
        this.loadRegistrations();
      }, err => {
        this.error = err?.error?.error || 'Failed to delete registration.';
      });
    }
  }
}
