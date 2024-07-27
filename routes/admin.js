/*===============================================
Modules
===============================================*/
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const adminController = require("../controllers/adminController");

/*===============================================
Variables
===============================================*/
const jwtSecret = process.env.JWT_SECRET;

/*===============================================
Authentication middleware 
===============================================*/
const authMiddleware = (req, res, next) => {
  // Gets the cookie from the browser. Be sure to target the correct name,
  // (the last chained object) as defined the token variable name in the Admin 
  //check login section
  const jasonWebToken = req.cookies.jwt;

  // If we don't have the token
  if(!jasonWebToken) {
    res.redirect("/unauthorized")
    //return res.status(401).json({message: "Unauthorized"})
  }

  try {
    // Verifying the JWT by comparing the secret
    const decoded = jwt.verify(jasonWebToken, jwtSecret);

    // Get the user
    req.userId = decoded.userId;
    next();
    
  } catch (error) {
    res.render("splash-page", {
      error
    });
  }
}

/*===============================================
Routes
===============================================*/
/*==============================
Admin dashboard page
==============================*/
router.get("/admin/dashboard", authMiddleware, adminController.index);

router.get("/admin/posts/:slug", authMiddleware,adminController.get_one_admin_blog_post );

/*==============================
Admin create new post page
==============================*/
// Get the page
router.get("/admin/create-new-post", authMiddleware, adminController.get_create_post_page);

// Post a new post
router.post("/add-post", authMiddleware, adminController.post_new_post)

/*==============================
Admin edit post page
==============================*/
router.get("/admin/edit-post/:slug", authMiddleware, adminController.get_edit_post_page);

router.put("/edit-post/:slug", authMiddleware, adminController.edit_post);

router.delete("/delete-post/:slug", authMiddleware, adminController.delete_post);

/*==============================
Register new user
==============================*/
// Get the page
router.get("/admin/register", authMiddleware, adminController.get_register_user_page);

// Takes data posted from the form in views/register-page.ejs
router.post("/register", authMiddleware, adminController.register_user);

/*===============================================
Exporting the router, so app in app.js
can read the routes
===============================================*/
module.exports = router;