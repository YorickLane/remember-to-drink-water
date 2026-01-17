# 版本号规范

本文档记录 iOS App Store 和 Google Play 的版本号要求，以及项目的版本管理策略。

---

## iOS App Store 版本号规范

iOS 应用需要配置两个版本标识符：

### Version (CFBundleShortVersionString)
- **格式**: `X.Y.Z`（三个由点分隔的非负整数）
- **用途**: 用户可见的版本号，显示在 App Store 页面
- **要求**:
  - 必须由 1-3 个点分隔的整数组成
  - 每个整数必须 ≥ 0
  - 总长度不超过 18 个字符
  - 新版本必须大于当前版本（按语义比较）
- **示例**: `1.0.0`, `2.1.3`, `10.20.30`

### Build (CFBundleVersion)
- **格式**: 字符串（通常为整数或 `X.Y.Z` 格式）
- **用途**: 内部构建号，用于区分同一版本的不同构建
- **要求**:
  - 相同 Version 下，Build 必须递增
  - 不同 Version 下，Build 可以重置
  - TestFlight 使用此号码区分不同构建
- **示例**: `1`, `42`, `1.0.1`

---

## Google Play 版本号规范

Android 应用需要配置两个版本标识符：

### versionCode
- **格式**: 正整数
- **用途**: 系统内部使用，用于判断版本新旧，用户不可见
- **要求**:
  - 必须是正整数
  - 最大值: `2100000000`
  - **每次上传到 Google Play 必须递增**（包括所有 track：内部测试、封闭测试、公开测试、正式发布）
  - 一旦使用过的 versionCode 无法重复使用
- **示例**: `1`, `2`, `100`

### versionName
- **格式**: 字符串
- **用途**: 用户可见的版本号，显示在 Google Play 页面
- **要求**:
  - 无严格格式限制，但建议使用语义化版本号
  - 仅供展示，不影响系统判断版本新旧
- **示例**: `"1.0.0"`, `"2.1.3-beta"`, `"v3.0"`

---

## 语义化版本号 (Semantic Versioning)

本项目采用 [语义化版本号 2.0.0](https://semver.org/lang/zh-CN/) 规范：

### 格式
```
MAJOR.MINOR.PATCH
```

### 递增规则

| 版本号 | 递增条件 | 示例场景 |
|--------|----------|----------|
| **MAJOR** | 不兼容的 API 变更 | 重大架构重构、破坏性变更 |
| **MINOR** | 向后兼容的新功能 | 新增功能、新增设置项 |
| **PATCH** | 向后兼容的问题修复 | Bug 修复、性能优化、文案修改 |

### 示例

```
1.0.0 → 1.0.1  # 修复 Bug
1.0.1 → 1.1.0  # 新增饮水目标自定义功能
1.1.0 → 2.0.0  # 重构数据存储层，需要数据迁移
```

---

## 项目当前配置

### app.json

```json
{
  "expo": {
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.nwarch.waterreminder"
    },
    "android": {
      "package": "com.nwarch.waterreminder"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

- `version`: 应用版本号，同时用于 iOS 的 CFBundleShortVersionString 和 Android 的 versionName

### eas.json

```json
{
  "cli": {
    "appVersionSource": "remote"
  },
  "build": {
    "production": {
      "autoIncrement": true
    }
  }
}
```

关键配置说明：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `appVersionSource` | `"remote"` | 版本号从 EAS 服务器获取，避免本地与远程冲突 |
| `autoIncrement` | `true` | 自动递增构建号（iOS 的 buildNumber，Android 的 versionCode） |

---

## 版本发布流程

### 1. 日常 Bug 修复

```bash
# 修改 app.json 中的 version
"version": "1.0.1"

# 构建并提交
eas build --platform all
eas submit --platform all --latest
```

### 2. 新功能发布

```bash
# 修改 app.json 中的 version
"version": "1.1.0"

# 构建并提交
eas build --platform all
eas submit --platform all --latest
```

### 3. 仅重新构建（不更改版本号）

由于配置了 `autoIncrement: true`，即使 `version` 不变，构建号也会自动递增：
- iOS: buildNumber 自动递增
- Android: versionCode 自动递增

---

## 注意事项

1. **版本号只能递增**: 一旦发布，无法回退到较低版本号
2. **测试时注意 versionCode**: 即使是内部测试也会消耗 versionCode
3. **OTA 更新**: 使用 EAS Update 可以在不更改版本号的情况下推送更新（仅限 JS 代码变更）
4. **runtimeVersion**: 配置为 `appVersion` 策略，与 `version` 保持一致，用于 OTA 更新兼容性判断
