# NodeJS-task-manager
In order to run this code on DEV and Test Environment.
Add Folder config then 
1.create an environment file (dev.env) for Development
  PORT=3000
  SENDGRID_API_KEY=SEND_GRID_API_KEY
  MONGODB_URL=mongodb://127.0.0.1:27017/YOUR_DB_NAME
  JWT_SECRET=YOUR_SECRET_KEY
2.create an environment file (test.env) for Testing
  PORT=3000
  SENDGRID_API_KEY=SEND_GRID_API_KEY_FOR_TEST
  MONGODB_URL=mongodb://127.0.0.1:27017/YOUR_DB_NAME_TEST
  JWT_SECRET=YOUR_SECRET_KEY_TEST
