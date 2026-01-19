# Student Management System - Frontend (React 18 + Next.js 14)

Giao diện đăng nhập và đăng ký chuyên nghiệp được xây dựng bằng React 18, Next.js 14, TypeScript và Tailwind CSS.

## Công nghệ sử dụng

- **Next.js 14** - React framework với App Router
- **React 18.3** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Lucide React** - Icon library

## Cấu trúc dự án

```
frontend/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (redirect to signin)
│   ├── signin/
│   │   └── page.tsx         # Sign In page
│   └── signup/
│       └── page.tsx         # Sign Up page
├── components/
│   └── ui/
│       ├── Button.tsx       # Button component
│       ├── Input.tsx        # Input component
│       └── Card.tsx         # Card components
├── lib/
│   └── utils.ts             # Utility functions
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.mjs          # Next.js configuration
└── package.json             # Dependencies
```

## Tính năng

### Sign In Page (`/signin`)
- Form đăng nhập với validation
- Remember me checkbox
- Forgot password link
- Loading state khi submit
- Error handling

### Sign Up Page (`/signup`)
- Form validation đầy đủ:
  - Email format validation
  - Phone number validation (Vietnamese format)
  - Password strength indicator (weak/medium/strong)
  - Password confirmation matching
- Real-time password strength checking
- Terms & conditions checkbox
- Responsive design

## Cài đặt và chạy

### Bước 1: Cài đặt dependencies

```bash
cd frontend
npm install
```

### Bước 2: Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại: [http://localhost:3000](http://localhost:3000)

### Bước 3: Build production

```bash
npm run build
npm start
```

## Thiết kế

### Nguyên tắc thiết kế
- **Clean & Professional**: Không sử dụng gradient phức tạp
- **Minimalist**: Tập trung vào nội dung và chức năng
- **Accessible**: Đảm bảo accessibility cho tất cả người dùng
- **Responsive**: Hoạt động tốt trên mọi thiết bị

### Màu sắc
- **Primary Blue**: `#3b82f6` (Blue 500)
- **Dark Blue**: `#2563eb` (Blue 600)
- **Gray**: `#6b7280` (Gray 500)
- **Background**: `#f9fafb` (Gray 50)

### Typography
- **Font**: System fonts (Segoe UI, Roboto, etc.)
- **Heading**: Bold, 2xl (24px)
- **Body**: Regular, base (16px)
- **Small**: Regular, sm (14px)

## Responsive Design

- **Desktop** (≥ 1024px): Full layout
- **Tablet** (768px - 1023px): Adjusted spacing
- **Mobile** (< 768px): Stacked layout, full-width components

## Tùy chỉnh

### Thay đổi màu sắc

Chỉnh sửa trong `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#3b82f6',  // Màu chính
        600: '#2563eb',  // Màu hover
      },
    },
  },
}
```

### Thay đổi validation rules

Chỉnh sửa trong các page component (`app/signin/page.tsx`, `app/signup/page.tsx`):

```typescript
// Password minimum length
if (formData.password.length < 8) {
  newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
}

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(formData.email)) {
  newErrors.email = "Email không hợp lệ";
}
```

## Tích hợp Backend

Hiện tại đây là **frontend demo** với validation client-side. Để tích hợp với backend:

### 1. Cài đặt NextAuth.js (khuyến nghị)

```bash
npm install next-auth
```

Tạo file `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID!,
      clientSecret: process.env.KEYCLOAK_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
});

export { handler as GET, handler as POST };
```

### 2. Environment Variables

Tạo file `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

KEYCLOAK_ID=student-management-client
KEYCLOAK_SECRET=your-client-secret
KEYCLOAK_ISSUER=http://localhost:8080/realms/student-management

NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
```

### 3. Gọi API Backend

Trong page component:

```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Lưu token và redirect
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } else {
      setErrors({ general: data.message });
    }
  } catch (error) {
    console.error('Login error:', error);
    setErrors({ general: 'Đã có lỗi xảy ra' });
  }
};
```

## Components

### Button Component

```tsx
import Button from "@/components/ui/Button";

<Button variant="primary" size="md" isLoading={false}>
  Đăng nhập
</Button>

// Variants: primary | secondary | outline
// Sizes: sm | md | lg
```

### Input Component

```tsx
import Input from "@/components/ui/Input";

<Input
  label="Email"
  type="email"
  placeholder="example@school.edu"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error="Email không hợp lệ"
  required
/>
```

### Card Component

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

<Card>
  <CardHeader>
    <CardTitle>Đăng nhập</CardTitle>
    <CardDescription>Nhập thông tin tài khoản</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
</Card>
```

## Security Best Practices

- Client-side validation (không thay thế server-side)
- HTTPS trong production
- Environment variables cho sensitive data
- CSRF protection với NextAuth.js
- XSS protection (React mặc định)

## Scripts

```bash
npm run dev      # Chạy development server
npm run build    # Build production
npm run start    # Chạy production server
npm run lint     # Lint code
```

## Troubleshooting

### Port 3000 đã được sử dụng?

```bash
# Chạy trên port khác
PORT=3001 npm run dev
```

### Module not found error?

```bash
# Xóa và cài lại dependencies
rm -rf node_modules package-lock.json
npm install
```

### Tailwind CSS không hoạt động?

Đảm bảo `tailwind.config.ts` có đúng content paths:

```typescript
content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
],
```

## Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

## Demo Accounts

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Admin | `admin` | `admin123` | Quản trị viên hệ thống |
| Teacher | `teacher.nguyen` | `teacher123` | Giáo viên |
| Student | `student.pham` | `student123` | Sinh viên |

## License

MIT License

## Author

Created for Student Management System with OAuth2 & Keycloak

---

**Lưu ý**: Đây là frontend UI với validation client-side. Để hoàn thiện hệ thống, bạn cần tích hợp với:
1. Keycloak OAuth2 server (port 8080)
2. Spring Boot backend API (port 8081)
3. NextAuth.js cho session management
