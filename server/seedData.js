const mongoose = require('mongoose');
const Bike = require('./models/Bike');
const User = require('./models/User');

const seedBikes = [
  {
    name: "Urban Cruiser",
    type: "electric",
    imageUrl: "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Perfect for city commuting with electric assist",
    pricePerHour: 15,
    location: "Downtown",
    rating: 4.8,
    features: ["Electric", "GPS", "Light", "Lock"]
  },
  {
    name: "Mountain Explorer",
    type: "mountain",
    imageUrl: "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Rugged mountain bike for off-road adventures",
    pricePerHour: 12,
    location: "North Station",
    rating: 4.6,
    features: ["Suspension", "All-terrain", "Water bottle", "Repair kit"]
  },
  {
    name: "Speed Demon",
    type: "road",
    imageUrl: "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "High-performance road bike for speed enthusiasts",
    pricePerHour: 18,
    location: "West End",
    rating: 4.9,
    features: ["Carbon frame", "Racing wheels", "Aerodynamic", "Lightweight"]
  },
  {
    name: "Family Cruiser",
    type: "hybrid",
    imageUrl: "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Comfortable hybrid bike perfect for family rides",
    pricePerHour: 10,
    location: "Central Park",
    rating: 4.7,
    features: ["Comfortable seat", "Basket", "Bell", "Reflectors"]
  }
];

const seedUsers = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "password",
    phone: "123-456-7890",
    role: "admin"
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password",
    phone: "123-456-7890",
    role: "user"
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password",
    phone: "098-765-4321",
    role: "user"
  },
  {
    name: "Naman",
    email: "namanjhanwar153@gmail.com",
    password: "Naman@1001",
    phone: "123456789",
    role: "admin"
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect("mongodb+srv://naman:naman@cluster0.pe7bv9y.mongodb.net/bike-rental?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas successfully!');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await Bike.deleteMany({});
    await User.deleteMany({});
    
    // Seed bikes
    console.log('Seeding bikes...');
    await Bike.insertMany(seedBikes);
    console.log('✅ Bikes seeded successfully');
    
    // Seed users
    console.log('Seeding users...');
    await User.insertMany(seedUsers);
    console.log('✅ Users seeded successfully');
    
    console.log('🎉 Database seeded successfully!');
    console.log('\nDefault login credentials:');
    console.log('Admin: admin@example.com / password');
    console.log('User: john@example.com / password');
    console.log('User: jane@example.com / password');
    console.log('Your Admin: namanjhanwar153@gmail.com / Naman@1001');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();