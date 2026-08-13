# 📝 SparkNote — Share Your Stories

SparkNote is a full-stack blogging platform where users can create, manage, search, and read blog posts.

The application provides secure authentication using **JWT stored in HttpOnly cookies** and protects user-specific operations such as creating, editing, and deleting posts.

---

## 🚀 Features

### 🔐 Authentication

- User registration
- User login
- User logout
- JWT-based authentication
- JWT stored in an HttpOnly cookie
- Password hashing using BCrypt
- Current logged-in user detection
- Protected user operations

### 📝 Blog Management

- Create blog posts
- View blog posts
- View individual posts
- Edit your own posts
- Delete your own posts
- View your own posts
- Search posts

### 🔍 Search

- Search posts by title
- Search posts by content
- Case-insensitive search
- Dynamic search from the navigation bar

### 👤 User-Based Post Visibility

When a visitor is **not logged in**:

```text
All posts are visible
```

When a user is **logged in**:

```text
Other users' posts are visible
The logged-in user's own posts are hidden from the public feed
```

The **My Posts** section displays only the logged-in user's posts.

### 🛡️ Security

- JWT authentication
- HttpOnly cookies
- Spring Security
- BCrypt password hashing
- Stateless authentication
- CORS configuration
- Protected POST endpoints
- Protected PUT endpoints
- Protected DELETE endpoints
- Owner-only edit functionality
- Owner-only delete functionality
- Author is taken from the authenticated JWT

### 📱 Responsive UI

- Responsive desktop layout
- Mobile navigation
- Responsive search bar
- Blog cards
- Post details page
- Loading states
- Empty states
- Toast notifications

---

# 🛠️ Tech Stack

## Frontend

- React
- JavaScript
- React Router
- Tailwind CSS
- Axios
- React Hot Toast

## Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT
- Lombok
- Maven

## Database

- MySQL

## Tools

- Git
- GitHub
- VS Code
- IntelliJ IDEA
- Maven

---

# 🏗️ Project Architecture

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │    Tailwind CSS      │
                    └──────────┬───────────┘
                               │
                               │ Axios
                               ▼
                    ┌──────────────────────┐
                    │    Spring Boot API   │
                    │                      │
                    │ Controllers          │
                    │ Services             │
                    │ Repositories         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Spring Security    │
                    │                      │
                    │ JWT Filter           │
                    │ Authentication       │
                    │ Authorization        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │        MySQL         │
                    │                      │
                    │ Users                │
                    │ Posts                │
                    └──────────────────────┘
```

---

# 📂 Project Structure

## Frontend

```text
frontend/
│
├── src/
│   │
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Post.jsx
│   │   └── UserPost.jsx
│   │
│   ├── context/
│   │   ├── DataContext.jsx
│   │   └── UserContext.jsx
│   │
│   ├── pages/
│   │   ├── AllPost.jsx
│   │   ├── CreatePost.jsx
│   │   ├── EditPost.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── MyPost.jsx
│   │   └── PostDetails.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── README.md
```

## Backend

```text
BlogApplication/
│
├── src/
│   │
│   ├── main/
│   │   │
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── BlogApplication/
│   │   │
│   │   │           ├── Controller/
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── PostController.java
│   │   │           │   └── UserController.java
│   │   │           │
│   │   │           ├── Service/
│   │   │           │   ├── PostService.java
│   │   │           │   └── CustomUserDetailsService.java
│   │   │           │
│   │   │           ├── repository/
│   │   │           │   ├── PostRepository.java
│   │   │           │   └── UserRepository.java
│   │   │           │
│   │   │           ├── model/
│   │   │           │   ├── Post.java
│   │   │           │   └── User.java
│   │   │           │
│   │   │           ├── security/
│   │   │           │   ├── JwtService.java
│   │   │           │   └── JwtAuthenticationFilter.java
│   │   │           │
│   │   │           └── config/
│   │   │               └── SecurityConfig.java
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│
├── pom.xml
└── README.md
```

---

# 🔑 Authentication Flow

SparkNote uses JWT authentication with an HttpOnly cookie.

```text
User
 │
 │ Login
 ▼
React Frontend
 │
 │ POST /api/auth/login
 ▼
Spring Boot
 │
 │ Validate username/password
 ▼
AuthenticationManager
 │
 │ Authentication successful
 ▼
JwtService
 │
 │ Generate JWT
 ▼
HttpOnly Cookie
 │
 │ jwt=TOKEN
 ▼
Browser
```

For subsequent requests:

```text
Browser
 │
 │ JWT Cookie
 ▼
JwtAuthenticationFilter
 │
 │ Extract JWT
 ▼
JwtService
 │
 │ Validate JWT
 ▼
CustomUserDetailsService
 │
 │ Load User
 ▼
SecurityContext
 │
 ▼
