# System Architecture & Design

## 📐 System Overview

The Student Management System is built on a modern, scalable architecture using microservices principles, OAuth 2.0 authentication, and containerization.

## 🏗️ High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile App - Future]
    end
    
    subgraph "Presentation Layer - Port 3000"
        NextJS["Next.js Frontend - React 18 + TypeScript"]
    end
    
    subgraph "Authentication Layer - Port 8080"
        Keycloak["Keycloak Auth Server - OAuth 2.0 / OIDC"]
    end
    
    subgraph "Application Layer - Port 8081"
        SpringBoot["Spring Boot API - Java 17 + Spring Security"]
        Cache["Redis Cache - Optional"]
    end
    
    subgraph "Data Layer - Port 5432"
        PostgreSQL[("PostgreSQL 16<br/>Relational Database")]
    end
    
    Browser --> NextJS
    Mobile -.-> NextJS
    NextJS <-->|OAuth2 Flow| Keycloak
    NextJS <-->|REST API + JWT| SpringBoot
    SpringBoot <-->|Token Validation| Keycloak
    SpringBoot <-->|JDBC| PostgreSQL
    SpringBoot <-->|Caching| Cache
    Keycloak <-->|User Storage| PostgreSQL
```

## 🔐 Authentication Flow (OAuth 2.0)

### Authorization Code Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Next.js
    participant Keycloak
    participant Backend as Spring Boot API
    participant DB as PostgreSQL

    User->>Frontend: 1. Access /students
    Frontend->>Frontend: 2. Check session
    Frontend->>Keycloak: 3. Redirect to /auth/login
    User->>Keycloak: 4. Enter username/password
    Keycloak->>DB: 5. Validate credentials
    DB->>Keycloak: 6. User valid
    Keycloak->>Frontend: 7. Redirect with code
    Frontend->>Keycloak: 8. Exchange code for tokens
    Keycloak->>Frontend: 9. Access Token + Refresh Token
    Frontend->>Backend: 10. API call with Bearer token
    Backend->>Keycloak: 11. Validate JWT (JWKS)
    Keycloak->>Backend: 12. Token valid + claims
    Backend->>DB: 13. Query students
    DB->>Backend: 14. Return data
    Backend->>Frontend: 15. JSON response (envelope)
    Frontend->>User: 16. Display students table
```

### Token Structure

**Access Token (JWT):**
```json
{
  "exp": 1705132800,
  "iat": 1705129200,
  "auth_time": 1705129200,
  "jti": "uuid",
  "iss": "http://localhost:8080/realms/student-management",
  "aud": ["student-management-client"],
  "sub": "user-uuid",
  "typ": "Bearer",
  "azp": "student-management-client",
  "session_state": "uuid",
  "acr": "1",
  "realm_access": {
    "roles": ["ADMIN"]
  },
  "scope": "openid profile email",
  "email_verified": true,
  "name": "Admin User",
  "preferred_username": "admin",
  "email": "admin@school.edu"
}
```

## 🗄️ Database Architecture

### Entity-Relationship Diagram

```mermaid
erDiagram
    ACADEMIC_YEARS ||--o{ SEMESTERS : contains
    ACADEMIC_YEARS ||--o{ CLASSES : "scheduled in"
    SEMESTERS ||--o{ CLASSES : "runs in"
    TEACHERS ||--o{ CLASSES : teaches
    CLASSES ||--o{ STUDENT_CLASSES : enrollment
    STUDENTS ||--o{ STUDENT_CLASSES : enrolls
    STUDENTS ||--o{ GRADES : receives
    CLASSES ||--o{ GRADES : "grades for"

    ACADEMIC_YEARS {
        uuid id PK
        int year
        string name
        date start_date
        date end_date
        boolean is_current
    }

    SEMESTERS {
        uuid id PK
        uuid academic_year_id FK
        int semester_number
        string name
        date start_date
        date end_date
        boolean is_current
    }

    STUDENTS {
        uuid id PK
        string user_id
        string student_code UK
        string first_name
        string last_name
        date date_of_birth
        string email UK
        string status
    }

    TEACHERS {
        uuid id PK
        string user_id
        string teacher_code UK
        string first_name
        string last_name
        string email UK
        string department
    }

    CLASSES {
        uuid id PK
        string class_code UK
        string class_name
        uuid teacher_id FK
        uuid academic_year_id FK
        uuid semester_id FK
        int capacity
        jsonb schedule
        string status
    }

    STUDENT_CLASSES {
        uuid id PK
        uuid student_id FK
        uuid class_id FK
        timestamp enrollment_date
        string status
    }

    GRADES {
        uuid id PK
        uuid student_id FK
        uuid class_id FK
        string assessment_type
        decimal score
        decimal max_score
        decimal weight
        date grade_date
    }
```

