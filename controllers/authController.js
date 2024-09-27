const prisma = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const {
  validateEmail,
  validatePassword,
} = require("../validators/authService");

// Google Authentication
exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email", "openid"],
});

// Google Authentication Callback
exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    {
      session: false,
      failureRedirect: `${process.env.FRONTEND_URL}/auth/login`,
    },
    (err, user) => {
      if (err || !user) {
        return res.redirect(`${process.env.FRONTEND_URL}/auth/login`);
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET
      );

      if (user) {
        res.cookie("accessToken", token, {
          samesite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        });
      }

      res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }
  )(req, res, next);
};

exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "An unexpected error occurred during registration" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "No user found with this email" });
    }

    if (user && user.password === null) {
      return res
        .status(403)
        .json({ error: "This email is linked with a google Account" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET
    );

    res.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({ error: "An unexpected error occurred during login" });
  }
};
