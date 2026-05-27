const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const mongoUri = 'mongodb+srv://suprajushivajji_db_user:kCJmVsqi4OhdLaMG@cluster0.67hqku3.mongodb.net/innovyra';

async function createUser() {
  try {
    await mongoose.connect(mongoUri);
    const db = mongoose.connection.db;
    const users = db.collection('users');
    
    // Check if user exists
    const existingUser = await users.findOne({ email: 'test@test.com' });
    if (existingUser) {
      console.log('User exists:', existingUser.email);
      // Delete and recreate
      await users.deleteOne({ email: 'test@test.com' });
    }
    
    // Create new user
    const hashedPassword = await bcrypt.hash('TestPass123', 10);
    const result = await users.insertOne({
      email: 'test@test.com',
      password: hashedPassword,
      created_at: new Date()
    });
    console.log('User created with ID:', result.insertedId);
    
    await mongoose.disconnect();
  } catch (e) {
    console.error('Error:', e.message);
  }
}

createUser();
