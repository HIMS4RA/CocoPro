# CocoPro 🌴

CocoPro is a full-stack web application designed to support coconut processing operations and environmental monitoring. The system helps manage operational data such as employees, raw materials, processing batches, and financial records while also integrating real-time weather data.

The application follows a **modern full-stack architecture** using **Spring Boot for the backend** and **React (Vite) for the frontend**, communicating through REST APIs.

---

## 📌 Project Overview

CocoPro provides a digital platform for managing coconut processing activities efficiently. The system combines operational management features with external environmental data to help improve decision-making and monitoring.

### Key Functionalities

- User authentication and authorization
- Employee management
- Raw material management
- Batch processing management
- Weather data integration using the OpenWeather API
- Financial transaction tracking

---

## 🛠 Technology Stack

### Backend

- Java
- Spring Boot
- Spring Security
- Maven
- REST APIs

### Frontend

- React
- Vite
- JavaScript
- CSS

### External Services

- OpenWeather API (Weather Data)
- Stripe Payment Gateway

---

## 📂 Project Structure

```
CocoPro
│
├── backend
│   ├── controller
│   ├── service
│   ├── model
│   └── config
│
├── frontend
│   ├── components
│   ├── pages
│   └── services
│
└── README.md
```

---

## 👨‍💻 My Contribution

**Himsara Edirisooriya**

In this project, I was responsible for designing and implementing the **Finance Module** of the system.

### Finance Module Features

The finance module manages employee salary payments and financial records within the system.

- Staff salary management
- Salary payment processing using **Stripe**
- Financial transaction tracking
- Revenue and expense management
- Integration of financial operations with the backend system

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/HIMS4RA/CocoPro.git
cd CocoPro
```

---

### 2. Run the Backend (Spring Boot)

Navigate to the backend folder:

```bash
cd backend
```

Run the Spring Boot application:

```bash
./mvnw spring-boot:run
```

The backend server will start on:

```
http://localhost:8080
```

---

### 3. Run the Frontend (React + Vite)

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on:

```
http://localhost:5173
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **frontend** directory.

Example:

```
VITE_WEATHER_API_KEY=your_openweather_api_key
```

---

## 👤 Author

**Himsara Edirisooriya**
BSc (Hons) Information Technology – SLIIT

GitHub: https://github.com/HIMS4RA
