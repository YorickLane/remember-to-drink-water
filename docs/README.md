# GitHub Pages 部署说明

## 隐私政策 URL 配置

本目录用于部署应用的隐私政策页面到 GitHub Pages。

### 部署步骤：

#### 1. 启用 GitHub Pages

在 GitHub 仓库中：
1. 进入 Settings → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 "main"
4. 文件夹选择 "/docs"
5. 点击 Save

#### 2. 等待部署（约1-2分钟）

部署完成后，你的隐私政策 URL 将是：
```
https://fengxiu.github.io/remember-to-drink-water/privacy.html
```

主页 URL：
```
https://fengxiu.github.io/remember-to-drink-water/
```

#### 3. 在商店中使用此 URL

**App Store Connect：**
- App Privacy → Privacy Policy URL
- 填入：`https://fengxiu.github.io/remember-to-drink-water/privacy.html`

**Google Play Console：**
- Store Presence → Privacy Policy
- 填入：`https://fengxiu.github.io/remember-to-drink-water/privacy.html`

---

## 文件说明

- `index.html` - 主页（应用介绍）
- `privacy.html` - 隐私政策（商店必需）

## 验证部署

部署完成后，在浏览器中访问：
```
https://fengxiu.github.io/remember-to-drink-water/privacy.html
```

应该能看到完整的隐私政策页面。

---

## 注意事项

1. **不需要单独的服务器**：GitHub Pages 免费托管
2. **自动 HTTPS**：GitHub 自动提供 SSL 证书
3. **更新方式**：修改 `docs/privacy.html` 并 push 即可
4. **响应式设计**：支持手机和电脑浏览
5. **深色模式**：自动跟随系统主题

---

## 替代方案

如果你不想用 GitHub Pages，还可以：

### 方案 1：Vercel（免费）
```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
cd docs && vercel
```

### 方案 2：Netlify（免费）
拖拽 docs 文件夹到 https://app.netlify.com/drop

### 方案 3：自己的服务器
上传 `privacy.html` 到你的服务器即可

---

**推荐：使用 GitHub Pages，简单、免费、稳定！**
