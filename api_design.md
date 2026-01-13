# Enhanced API Design - Student Management System

## API Design Principles

### 1. Versioning Strategy
All APIs use **version prefix** for future compatibility:
- Current: `/api/v1/*`
- Future: `/api/v2/*` (breaking changes without affecting v1 clients)

### 2. HTTP Methods Usage
- `GET` - Retrieve resources
- `POST` - Create new resources
- `PATCH` - Partial update (recommended for flexibility)
- `PUT` - Full replacement (optional, use sparingly)
- `DELETE` - Remove resources

### 3. Response Envelope Pattern
All responses wrapped in standard envelope for consistency:

```json
{
  "data": { /* actual data */ },
  "meta": {
    "timestamp": "2026-01-13T09:11:39Z",
    "page": 1,
    "limit": 20,
    "total": 150
  },
  "message": "Success"
}
```

For errors:
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
    "timestamp": "2026-01-13T09:11:39Z"
  }
}
```

---

## Core API Endpoints (v1)

### Authentication (via Keycloak)

#### Login
```
GET /api/v1/auth/login
```
Redirects to Keycloak login page

#### Callback
```
GET /api/v1/auth/callback?code={code}&state={state}
```
OAuth2 callback handler

#### Logout
```
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

#### Current User Info
```
GET /api/v1/auth/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@school.edu",
    "roles": ["ADMIN"],
    "profile": {
      "firstName": "Admin",
      "lastName": "User",
      "photoUrl": "https://..."
    }
  },
  "meta": { "timestamp": "2026-01-13T09:11:39Z" },
  "message": "Success"
}
```

---

### Academic Context Management

#### Academic Years

```
GET /api/v1/academic-years
GET /api/v1/academic-years/{id}
POST /api/v1/academic-years          [ADMIN]
PATCH /api/v1/academic-years/{id}    [ADMIN]
DELETE /api/v1/academic-years/{id}   [ADMIN]
```

**Example Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "year": 2024,
      "name": "Academic Year 2024-2025",
      "startDate": "2024-09-01",
      "endDate": "2025-06-30",
      "current": true
    }
  ],
  "meta": { "total": 5 },
  "message": "Success"
}
```

#### Semesters

```
GET /api/v1/semesters
GET /api/v1/semesters?academicYearId={id}
POST /api/v1/semesters               [ADMIN]
PATCH /api/v1/semesters/{id}         [ADMIN]
```

---

### Students API (Enhanced)

#### List Students with Advanced Filtering
```
GET /api/v1/students?page=1&limit=20&sort=lastName&order=asc
GET /api/v1/students?search=nguyen
GET /api/v1/students?status=ACTIVE
GET /api/v1/students?classId={id}
GET /api/v1/students?enrollmentYear=2024
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "studentCode": "SV2024001",
      "firstName": "Nguyen",
      "lastName": "Van A",
      "email": "nguyenvana@school.edu",
      "phone": "0901234567",
      "dateOfBirth": "2006-05-15",
      "gender": "MALE",
      "status": "ACTIVE",
      "enrollmentDate": "2024-09-01",
      "photoUrl": "https://...",
      "address": "123 Main St, Hanoi",
      "createdAt": "2024-01-13T09:11:39Z",
      "updatedAt": "2024-01-13T09:11:39Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "message": "Success"
}
```

#### Get Student by ID
```
GET /api/v1/students/{id}
```

#### Create Student
```
POST /api/v1/students
Authorization: Bearer {token}
Roles: [ADMIN]
Content-Type: application/json
```

**Request:**
```json
{
  "studentCode": "SV2024001",
  "firstName": "Nguyen",
  "lastName": "Van A",
  "email": "nguyenvana@school.edu",
  "phone": "0901234567",
  "dateOfBirth": "2006-05-15",
  "gender": "MALE",
  "address": "123 Main St, Hanoi",
  "enrollmentDate": "2024-09-01",
  "photoUrl": "https://..."
}
```

#### Partial Update Student (PATCH)
```
PATCH /api/v1/students/{id}
Authorization: Bearer {token}
Roles: [ADMIN]
```

**Request (only fields to update):**
```json
{
  "phone": "0909999999",
  "address": "456 New Street, Hanoi"
}
```

#### Delete Student
```
DELETE /api/v1/students/{id}
Authorization: Bearer {token}
Roles: [ADMIN]
```

#### Bulk Import Students
```
POST /api/v1/students/bulk-import
Authorization: Bearer {token}
Roles: [ADMIN]
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: CSV/Excel file

