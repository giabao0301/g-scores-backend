# THPT 2024 Exam Score Analysis

This project allows users to check THPT 2024 exam scores, view reports, and analyze student performance. It is built using:
- **Frontend:** Next.js (React)
- **Backend:** NestJS (Node.js)
- **Database:** PostgreSQL
- **Containerization:** Docker & Docker Compose
- **🌐Live Demo:** https://g-scores-frontend.vercel.app

## 🚀 Getting Started

### 1️⃣ Prerequisites
Ensure you have:
- **Docker** installed ([Download Docker](https://www.docker.com/get-started))
- **Git** installed ([Download Git](https://git-scm.com/downloads))

### 2️⃣ Clone the Repository
```sh
git clone https://github.com/giabao0301/g-scores-backend
```
### 3️⃣ Create .env file 
For **local development**, create a `.env` file in the root directory with the following:
```bash
# Environment variables for local development

# PostgreSQL Database Configuration (for the container)
POSTGRES_USER=<YOUR_POSTGRES_USER>
POSTGRES_PASSWORD=<YOUR_POSTGRES_PASSWORD>
POSTGRES_DB=thpt2024

# pgAdmin Configuration
PGADMIN_DEFAULT_EMAIL=pgadmin4@pgadmin.org
PGADMIN_DEFAULT_PASSWORD=admin
  
# Database Connection Settings (for the application)
DB_HOST=postgres # Matches the service name in docker-compose
DB_PORT=5432
DB_USER=${POSTGRES_USER} # Reuse the same credentials as PostgreSQL
DB_PASSWORD=${POSTGRES_PASSWORD}
DB_NAME=thpt2024

# Backend Configuration
API_PORT=8080
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 4️⃣ Run docker-compose.yml
```sh
docker-compose up -d    
```

### 5️⃣ Create database
Connect to default database first:
```sh
docker exec -it postgres psql -U user -d postgres
```
Then run:
```sh
CREATE DATABASE thpt2024;
```

### 6️⃣ Restart backend container
```sh
docker restart g-scores-api
```
### ⏳Seeding data
There are over 1 million data rows. 
Run this command and wait until the process is finished:
```sh
docker logs -f g-scores-api
``` 


### 🛑 Stopping the Application
To stop the containers, run:
```sh
docker-compose down
```

## 🚀 Deployment
If you want to deploy the application, you can use:

-   **Vercel** (Frontend) → [https://vercel.com](https://vercel.com)
    
-   **Render** (Backend) → [https://render.com/](https://render.com/)

## 📝 Notes

-   Ensure **Docker is running** before starting.
    
-   If you face database connection issues, wait a few seconds and try again.
