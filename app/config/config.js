const fs = require('fs');
const path = require('path');

// Load environment variables from env.json
const envFilePath = path.join(__dirname, '../../config.json');
const rawEnvData = fs.readFileSync(envFilePath);
const envData = JSON.parse(rawEnvData);

// Determine the environment based on NODE_ENV (default to 'development')
const currentEnv = process.env.NODE_ENV || 'local';
// Get the configuration for the current environment
const currentEnvConfig = envData[currentEnv];

// Set environment variables globally
process.env = { ...process.env, ...currentEnvConfig };
console.log("Current Environment: ", currentEnv);

module.exports = {
  PORT: process.env.PORT,
  db: {
    username: process.env.username,
    password: process.env.password,
    database: process.env.database,
    host: process.env.host,
    dialect: process.env.dialect,
    port: process.env.port
  }
};
