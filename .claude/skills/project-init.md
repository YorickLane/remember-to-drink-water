# Project Init - 项目初始化自动生成 README

## 目的
在新项目初始化完成后，自动生成完整、专业的 README.md 文档，避免遗忘项目说明。

## 使用时机
- ✅ 运行 `npm run reset-project` 或类似命令后
- ✅ 完成项目核心功能后
- ✅ 准备开源或分享项目时
- ✅ 项目重构后需要更新文档时

## 触发条件（自动）

检测以下情况自动提示生成 README：
1. README.md 是默认的 Expo 模板内容
2. 项目有了实际的功能代码（app/ 目录有自定义文件）
3. package.json 中添加了多个依赖
4. 用户明确表示"项目完成了"或"准备发布"

## README 必需内容

### 基础信息
- [ ] 项目名称和简介
- [ ] 功能特性列表
- [ ] 技术栈说明
- [ ] 快速开始指南

### 项目文档
- [ ] 文档索引（链接到其他 md 文件）
- [ ] 项目结构说明
- [ ] API 文档（如果有）

### 开发信息
- [ ] 安装步骤
- [ ] 运行命令
- [ ] 构建和部署
- [ ] 常用脚本说明

### 额外信息
- [ ] 故障排查
- [ ] 贡献指南
- [ ] License
- [ ] 联系方式

---

## 生成流程

### 第一步：收集项目信息

从以下源收集信息：
1. **package.json** - 项目名称、版本、依赖
2. **app.json** - Expo 配置、平台支持
3. **目录结构** - 分析 app/、components/、lib/ 等
4. **其他 md 文档** - 索引已有文档

### 第二步：分析技术栈

自动识别：
- 使用的框架（Expo、React Native CLI）
- 路由方案（expo-router、react-navigation）
- 状态管理（Zustand、Redux、Context）
- UI 库（Reanimated、NativeWind 等）
- 数据存储（SQLite、AsyncStorage、IndexedDB）

### 第三步：提取功能特性

分析代码识别：
- 主要页面和功能
- 特殊功能（深色模式、动画、通知等）
- 跨平台支持情况

### 第四步：生成 README

使用模板生成包含：
- 项目徽章（Expo、RN、TypeScript）
- 清晰的功能列表
- 完整的文档索引
- 详细的快速开始指南
- 项目结构可视化
- 技术栈说明

---

## README 模板结构

```markdown
# [项目图标] 项目名称

一句话简介

[![徽章1](url)](link) [![徽章2](url)](link)

---

## ✨ 功能特性

### 核心功能
- 功能 1 描述
- 功能 2 描述

### 高级功能
- 高级功能 1
- 高级功能 2

---

## 📚 文档索引

### 分类 1
- [文档1](link) - 说明
- [文档2](link) - 说明

---

## 🚀 快速开始

### 前置要求
列出所有依赖

### 安装
代码块

### 运行
代码块

---

## 🏗️ 项目结构

目录树结构

---

## 🛠️ 技术栈

详细的技术栈列表

---

## 📱 构建和发布

构建命令和说明

---

## 🧪 开发脚本

常用命令列表

---

## 📊 项目状态

当前完成度和质量指标

---

## 🔧 故障排查

常见问题 FAQ

---

## 📄 License

协议说明

---

## 🤝 贡献

贡献指南

---

## 📮 联系方式

联系信息
```

---

## 自动化检查

在生成 README 前，检查：

```bash
# 1. 检查是否是默认 README
grep -q "Welcome to your Expo app" README.md && echo "需要更新"

# 2. 检查项目是否有实际内容
[ -d "app" ] && [ $(ls app/*.tsx 2>/dev/null | wc -l) -gt 1 ] && echo "有内容"

# 3. 检查是否有其他文档
ls *.md 2>/dev/null | wc -l

# 4. 分析 package.json
cat package.json | jq '.dependencies | keys | length'
```

---

## 生成命令示例

```bash
# 自动生成 README（检查并提示）
/skill project-init

# 或在项目根目录
npm run generate-readme
```

---

## 最佳实践

### 内容原则
1. **简洁明了** - 一眼看懂项目是什么
2. **完整全面** - 包含所有必要信息
3. **易于导航** - 清晰的文档索引
4. **持续更新** - 功能变化时更新 README

### 格式规范
1. 使用 emoji 增加可读性（但不过度）
2. 代码块标注语言
3. 链接使用相对路径
4. 徽章使用 shields.io

### 文档组织
1. README.md - 项目概览和快速开始
2. CONTRIBUTING.md - 贡献指南
3. CHANGELOG.md - 变更日志
4. 功能文档放在 docs/ 目录

---

## 检测时机

**主动检测：**
- 用户表达"项目完成"或"准备发布"
- 运行 `npm run reset-project`
- 第一次运行 `eas build`

**被动提醒：**
- README 超过7天未更新
- 新增了重要功能但 README 未更新
- 准备提交 PR 时

---

## 示例触发对话

```
User: "项目功能都完成了"
Assistant: 我注意到 README.md 还是默认模板。
要不要我帮你生成一个完整的项目文档？

包括：
- 功能特性列表
- 技术栈说明
- 快速开始指南
- 文档索引

/skill project-init
```

---

## 配置选项

可以在 `.claude/project-init.config.json` 中配置：

```json
{
  "autoGenerate": true,
  "template": "detailed",
  "includeBadges": true,
  "includeDocIndex": true,
  "includeTechStack": true,
  "includeProjectStructure": true,
  "language": "zh-CN"
}
```

---

**使用此 skill 确保每个项目都有完善的文档！**
