const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'resume_secret',
  resave: false,
  saveUninitialized: false
}));

// ✅ MongoDB connection
mongoose.connect('mongodb+srv://ayushtiwari:Project%40123@cluster0.lewbdp7.mongodb.net/resumeAuthDB?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));


// ✅ User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const User = mongoose.model('User', userSchema);

// ✅ Multer config for file upload
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ✅ Middleware to protect /form
function checkAuth(req, res, next) {
  if (req.session.userId) next();
  else res.redirect('/login');
}

// 🔹 ROUTES 🔹

app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/form');
  } else {
    res.redirect('/login');
  }
});

// ✅ Signup
app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await User.create({ email: req.body.email, password: hashedPassword });
  res.redirect('/login');
});

// ✅ Login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    req.session.userId = user._id;
    res.redirect('/form');
  } else {
    res.send('Invalid email or password');
  }
});

// ✅ Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// ✅ Protected resume form
app.get('/form', checkAuth, (req, res) => {
  res.render('form');
});

// ✅ Form submission
app.post('/submit-form', checkAuth, upload.single('profilePic'), (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    objective: req.body.objective,
    workExperience: req.body.workExperience,
    education: req.body.education,
    skills: req.body.skills,
    projects: req.body.projects || "",
    linkedin: req.body.linkedin,
    leetcode: req.body.leetcode,
    hackerrank: req.body.hackerrank,
    profilePicUrl: req.file ? `/uploads/${req.file.filename}` : null
  };

  const selectedTemplate = req.body.template;
  if (selectedTemplate === 'template1') {
    res.render('resume', { data });
  } else if (selectedTemplate === 'template2') {
    res.render('resume2', { data });
  } else {
    res.send('Invalid template selection.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
