# MongoDB Setup Guide for SplitNest

## Option 1: MongoDB Atlas (Cloud - Recommended for Development)

This is the easiest way to get started without installing MongoDB locally.

### Steps:
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string
5. Update your `.env.local` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/splitnest?retryWrites=true&w=majority
```

## Option 2: Local MongoDB Installation

### Windows:
1. Download MongoDB Community Server from [here](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service
5. Start the MongoDB service from Windows Services

### macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Linux (Ubuntu/Debian):
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Option 3: Docker (Alternative)

If you have Docker installed:

```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# To stop: docker stop mongodb
# To start: docker start mongodb
```

## Testing Your Connection

After setting up MongoDB, test the connection:

```bash
# For local MongoDB
mongosh mongodb://localhost:27017/splitnest

# For MongoDB Atlas
mongosh "your-connection-string"
```

## Troubleshooting

### Windows Issues:
- Make sure MongoDB service is running in Windows Services
- Check if MongoDB is in your PATH environment variable
- Try running as Administrator

### Connection Issues:
- Check your firewall settings
- Verify the connection string format
- Ensure MongoDB is listening on the correct port (27017)

### Common Error Solutions:
1. **"MongoDB not found"**: Add MongoDB bin directory to PATH
2. **"Connection refused"**: Start MongoDB service
3. **"Authentication failed"**: Check username/password in connection string

## Quick Test

Run this command to test if MongoDB is working:

```bash
npm run test-db
```

This will attempt to connect to your MongoDB instance and create a test document.
