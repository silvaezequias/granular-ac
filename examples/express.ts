import express from "express";
import { RAS } from "granular-ac";
import { database } from "./database"; // Assuming you have a database module

const app = express();

// Define permissions for creating and reading posts
const postCredentials = new RAS("post", {
  create: ["others"],
  read: ["own", "others"],
} as const);

// Middleware to verify permissions before creating a post
async function verifyPermissionsToCreatePost(req, res, next) {
  try {
    const postObject = req.body;
    const scope = postObject.ownerId === req.user.id ? undefined : "others";

    // Check if the user has permission to create the post
    if (postCredentials.verify("create", scope, req.user.permissions)) {
      next(); // Permission granted, proceed to the next middleware function
    } else {
      res.status(403).send("Unauthorized"); // Permission denied, send a 403 (Forbidden) response
    }
  } catch (error) {
    console.error("Error verifying create permissions:", error);
    res.status(500).send("Internal Server Error"); // In case of error, send a 500 (Internal Server Error) response
  }
}

// Middleware to verify permissions before reading a post
async function verifyPermissionsToReadPost(req, res, next) {
  try {
    // Simulate fetching the post from the database
    const postId = req.params.postId;
    const post = await database.findPostById(postId);

    // Dynamically determine the scope based on the post owner's ID and the user in the request
    const scope = post.ownerId === req.user.id ? "own" : "others";

    // Check if the user has permission to read the post
    if (postCredentials.verify("read", scope, req.user.permissions)) {
      next(); // Permission granted, proceed to the next middleware function
    } else {
      res.status(403).send("Unauthorized"); // Permission denied, send a 403 (Forbidden) response
    }
  } catch (error) {
    console.error("Error verifying read permissions:", error);
    res.status(500).send("Internal Server Error"); // In case of error, send a 500 (Internal Server Error) response
  }
}

// Route to create a post
app.post("/posts", verifyPermissionsToCreatePost, async (req, res) => {
  // Simulate creating the post in the database
  const createdPost = await database.createPost(req.body);

  // Here you can handle the request to create the post
  res.status(200).send("Post created successfully");
});

// Route to read a post
app.get("/posts/:postId", verifyPermissionsToReadPost, (req, res) => {
  // Here you can handle the request to read the post
  res.status(200).send("Post read successfully");
});

// Other routes and app configurations...

export default app;
