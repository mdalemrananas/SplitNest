#!/usr/bin/env node

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing MongoDB Connection...\n');

// Load environment variables manually
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  console.log('Please make sure you have a .env.local file with MONGODB_URI set.');
  process.exit(1);
}

console.log('📡 Connection string:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));

async function testConnection() {
  try {
    console.log('🔄 Attempting to connect...');
    
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test creating a simple document
    const TestSchema = new mongoose.Schema({
      name: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', TestSchema);
    
    const testDoc = new TestModel({ name: 'SplitNest Test' });
    await testDoc.save();
    
    console.log('✅ Successfully created test document');
    
    // Clean up test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document cleaned up');
    
    console.log('\n🎉 MongoDB is working perfectly!');
    console.log('You can now run: npm run dev');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Make sure MongoDB is running');
      console.log('2. Check if the connection string is correct');
      console.log('3. Verify the port (default: 27017)');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 Authentication error:');
      console.log('1. Check username and password in connection string');
      console.log('2. Make sure the user has proper permissions');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 DNS/Network error:');
      console.log('1. Check your internet connection (for Atlas)');
      console.log('2. Verify the hostname in connection string');
    }
    
    console.log('\n📚 For detailed setup instructions, see MONGODB_SETUP.md');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testConnection();
