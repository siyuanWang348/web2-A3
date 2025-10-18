// 获取URL中的事件ID参数
const getEventId = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get('event_id');
};

// 通过手动输入的ID加载事件详情
const loadEventByManualId = () => {
  const inputElement = document.getElementById('manualId');
  const manualId = inputElement.value.trim();
  
  if (manualId && !isNaN(manualId)) {
    fetchEventDetails(manualId);
  } else {
    alert('Please enter a valid event ID');
  }
};

// 计算进度百分比
const calculateProgress = (current, goal) => {
  if (!goal) return 0;
  return Math.min(Math.round((current / goal) * 100), 100);
};

// 格式化日期显示
const formatDate = (dateString) => {
  return dateString ? new Date(dateString).toLocaleString() : 'N/A';
};

// 加载并展示事件详情
const fetchEventDetails = (eventId) => {
  fetch(`http://localhost:3001/api/events/${eventId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(event => {
      // 隐藏手动输入区域
      document.getElementById('manualIdEntry').style.display = 'none';
      
      const detailsContainer = document.getElementById('eventDetails');
      const progressPercent = calculateProgress(event.current_progress, event.charity_goal);
      
      detailsContainer.innerHTML = `
        <div class="event-card">
          <h2>${event.title || 'N/A'}</h2>
          <div class="event-info">
            <p><strong>Date:</strong> ${formatDate(event.event_date)}</p>
            <p><strong>Location:</strong> ${event.location || 'N/A'}</p>
            <p><strong>Category:</strong> ${event.category_name || 'N/A'}</p>
            <p><strong>Organization:</strong> ${event.org_name || 'N/A'}</p>
            <p><strong>Contact:</strong> ${event.contact_email || 'N/A'}, ${event.contact_phone || 'N/A'}</p>
          </div>
          <p class="desc">${event.description || 'N/A'}</p>
          <div class="goal-section">
            <p><strong>🎯 Goal:</strong> $${event.charity_goal ?? 'N/A'} | <strong>Progress:</strong> $${event.current_progress ?? 'N/A'}</p>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
          </div>
          <p><strong>Ticket Price:</strong> $${event.ticket_price ?? 'N/A'}</p>
          <button class="btn primary" onclick="alert('Registration feature under development.')">Register</button>
        </div>
      `;
    })
    .catch(error => {
      document.getElementById('eventDetails').innerHTML = `<p class="error">Error loading event details.</p>`;
      console.error("Error:", error);
    });
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  const eventId = getEventId();
  const detailsContainer = document.getElementById('eventDetails');
  
  if (eventId) {
    fetchEventDetails(eventId);
  } else {
    detailsContainer.innerHTML = `<p>No valid event ID provided.</p>`;
  }
});