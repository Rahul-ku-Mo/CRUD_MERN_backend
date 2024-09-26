const prisma = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Google Authentication
exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email", "openid"],
});

// Google Authentication Callback
exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false, failureRedirect: "/auth/login" },
    (err, user) => {
      if (err || !user) {
        return res.redirect("/auth/login");
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET
      );

      res.cookie("accessToken", token, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      }); 

      res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }
  )(req, res, next);
};

// Register User
exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "User already exists or invalid data" });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
