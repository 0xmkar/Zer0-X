import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Users from "../models/User.js"; 


dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));

app.use(express.json()); // To parse incoming JSON data

const mongouri = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// Route to store user details
app.post("/api/save-user", async (req, res) => {
  try {
    const { username, twitterId, publicKey, privateKey } = req.body;

    // Check if user already exists
    let user = await Users.findOne({ twitterId });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create and save user
    user = new Users({ username, twitterId, publicKey, privateKey });
    await user.save();

    res.status(201).json({ message: "User stored successfully", user });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/api/check-user", async (req, res) => {
  try {
    const { twitterId } = req.query;
    if (!twitterId) {
      return res.status(400).json({ error: "Missing Twitter ID" });
    }

    const user = await Users.findOne({ twitterId });
    res.json({ exists: !!user });
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/twitter-username", async (req, res) => {
  try {
    const { twitterId } = req.query;
    if (!twitterId) {
      return res.status(400).json({ error: "Missing Twitter ID" });
    }

    const twitterApiUrl = `https://api.twitter.com/2/users/${twitterId}`;
    
    const response = await fetch(twitterApiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
      }
    });

    const data = await response.json();

    if (response.status === 429) {
      console.warn("Rate limit reached.");
      return res.json({ username: "ojboss" });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    res.json({ username: data.data?.username || "testname" });
  } catch (error) {
    console.error("Error fetching Twitter username:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/get-user", async (req, res) => {
  try {
    const { twitterId } = req.query;
    if (!twitterId) {
      return res.status(400).json({ error: "Missing Twitter ID" });
    }

    const user = await Users.findOne({ twitterId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      publicKey: user.publicKey,
      privateKey: user.privateKey,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});
