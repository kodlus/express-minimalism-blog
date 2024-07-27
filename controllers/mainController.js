/*===============================================
Modules
===============================================*/
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require('http-errors');

const asyncHandler = require("express-async-handler");

/*===============================================
Variables
===============================================*/
const jwtSecret = process.env.JWT_SECRET;

/*===============================================
Dummy / Skeleton routes for admin
===============================================*/
/*==============================
Home / index page
==============================*/
exports.index = asyncHandler(async (req, res, next) => {
  // Parameters accessible in index.ejs
  const locals = {
    title: "Job hunt blog",
    desc: "A simple blog created with NodeJS, Express, and MongoDB",
  }

  // Get the data 
  const data = await Post.find().exec();

  // Sort the posts - newest first
  data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Get the latest post
  const latestPost = data[0]

  // And the rest
  const previousPosts = Array.from(data).slice(1);

  // Send response to server/views/index.ejs
  res.render("index-page", {
    data,
    latestPost,
    previousPosts,
    locals
  });
});

/*==============================
Blog posts summary page
==============================*/
exports.get_blog_post_summary = asyncHandler(async (req, res, next) => {
  // Grab the posts from the database
  const data = await Post.find().exec();

  // Sort the posts - newest first
  data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Send response to server/views/posts-summary-page.ejs
  res.render("posts-summary-page", {
    data
  });
});

/*==============================
Single blog post page
==============================*/
exports.get_one_blog_post = asyncHandler(async (req, res, next) => {
  // Get a slug from the url
  const slug = req.params.slug;
  // Search for a matching slug in the database
  const data = await Post.findOne({ slug: slug }).exec();
  // Send response to post-page.ejs
  res.render("post-page", {
    data
  });
});

/*==============================
About page
==============================*/
exports.get_about_page = asyncHandler(async (req, res, next) => {
  // Parameters accessible in index.ejs
  const locals = {
    title: "About page",
    desc: "A simple blog created with NodeJS, Express, and MongoDB"
  }

  // Send response to about.ejs
  res.render("about-page", {
    locals
  });
});

/*==============================
Project page
==============================*/
exports.get_project_page = asyncHandler(async (req, res, next) => {
  res.render("projects-page");
});

/*==============================
Login page
==============================*/
exports.get_login_page = asyncHandler(async (req, res, next) => {
  // If the admin is already logged in, redirect to admin
  if (req.cookies.jwt) {
    res.redirect("/admin/dashboard");
    return;
  }
  
  res.render("login-page");
});

exports.post_login_credentials = asyncHandler(async (req, res, next) => {
  // Get the username and password from the login form
  const { username, password } = req.body;

  // Find the username in the database
  const user = await User.findOne({ username }).exec();

  // Alert if the user is not found ("naïve way")
  if (username !== process.env.ADMIN || user.username === null) {
    res.render("login-page", {
      message: "Wrong credentials"
    });
    return;
  }

  // Get the user's hashed password and compare it with the "inmatade"
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // Alert if the password is not found
  if (!isPasswordValid) {
    res.render("login-page", {
      message: "Wrong credentials"
    });
    return;
  };

  // Save a jwt to a http-only cookie
  const jasonWebToken = jwt.sign({ userId: user._id }, jwtSecret);
  // Create the http only cookie (cannot be read on the client side)
  res.cookie("jwt", jasonWebToken, { 
    httpOnly: true,
    sameSite: "None", // Chrome setting
    secure: true,
    maxAge: 24 * 60 * 60 * 1000
  });

  res.redirect("/admin/dashboard");
});

exports.logout_user = asyncHandler(async (req, res, next) => {
    // Remove the jwt-cookie. Remember, the names of the token 
    // must match. 
    res.clearCookie("jwt");
    res.redirect("/");
});
