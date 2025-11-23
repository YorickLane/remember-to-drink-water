# 下一步行动计划

**当前状态：** 应用开发完成 100%，等待开发者账号批准

**最后更新：** 2025-11-22

---

## 📊 当前进度总览

### ✅ 已完成（100%）

#### 功能开发
- ✅ 核心功能（记录、提醒、设置）
- ✅ 深色模式完整支持
- ✅ UI 动画效果
- ✅ 跨平台支持（iOS/Android/Web）
- ✅ 类型安全（0 个 any）
- ✅ 性能优化（Hermes 已启用）

#### 上架准备
- ✅ App 图标生成（1024x1024）
- ✅ 启动页配置
- ✅ 隐私政策页面（App 内 + GitHub Pages）
- ✅ 商店描述文档
- ✅ EAS Build 配置
- ✅ Android 构建完成（90MB APK）

#### 技术优化
- ✅ 安全区域适配
- ✅ 导航栏图标跨平台支持
- ✅ 通知立即弹出 bug 修复
- ✅ Web 平台支持（IndexedDB）

### ⏳ 进行中

- ⏳ **Apple Developer Program** 账号申请中（1-2天）
- ⏳ **Google Play Console** 账号申请中（可选，$25）

### 📍 待完成

- [ ] 准备应用截图（2-4张）
- [ ] 启用 GitHub Pages（隐私政策 URL）
- [ ] iOS 生产构建（等 Apple 账号）
- [ ] 提交 App Store
- [ ] 提交 Google Play

---

## 🎯 详细行动计划

### 阶段 1：等待账号期间（今天-明天）

#### 任务 1.1：启用 GitHub Pages ⏰ 5分钟

```bash
# 1. Push 代码到 GitHub
git push origin main

# 2. 在 GitHub 仓库中：
# Settings → Pages → Source: main, /docs → Save

# 3. 等待 1-2 分钟部署

# 4. 验证 URL
# https://fengxiu.github.io/remember-to-drink-water/privacy.html
```

**用途：** 商店提交时的隐私政策 URL

#### 任务 1.2：准备应用截图 ⏰ 30分钟

**iOS 截图：**
```bash
# 启动 iOS 模拟器
npx expo start --ios

# 选择 iPhone 15 Pro Max
# 截图快捷键：Cmd + S
```

**需要截取：**
1. 主页面 - 显示 50-70% 进度 + 几条记录
2. 设置页面 - 显示所有设置选项
3. 深色模式 - 主页面深色版本（可选）
4. 通知示例 - 截图通知（可选）

**Android 截图：**
- 在 Android 设备上截图
- 或使用 Android 模拟器

**截图要求：**
- iOS: 6.7" (1290 x 2796) 和 5.5" (1242 x 2208)
- Android: 手机尺寸（1080 x 1920 推荐）
- 至少 2 张，建议 3-4 张

#### 任务 1.3：测试 Android APK ⏰ 15分钟

**已有的 90MB APK：**
1. 下载到手机
2. 安装测试
3. 完整功能测试：
   - 添加/删除记录
   - 修改设置
   - 测试通知
   - 深色模式切换
   - 数据持久化

**如果发现问题：**
- 修复代码
- 重新构建

#### 任务 1.4：优化版本构建（可选）⏰ 20分钟

```bash
# 应用 Hermes 优化后重新构建
eas build --profile preview --platform android

# 预计从 90MB → 60-70MB
```

#### 任务 1.5：准备 Web 部署（可选）⏰ 30分钟

**选项 A：Vercel（推荐）**
```bash
npm install -g vercel
vercel --prod

# 跟随提示配置
```

**选项 B：GitHub Pages**
```bash
# 复制 dist 到 docs（会覆盖现有 docs）
# 不推荐：会覆盖隐私政策页面
```

**选项 C：你的服务器**
```bash
# 上传 dist/ 目录
scp -r dist/* user@server:/var/www/waterreminder/
```

---

### 阶段 2：Apple 账号批准后（第2-3天）

#### 任务 2.1：iOS 生产构建 ⏰ 30分钟

```bash
# 构建 iOS 生产版
eas build --profile production --platform ios

# 这次选 Y，登录 Apple 账号
# 等待 20-30 分钟
```

#### 任务 2.2：下载并测试 iOS 构建

**通过 TestFlight 测试：**
```bash
# 提交到 TestFlight
eas submit --platform ios

# 在 App Store Connect 添加测试员
# 通过 TestFlight App 安装测试
```

---

### 阶段 3：提交商店（第3-4天）

#### 任务 3.1：准备 App Store Connect

**需要填写：**
1. App 信息
   - 名称：喝水提醒
   - 副标题：健康饮水，轻松记录
   - 类别：健康与健身

2. 隐私信息
   - 数据收集：No（无收集）
   - 隐私政策 URL：`https://fengxiu.github.io/remember-to-drink-water/privacy.html`

3. 应用描述
   - 复制 STORE-DESCRIPTION.md 中的中文描述
   - 关键词：从文档中复制

4. 截图
   - 上传准备好的截图

5. 版本信息
   - 版本号：1.0.0
   - 更新说明：复制 STORE-DESCRIPTION.md 中的 Release Notes

#### 任务 3.2：提交 iOS

```bash
eas submit --platform ios
```