### Database Optimization

**Indexes:**
```sql
-- Performance indexes
CREATE INDEX idx_students_code ON students(student_code);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_grades_student_class ON grades(student_id, class_id);
CREATE INDEX idx_student_classes_student ON student_classes(student_id);
CREATE INDEX idx_classes_academic_year ON classes(academic_year_id);
```

**Views for Common Queries:**
```sql
-- Pre-joined view for student details
CREATE VIEW v_students_full AS
SELECT s.*, 
       COUNT(DISTINCT sc.class_id) as enrolled_classes,
       AVG(g.score / g.max_score * 10) as overall_gpa
FROM students s
LEFT JOIN student_classes sc ON s.id = sc.student_id
LEFT JOIN grades g ON s.id = g.student_id
GROUP BY s.id;
```

## 📡 API Architecture

### Request/Response Flow

```mermaid
flowchart LR
    Client[Client Request] --> Nginx[Nginx - Optional]
    Nginx --> CORS[CORS Filter]
    CORS --> Auth[JWT Authentication]
    Auth --> RoleCheck[Role Authorization]
    RoleCheck --> Validation[Input Validation]
    Validation --> Controller[REST Controller]
    Controller --> Service[Service Layer]
    Service --> Repository[JPA Repository]
    Repository --> DB[(Database)]
    DB --> Repository
    Repository --> Service
    Service --> Envelope[Response Envelope]
    Envelope --> Client
```

### Response Envelope Pattern

All API responses use a standard envelope:

**Success Response:**
```json
{
  "data": {
    "id": "uuid",
    "studentCode": "SV2024001",
    "name": "Nguyen Van A"
  },
  "meta": {
    "timestamp": "2026-01-13T09:47:04Z",
    "page": 1,
    "limit": 20,
    "total": 150
  },
  "message": "Success"
}
```

**Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-01-13T09:47:04Z"
  }
}
```

### API Versioning Strategy

```
/api/v1/students     ← Current version
/api/v2/students     ← Future version (breaking changes)
```

## 🔒 Security Architecture

### Multi-Layer Security

```mermaid
graph TD
    A[User Request] --> B[HTTPS/TLS Layer]
    B --> C[CORS Policy]
    C --> D[Rate Limiting]
    D --> E[JWT Validation]
    E --> F{Token Valid?}
    F -->|No| G[401 Unauthorized]
    F -->|Yes| H[Extract Roles]
    H --> I{Has Permission?}
    I -->|No| J[403 Forbidden]
    I -->|Yes| K[Input Validation]
    K --> L{Valid Input?}
    L -->|No| M[400 Bad Request]
    L -->|Yes| N[Process Request]
    N --> O[Audit Log]
    O --> P[Return Response]
