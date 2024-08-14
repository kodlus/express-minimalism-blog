/*===============================================
Modules
===============================================*/
const express = require("express");
const router = express.Router();

const mainController = require("../controllers/mainController");
/*===============================================
Variables
===============================================*/
const jwtSecret = process.env.JWT_SECRET;

/*===============================================
Routes
===============================================*/
/*==============================
Main
==============================*/
router.get("/", mainController.index);

/*==============================
Blog posts summary page
==============================*/
router.get("/posts", mainController.get_blog_posts_summaries);

/*==============================
Single blog post page
==============================*/
router.get("/posts/:slug", mainController.get_one_blog_post);

/*==============================
About page
==============================*/
router.get("/about", mainController.get_about_page);

/*==============================
Project page
==============================*/
router.get("/projects", mainController.get_project_page);

/*==============================
Login page
==============================*/
// Get the page
router.get("/login", mainController.get_login_page);

// Takes data posted from the form in views/login-page.ejs
router.post("/login", mainController.post_login_credentials);

/*==============================
Logout
==============================*/
router.get("/logout", mainController.logout_user);

/*===============================================
Exporting the router, so app in app.js
can read the routes
===============================================*/
module.exports = router;