**Response:**
```json
{
  "data": {
    "totalRows": 100,
    "successCount": 95,
    "failureCount": 5,
    "errors": [
      {
        "row": 12,
        "reason": "Duplicate student code: SV2024001"
      }
    ]
  },
  "message": "Import completed with 5 errors"
}
```

#### Export Students
```
GET /api/v1/students/export?format=csv
GET /api/v1/students/export?format=excel
Authorization: Bearer {token}
```

Returns downloadable file

---

### Teachers API (Enhanced)

```
GET /api/v1/teachers?page=1&limit=20
GET /api/v1/teachers?department=MATH
GET /api/v1/teachers/{id}
POST /api/v1/teachers              [ADMIN]
PATCH /api/v1/teachers/{id}        [ADMIN]
DELETE /api/v1/teachers/{id}       [ADMIN]
```

Similar structure to Students API

---

### Classes API (Enhanced)

#### List Classes with Filtering
```
GET /api/v1/classes?academicYear=2024
GET /api/v1/classes?semester=1
GET /api/v1/classes?teacherId={id}
GET /api/v1/classes?status=ACTIVE
```

#### Get Class Details
```
GET /api/v1/classes/{id}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "classCode": "10A1",
    "className": "Class 10A1",
    "teacher": {
      "id": "uuid",
      "name": "Nguyen Van B",
      "email": "teacher@school.edu"
    },
    "academicYear": 2024,
    "semester": 1,
    "capacity": 40,
    "enrolledCount": 35,
    "schedule": [
      {
        "dayOfWeek": "MONDAY",
        "startTime": "08:00",
        "endTime": "09:30",
        "subject": "MATH"
      }
    ],
    "roomNumber": "A101",
    "status": "ACTIVE"
  },
  "message": "Success"
}
```

#### Get Students in Class
```
GET /api/v1/classes/{id}/students?page=1&limit=20
```

#### Bulk Enroll Students
```
POST /api/v1/classes/{id}/students/bulk-enroll
Authorization: Bearer {token}
Roles: [ADMIN, TEACHER]
```

**Request:**
```json
{
  "studentIds": [
    "uuid1",
    "uuid2",
    "uuid3"
  ]
}
```

**Response:**
```json
{
  "data": {
    "successCount": 3,
    "failureCount": 0,
    "errors": []
  },
  "message": "Successfully enrolled 3 students"
}
```

#### Remove Student from Class
```
DELETE /api/v1/classes/{classId}/students/{studentId}
Authorization: Bearer {token}
Roles: [ADMIN, TEACHER]
```

---

### Grades API (Enhanced with Query Parameters)

#### Get Grades with Flexible Filtering
```
GET /api/v1/grades?studentId={id}
GET /api/v1/grades?classId={id}
GET /api/v1/grades?classId={id}&assessmentType=MIDTERM
GET /api/v1/grades?studentId={id}&academicYear=2024&semester=1
GET /api/v1/grades?page=1&limit=20
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "student": {
        "id": "uuid",
        "studentCode": "SV2024001",
        "name": "Nguyen Van A"
      },
      "class": {
        "id": "uuid",
        "classCode": "10A1",
        "className": "Class 10A1"
      },
      "assessmentType": "MIDTERM",
      "score": 8.5,
      "maxScore": 10.0,
      "weight": 0.3,
      "date": "2024-11-15",
      "notes": "Good performance",
      "createdBy": {
        "id": "uuid",
        "name": "Teacher Nguyen"
      },
      "createdAt": "2024-11-15T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45
  },
  "message": "Success"
}
```

#### Create Single Grade
```
POST /api/v1/grades
Authorization: Bearer {token}
Roles: [TEACHER, ADMIN]
```

**Request:**
```json
{
  "studentId": "uuid",
  "classId": "uuid",
  "assessmentType": "MIDTERM",
  "score": 8.5,
  "maxScore": 10.0,
  "weight": 0.3,
  "date": "2024-11-15",
  "notes": "Good performance"
}
```

#### Bulk Create Grades (Most Important for Teachers)
```
POST /api/v1/grades/bulk-create
Authorization: Bearer {token}
Roles: [TEACHER, ADMIN]
Content-Type: application/json
```

**Request:**
```json
{
  "classId": "uuid",
  "assessmentType": "MIDTERM",
  "maxScore": 10.0,
  "weight": 0.3,
  "date": "2024-11-15",
  "grades": [
    {
      "studentId": "uuid1",
      "score": 8.5,
      "notes": "Good"
    },
    {
      "studentId": "uuid2",
      "score": 7.0
    },
    {
      "studentId": "uuid3",
      "score": 9.5,
      "notes": "Excellent"
    }
  ]
}
```

