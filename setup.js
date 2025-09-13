#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🏠 SplitNest Setup Script');
console.log('========================\n');

// Check if .env.local already exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Skipping environment setup.');
  console.log('   If you need to update it, please edit .env.local manually.\n');
} else {
  // Generate a random secret for NextAuth
  const nextAuthSecret = crypto.randomBytes(32).toString('hex');
  
  // Create .env.local file
  const envContent = `# Database
MONGODB_URI=mongodb://localhost:27017/splitnest

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${nextAuthSecret}

# Google OAuth (optional - for Google sign-in)
# Get these from https://console.developers.google.com/
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file with default configuration');
  console.log('   Please update the MongoDB URI and Google OAuth credentials as needed.\n');
}

// Check if MongoDB is running (basic check)
const { exec } = require('child_process');

// Try multiple ways to check MongoDB
const checkMongoDB = () => {
  const commands = [
    'mongod --version',
    'mongo --version', 
    'mongosh --version',
    'sc query MongoDB'
  ];
  
  let found = false;
  let completed = 0;
  
  commands.forEach((cmd, index) => {
    exec(cmd, (error, stdout, stderr) => {
      completed++;
      
      if (!error && !found) {
        found = true;
        console.log('✅ MongoDB is available');
        return;
      }
      
      if (completed === commands.length && !found) {
        console.log('⚠️  MongoDB doesn\'t seem to be installed or running.');
        console.log('   Please install MongoDB and start the service:');
        console.log('   - Windows: Download from https://www.mongodb.com/try/download/community');
        console.log('   - macOS: brew install mongodb-community');
        console.log('   - Linux: sudo apt-get install mongodb');
        console.log('   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas\n');
      }
    });
  });
};

checkMongoDB();

console.log('🚀 Next steps:');
console.log('1. Make sure MongoDB is running on your system');
console.log('2. Update .env.local with your MongoDB connection string');
console.log('3. (Optional) Set up Google OAuth for social login');
console.log('4. Run: npm run dev');
console.log('5. Open: http://localhost:3000\n');

console.log('📚 For detailed setup instructions, see README.md');
console.log('🎉 Happy coding with SplitNest!');