或在 App Store Connect 手动上传。

#### 任务 3.3：准备 Google Play Console

**需要填写：**
1. App 信息
   - 应用名称：喝水提醒
   - 简短描述：从文档复制
   - 完整描述：从文档复制

2. 分类
   - 类别：健康与健身
   - 标签：健康、工具

3. Data Safety
   - 选择：No data collected/shared
   - 填写表单

4. Health Apps Declaration
   - 如实填写健康类应用声明

5. 截图
   - 上传 Android 截图

#### 任务 3.4：提交 Android

```bash
# 使用已有的 .aab 文件
eas submit --platform android

# 或重新构建后提交
eas build --profile production --platform android
eas submit --platform android
```

---

### 阶段 4：审核期间（第4-7天）

#### 监控审核状态

**iOS：**
- App Store Connect → 我的 App → 查看状态
- 一般 1-3 天

**Android：**
- Google Play Console → 查看状态
- 一般几小时到 1 天

#### 准备应对审核问题

**常见被拒原因：**
1. 隐私政策不完整 → 已完善 ✅
2. 截图不符合要求 → 检查尺寸
3. 健康声明不完整 → 如实填写
4. 功能描述不准确 → 检查描述

**如果被拒：**
1. 查看拒绝原因
2. 根据要求修改
3. 重新提交（通常当天可重新审核）

---

## 📅 时间线估算

| 阶段 | 任务 | 预计时间 | 依赖 |
|------|------|----------|------|
| **今天** | 启用 GitHub Pages | 5 分钟 | - |
| | 准备截图 | 30 分钟 | - |
| | 测试 Android APK | 15 分钟 | - |
| **明天** | 等待 Apple 账号 | - | Apple 审核 |
| | 准备商店信息 | 1 小时 | - |
| **第2-3天** | Apple 账号批准 | - | Apple |
| | iOS 构建 | 30 分钟 | Apple 账号 |
| | 测试 iOS 版本 | 30 分钟 | - |
| **第3-4天** | 提交 App Store | 1 小时 | 截图准备好 |
| | 提交 Google Play | 1 小时 | 截图准备好 |
| **第4-7天** | 等待审核 | - | 商店审核 |
| **第7天** | 🎉 **上架成功** | - | - |

**总计：约 5-7 天**

---

## ✅ 当前可以立即做的

### 优先级 1（今天必做）

1. **启用 GitHub Pages**
   ```bash
   git push origin main
   # 然后在 GitHub 网页操作
   ```

2. **准备应用截图**
   - 启动模拟器
   - 截取 2-4 张截图
   - 保存到 `screenshots/` 目录（可选）

### 优先级 2（明天）

3. **完善商店信息**
   - 检查 STORE-DESCRIPTION.md
   - 确认描述和关键词
   - 准备版本说明

4. **测试 Android 版本**
   - 安装 APK 到真机
   - 完整功能测试
   - 记录任何问题

### 优先级 3（有时间就做）

5. **优化 APK 大小**
   - 重新构建应用 Hermes 优化
   - 测试优化后的版本

6. **部署 Web 版本**
   - 选择部署平台
   - 部署 dist/ 目录

---

## 🚫 暂时不要做的

- ❌ 不要修改核心功能（容易引入 bug）
- ❌ 不要添加新功能（V1.1 再做）
- ❌ 不要重构代码（稳定优先）
- ❌ 不要改变 UI（已经很好了）

**现在专注于上架！** 🎯

---

## 📝 检查清单

### 今天结束前
- [ ] GitHub Pages 已启用并验证
- [ ] 应用截图已准备（至少 2 张）
- [ ] Android APK 已测试
- [ ] 记录了任何发现的问题

### Apple 账号批准前
- [ ] 所有商店信息准备完毕
- [ ] 截图已美化（可选）
- [ ] 版本说明已完善
- [ ] 熟悉了 App Store Connect 界面（可先注册查看）

### 提交前
- [ ] 运行 `/skill pre-release-check`
- [ ] 所有检查项通过
- [ ] 构建版本测试通过
- [ ] 隐私政策 URL 可访问

---

## 🎯 最终目标

**本周内：**
- ✅ 完成所有准备工作
- ✅ 提交到两个商店

**下周内：**
- 🎉 应用上架
- 📱 用户可以下载使用

**未来：**
- V1.1：添加统计功能
- V1.2：历史记录查看
- V1.3：数据导出/导入
- V2.0：桌面小组件

---

## 📞 遇到问题？

**Apple 账号相关：**
- 查看 Apple Developer 邮件
- 检查支付状态
- 联系 Apple 支持

**构建失败：**
- 查看构建日志
- 运行 `/skill pre-release-check`
- 检查配置文件

**审核被拒：**
- 仔细阅读拒绝原因
- 查看 App Store 审核指南
- 根据要求修改后重新提交

---

## 💡 重要提醒

1. **不要着急**
   - 开发者账号审核需要时间
   - 利用这段时间完善细节

2. **保持代码稳定**
   - 不要在提交前大改
   - 小改动也要充分测试

3. **准备应对审核**
   - 第一次提交可能被拒
   - 根据反馈改进很正常

4. **享受过程**
   - 你的应用已经很棒了！
   - 马上就要上架了！

---

**坚持住，胜利在望！** 🚀💪
