const { Sequelize } = require('sequelize');

// Load environment variables
const isProduction = process.env.NODE_ENV === 'production';
const DB_TYPE = process.env.DB_TYPE || 'mysql'; // Use 'mysql' or 'sqlite'

// MySQL configuration
const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mini_loan',
  dialect: 'mysql',
  logging: false,  // Disable SQL query logging in console
};

// SQLite configuration (for development or testing)
const sqliteConfig = {
  dialect: 'sqlite',
  storage: './database.sqlite', // SQLite file location
  logging: false,
};

// Initialize Sequelize instance based on DB_TYPE
const sequelize = new Sequelize(
  DB_TYPE === 'mysql' ? mysqlConfig.database : undefined,
  DB_TYPE === 'mysql' ? mysqlConfig.username : undefined,
  DB_TYPE === 'mysql' ? mysqlConfig.password : undefined,
  DB_TYPE === 'mysql' ? mysqlConfig : sqliteConfig
);

// Test database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
