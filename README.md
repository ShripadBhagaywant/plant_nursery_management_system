# 🌻 Plant Nursery Management System

# Note : - JUST LEARNING IS NOT EVERYTHING.

The **Plant Nursery Management System** is a full-stack 
web application built using
**Java Spring Boot (Backend)** and **ReactJS (Frontend)**. 
This platform is designed to manage plant nurseries efficiently, 
offering a seamless experience for both customers and administrators.

---

## 🔧 Key Features

### 👤 User Management
- JWT-based **user authentication** and **role-based access control** (User/Admin)
- Secure **user registration**, **login**, and **profile management**
- **KYC verification** flow with document upload and admin approval

### 🌿 Plant Catalog
- Users can **browse and search** for various plants
- Admins can **add**, **update**, or **delete** plant records
- Inventory tracking and stock management

### 🛒 Orders and Payments
- Users can **place and manage orders**
- Integrated with **Razorpay** for secure online payments

### 📦 Inventory & Admin Dashboard
- Admins can:
    - View and manage all users
    - **Verify KYC documents**
    - Track and update **inventory levels**
    - Manage orders and payment history

### 💬 AI-powered Plant Assistant
- Integrated with **OpenAI Chatbot** to help users learn about plant care and recommendations

---

## 🔐 Configuration Instructions

### ✅ Add the following properties to `application.properties` or `.env` file:

#### 1. **Razorpay Configuration**
```properties
razorpay.key=YOUR_RAZORPAY_KEY
razorpay.secret=YOUR_RAZORPAY_SECRET
```

#### 2. **JWT Configuration**
```properties
jwt.secret=YOUR_JWT_SECRET
jwt.expiration=86400000  # example: 24 hours
```

#### 3. **Local Image Storage**
```properties
file.upload-dir=/path/to/local/image/storage
```

#### 4. **Email Configuration**
```properties
spring.mail.username=your-email@example.com
spring.mail.password=your-app-password
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

#### 5. **OpenAI API Configuration**
```properties
openai.api.key=YOUR_OPENAI_SECRET_KEY
```

---

## 📁 Tech Stack

| Layer        | Technology              |
|--------------|--------------------------|
| Backend      | Java, Spring Boot, Spring Security |
| Frontend     | React.js, Tailwind CSS   |
| Database     | MySQL                    |
| Authentication | JWT (JSON Web Tokens) |
| Payments     | Razorpay Integration     |
| AI Assistant | OpenAI API               |

---.

## GOOD PROJECT.
