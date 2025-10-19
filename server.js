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

// 管理活动列表接口 - 返回全部的活动
app.get('/api/events/all', (req, res) => {
  const eventQuery = `
    SELECT 
      e.*,
      c.category_name, 
      o.org_name
    FROM charity_events e
    INNER JOIN event_categories c ON e.category_id = c.category_id
    INNER JOIN charity_organizations o ON e.org_id = o.org_id
    ORDER BY e.event_date ASC
  `;

  handleQuery(res, eventQuery);
});

// 2. 活动详情接口 - 根据ID获取完整信息
app.get('/api/events/:id', (req, res) => {
  const eventId = req.params.id;

  // 2.1 查询活动详情
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

  db.query(detailQuery, [eventId], (err, results) => {
    if (err) {
      console.error('查询详情失败:', err);
      return res.status(500).json({ error: '获取详情出错' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: '活动不存在' });
    }

    const event = results[0];

    // 2.2 查询该活动的注册列表
    const regQuery = `
      SELECT 
        registration_id,
        user_name,
        user_email,
        user_phone,
        tickets,
        registered_at,
        notes
      FROM event_registrations
      WHERE event_id = ?
      ORDER BY registered_at ASC
    `;

    db.query(regQuery, [eventId], (regErr, regResults) => {
      if (regErr) {
        console.error('查询注册信息失败:', regErr);
        return res.status(500).json({ error: '获取注册信息出错' });
      }

      // 组合返回 JSON
      res.json({
        ...event,
        registrations: regResults // 注册列表放在 registrations 字段
      });
    });
  });
});

// 3. 活动类别列表接口
app.get('/api/categories', (req, res) => {
  handleQuery(res, 'SELECT * FROM event_categories ORDER BY category_name');
});

