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
        return res.redirect(
          `${process.env.FRONTEND_URL}/auth/login?error=AuthFailed`
        );
      }

      const tempToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          exp: Math.floor(Date.now() / 1000) + 60 * 25, // 25 minutes expiration
        },
        process.env.JWT_SECRET
      );


      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/google-callback?code=${tempToken}`
      );
    }
  )(req, res, next);
};

// New endpoint to exchange the temporary token for a long-lived access token
exports.exchangeToken = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    // Verify and decode the temporary token
    const decoded = jwt.verify(code, process.env.JWT_SECRET);

    // Generate a long-lived access token
    const accessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Set an appropriate expiration time
    );

    // Send the access token to the client
    res.json({ token: accessToken });
  } catch (error) {
    console.error("Error exchanging token:", error);
    res.status(400).json({ error: "Invalid or expired code" });
  }
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
