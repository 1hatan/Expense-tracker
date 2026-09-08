import mongoose from "mongoose";
import dns from "dns";

// Use public DNS servers for reliable SRV resolution on Windows environments
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // fallback silently if setServers fails
}

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error("Tip: Check network connectivity, MongoDB Atlas username/password, or IP Access List.");
    process.exit(1);
  }
}
