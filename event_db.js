const mysql = require('mysql2');

// Create a database connection configuration object
const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: 'wsy20030313.',
  database: 'charityevents_db'
};

// Establish a database connection
const dbConnection = mysql.createConnection(connectionConfig);

// Handle connection events
dbConnection.connect((error) => {
  if (error) {
    console.error('数据库连接失败:', error.stack);
    return;
  }
  console.log(`✅ MySQL 已连接，连接ID: ${dbConnection.threadId}`);
});

module.exports = dbConnection;