Controller
```

---

# 🔐 Authorization

## Public Endpoints

```text
POST /api/auth/**
GET  /api/posts
GET  /api/posts/search
GET  /api/posts/{id}
```

## Protected Endpoints

```text
GET    /api/user/current
GET    /api/posts/user
POST   /api/posts
PUT    /api/posts/{id}
DELETE /api/posts/{id}
```

---

# 📡 API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

Request:

```json
{
  "username": "shakthi",
  "password": "123456"
}
```

Response:

```json
{
  "message": "Registration successful"
}
```

---

### Login

```http
POST /api/auth/login
```

Request:

```json
{
  "username": "shakthi",
  "password": "123456"
}
```

Response:

```json
{
  "message": "Login successful"
}
```

The server generates a JWT and stores it in an HttpOnly cookie.

---

### Logout

```http
POST /api/auth/logout
```

---

# 👤 User API

### Get Current User

```http
GET /api/user/current
```

Response:

```json
{
  "username": "shakthi"
}
```

---

# 📝 Post API

### Get All Posts

```http
GET /api/posts
```

Behavior:

```text
Not logged in
      ↓
Show all posts

Logged in
      ↓
Show all posts except the current user's posts
```

---

### Search Posts

```http
GET /api/posts/search?keyword=java
```

Searches through:

```text
Post title
Post content
```

The search is case-insensitive.

---

### Get My Posts

```http
GET /api/posts/user
```

Returns only posts belonging to the authenticated user.

---

### Get Post By ID

```http
GET /api/posts/{id}
```

Example:

```http
GET /api/posts/10
```

---

### Create Post

```http
POST /api/posts
```

Request:

```json
{
  "title": "Learning Spring Boot",
  "content": "Spring Boot makes backend development easier..."
}
```

The backend automatically determines the author:

```java
post.setAuthor(authentication.getName());
```

The frontend does not control the author.

---

### Update Post

```http
PUT /api/posts/{id}
```

Request:

```json
{
  "title": "Updated Spring Boot Guide",
  "content": "Updated blog content..."
}
```

Only the owner can update the post.

---

### Delete Post

```http
DELETE /api/posts/{id}
```

Only the owner can delete the post.

---

# 🗄️ Database

SparkNote uses MySQL.

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/blog_db
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

# 🔒 Environment Variables

Create a `.env` file for local development.

```env
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_long_secure_jwt_secret

JWT_EXPIRATION=3600000
```

Do not commit `.env` to GitHub.

Add the following to `.gitignore`:

```gitignore
.env
```

Create `.env.example` for other developers:

```env
DB_PASSWORD=
JWT_SECRET=
JWT_EXPIRATION=3600000
```

---

# ⚙️ Backend Configuration

Example `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/blog_db
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update

jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION:3600000}

server.port=8083
```

---

# ▶️ Running the Project

## 1. Clone Repository

```bash
git clone https://github.com/your-username/SparkNote.git
```

```bash
cd SparkNote
```

---

# 💻 Backend Setup

Navigate to the backend:

```bash
cd BlogApplication
```

Build the project:

```bash
mvn clean install
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

Backend:

```text
http://localhost:8083
```

---

# 🌐 Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔄 Application Flow

```text
                    SparkNote
                       │
          ┌────────────┴────────────┐
          │                         │
      Visitor                    User
          │                         │
          ▼                         ▼
    View Posts                  Login
          │                         │
          │                         ▼
          │                    JWT Cookie
          │                         │
          │                         ▼
          │                   Authenticated
          │                         │
          │              ┌──────────┼──────────┐
          │              │          │          │
          │              ▼          ▼          ▼
          │           Create     My Posts   Logout
          │              │
          │              ▼
          │          Create Post
          │
          └──────────────┬──────────────
                         │
                         ▼
                    Search Posts
```

---

# 🛡️ Security Design

## Password Security

Passwords are not stored as plain text.

```text
Plain Password
      ↓
BCryptPasswordEncoder
      ↓
Hashed Password
      ↓
MySQL
```

## JWT Security

JWT tokens are stored in:

```text
HttpOnly Cookie
```

This prevents JavaScript from directly accessing the JWT.

## Author Security

When creating a post:

```java
post.setAuthor(authentication.getName());
```

The backend determines the author from the authenticated user.

## Owner Authorization

```text
JWT Username
      ↓
Post Author
      ↓
Compare
   /     \
Same    Different
 ↓          ↓
Allow     403
```

---

# 🎨 UI Features

- Modern responsive header
- SparkNote branding
- Responsive search bar
- User profile indicator
- Create Post button
- My Posts button
- Login and Register
- Logout
- Blog cards
- Post details page
- Read More functionality
- Loading skeletons
- Empty states
- Toast notifications
- Mobile navigation

---

# 🧪 Testing Checklist

```text
[✓] Register user
[✓] Login user
[✓] Logout user
[✓] JWT cookie created
[✓] Current user detected
[✓] View posts without login
[✓] View posts with login
[✓] Logged-in user's posts hidden from public feed
[✓] My Posts displays own posts
[✓] Create post
[✓] Search posts
[✓] View individual post
[✓] Edit own post
[✓] Delete own post
[✓] Prevent editing another user's post
[✓] Prevent deleting another user's post
```

---

# 🚀 Future Improvements

- Image upload
- Categories and tags
- Comments
- Likes
- Bookmarks
- Rich text editor
- Pagination
- User profile pages
- Email verification
- Forgot password
- Admin dashboard
- Role-based authorization
- Docker deployment
- CI/CD pipeline
- Cloud deployment

---

# 👨‍💻 Author

## Shakthi Vel K

Computer Science Engineering Student

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

# 📄 License

This project is created for educational and portfolio purposes.