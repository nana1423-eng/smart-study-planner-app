# 🎓 Smart Study Planner

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React_Vite-61DAFB?logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot-6DB33F?logo=spring&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql&logoColor=white)
![CI Status](https://github.com/${GITHUB_REPOSITORY}/actions/workflows/ci.yml/badge.svg)

The **Smart Study Planner** is a premium, AI-oriented academic management platform engineered to dissect monolithic assignments into optimized micro-tasks, visualize learning streaks, and enforce productivity via deep Pomodoro synchronization. Designed with an ultra-modern glassy aesthetic and highly functional offline capabilities.

---

## ✨ Full Stack Features
- **Intelligent Subtask Generation**: Automatically splits heavy assignments into achievable chunks utilizing algorithm-based deadlines heuristics.
- **Dynamic Timeline Arrays**: Plots daily micro-tasks intelligently against your user-defined maximum daily study hours.
- **Focus Mode Dashboard**: Integrated Pomodoro tracking mathematically synchronized with your backend study session timesheets.
- **Data-Driven Gamification**: Earn persistent points and streaks for completing workloads, cleanly rendered via Recharts visualization Dashboards.
- **Vite PWA Offline Capabilities**: A rigorously cached interface allowing interaction and tracking even when internet connectivity drops.
- **Premium UI/UX Architecture**: Natively responsive glassmorphism designed end-to-end with Tailwind CSS, featuring bespoke cinematic backgrounds and deep animations.

## 🚀 Tech Stack Highlights
**Frontend**
- **React 18** configured with **Vite** for lightning-fast HMR and optimized production builds.
- **Tailwind CSS v4** + responsive layouts, interactive hovers, and gradient masks.
- **Axios API interceptors** safely managing global Bearer Tokens.
- **Recharts** interactive line/pie/bar graph suites parsing granular user progression.

**Backend**
- **Java 17 Spring Boot 3** scalable REST API architectures.
- **Spring Security + JWT** heavily integrated for stateless, BCrypt-hardened user authentication.
- **Spring Data JPA** completely bridging normalized relational structures seamlessly to PostgreSQL.

## 🛠️ Quickstart Installation
1. Guarantee **PostgreSQL** is actively running natively and initialize an empty database named `smart_study_planner`.
2. Configure your properties string matching in `backend/src/main/resources/application.properties`.
3. Boot the backend Server API:
   ```bash
   cd backend
   .\mvnw spring-boot:run
   ```
4. Boot the Vite React Client interface:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
5. Navigate seamlessly to `http://localhost:5173` and start planning intuitively!

---

## 🐳 Running with Docker
The entire stack (Frontend, Backend, and Database) can be launched with a single command:
```bash
docker-compose up --build
```
- **Frontend**: [http://localhost:80](http://localhost:80)
- **Backend API**: [http://localhost:8081](http://localhost:8081)
- **Database**: Port 5432 (PostgreSQL)


---
*Developed robustly as an advanced Full-Stack Web Application demonstrating high-tier architectural scalability, persistent relational data management, and uncompromised User Interface aesthetic mastery.*
