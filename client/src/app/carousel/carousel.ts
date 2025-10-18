import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css'
})
export class Carousel implements OnInit {
  slides = [
    { image: '/images/1.jpg', title: 'Join Hands for a Better World', text: 'Together, we can make a difference.' },
    { image: '/images/2.jpg', title: 'Support Education & Hope', text: 'Help children access quality learning opportunities.' },
    { image: '/images/3.jpg', title: 'Assisting the people affected by the disaster', text: 'Our Shared Mission to Assist' }
  ];

  currentIndex = 0;
  slideInterval: any;

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  // 轮播逻辑
  showSlide(index: number): void {
    if (index < 0) index = this.slides.length - 1;
    if (index >= this.slides.length) index = 0;
    this.currentIndex = index;
  }

  showPreviousSlide(): void {
    this.showSlide(this.currentIndex - 1);
    this.resetAutoPlay();
  }

  showNextSlide(): void {
    this.showSlide(this.currentIndex + 1);
    this.resetAutoPlay();
  }

  startAutoPlay(): void {
    this.slideInterval = setInterval(() => this.showNextSlide(), 5000);
  }

  stopAutoPlay(): void {
    clearInterval(this.slideInterval);
  }

  resetAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}
