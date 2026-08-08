# 🏡 StayNest

**StayNest** is a full-stack Airbnb-inspired web application where users can discover, search, and manage property listings. The application includes secure user authentication, authorization, categories, search and filters, reviews, ratings, and a responsive user interface.

## 🚀 Features

* 🔐 **User Authentication** — Sign Up, Login & Logout
* 🛡️ **Authorization** — Only listing owners can edit or delete their listings
* 🏠 **Listing Management** — Create, Edit, View & Delete Listings
* 🔍 **Search** — Search listings by location and other details
* 🏷️ **Categories** — Browse listings by different categories
* 🎯 **Category Filters** — Filter listings based on categories
* 📍 **Property Details** — Location and country information
* 🖼️ **Image Support** — Property images for listings
* ⭐ **Reviews & Ratings** — Users can add reviews and ratings
* 👤 **Review Author Information**
* 💬 **Flash Messages** — Success and error notifications
* 📱 **Responsive UI** — Mobile and desktop friendly interface

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Passport.js
* Express Session
* Connect Flash
* Method Override

### Frontend

* EJS
* EJS-Mate
* Bootstrap 5
* HTML5
* CSS3
* JavaScript

### Other Technologies

* Cloudinary
* Multer
* MapTiler
* Axios
* Joi

---

## 📂 Project Structure

```text
StayNest/
│
├── controllers/
├── init/
├── models/
├── routes/
├── utils/
├── views/
│   ├── include/
│   ├── layouts/
│   └── listings/
│
├── public/
│   ├── css/
│   └── js/
│
├── app.js
├── package.json
├── package-lock.json
└── .gitignore
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/shantanujadhav6565/StayNest.git
```

### 2. Navigate to the Project

```bash
cd StayNest
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory and add your required environment variables.

```env
ATLASDB_URL=your_mongodb_atlas_connection_string
SECRET=your_session_secret
MAP_TOKEN=your_maptiler_token
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

> ⚠️ Never upload your `.env` file or API credentials to GitHub.

### 5. Start the Application

```bash
npm start
```

Or:

```bash
node app.js
```

### 6. Open in Browser

```text
http://localhost:8080
```

---

## 🔎 Search & Categories

StayNest allows users to easily explore listings using:

* 🔍 Search functionality
* 🏷️ Category-based filtering
* 🏠 Different property categories
* 📍 Location-based listing information

Users can quickly find properties based on their interests and requirements.

---

## ⭐ Reviews & Ratings

Authenticated users can:

* Add reviews
* Give ratings
* View review authors
* Delete their own reviews

Listing owners can manage their property listings while authorization protects editing and deletion operations.

---

## 🗺️ Map Integration

StayNest includes map functionality to display property locations and provide a better location-based browsing experience.

---

## 🔐 Security

The application uses:

* Passport.js for authentication
* Express Session for session management
* Authorization middleware for protected operations
* Joi for server-side validation
* Environment variables for sensitive credentials

Sensitive files such as `.env`, `cloudConfig.js`, `node_modules`, and uploaded files are excluded from the GitHub repository using `.gitignore`.

---

## 🔮 Future Improvements

* ❤️ Wishlist / Favorites
* 💳 Online Booking & Payments
* 📅 Availability Calendar
* ⭐ Average Rating System
* 🔔 Notifications
* 🚀 Production Deployment
* 📱 Progressive Web App Support

---

## 👨‍💻 Author

**Shantanu Jadhav**

* GitHub: https://github.com/shantanujadhav6565
* Project: https://github.com/shantanujadhav6565/StayNest

---

## ⭐ Support

If you like this project, don't forget to ⭐ **star the repository**.

Contributions, suggestions, and feedback are always welcome!
