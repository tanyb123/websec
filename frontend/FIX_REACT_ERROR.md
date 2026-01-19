# Fix "Cannot find module 'react'" Error

## Vấn đề:
```
Cannot find module 'react' or its corresponding type declarations. ts(2307)
```

## Nguyên nhân:
- `node_modules` chưa được cài đúng
- TypeScript không tìm thấy type declarations
- Cache bị lỗi

## Giải pháp - Chạy từng bước:

### Bước 1: Xóa cache và node_modules

```bash
cd frontend

# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Hoặc trên Windows:
rmdir /s /q node_modules
del package-lock.json
```

### Bước 2: Xóa cache của Next.js và TypeScript

```bash
# Xóa .next folder
rm -rf .next

# Windows:
rmdir /s /q .next
```

### Bước 3: Cài lại dependencies

```bash
npm install
```

**QUAN TRỌNG**: Đảm bảo bạn đang ở đúng thư mục `frontend/`

### Bước 4: Restart VS Code TypeScript Server

Trong VS Code:
1. Mở Command Palette: `Ctrl + Shift + P` (hoặc `Cmd + Shift + P` trên Mac)
2. Gõ: `TypeScript: Restart TS Server`
3. Enter

### Bước 5: Reload VS Code Window (nếu vẫn lỗi)

1. Command Palette: `Ctrl + Shift + P`
2. Gõ: `Developer: Reload Window`
3. Enter

## Kiểm tra sau khi fix:

```bash
# Kiểm tra node_modules có đúng không
ls node_modules/react

# Kiểm tra @types/react
ls node_modules/@types/react

# Run dev server
npm run dev
```

## Kết quả mong đợi:

Sau khi chạy `npm run dev`, bạn sẽ thấy:

```
   ▲ Next.js 14.2.0
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Ready in 2.3s
```

## Nếu vẫn lỗi:

### Option 1: Cài dependencies một cách manual

```bash
npm install react@18.3.1 react-dom@18.3.1
npm install --save-dev @types/react@18.3.1 @types/react-dom@18.3.0
npm install next@14.2.0
npm install typescript@5.3.3
```

### Option 2: Sử dụng yarn thay vì npm

```bash
# Cài yarn (nếu chưa có)
npm install -g yarn

# Xóa node_modules
rm -rf node_modules package-lock.json

# Cài bằng yarn
yarn install

# Chạy
yarn dev
```

### Option 3: Kiểm tra Node.js version

```bash
node -v
# Cần >= 18.17.0

npm -v
# Cần >= 9.0.0
```

Nếu Node.js cũ, update tại: https://nodejs.org/

## Checklist fix lỗi:

- [ ] Xóa `node_modules` và `package-lock.json`
- [ ] Xóa `.next` folder
- [ ] Chạy `npm install`
- [ ] Restart TS Server trong VS Code
- [ ] Reload VS Code window
- [ ] Kiểm tra `node_modules/react` có tồn tại
- [ ] Kiểm tra `node_modules/@types/react` có tồn tại
- [ ] Chạy `npm run dev`

## Lưu ý quan trọng:

1. **Đảm bảo đúng thư mục**: Phải ở trong `frontend/` folder
2. **Internet connection**: Cần internet để download packages
3. **Quyền admin**: Có thể cần run terminal as administrator (Windows)
4. **Antivirus**: Tạm thời tắt antivirus nếu nó block npm install

## Package versions đã fix:

Đã update `package.json` với exact versions (không dùng `^`):

```json
{
  "dependencies": {
    "react": "18.3.1",          ← Exact version
    "react-dom": "18.3.1",
    "next": "14.2.0"
  },
  "devDependencies": {
    "@types/react": "18.3.1",
    "@types/react-dom": "18.3.0",
    "typescript": "5.3.3"
  }
}
```

## Vẫn không được?

Gửi screenshot của:
1. Output của `npm install`
2. Output của `ls node_modules | grep react`
3. VS Code Problems panel

---

**Lưu ý**: Lỗi này phổ biến với Next.js + TypeScript, đã được fix ổn định với các bước trên.
