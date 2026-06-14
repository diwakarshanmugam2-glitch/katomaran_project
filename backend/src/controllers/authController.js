const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkeyfornexusai12345!', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Update user password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Check for user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    return res.status(500).json({ message: 'Server error updating password' });
  }
};

// @desc    Request a password reset code
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Return 200 to prevent email enumeration attacks
      return res.status(200).json({ message: 'If the email exists, a reset code was sent.' });
    }

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash the code before saving
    const salt = await bcrypt.genSalt(10);
    const hashedCode = await bcrypt.hash(code, salt);

    user.resetPasswordCode = hashedCode;
    user.resetPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Configure Nodemailer Transporter
    let transporter;
    let isTestAccount = false;
    
    if (process.env.EMAIL_USER === 'your_email@gmail.com' || !process.env.EMAIL_USER) {
      // Create a test account automatically if no real email is provided
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
          user: testAccount.user, 
          pass: testAccount.pass, 
        },
      });
      isTestAccount = true;
      console.log('⚠️ No real email configured in .env. Using Ethereal Test Email.');
    } else {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Password Reset Code',
      text: `Hello,\n\nYou requested a password reset. Here is your 6-digit verification code:\n\n${code}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested a password reset. Here is your 6-digit verification code:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="margin: 0; letter-spacing: 5px; color: #333;">${code}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #888; font-size: 12px; margin-top: 30px;">If you did not request this, please ignore this email.</p>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Reset email sent to ${user.email}`);
      
      if (isTestAccount) {
        console.log('=============================================');
        console.log('📨 TEST EMAIL SENT! View it here:');
        console.log(nodemailer.getTestMessageUrl(info));
        console.log('=============================================');
      }
      
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return res.status(500).json({ message: 'Error sending email. Please check server email configuration.' });
    }

    return res.status(200).json({ message: 'If the email exists, a reset code was sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Server error processing password reset request' });
  }
};

// @desc    Verify code and reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Please provide email, code, and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findOne({ email });
    
    if (!user || !user.resetPasswordCode || !user.resetPasswordExpiry) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    if (new Date() > new Date(user.resetPasswordExpiry)) {
      user.resetPasswordCode = undefined;
      user.resetPasswordExpiry = undefined;
      await user.save();
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    const isMatch = await bcrypt.compare(code, user.resetPasswordCode);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    // Code is valid, hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Server error resetting password' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updatePassword,
  forgotPassword,
  resetPassword,
};
