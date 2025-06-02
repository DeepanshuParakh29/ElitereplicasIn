import { Collection, Db, ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { AdminUser, hashPassword, comparePassword } from '../models/adminUser';

// Collection name for admin users
const COLLECTION = 'adminUsers';

// Get the admin users collection
async function getCollection(): Promise<Collection<AdminUser>> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<AdminUser>(COLLECTION);
}

// Create a new admin user
export async function createAdminUser(userData: Omit<AdminUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<AdminUser> {
  const collection = await getCollection();
  
  // Check if username already exists
  const existingUser = await collection.findOne({ username: userData.username });
  if (existingUser) {
    throw new Error('Username already exists');
  }
  
  // Hash the password
  const hashedPassword = await hashPassword(userData.password);
  
  // Create the user object
  const newUser: AdminUser = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Insert the user
  const result = await collection.insertOne(newUser as any);
  
  // Return the created user
  return {
    ...newUser,
    _id: result.insertedId
  };
}

// Get admin user by ID
export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  const collection = await getCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

// Get admin user by username
export async function getAdminUserByUsername(username: string): Promise<AdminUser | null> {
  const collection = await getCollection();
  return collection.findOne({ username });
}

// Update admin user
export async function updateAdminUser(id: string, userData: Partial<AdminUser>): Promise<AdminUser | null> {
  const collection = await getCollection();
  
  // If password is being updated, hash it
  if (userData.password) {
    userData.password = await hashPassword(userData.password);
  }
  
  // Update the user
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { 
      $set: {
        ...userData,
        updatedAt: new Date()
      } 
    },
    { returnDocument: 'after' }
  );
  
  return result.value;
}

// Delete admin user
export async function deleteAdminUser(id: string): Promise<boolean> {
  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

// Get all admin users
export async function getAllAdminUsers(): Promise<AdminUser[]> {
  const collection = await getCollection();
  return collection.find().toArray();
}

// Authenticate admin user
export async function authenticateAdminUser(username: string, password: string): Promise<AdminUser | null> {
  const collection = await getCollection();
  const user = await collection.findOne({ username });
  
  if (!user) {
    return null;
  }
  
  const isPasswordValid = await comparePassword(password, user.password);
  
  if (!isPasswordValid) {
    return null;
  }
  
  // Update last login time
  await collection.updateOne(
    { _id: user._id },
    { $set: { lastLogin: new Date(), updatedAt: new Date() } }
  );
  
  return user;
}

// Initialize admin users collection with a default admin if none exists
export async function initializeAdminUsers(): Promise<void> {
  const collection = await getCollection();
  const count = await collection.countDocuments();
  
  if (count === 0) {
    // Create default admin user
    await createAdminUser({
      username: 'admin',
      password: 'admin123',
      name: 'Admin User',
      email: 'admin@elitereplicas.com',
      role: 'superadmin',
      status: 'active'
    });
    console.log('Created default admin user');
  }
}
