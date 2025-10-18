document.addEventListener('DOMContentLoaded', () => {
  // 轮播图功能实现
  const carousel = {
    slidesContainer: document.querySelector('.carousel-slides'),
    slides: document.querySelectorAll('.carousel-slide'),
    prevBtn: document.querySelector('.prev'),
    nextBtn: document.querySelector('.next'),
    indicators: document.querySelectorAll('.indicator'),
    currentIndex: 0,
    slideInterval: null,
    
    init() {
      this.showSlide(this.currentIndex);
      this.startAutoPlay();
      this.bindEvents();
    },
    
    bindEvents() {
      this.prevBtn.addEventListener('click', () => this.showPreviousSlide());
      this.nextBtn.addEventListener('click', () => this.showNextSlide());
      
      this.indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
          this.currentIndex = parseInt(indicator.dataset.index);
          this.showSlide(this.currentIndex);
          this.resetAutoPlay();
        });
      });
      
      this.slidesContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
      this.slidesContainer.addEventListener('mouseleave', () => this.startAutoPlay());
    },
    
    showSlide(index) {
      // 处理边界情况
      if (index < 0) {
        this.currentIndex = this.slides.length - 1;
      } else if (index >= this.slides.length) {
        this.currentIndex = 0;
      } else {
        this.currentIndex = index;
      }
      
      // 更新轮播位置
      this.slidesContainer.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      
      // 更新指示器状态
      this.indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === this.currentIndex);
      });
    },
    
    showPreviousSlide() {
      this.showSlide(this.currentIndex - 1);
      this.resetAutoPlay();
    },
    
    showNextSlide() {
      this.showSlide(this.currentIndex + 1);
      this.resetAutoPlay();
    },
    
    startAutoPlay() {
      this.slideInterval = setInterval(() => this.showNextSlide(), 5000);
    },
    
    stopAutoPlay() {
      clearInterval(this.slideInterval);
    },
    
    resetAutoPlay() {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  };
  
  // 初始化轮播图
  carousel.init();

  // 事件列表加载功能
  const loadEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    fetch('http://localhost:3001/api/events')
      .then(response => response.json())
      .then(events => {
        const upcomingContainer = document.getElementById('upcoming-events');
        const pastContainer = document.getElementById('past-events');
        
        // 过滤违规事件
        const validEvents = events.filter(event => !event.is_violating_policy);
        
        // 分类事件为即将到来和已过去
        const { upcomingEvents, pastEvents } = validEvents.reduce((acc, event) => {
          const eventDate = new Date(event.event_date);
          eventDate.setHours(0, 0, 0, 0);
          
          if (eventDate < today) {
            acc.pastEvents.push(event);
          } else {
            acc.upcomingEvents.push(event);
          }
          return acc;
        }, { upcomingEvents: [], pastEvents: [] });
        
        // 初始化容器
        upcomingContainer.innerHTML = upcomingEvents.length ? '' : "<p>No upcoming events available.</p>";
        pastContainer.innerHTML = pastEvents.length ? '' : "<p>No past events recorded.</p>";
        
        // 添加事件卡片
        upcomingEvents.forEach(event => {
          upcomingContainer.appendChild(createEventCard(event, 'upcoming', 'Upcoming'));
        });
        
        pastEvents.forEach(event => {
          pastContainer.appendChild(createEventCard(event, 'past', 'Past'));
        });
      })
      .catch(error => {
        console.error("Error loading events:", error);
      });
  };
  
  // 创建事件卡片
  const createEventCard = (event, status, statusText) => {
    const card = document.createElement('div');
    card.className = `event-card ${status}`;
    
    card.innerHTML = `
      ${event.image_url ? `<img src="${event.image_url}" alt="${event.title}" class="event-image">` : ''}
      <div class="event-status ${status}">${statusText}</div>
      <h3>${event.title}</h3>
      <p>📅 ${new Date(event.event_date).toLocaleString()}</p>
      <p>📍 ${event.location}</p>
      <p>🏷️ ${event.category_name || 'Uncategorized'} | Organized by ${event.org_name || 'Unknown Organization'}</p>
      <a href="/event?event_id=${event.event_id}" class="btn">🔍 View Details</a>
    `;
    
    return card;
  };
  
  // 加载事件列表
  loadEvents();
});