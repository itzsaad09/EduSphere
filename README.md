<h1 align="center">EduSphere</h1>

<p>
  <a href="LICENSE.md" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://tech-store-project-frontend.vercel.app/" target="_blank">
    <img alt="Visit Site" src="https://img.shields.io/badge/Visit-Store-058ad2" />
  </a>
</p>

A complete full-stack platform for **course and certificate management**, designed to streamline educational content delivery and user administration.  
The project is split into three main parts:  
- **Frontend** → User-facing platform  
- **Admin Dashboard** → Management panel for administrators  
- **Backend** → Server-side logic and database handling

---

## ✨ Features

- **User Authentication**  
  Secure sign-up, sign-in, and password management for both users and administrators.

- **Course Management**  
  Administrators can add, view, and manage courses through a dedicated dashboard.

- **Course Enrollment**  
  Users can explore and enroll in available courses.

- **Certificate Generation**  
  Automatically generate certificates for users upon course completion.

- **User & Feedback Management**  
  Admins can view/manage user accounts and feedback submitted through the platform.

---

## 🛠️ Technologies Used

### Frontend
- **React** → Core UI library  
- **Vite** → Fast build tool for React  
- **React Router DOM** → Client-side routing  
- **CSS Modules** → Scoped component styling  

### Backend
- **Node.js & Express** → Backend runtime and framework  
- **MongoDB** → NoSQL database  
- **Mongoose** → ODM for MongoDB  
- **Cloudinary** → Cloud-based image & file storage  
- **Multer** → File upload middleware  
- **Nodemailer** → Email sending service  

---

## 📂 Project Structure

```bash
.
├── admin/
│   ├── .gitignore
│   ├── README.md
│   ├── index.html
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx            # Main Admin component
│   │   ├── components/        # Reusable Admin components (Sidebar, etc.)
│   │   ├── pages/             # Admin pages (AddCourses, ViewCourses, etc.)
│   │   └── main.jsx
│   └── vite.config.js
│
├── backend/
│   ├── config/                # Database & API configurations
│   ├── controllers/           # Business logic & request handling
│   ├── middleware/            # Auth, email, file upload
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API route definitions
│   ├── server.js              # Server entry point
│   └── ...
│
└── frontend/
    ├── .gitignore
    ├── README.md
    ├── index.html
    ├── package.json
    ├── src/
    │   ├── App.jsx            # Main User app
    │   ├── assets/
    │   ├── components/        # Reusable UI components
    │   ├── context/           # State management
    │   ├── pages/             # User pages (Dashboard, ExploreCourses, etc.)
    │   └── main.jsx
    └── vite.config.js

```
---

## 🚀 Installation & Setup

### 1. Backend Setup
``` bash
cd backend
npm install
```

Create a .env file inside backend/:
``` bash
MONGO_URI="your_mongodb_connection_string"
JWT_SECRET="a_strong_secret_key"
SMTP_HOST = "your_smtp_host_url"
SMTP_USER = "your_smtp_user"
SMTP_PASS = "your_smtp_pass"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
YOUTUBE_API_KEY = "your_youtube_api_secret"
ADMIN_EMAIL = "your_admin_email"
ADMIN_PASS = "your_admin_pass"
FRONTEND_URL = "your_frontend_url"
```

Run the backend:
``` bash
node server.js
```

### 2. Frontend Setup
``` bash
cd frontend
npm install
```

Create a .env file inside backend/:
``` bash
VITE_BACKEND_URL="your_backend_url"
```

Run the frontend:
``` bash
npm run dev
```

### 3. Admin Setup
``` bash
cd admin
npm install
```

Create a .env file inside backend/:
``` bash
VITE_BACKEND_URL="your_backend_url"
```

Run the admin dashboard:
``` bash
npm run dev
```

## License
This project is open-source and available under the MIT License.

## Authors

👤 **Hafiz Muhammad Saad**

* Github: [@itzsaad09](https://github.com/itzsaad09)
* LinkedIn: [@itzsaad09](https://linkedin.com/in/itzsaad09)

## Show your support

Give a ⭐️ if this project helped you!
