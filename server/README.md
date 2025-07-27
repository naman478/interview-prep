# Bike Rental Backend - MongoDB Atlas

## Setup Instructions

### 1. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string from "Connect" → "Connect your application"
5. Replace `<username>`, `<password>`, and `<cluster-url>` in the connection string

### 2. Environment Configuration
1. Update the `.env` file with your MongoDB Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bikerental?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here-change-this
   PORT=5000
   ```

### 3. Install Dependencies
```bash
cd server
npm install
```

### 4. Seed Database (Optional)
```bash
node seedData.js
```

### 5. Start Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### 6. Test Connection
Visit: `http://localhost:5000/api/health`

## MongoDB Atlas Benefits
- ✅ **Free Tier**: 512MB storage, perfect for development
- ✅ **Cloud Hosted**: No local MongoDB installation needed
- ✅ **Automatic Backups**: Built-in data protection
- ✅ **Global Access**: Access from anywhere
- ✅ **Scalable**: Easy to upgrade when needed

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Bikes
- `GET /api/bikes` - Get all bikes with availability
- `GET /api/bikes/:id` - Get single bike
- `POST /api/bikes` - Add new bike (admin only)
- `PUT /api/bikes/:id` - Update bike (admin only)
- `DELETE /api/bikes/:id` - Delete bike (admin only)

### Bookings
- `POST /api/bookings` - Create new booking (requires auth)
- `GET /api/bookings/my-bookings` - Get user's bookings (requires auth)
- `GET /api/bookings/all` - Get all bookings (admin only)
- `GET /api/bookings/:id` - Get single booking (requires auth)
- `DELETE /api/bookings/:id` - Cancel booking (requires auth)

### Health Check
- `GET /api/health` - Check server and database status

## Default Users (after seeding)
- **Admin**: admin@example.com / password
- **User**: john@example.com / password  
- **User**: jane@example.com / password

## Features
- 🔐 JWT Authentication
- 👥 Role-based access control (user/admin)
- ⏰ Real-time bike availability checking
- 🚫 Booking conflict prevention
- 📱 User-specific booking history
- 🛠️ Admin dashboard functionality
- ☁️ MongoDB Atlas cloud database
- 🔍 Health monitoring endpoint

## Troubleshooting

### Connection Issues
1. Check your MongoDB Atlas connection string
2. Ensure your IP is whitelisted in Atlas (or use 0.0.0.0/0 for development)
3. Verify database user credentials
4. Check if cluster is running

### Common Errors
- **Authentication failed**: Check username/password in connection string
- **Network timeout**: Check IP whitelist in MongoDB Atlas
- **Database not found**: The database will be created automatically on first connection