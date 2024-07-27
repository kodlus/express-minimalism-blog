/*===============================================
Modules
===============================================*/
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const { slugify } = require("../helpers/functions");
const asyncHandler = require("express-async-handler");

/*===============================================
Variables
===============================================*/
const adminLayout = "../views/layouts/admin.ejs";

/*===============================================
Dummy / Skeleton routes for admin
===============================================*/
/*==============================
Dashboard / index page
==============================*/
exports.index = asyncHandler(async (req, res, next) => {
  // Get all of the posts
  const data = await Post.find().exec();

  // Sort the posts - newest first
  data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.render("admin/dashboard-page", {
    data,
    layout: adminLayout, // Changes the layout from main to admin
  });
});

/*==============================
Admin blog post page
==============================*/
exports.get_one_admin_blog_post = asyncHandler(async (req, res, next) => {
  // Get a slug from the url
  const slug = req.params.slug;
  // Search for a matching slug in the database
  const data = await Post.findOne({ slug: slug }).exec();
  // Send response to post-page.ejs
  res.render("admin/view-post-page", {
    data 
  });
});

/*==============================
Admin create new post page
==============================*/
exports.get_create_post_page = asyncHandler(async (req, res, next) => {
  res.render("admin/create-new-post-page", {
    layout: adminLayout, // Changes the layout from main to admin
  });
});

exports.post_new_post = asyncHandler(async (req, res, next) => {
  // Create a slug from the title
  const slug = slugify(req.body.title);

  // Create an array from the tags
  const tags = req.body.tags.split(",");
  // https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
  const uniqueTags = [... new Set(tags)];

  const duplicate = await Post.findOne({ title: req.body.title }).exec();

  // Check for duplicate slugs
  if (duplicate) {
    res.send("Titeln används redan")
    return;
  }
  
  // Create a new post
  const newPost = new Post({
    title: req.body.title,
    description: req.body.description,
    tags: uniqueTags,
    body: req.body.body,
    slug: slug
  });

  // Send the post to the database
  await Post.create(newPost);

  // Go back to the admin panel
  res.redirect("/admin/dashboard");
});

/*==============================
Admin edit post page
==============================*/
exports.get_edit_post_page = asyncHandler(async (req, res, next) => {
  // Get a slug from the url
  const slug = req.params.slug;
  // Search for a matching slug in the database
  const data = await Post.findOne({ slug: slug }).exec();
  
  // Redirect to the page that got updated
  res.render(`admin/edit-post-page`, {
    data,
    layout: adminLayout
  });
});

exports.edit_post = asyncHandler(async (req, res, next) => {
  // Get a slug from the url
  const slug = req.params.slug;

  // Search for a matching slug in the database
  const post = await Post.findOne({ slug: slug }).exec();
  const id = post?._id;

  // Create a new slug
  const newSlug = slugify(req.body.title);

  // Create an array from the tags
  const tags = req.body.tags.split(",");
  const uniqueTags = [... new Set(tags)];
  
  // Query the id to find the post and update it
  // with the new information
  await Post.findByIdAndUpdate(id, {
    title: req.body.title,
    description: req.body.description,
    tags: uniqueTags,
    body: req.body.body,
    slug: newSlug,
    updatedAt: Date.now()
  }).exec();

  // Redirect to the page that got updated
  res.redirect(`/admin/dashboard`);
});

exports.delete_post = asyncHandler(async (req, res, next) => {
  // Get a slug from the url
  const slug = req.params.slug;
  
  // Search for a matching slug in the database
  const post = await Post.findOne({ slug: slug }).exec();
  const id = post?._id;

  //todo: add warning

  // Delete post based on its id
  await Post.deleteOne({_id: id}).exec();

  // Redirect after deletion
  res.redirect("/admin/dashboard");
});

/*==============================
Register new user
==============================*/
exports.get_register_user_page = asyncHandler(async (req, res, next) => {
  res.render("register-page");
});

exports.register_user = asyncHandler(async (req, res, next) => {
  // Get the username and password from the login form
  const { username, password } = req.body;

  // Try to find a duplicate
  const duplicate = await User.findOne({ username }).exec();

  if (duplicate) {
    return res.status(400).json({message: "Username is already taken"});
  };

  // Hash & salt the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const user = await User.create({ username, password: hashedPassword }).exec();
  //res.status(201).json({ message: "User created", user});

  res.redirect("/login");
});
