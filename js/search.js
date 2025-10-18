// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 加载类别列表
  const loadCategories = () => {
    fetch('http://localhost:3001/api/categories')
      .then(response => response.json())
      .then(categories => {
        const categorySelect = document.getElementById('category');
        
        categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.category_id;
          option.textContent = category.category_name;
          categorySelect.appendChild(option);
        });
      });
  };
  
  // 处理搜索提交
  const handleSearch = (event) => {
    event.preventDefault();
    
    // 获取表单值
    const dateInput = document.getElementById('date');
    const locationInput = document.getElementById('location');
    const categorySelect = document.getElementById('category');
    
    const date = dateInput.value;
    const location = locationInput.value;
    const categoryId = categorySelect.value;
    
    // 构建查询参数
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (location) params.append('location', encodeURIComponent(location));
    if (categoryId) params.append('category_id', categoryId);
    
    // 执行搜索请求
    fetch(`http://localhost:3001/api/search?${params.toString()}`)
      .then(response => response.json())
      .then(results => displaySearchResults(results))
      .catch(error => console.error('Search error:', error));
  };
  
  // 显示搜索结果
  const displaySearchResults = (events) => {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    
    if (events.length === 0) {
      resultsContainer.innerHTML = "<p>No events found.</p>";
      return;
    }
    
    events.forEach(event => {
      const eventCard = createResultCard(event);
      resultsContainer.appendChild(eventCard);
    });
  };
  
  // 创建结果卡片
  const createResultCard = (event) => {
    const card = document.createElement('div');
    card.className = "event-card";
    
    // 格式化日期
    const eventDate = new Date(event.event_date);
    const formattedDate = eventDate.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    });
    
    card.innerHTML = `
      <h3><a href="/event?event_id=${event.event_id}">${event.title}</a></h3>
      <p class="event-date">📅 ${formattedDate}</p>
      <p>📍 ${event.location}</p>
      <p>🏷️ ${event.category_name} | Org: ${event.org_name}</p>
      <button class="btn" onclick="window.location.href='/event?event_id=${event.event_id}'">🔍 View Details</button>
    `;
    
    return card;
  };
  
  // 清除筛选条件
  window.clearFilters = () => {
    document.getElementById('date').value = "";
    document.getElementById('location').value = "";
    document.getElementById('category').value = "";
    document.getElementById('results').innerHTML = "";
  };
  
  // 初始化
  loadCategories();
  document.getElementById('searchForm').addEventListener('submit', handleSearch);
});