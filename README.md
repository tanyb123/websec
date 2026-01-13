# Student Management System

A complete web-based student management system with OAuth 2.0 authentication using Keycloak, Spring Boot backend, and Next.js frontend.

## 🎯 Overview

This system provides a comprehensive solution for managing students, teachers, classes, and grades in an educational institution. Built with modern technologies and security best practices.

**Key Features:**
- OAuth 2.0 / OpenID Connect authentication with Keycloak
- Student and teacher management
- Class and enrollment management
- Grade tracking and GPA calculation
- Analytics dashboard with reports
- Bulk import/export (CSV/Excel)
-  Modern, responsive UI

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Next.js   │─────▶│  Keycloak    │◀────▶│  Spring Boot    │
│  Frontend   │      │ Auth Server  │      │   Backend API   │
│  (Port 3000)│      │  (Port 8080) │      │   (Port 8081)   │
└─────────────┘      └──────────────┘      └─────────────────┘
                              │                      │
                              └──────────────────────┘
                                        │
                                 ┌──────▼──────┐
                                 │ PostgreSQL  │
                                 │ (Port 5432) │
                                 └─────────────┘
```

## 🛠️ Technology Stack

### Backend
- **Java 17+** with Spring Boot 3.2
- **Spring Security** with OAuth2 Resource Server
- **Spring Data JPA** for database access
- **PostgreSQL 16** database
- **Maven** for dependency management

### Frontend
- **Next.js 14** with React 18
- **TypeScript** for type safety
- **NextAuth.js** for authentication
- **TanStack Query** for data fetching
- **Tailwind CSS** + **shadcn/ui** for styling
- **Recharts** for analytics visualization

### Infrastructure
- **Docker & Docker Compose** for containerization
- **Keycloak 23.x** for authentication
- **Redis** for caching (optional)

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Java 17+ (for local development)
- Node.js 18+ (for local development)

### 1. Clone Repository

```bash
git clone https://github.com/qthanh04/oauth2-keycloak-authentication.git
cd oauth2-keycloak-authentication
```

### 2. Start with Docker Compose

```bash
docker-compose up -d
```

This will start:
- PostgreSQL (port 5432)
- Keycloak (port 8080)
- Spring Boot API (port 8081)
- Next.js Frontend (port 3000)

### 3. Access Applications

| Application | URL | Credentials |
|-------------|-----|-------------|
| **Frontend** | http://localhost:3000 | See users below |
| **Keycloak Admin** | http://localhost:8080/admin | admin / admin |
| **API Swagger** | http://localhost:8081/swagger-ui.html | - |

### Default Users

**Admin:**
- Username: `admin`
- Password: `admin123`
- Role: ADMIN

**Teacher:**
- Username: `teacher.nguyen`
- Password: `teacher123`
- Role: TEACHER

**Student:**
- Username: `student.pham`
- Password: `student123`
- Role: STUDENT

## 📖 Documentation

- [System Architecture](../../Downloads/web%20sec/system.md) - Complete system design and architecture
- [About](./AboutMe) - Project background and objectives
- [API Documentation](./api_design.md) - REST API endpoints

## 🔑 Key Features

### 1. Authentication & Authorization
- OAuth 2.0 / OpenID Connect flow
- Role-based access control (ADMIN, TEACHER, STUDENT)
- JWT token validation
- Automatic token refresh

### 2. Student Management
- CRUD operations for student profiles
- Bulk import from CSV/Excel
- Search and filtering
- Student status tracking (Active, Suspended, Graduated)

### 3. Teacher Management
- Teacher profiles and assignments
- Department and specialization tracking
- Class assignments

### 4. Class Management
- Create and manage classes
- Bulk student enrollment
- Class capacity management
- Schedule and room assignment
- Academic year and semester tracking

### 5. Grade Management
- Multiple assessment types (Midterm, Final, Assignments, Quizzes)
- Bulk grade entry for entire classes
- Automatic GPA calculation
- Grade reports and transcripts

### 6. Dashboard & Analytics
- Real-time statistics
- Student performance analytics
- Class performance reports
- Export to PDF/Excel

## 📚 API Endpoints

All APIs are versioned under `/api/v1/`:

### Core Resources
- **Students**: `/api/v1/students`
- **Teachers**: `/api/v1/teachers`
- **Classes**: `/api/v1/classes`
- **Grades**: `/api/v1/grades`
- **Academic Years**: `/api/v1/academic-years`
- **Semesters**: `/api/v1/semesters`

### Special Endpoints
- **Me Endpoints**: `/api/v1/me/*` (current user context)
- **Bulk Operations**: `/api/v1/*/bulk-*`
- **Dashboard**: `/api/v1/dashboard/*`

See [API Documentation](./api_design.md) for complete details.

## 🗄️ Database Schema

Key tables:
- `students` - Student profiles
- `teachers` - Teacher profiles
- `classes` - Class definitions
- `grades` - Student grades
- `academic_years` - Academic year periods
- `semesters` - Semester periods
- `student_classes` - Student-class enrollment

See `system.md` for database schema details and entity relationships.

## 🔧 Development

### Backend Development

```bash
cd backend
./mvnw spring-boot:run
```

API will be available at http://localhost:8081

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at http://localhost:3000

### Database Migrations

```bash
cd backend
./mvnw flyway:migrate
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
./mvnw test
```

### Frontend Tests

```bash
cd frontend
npm run test
npm run test:e2e  # E2E tests with Playwright
```

## 📦 Deployment

### Production Build

```bash
# Backend
cd backend
./mvnw clean package -DskipTests

# Frontend
cd frontend
npm run build
```

### Environment Variables

**Backend (.env):**
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/student_mgmt
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
KEYCLOAK_ISSUER_URI=http://localhost:8080/realms/student-management
```

**Frontend (.env.local):**
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
KEYCLOAK_ID=student-management-client
KEYCLOAK_SECRET=your-client-secret
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
