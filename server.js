// 导入所需模块
const express = require('express');
const cors = require('cors');
const db = require('./event_db');

// 初始化应用及配置
const app = express();
const serverPort = 3001;

// 配置中间件
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10kb' }));

// 数据库查询处理工具函数
const handleQuery = (res, query, params = []) => {
  db.query(query, params, (error, results) => {
    if (error) {
      console.error('数据库查询失败:', error.message);
      return res.status(500).json({ error: '数据库操作出错' });
    }
    res.json(results);
  });
};

// 1. 首页活动列表接口 - 仅返回未过期且激活的活动
app.get('/api/events', (req, res) => {
  const eventQuery = `
    SELECT 
      e.event_id, 
      e.title, 
      e.event_date, 
      e.location, 
      e.ticket_price,
      c.category_name, 
      o.org_name
    FROM charity_events e
    INNER JOIN event_categories c ON e.category_id = c.category_id
    INNER JOIN charity_organizations o ON e.org_id = o.org_id
    WHERE e.is_active = 1 
      AND e.event_date >= CURRENT_DATE()
    ORDER BY e.event_date ASC
  `;
  
  handleQuery(res, eventQuery);
});

// 2. 活动详情接口 - 根据ID获取完整信息
app.get('/api/events/:id', (req, res) => {
  const detailQuery = `
    SELECT 
      e.*, 
      c.category_name, 
      o.org_name, 
      o.contact_email, 
      o.contact_phone, 
      o.website
    FROM charity_events e
    LEFT JOIN event_categories c ON e.category_id = c.category_id
    LEFT JOIN charity_organizations o ON e.org_id = o.org_id
    WHERE e.event_id = ?
  `;
  
  db.query(detailQuery, [req.params.id], (err, results) => {
    if (err) {
      console.error('查询详情失败:', err);
      return res.status(500).json({ error: '获取详情出错' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: '活动不存在' });
    }
    
    res.json(results[0]);
  });
});

// 3. 活动类别列表接口
app.get('/api/categories', (req, res) => {
  handleQuery(res, 'SELECT * FROM event_categories ORDER BY category_name');
});

// 4. 活动搜索接口 - 支持多条件筛选
app.get('/api/search', (req, res) => {
  const { date, location, category_id } = req.query;
  const queryParams = [];
  let searchQuery = `
    SELECT 
      e.event_id, 
      e.title, 
      e.event_date, 
      e.location, 
      e.ticket_price,
      c.category_name, 
      o.org_name
    FROM charity_events e
    LEFT JOIN event_categories c ON e.category_id = c.category_id
    LEFT JOIN charity_organizations o ON e.org_id = o.org_id
    WHERE e.is_active = 1
  `;

  // 构建查询条件
  if (date) {
    searchQuery += ' AND DATE(e.event_date) = ?';
    queryParams.push(date);
  }
  
  if (location) {
    searchQuery += ' AND e.location LIKE ?';
    queryParams.push(`%${location}%`);
  }
  
  if (category_id) {
    searchQuery += ' AND e.category_id = ?';
    queryParams.push(category_id);
  }

  // 排序条件
  searchQuery += ' ORDER BY e.event_date ASC';
  
  handleQuery(res, searchQuery, queryParams);
});

// 启动服务器
app.listen(serverPort, () => {
  console.log(`服务器已启动，运行在 http://localhost:${serverPort}`);
});