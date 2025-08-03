# Server Deployment Guide

## Deploying to a Production Environment

This guide provides instructions for deploying the backend server to various production environments.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB database (Atlas or self-hosted)

## Environment Variables

Ensure the following environment variables are set in your production environment:

```
NODE_ENV=production
PORT=5000 (or your preferred port)
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

## Deployment Options

### Option 1: Traditional Hosting (DigitalOcean, AWS EC2, etc.)

1. SSH into your server
2. Clone the repository
   ```
   git clone https://github.com/yourusername/linkedin-clone.git
   cd linkedin-clone
   ```
3. Install dependencies
   ```
   npm run install-all
   ```
4. Build the client
   ```
   npm run build
   ```
5. Set up environment variables
   ```
   export NODE_ENV=production
   export PORT=5000
   export MONGO_URI=your_mongodb_connection_string
   export JWT_SECRET=your_jwt_secret
   export JWT_EXPIRE=30d
   export JWT_COOKIE_EXPIRE=30
   ```
6. Start the server
   ```
   npm start
   ```
7. Use a process manager like PM2 to keep the server running
   ```
   npm install -g pm2
   pm2 start server/server.js --name "linkedin-clone"
   ```

### Option 2: Heroku

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku CLI
   ```
   heroku login
   ```
3. Create a new Heroku app
   ```
   heroku create your-app-name
   ```
4. Add MongoDB add-on or set your MongoDB Atlas connection string
   ```
   heroku config:set MONGO_URI=your_mongodb_connection_string
   ```
5. Set other environment variables
   ```
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set JWT_EXPIRE=30d
   heroku config:set JWT_COOKIE_EXPIRE=30
   heroku config:set NODE_ENV=production
   ```
6. Push to Heroku
   ```
   git push heroku main
   ```

### Option 3: Docker

1. Create a Dockerfile in the server directory:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

2. Build the Docker image
   ```
   docker build -t linkedin-clone-server .
   ```

3. Run the Docker container
   ```
   docker run -p 5000:5000 \
     -e NODE_ENV=production \
     -e PORT=5000 \
     -e MONGO_URI=your_mongodb_connection_string \
     -e JWT_SECRET=your_jwt_secret \
     -e JWT_EXPIRE=30d \
     -e JWT_COOKIE_EXPIRE=30 \
     linkedin-clone-server
   ```

## Connecting Frontend to Backend

Ensure your frontend is configured to connect to your deployed backend API:

1. Update the `REACT_APP_API_URL` in your frontend environment to point to your deployed backend URL
2. Rebuild and deploy your frontend application

## SSL/HTTPS

For production deployments, always use HTTPS:

1. Set up SSL certificates using Let's Encrypt or your hosting provider's SSL options
2. Configure your web server (Nginx, Apache) to handle SSL termination
3. Update your frontend to use the HTTPS URL for the backend API

## Monitoring and Logging

Consider setting up monitoring and logging for your production deployment:

1. Use PM2 for process monitoring
2. Set up application logging with Winston or similar
3. Consider using a service like Sentry for error tracking
4. Set up uptime monitoring with services like UptimeRobot or Pingdom