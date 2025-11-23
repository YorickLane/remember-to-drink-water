# Latest Documentation Skill

## 目的
提供查询 React Native、Expo 和相关技术最新官方文档的**工具和方法**。

> 💡 **何时使用本 skill：** 需要查询最新文档和 API 用法时
>
> 📚 **关于主动检查原则：** 见 [proactive-checks.md](./proactive-checks.md)

---

## 使用场景

### 何时查询文档
- 添加新功能时查询最新 API
- 解决错误和警告时查找官方解决方案
- 学习新技术特性
- 验证代码是否使用了推荐的方法
- 不确定某个 API 的具体用法

### ⚠️ 重要提醒
> 关于**何时应该主动查询**、**为什么要主动查询**，详见 [proactive-checks.md](./proactive-checks.md)
>
> 本文档专注于**如何查询**和**使用什么工具**

## 执行步骤

### 1. 确定查询目标
- 明确需要查询的技术栈（Expo、React Native、相关库等）
- 确定具体的 API 或功能

### 2. 使用 Context7 MCP 自动获取最新文档

**Context7 的优势：**
- 自动获取特定版本的最新文档
- 消除幻觉 API 和过时代码
- 支持多种框架和库
- 在提示中添加 "use context7" 即可触发

**使用方法：**
```
我需要实现 [功能]，use context7
```

Context7 会自动：
- 识别相关的技术栈
- 获取对应版本的最新文档
- 提供准确的代码示例

### 3. 使用 MCP Fetch 工具查询官方文档（备选方案）

**Expo 官方文档：**
- 基础 URL: https://docs.expo.dev
- 常用路径：
  - `/versions/latest/sdk/` - SDK 包文档
  - `/develop/` - 开发指南
  - `/build/` - 构建和发布
  - `/router/` - Expo Router 文档

**React Native 官方文档：**
- 基础 URL: https://reactnative.dev
- 常用路径：
  - `/docs/` - 核心文档
  - `/docs/components` - 组件文档
  - `/docs/apis` - API 文档

**特定库文档：**
- expo-notifications: https://docs.expo.dev/versions/latest/sdk/notifications/
- expo-sqlite: https://docs.expo.dev/versions/latest/sdk/sqlite/
- zustand: https://zustand.docs.pmnd.rs/
- date-fns: https://date-fns.org/docs/

### 3. 执行查询

使用 MCP Fetch 工具获取最新文档：

```
请使用 Fetch MCP 工具查询 [具体 URL]，并提取以下信息：
- API 使用方法
- 最新的示例代码
- 注意事项和最佳实践
- 已知问题和解决方案
```

### 4. 应用到项目

根据查询到的最新文档：
- 更新代码使用最新 API
- 应用最佳实践
- 修复已知问题
- 添加必要的错误处理

### 5. 验证变更

- 测试新实现的功能
- 确保没有引入新的警告或错误
- 验证兼容性

## 示例用法

### 查询 Expo Notifications 最新 API

```markdown
我需要实现推送通知功能，请：
1. 查询 https://docs.expo.dev/versions/latest/sdk/notifications/
2. 提取最新的权限请求方法
3. 提取最新的通知调度 API
4. 检查是否有新的配置选项
```

### 查询 Expo SQLite 最新用法

```markdown
我需要使用 SQLite 存储数据，请：
1. 查询 https://docs.expo.dev/versions/latest/sdk/sqlite/
2. 确认是使用 expo-sqlite 还是 expo-sqlite/next
3. 提取最新的数据库操作 API
4. 查找迁移和升级的最佳实践
```

### 查询特定组件的最新用法

```markdown
我需要使用 FlatList 组件，请：
1. 查询 https://reactnative.dev/docs/flatlist
2. 提取性能优化建议
3. 查找常见陷阱和解决方案
4. 确认最新的 props 和回调
```

## 注意事项

1. **优先使用官方文档**：始终优先查询官方文档而不是第三方资源
2. **检查版本兼容性**：确保查询的文档版本与项目使用的版本匹配
3. **验证示例代码**：不要直接复制粘贴，理解后再应用
4. **关注废弃警告**：注意文档中的 deprecated 标记
5. **查看变更日志**：对于重大更新，查看 changelog 了解破坏性变更

## 当前项目技术栈

- **Expo SDK**: ~54.0.25
- **React Native**: 0.81.5
- **React**: 19.1.0
- **Expo Router**: ~6.0.15
- **核心依赖**:
  - expo-sqlite
  - expo-notifications
  - zustand
  - date-fns
  - react-native-gifted-charts

## 快速查询链接

### Expo 相关
- Expo SDK 54 文档: https://docs.expo.dev/versions/v54.0.0/
- Expo Router: https://docs.expo.dev/router/introduction/
- EAS Build: https://docs.expo.dev/build/introduction/
- Expo Notifications: https://docs.expo.dev/versions/latest/sdk/notifications/
- Expo SQLite: https://docs.expo.dev/versions/latest/sdk/sqlite/

### React Native 相关
- React Native 核心: https://reactnative.dev/docs/getting-started
- React Native 组件: https://reactnative.dev/docs/components-and-apis
- React Native 性能: https://reactnative.dev/docs/performance

### 第三方库
- Zustand: https://zustand.docs.pmnd.rs/
- date-fns: https://date-fns.org/docs/Getting-Started
- React Native Gifted Charts: https://www.npmjs.com/package/react-native-gifted-charts

## 输出格式

查询完成后，应该提供：

1. **概述**：简要说明查询到的信息
2. **关键 API**：列出相关的 API 和方法
3. **代码示例**：提供实际可用的代码片段
4. **注意事项**：列出需要注意的事项
5. **应用建议**：说明如何在当前项目中应用

---

**使用方法**：在 Claude Code 中输入 `/skill latest-docs` 即可激活此技能。
