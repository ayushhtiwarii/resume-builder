# 📝 Resume Builder (Node.js + Express + MongoDB)

A full-stack Resume Builder web application that allows users to register, log in, and generate a professional resume using attractive templates.

---

## 🚀 Features

- 👤 User authentication (signup/login/logout)
- 📄 Resume form with personal info, skills, education, projects, etc.
- 🖼️ Profile picture upload using Multer
- 🧠 Dynamic resume generation using EJS templates
- 🖨️ "Print Resume" button to download as PDF
- 🔐 Sessions for secure access (only logged-in users can build resumes)

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, EJS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Other:** Multer (file upload), bcrypt (password hashing), express-session

---

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/resume-builder.git

# Go into the project directory
cd resume-builder

# Install dependencies
npm install

# Start the server
node app.js