**Response:**
```json
{
  "data": {
    "totalGrades": 35,
    "successCount": 35,
    "failureCount": 0,
    "errors": []
  },
  "message": "Successfully created 35 grades"
}
```

#### Bulk Update Grades
```
PATCH /api/v1/grades/bulk-update
Authorization: Bearer {token}
Roles: [TEACHER, ADMIN]
```

**Request:**
```json
{
  "updates": [
    {
      "gradeId": "uuid1",
      "score": 8.7,
      "notes": "Updated after review"
    },
    {
      "gradeId": "uuid2",
      "score": 7.5
    }
  ]
}
```

#### Update Single Grade
```
PATCH /api/v1/grades/{id}
Authorization: Bearer {token}
Roles: [TEACHER, ADMIN]
```

#### Delete Grade
```
DELETE /api/v1/grades/{id}
Authorization: Bearer {token}
Roles: [TEACHER, ADMIN]
```

---

### "Me" Endpoints (Current User Context)

These endpoints automatically use the authenticated user's ID from JWT token:

#### My Grades (Student View)
```
GET /api/v1/me/grades
GET /api/v1/me/grades?academicYear=2024&semester=1
Authorization: Bearer {token}
Roles: [STUDENT]
```

#### My Classes (Student View)
```
GET /api/v1/me/classes
GET /api/v1/me/classes?academicYear=2024
Authorization: Bearer {token}
Roles: [STUDENT]
```

#### My Teaching Classes (Teacher View)
```
GET /api/v1/me/teaching-classes
GET /api/v1/me/teaching-classes?academicYear=2024
Authorization: Bearer {token}
Roles: [TEACHER]
```

#### My Students (Teacher View)
```
GET /api/v1/me/students
GET /api/v1/me/students?classId={id}
Authorization: Bearer {token}
Roles: [TEACHER]
```

#### My Profile
```
GET /api/v1/me/profile
PATCH /api/v1/me/profile
Authorization: Bearer {token}
```

**PATCH Request:**
```json
{
  "phone": "0909999999",
  "photoUrl": "https://..."
}
```

---

### Dashboard & Analytics API (with Caching)

#### Dashboard Statistics
```
GET /api/v1/dashboard/stats
GET /api/v1/dashboard/stats?academicYear=2024
Authorization: Bearer {token}
Roles: [ADMIN, TEACHER]
```

**Response:**
```json
{
  "data": {
    "totalStudents": 1250,
    "totalTeachers": 85,
    "totalClasses": 42,
    "activeStudents": 1180,
    "averageGPA": 7.85
  },
  "meta": {
    "cached": true,
    "cacheExpiry": "2026-01-13T10:00:00Z"
  },
  "message": "Success"
}
```

#### Student Performance Analytics
```
GET /api/v1/dashboard/student-performance
GET /api/v1/dashboard/student-performance?studentId={id}&from=2024-01-01&to=2024-06-01
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": {
    "studentId": "uuid",
    "studentName": "Nguyen Van A",
    "gpa": 8.5,
    "gradesBySubject": [
      {
        "subject": "MATH",
        "averageScore": 9.0,
        "trend": "UP"
      },
      {
        "subject": "ENGLISH",
        "averageScore": 8.0,
        "trend": "STABLE"
      }
    ],
    "performanceTrend": [
      { "month": "2024-01", "gpa": 8.0 },
      { "month": "2024-02", "gpa": 8.3 },
      { "month": "2024-03", "gpa": 8.5 }
    ]
  },
  "message": "Success"
}
```

#### Class Performance Analytics
```
GET /api/v1/dashboard/class-performance?classId={id}
Authorization: Bearer {token}
Roles: [ADMIN, TEACHER]
```

#### Export Reports
```
GET /api/v1/dashboard/reports/export?type=student-grades&studentId={id}&format=pdf
GET /api/v1/dashboard/reports/export?type=class-summary&classId={id}&format=excel
Authorization: Bearer {token}
```

---

## Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Duplicate resource (e.g., student code exists) |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

- Standard endpoints: **100 requests/minute**
- Bulk operations: **10 requests/minute**
- Dashboard/Analytics: **20 requests/minute** (cached responses)

---

## Pagination Standard

All paginated endpoints support:
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `sort` (field name)
- `order` (asc/desc)

---

## Next Steps for Implementation

1. ✅ **Database Schema** - Design tables for AcademicYear, Semester
2. ✅ **Response Envelope** - Create generic wrapper classes
3. ✅ **Bulk Operations** - Implement batch processing services
4. ✅ **Caching Layer** - Set up Redis for dashboard stats
5. ✅ **Query Optimization** - Use Spring Data JPA specifications for dynamic filtering
