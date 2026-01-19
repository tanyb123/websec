# Quick Start Guide

## Cài đặt nhanh (3 bước)

### 1. Cài đặt dependencies

```bash
cd frontend
npm install
```

Nếu gặp lỗi, thử:
```bash
npm install --legacy-peer-deps
```

### 2. Chạy development server

```bash
npm run dev
```

### 3. Mở trình duyệt

Truy cập: **http://localhost:3000**

Bạn sẽ được redirect đến trang `/signin`

---

## Routes

- **/** → Redirect to `/signin`
- **/signin** → Trang đăng nhập
- **/signup** → Trang đăng ký

---

## Demo Accounts

---

## Features

### Sign In (`/signin`)
- Username & password validation
- Remember me checkbox
- Loading state
- Error messages

### Sign Up (`/signup`)
- Form với validation
- Password strength meter
- Real-time validation
- Terms & conditions

---

## Tech Stack

- **React 18.3** - Latest React
- **Next.js 14** - App Router
- **TypeScript 5** - Type safety
- **Tailwind CSS 3.4** - Styling
- **Lucide React** - Icons

---

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── signin/            # Sign in page
│   ├── signup/            # Sign up page
│   └── globals.css        # Global styles
├── components/ui/         # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
└── lib/                   # Utilities
    └── utils.ts
```

---

## Thiết kế

- **Clean & Professional**
- **No gradients** (như bạn yêu cầu)
- **Modern UI** với Tailwind CSS
- **Responsive** trên mọi thiết bị
- **Accessible** với proper labels

---

## Customize

### Đổi màu chính

File: `tailwind.config.ts`

```typescript
colors: {
  primary: {
    500: '#3b82f6',  // Đổi màu này
    600: '#2563eb',  // Và màu này
  },
}
```

### Đổi logo

File: `app/signin/page.tsx` và `app/signup/page.tsx`

Tìm và thay thế icon SVG trong phần logo.

---

## Lưu ý quan trọng

1. **Đây là UI demo** - Không có backend integration
2. **Client-side validation only** - Cần thêm server-side validation
3. **Không có authentication thực** - Cần tích hợp Keycloak/NextAuth

---

## Next Steps

Để hoàn thiện hệ thống:

1. **Cài NextAuth.js** → `npm install next-auth`
2. **Setup Keycloak provider** → Xem README.md
3. **Kết nối Spring Boot API** → Port 8081
4. **Add environment variables** → `.env.local`

Chi tiết xem trong `README.md`

---

## Troubleshooting

### Lỗi: "Cannot find module 'next'"
```bash
npm install
```

### Port 3000 bị chiếm?
```bash
PORT=3001 npm run dev
```

### TypeScript errors?
```bash
npm run build  # Check for errors
```

### Tailwind không load?
Kiểm tra `tailwind.config.ts` có đúng paths.

---

## Support

- Xem **README.md** cho hướng dẫn chi tiết
- Kiểm tra console (F12) nếu có lỗi
- Đảm bảo Node.js >= 18

---

**Happy coding!**