```

### Role-Based Access Control (RBAC)

| Resource | ADMIN | TEACHER | STUDENT |
|----------|-------|---------|---------|
| **Students** |
| List All | ✅ | ✅ | ❌ |
| View Details | ✅ | ✅ | 🔒 Own only |
| Create | ✅ | ❌ | ❌ |
| Update | ✅ | ❌ | ❌ |
| Delete | ✅ | ❌ | ❌ |
| **Classes** |
| List All | ✅ | ✅ | 🔒 Enrolled |
| Create | ✅ | ✅ | ❌ |
| Update | ✅ | 🔒 Own classes | ❌ |
| **Grades** |
| View | ✅ | 🔒 Own classes | 🔒 Own only |
| Create | ✅ | ✅ | ❌ |
| Update | ✅ | 🔒 Own grades | ❌ |

**Legend:** ✅ Full access | ❌ No access | 🔒 Limited access

### Security Best Practices Implemented

1. **Authentication**
   - ✅ OAuth 2.0 standard (not custom)
   - ✅ JWT with RSA signatures
   - ✅ Token expiration (15 min access, 30 day refresh)
   - ✅ Automatic token refresh

2. **Authorization**
   - ✅ Role-based access control
   - ✅ Resource-level permissions
   - ✅ "Me" endpoints for user context

3. **Data Protection**
   - ✅ Input validation (Bean Validation)
   - ✅ SQL injection prevention (JPA)
   - ✅ XSS prevention (React escaping)
   - ✅ CORS configuration

4. **Network Security**
   - ✅ HTTPS required (production)
   - ✅ CORS whitelisting
   - ✅ Rate limiting

5. **Audit & Monitoring**
   - ✅ Audit logs for critical operations
   - ✅ User action tracking
   - ✅ Failed login attempts logged

## 🚀 Deployment Architecture

### Docker Compose (Development)

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    volumes:
      - postgres_data:/var/lib/postgresql/data

  keycloak:
    image: quay.io/keycloak/keycloak:23.0
    ports: ["8080:8080"]
    depends_on: [postgres]

  backend:
    build: ./backend
    ports: ["8081:8081"]
    depends_on: [postgres, keycloak]
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/student_mgmt
      - KEYCLOAK_ISSUER_URI=http://keycloak:8080/realms/student-management

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    depends_on: [backend]
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8081/api/v1
      - KEYCLOAK_ISSUER=http://keycloak:8080/realms/student-management
```

### Production Deployment (Kubernetes)

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[Ingress Controller]
    end
    
    subgraph "Application Pods"
        FE1[Frontend Pod 1]
        FE2[Frontend Pod 2]
        BE1[Backend Pod 1]
        BE2[Backend Pod 2]
        BE3[Backend Pod 3]
    end
    
    subgraph "Authentication"
        KC[Keycloak StatefulSet]
    end
    
    subgraph "Data Layer"
        DB[("PostgreSQL StatefulSet")]
        Redis[(Redis Cache)]
    end
    
    LB --> FE1
    LB --> FE2
    FE1 --> BE1
    FE1 --> BE2
    FE2 --> BE2
    FE2 --> BE3
    BE1 --> KC
    BE2 --> KC
    BE3 --> KC
    BE1 --> DB
    BE2 --> DB
    BE3 --> DB
    BE1 --> Redis
    BE2 --> Redis
    BE3 --> Redis
```

## ⚡ Performance Optimization

### Caching Strategy

**Redis Caching:**
```java
@Cacheable(value = "dashboard-stats", key = "#academicYear")
public DashboardStats getStats(Integer academicYear) {
    // Expensive calculation
}
```

**Cache Layers:**
1. **Application Cache** - Redis (dashboard, stats)
2. **Database Cache** - PostgreSQL shared buffers
3. **CDN Cache** - Static assets (frontend)
4. **Browser Cache** - API responses with ETags

### Database Optimization

**Query Optimization:**
```java
// Bad: N+1 query problem
List<Student> students = studentRepository.findAll();
students.forEach(s -> s.getClasses().size()); // N queries!

