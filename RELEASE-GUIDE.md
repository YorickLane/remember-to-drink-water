# 应用发布指南

## EAS Build 是什么？

**EAS Build** = Expo Application Services Build

### 简单理解：
- **传统方式**：在你的电脑上用 Xcode/Android Studio 打包 → 复杂、环境问题多
- **EAS Build**：在云端自动打包 → 简单、稳定、省心

### 主要功能：
1. **云端构建**：不需要本地配置 Xcode/Android Studio
2. **自动签名**：自动管理 iOS 证书和 Android 密钥
3. **团队协作**：团队成员都可以打包，无需配置环境
4. **应用商店提交**：直接提交到 App Store 和 Google Play

### 免费 vs 付费：
- **免费版**：每月有限的构建次数（足够个人开发）
- **付费版**：无限构建、优先队列、更多并发

---

## 发布流程总览

### 第一步：配置 EAS Build
```bash
# 安装 EAS CLI
npm install -g eas-cli

# 登录 Expo 账号
eas login

# 初始化配置
eas build:configure
```

这会创建 `eas.json` 配置文件。

### 第二步：构建应用

**开发测试版**（用于内部测试）：
```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

**生产版**（准备上架）：
```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

### 第三步：提交到商店

```bash
# 提交到 App Store
eas submit --platform ios

# 提交到 Google Play
eas submit --platform android
```

---

## 需要准备的材料

### 1. App 图标和启动页
- ✅ 已生成（见下文）

### 2. 商店截图
- iOS: 至少 2 张（6.7" 和 5.5"）
- Android: 至少 2 张
- **获取方式**：在模拟器/真机上截图

### 3. 商店描述
- ✅ 已准备（见 STORE-DESCRIPTION.md）

### 4. 隐私政策
- ✅ 已添加（见 App 内设置页面）

### 5. 开发者账号
- **Apple Developer Program**：$99/年
  - 注册：https://developer.apple.com/programs/
- **Google Play Console**：$25 一次性
  - 注册：https://play.google.com/console/

---

## 上架前检查清单

### 技术准备
- ✅ 核心功能完整
- ✅ 深色模式支持
- ✅ 动画效果流畅
- ✅ 通知功能正常
- ✅ 数据持久化稳定
- ⏳ 真机测试（iOS + Android）
- ⏳ 性能测试（启动时间、内存占用）

### 内容准备
- ✅ App 图标
- ✅ 启动页
- ✅ 隐私政策
- ✅ 商店描述
- ⏳ 应用截图
- ⏳ 宣传视频（可选）

### 合规准备
- ⏳ iOS 隐私问卷（Data collected: No）
- ⏳ Google Play Data Safety 表单
- ⏳ 健康类应用声明

---

## 常见问题

### Q: 必须使用 EAS Build 吗？
A: 不是必须，但强烈推荐。你也可以：
- 本地构建：需要配置 Xcode 和 Android Studio
- 其他 CI/CD 服务：需要自己配置

### Q: EAS Build 收费吗？
A: 有免费额度，个人开发通常够用。超出后可以付费。

### Q: 构建需要多久？
A: 通常 10-20 分钟（取决于队列和项目大小）

### Q: 可以本地测试构建的包吗？
A: 可以！构建完成后会提供下载链接。

---

## 发布时间线估算

如果现在开始准备：

1. **今天**：
   - 配置 EAS Build（10 分钟）
   - 生成图标和启动页（已完成）
   - 准备商店描述（已完成）

2. **明天**：
   - 真机测试（2-3 小时）
   - 截取应用截图（30 分钟）
   - 首次构建（20 分钟 + 等待）

3. **第三天**：
   - 注册开发者账号（如果还没有）
   - 填写商店信息
   - 提交审核

4. **审核期**：
   - iOS: 1-3 天
   - Android: 几小时到 1 天

**总计：最快 3-5 天可以上架！**

---

## 下一步行动

请继续阅读以下文档：
- `APP-ASSETS.md` - 图标和启动页说明
- `STORE-DESCRIPTION.md` - 商店描述和截图指南
- `PRIVACY-POLICY.md` - 隐私政策内容

然后运行：
```bash
eas build:configure
```

开始配置 EAS Build！
