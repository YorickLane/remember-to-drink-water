# Web 版本部署指南

## ✨ 已实现 Web 跨平台支持

你的应用现在可以运行在：
- ✅ iOS（使用 SQLite）
- ✅ Android（使用 SQLite）
- ✅ Web（使用 IndexedDB）

**一套代码，三个平台！**

---

## 🏗️ 技术实现

### 平台适配器架构

**抽象层：**
- `lib/storage/types.ts` - 统一接口定义
- `lib/storage/index.ts` - 平台检测和适配器选择

**移动端：**
- `lib/storage/mobile.ts` - SQLite 实现
- 使用 expo-sqlite

**Web 端：**
- `lib/storage/web.ts` - IndexedDB 实现
- 浏览器原生 API，无需额外依赖

### 功能差异

| 功能 | 移动端 | Web 端 |
|------|--------|--------|
| 数据存储 | SQLite | IndexedDB |
| 通知提醒 | 本地通知 | 浏览器通知（可选） |
| 离线使用 | ✅ | ✅ |
| 数据持久化 | ✅ | ✅ |
| 深色模式 | ✅ | ✅ |
| UI 动画 | ✅ | ✅ |

---

## 📦 构建 Web 版本

### 导出静态文件

```bash
npx expo export --platform web
```

**输出：**
- 生成 `dist/` 目录
- 包含所有静态资源（HTML, JS, CSS, 图标）
- 大小约 2-3 MB（已压缩）

**生成的文件：**
```
dist/
├── index.html
├── _expo/
│   └── static/
│       ├── js/
│       │   └── web/entry-[hash].js
│       └── css/
├── assets/
└── favicon.png
```

---

## 🚀 部署方式

### 方式 1：部署到你自己的服务器 ⭐⭐⭐

**步骤：**

1. **上传 dist 目录到服务器：**

```bash
# 使用 scp
scp -r dist/* user@yourserver.com:/var/www/waterreminder/

# 或使用 rsync
rsync -avz dist/ user@yourserver.com:/var/www/waterreminder/

# 或使用 FTP 工具（FileZilla 等）
```

2. **配置 Nginx（示例）：**

```nginx
server {
    listen 80;
    server_name waterreminder.yourdomain.com;

    root /var/www/waterreminder;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 压缩静态资源
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

3. **配置 HTTPS（推荐）：**

```bash
# 使用 Let's Encrypt
sudo certbot --nginx -d waterreminder.yourdomain.com
```

**你的隐私政策 URL 将是：**
```
https://waterreminder.yourdomain.com/privacy
```

---

### 方式 2：GitHub Pages（免费，简单）⭐⭐⭐⭐⭐

**步骤：**

1. **将 dist 内容复制到 docs：**

```bash
# 备份现有 docs
mv docs docs-backup

# 复制 dist 到 docs
cp -r dist docs

# 恢复 privacy.html（已有更好的版本）
cp docs-backup/privacy.html docs/
cp docs-backup/index.html docs/
```

2. **Push 到 GitHub：**

```bash
git add docs
git commit -m "Deploy web version"
git push origin main
```

3. **启用 GitHub Pages：**
- Settings → Pages
- Source: main, /docs

**URL 将是：**
```
https://fengxiu.github.io/remember-to-drink-water/
```

---

### 方式 3：Vercel（免费，自动化）⭐⭐⭐⭐

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel --prod

# 指定输出目录
vercel --prod dist/
```

**优点：**
- 自动 HTTPS
- 全球 CDN
- 每次 push 自动部署
- 免费自定义域名

---

### 方式 4：Netlify（免费，拖拽部署）⭐⭐⭐⭐

1. 访问 https://app.netlify.com/drop
2. 拖拽 `dist` 文件夹
3. 完成！

**或使用 CLI：**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 🌐 本地预览 Web 版本

### 方式 1：使用 Expo

```bash
npx expo start --web
```

### 方式 2：使用简单的 HTTP 服务器

```bash
# Python 3
cd dist && python3 -m http.server 8000

# Node.js
npx serve dist

# 访问 http://localhost:8000
```

---

## 📋 部署清单

### 部署前检查：
- ✅ Web 构建成功（`dist/` 目录存在）
- ✅ 本地预览正常
- ✅ 所有功能测试通过
- ✅ 深色模式正常
- ✅ 数据存储正常（IndexedDB）

### 部署后验证：
- [ ] 访问部署的 URL
- [ ] 测试添加记录
- [ ] 测试设置修改
- [ ] 测试数据持久化（刷新页面）
- [ ] 测试深色/浅色模式
- [ ] 移动端浏览器测试

---

## 🎯 推荐的部署方案

### 对于你的情况：

**隐私政策 URL：**
→ 使用 GitHub Pages（已有 `docs/privacy.html`）
```
https://fengxiu.github.io/remember-to-drink-water/privacy.html
```

**完整 Web App：**
→ 选择：
1. **你自己的服务器**（如果有域名）
2. **Vercel**（免费 + 自动部署）← 推荐
3. **Netlify**（免费 + 简单）

---

## 🔧 自己服务器部署详细步骤

### 如果你有服务器和域名：

1. **创建子域名**（DNS 配置）：
   ```
   waterreminder.yourdomain.com → 你的服务器 IP
   ```

2. **上传文件**：
   ```bash
   scp -r dist/* user@yourserver:/var/www/waterreminder/
   ```

3. **配置 Web 服务器**（Nginx/Apache）

4. **配置 HTTPS**（Let's Encrypt）

5. **完成！** 访问：
   ```
   https://waterreminder.yourdomain.com
   ```

---

## 💡 我的建议

**最佳组合方案：**

1. **隐私政策**：GitHub Pages
   - URL: `https://fengxiu.github.io/remember-to-drink-water/privacy.html`
   - 满足商店要求
   - 免费稳定

2. **Web App**：Vercel 或你自己的服务器
   - 完整的应用体验
   - 用户可以在浏览器使用
   - 数据同步（同一浏览器）

**下一步：**
1. ✅ 提交代码
2. 选择部署平台
3. 部署 Web 版本
4. 在商店中使用隐私政策 URL

需要我帮你选择和配置部署平台吗？