// Good: JOIN FETCH
@Query("SELECT s FROM Student s LEFT JOIN FETCH s.classes")
List<Student> findAllWithClasses();
```

**Pagination:**
```java
Pageable pageable = PageRequest.of(page, limit, Sort.by("lastName"));
Page<Student> students = studentRepository.findAll(pageable);
```

### API Response Time Targets

| Endpoint Type | Target | Max Acceptable |
|---------------|--------|----------------|
| Simple GET (by ID) | < 50ms | 200ms |
| List with pagination | < 200ms | 500ms |
| Bulk operation | < 2s | 5s |
| Report generation | < 3s | 10s |
| Dashboard stats | < 100ms | 300ms (cached) |

## 📊 Monitoring & Observability

### Health Checks

**Backend (Spring Actuator):**
```
GET /actuator/health
GET /actuator/metrics
GET /actuator/info
```

**Response:**
```json
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" },
    "keycloak": { "status": "UP" },
    "diskSpace": { "status": "UP" }
  }
}
```

### Logging Strategy

**Log Levels:**
- **ERROR:** Critical failures requiring immediate attention
- **WARN:** Degraded performance, recoverable errors
- **INFO:** Normal business operations (login, grade entry)
- **DEBUG:** Detailed diagnostic information (development only)

**Structured Logging:**
```json
{
  "timestamp": "2026-01-13T09:47:04Z",
  "level": "INFO",
  "logger": "StudentService",
  "message": "Student created successfully",
  "userId": "admin-uuid",
  "studentId": "student-uuid",
  "ip": "192.168.1.100"
}
```

## 🔄 Data Flow Examples

### Example: Creating a Grade

```mermaid
sequenceDiagram
    participant T as Teacher (Browser)
    participant F as Frontend
    participant B as Backend
    participant DB as Database

    T->>F: Fill grade form
    T->>F: Click "Save Grade"
    F->>F: Validate input (client-side)
    F->>B: POST /api/v1/grades (studentId, classId, score)
    B->>B: Validate JWT token
    B->>B: Check TEACHER role
    B->>B: Verify teacher owns class
    B->>B: Validate input (server-side)
    B->>DB: Check student enrollment
    DB->>B: Student enrolled ✓
    B->>DB: Check duplicate grade
    DB->>B: No duplicate ✓
    B->>DB: INSERT INTO grades
    DB->>B: Grade created (ID)
    B->>DB: INSERT INTO audit_logs
    B->>F: 200 OK {gradeId, score}
    F->>T: Show success message
    F->>F: Update grade list
```

### Example: Bulk Grade Import

```mermaid
flowchart TD
    subgraph Frontend [Frontend - Next.js]
        A[Teacher uploads Excel] --> B[Validate file format]
        B --> C[Parse Excel to JSON]
        M[Display Results]
    end

    subgraph Backend [Backend - Spring Boot]
        C -- POST /bulk-create --> D[Receive List]
        D --> E{Validate Record}
        
        E -- Valid --> F[Add to Success List]
        E -- Invalid --> G[Add to Error List]
        
        F --> H{All processed?}
        G --> H
        
        H -- No (Next Record) --> E
        H -- Yes --> I[Start DB Transaction]
        
        I --> J[Batch Insert Valid Grades]
        J --> K[Commit Transaction]
        
        K -- Return JSON --> M
    end
    
    %% Styling for better visibility
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style K fill:#9f9,stroke:#333,stroke-width:2px
    style G fill:#ff9999,stroke:#333
```

## 📈 Scalability Considerations

### Horizontal Scaling

**Stateless Design:**
- ✅ No server-side sessions (JWT only)
- ✅ Database connection pooling
- ✅ Shared cache (Redis)

**Load Balancing:**
```
Traffic → Load Balancer
  ├─→ Backend Pod 1
  ├─→ Backend Pod 2
  └─→ Backend Pod 3
```

### Database Scaling

**Strategies:**
1. **Read Replicas** - Separate read/write databases
2. **Connection Pooling** - HikariCP (default in Spring Boot)
3. **Partitioning** - By academic year (future)
4. **Archiving** - Move old data to archive tables

## 🛠️ Technology Justification

### Why Keycloak?
- ✅ Open-source, production-ready
- ✅ LDAP/AD integration support
- ✅ Social login support
- ✅ Multi-factor authentication
- ✅ Extensive documentation

### Why Spring Boot?
- ✅ Industry standard for Java backends
- ✅ Excellent OAuth2 support
- ✅ Large ecosystem
- ✅ Production-ready features (Actuator)

### Why Next.js?
- ✅ Server-side rendering (SEO)
- ✅ File-based routing
- ✅ API routes (BFF pattern)
- ✅ Excellent TypeScript support
- ✅ Image optimization

### Why PostgreSQL?
- ✅ ACID compliance
- ✅ Advanced features (JSONB, views, triggers)
- ✅ Excellent performance
- ✅ Strong community support

---

**This architecture prioritizes security, scalability, and maintainability while following industry best practices.**
