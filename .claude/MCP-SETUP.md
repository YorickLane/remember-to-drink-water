# MCP 服务器配置说明

本项目配置了以下 MCP 服务器来辅助开发，确保始终使用最新的技术文档和最佳实践。

## 已配置的 MCP 服务器

### 1. **Fetch MCP** ✅
- **功能**：获取网页内容
- **状态**：开箱即用，无需配置
- **用途**：直接查询官方文档网页

### 2. **Context7 MCP** 🔧
- **功能**：为 LLM 提供最新的代码文档和示例
- **状态**：需要配置 API Key
- **用途**：自动获取特定版本的框架/库文档

## Context7 配置步骤

### 步骤 1：获取 API Key

1. 访问 [https://context7.com/dashboard](https://context7.com/dashboard)
2. 注册/登录账号
3. 在 Dashboard 中生成 API Key

### 步骤 2：配置环境变量

**macOS/Linux:**

```bash
# 编辑你的 shell 配置文件
# 对于 zsh (macOS 默认)
echo 'export CONTEXT7_API_KEY="your-api-key-here"' >> ~/.zshrc
source ~/.zshrc

# 对于 bash
echo 'export CONTEXT7_API_KEY="your-api-key-here"' >> ~/.bashrc
source ~/.bashrc
```

**Windows (PowerShell):**

```powershell
# 临时设置（当前会话）
$env:CONTEXT7_API_KEY="your-api-key-here"

# 永久设置
[System.Environment]::SetEnvironmentVariable('CONTEXT7_API_KEY', 'your-api-key-here', 'User')
```

### 步骤 3：验证配置

```bash
# 检查环境变量是否设置成功
echo $CONTEXT7_API_KEY

# 应该输出你的 API Key
```

### 步骤 4：重启 Claude Code

配置环境变量后，需要重启 Claude Code 才能生效。

## 使用方法

### 使用 Context7

在提示中添加 "use context7" 即可：

```
我需要实现 Expo 推送通知功能，use context7
```

Context7 会自动：
- 识别你使用的 Expo 版本（SDK 54）
- 获取对应版本的最新文档
- 提供准确的代码示例和 API 用法

### 使用 Fetch MCP

直接请求查询特定 URL：

```
请使用 Fetch MCP 查询 https://docs.expo.dev/versions/latest/sdk/notifications/
并提取权限请求的方法
```

## 常见问题

### Q: Context7 需要付费吗？
A: Context7 提供免费层级，有速率限制。付费版本提供更高的速率限制和私有仓库支持。

### Q: 不配置 API Key 可以使用吗？
A: 可以，但会有较低的速率限制。建议配置 API Key 以获得更好的体验。

### Q: 如何知道 Context7 是否正常工作？
A: 在使用 "use context7" 后，如果能正常返回文档和代码示例，说明配置成功。

### Q: Fetch MCP 和 Context7 有什么区别？
A:
- **Fetch MCP**: 直接获取网页内容，需要手动指定 URL
- **Context7**: 智能识别技术栈版本，自动获取相关文档，更智能但需要 API Key

## 技术栈版本

当前项目使用的版本（Context7 会自动识别）：

- **Expo SDK**: ~54.0.25
- **React Native**: 0.81.5
- **React**: 19.1.0
- **Expo Router**: ~6.0.15

## 相关链接

- Context7 官网: https://context7.com
- Context7 GitHub: https://github.com/upstash/context7
- Fetch MCP: https://github.com/modelcontextprotocol/servers/tree/main/src/fetch

## 更新日志

- **2025-11-22**: 初始配置，添加 Fetch 和 Context7 MCP 服务器