// 活动组织列表接口
app.get('/api/organizations', (req, res) => {
  handleQuery(res, 'SELECT * FROM charity_organizations ORDER BY org_name');
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

// 添加注册接口
app.post('/api/events/:id/register', (req, res) => {
  const eventId = req.params.id;
  const { user_name, user_email, user_phone, tickets, notes } = req.body;

  if (!user_name || !user_email || !tickets) {
    return res.status(400).json({
      error: 'Name, email, and ticket count are required.'
    });
  }

  // 1. 先检查该用户是否已注册这个活动
  const checkQuery = `SELECT * FROM event_registrations WHERE event_id = ? AND user_email = ?`;
  db.query(checkQuery, [eventId, user_email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      return res.status(400).json({
        error: 'You have already registered for this event.'
      });
    }

    // 2. 插入注册记录
    const insertQuery = `
      INSERT INTO event_registrations 
      (event_id, user_name, user_email, user_phone, tickets, notes, registered_at) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    db.query(insertQuery, [eventId, user_name, user_email, user_phone, tickets, notes], (err2, results2) => {
      if (err2) {
        return res.status(500).json({ error: 'Failed to register' });
      }
      res.json({
        success: true,
        registration_id: results2.insertId
      });
    });
  });
});


// 添加活动类别接口
app.post('/api/categories', (req, res) => {
  const { category_name, description } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: 'Category name is required.' });
  }

  const insertQuery = `
    INSERT INTO event_categories (category_name, description)
    VALUES (?, ?)
  `;
  db.query(insertQuery, [category_name, description || null], (err, results) => {
    if (err) {
      console.error('添加类别失败:', err);
      return res.status(500).json({ error: 'Failed to add category.' });
    }
    res.json({
      success: true,
      message: 'Category added successfully.',
      category_id: results.insertId
    });
  });
});


// 更新活动类别接口
app.put('/api/categories/:id', (req, res) => {
  const categoryId = req.params.id;
  const { category_name, description } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: 'Category name is required.' });
  }

  const updateQuery = `
    UPDATE event_categories
    SET category_name = ?, description = ?
    WHERE category_id = ?
  `;
  db.query(updateQuery, [category_name, description || null, categoryId], (err, results) => {
    if (err) {
      console.error('更新类别失败:', err);
      return res.status(500).json({ error: 'Failed to update category.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.json({
      success: true,
      message: 'Category updated successfully.'
    });
  });
});


// 删除活动类别接口
app.delete('/api/categories/:id', (req, res) => {
  const categoryId = req.params.id;

  // 防止删除有绑定活动的类别
  const checkQuery = `
    SELECT COUNT(*) AS count FROM charity_events WHERE category_id = ?
  `;
  db.query(checkQuery, [categoryId], (err, results) => {
    if (err) {
      console.error('检查关联活动失败:', err);
      return res.status(500).json({ error: 'Failed to check related events.' });
    }

    if (results[0].count > 0) {
      return res.status(400).json({
        error: 'Cannot delete category that is linked to existing events.'
      });
    }

    const deleteQuery = `DELETE FROM event_categories WHERE category_id = ?`;
    db.query(deleteQuery, [categoryId], (delErr, delResults) => {
      if (delErr) {
        console.error('删除类别失败:', delErr);
        return res.status(500).json({ error: 'Failed to delete category.' });
      }

      res.json({
        success: true,
        message: 'Category deleted successfully.'
      });
    });
  });
});


// 添加活动接口
app.post('/api/events', (req, res) => {
  const {title, description, event_date, location, ticket_price, is_active, charity_goal, current_progress, org_id, category_id, latitude, longitude} = req.body;

  // 基本验证
  if (!title || !event_date || !location || !charity_goal || !org_id || !category_id) {
    return res.status(400).json({
      error: 'Missing required fields: title, event_date, location, charity_goal, org_id, category_id.'
    });
  }

  const insertQuery = `
    INSERT INTO charity_events (
      title, description, event_date, location, ticket_price, is_active,
      charity_goal, current_progress, org_id, category_id, latitude, longitude
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [title, description, event_date, location, ticket_price, is_active, charity_goal, current_progress || 0.00, org_id, category_id, latitude, longitude];

  db.query(insertQuery, params, (err, results) => {
    if (err) {
      console.error('添加活动失败:', err);
      return res.status(500).json({ error: 'Failed to add event.' });
    }
    res.json({
      success: true,
      message: 'Event added successfully.',
      event_id: results.insertId
    });
  });
});

// 更新活动接口
app.put('/api/events/:id', (req, res) => {
  const eventId = req.params.id;
  const {title, description, event_date, location, ticket_price, is_active, charity_goal, current_progress, org_id, category_id, latitude, longitude} = req.body;

  // 基本验证
  if (!title || !event_date || !location || !charity_goal) {
    return res.status(400).json({
      error: 'Missing required fields: title, event_date, location, charity_goal.'
    });
  }

  const updateQuery = `
    UPDATE charity_events
    SET title = ?, description = ?, event_date = ?, location = ?, ticket_price = ?, is_active = ?, charity_goal = ?, current_progress = ?, org_id = ?, category_id = ?, latitude = ?, longitude = ?
    WHERE event_id = ?
  `;

  const params = [title, description, event_date, location, ticket_price, is_active, charity_goal, current_progress, org_id, category_id, latitude, longitude, eventId];

  db.query(updateQuery, params, (err, results) => {
    if (err) {
      console.error('更新活动失败:', err);
      return res.status(500).json({ error: 'Failed to update event.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    res.json({
      success: true,
      message: 'Event updated successfully.'
    });
  });
});


// 删除活动接口
app.delete('/api/events/:id', (req, res) => {
  const eventId = req.params.id;

  // 先检查是否存在注册记录
  const checkQuery = `SELECT COUNT(*) AS regCount FROM event_registrations WHERE event_id = ?`;

  db.query(checkQuery, [eventId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('检查注册记录失败:', checkErr);
      return res.status(500).json({ error: 'Failed to check registrations.' });
    }

    const regCount = checkResults[0].regCount;
    if (regCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete event that already has registrations.'
      });
    }

    // 若没有注册记录，则执行删除
    const deleteQuery = `DELETE FROM charity_events WHERE event_id = ?`;

    db.query(deleteQuery, [eventId], (delErr, delResults) => {
      if (delErr) {
        console.error('删除活动失败:', delErr);
        return res.status(500).json({ error: 'Failed to delete event.' });
      }
      res.json({
        success: true,
        message: 'Event deleted successfully.'
      });
    });
  });
});


// 获取所有注册记录接口
app.get('/api/registrations', (req, res) => {
  const query = `
    SELECT 
      r.registration_id,
      r.event_id,
      e.title AS event_title,
      r.user_name,
      r.user_email,
      r.user_phone,
      r.tickets,
      r.notes,
      r.registered_at
    FROM event_registrations r
    LEFT JOIN charity_events e ON r.event_id = e.event_id
    ORDER BY r.registered_at DESC
  `;

  handleQuery(res, query);
});


// 删除注册记录接口
app.delete('/api/registrations/:id', (req, res) => {
  const registrationId = req.params.id;

  const deleteQuery = `DELETE FROM event_registrations WHERE registration_id = ?`;

  db.query(deleteQuery, [registrationId], (err, results) => {
    if (err) {
      console.error('删除注册记录失败:', err);
      return res.status(500).json({ error: 'Failed to delete registration.' });
    }
    res.json({
      success: true,
      message: 'Registration deleted successfully.'
    });
  });
});

// 启动服务器
app.listen(serverPort, () => {
  console.log(`服务器已启动，运行在 http://localhost:${serverPort}`);
});
