# Proactive Checks - 主动检查原则

## 目的
建立主动验证的开发习惯，避免依赖可能过时的知识库，确保使用最新、最准确的信息。

> 💡 **核心理念：** 不确定就查询，查询用 Context7
>
> 📚 **详细查询方法见：** [latest-docs.md](./latest-docs.md)

---

## ⚠️ 为什么需要主动检查？

### 问题
- AI 知识库有训练截止日期，可能过时
- API 会更新、废弃、变更
- 不同版本的 API 用法可能完全不同
- 时间敏感的信息需要实时确认

### 解决方案
- ✅ 主动查询最新文档（不要等出问题再查）
- ✅ 确认当前时间（避免搜索过时信息）
- ✅ 验证版本兼容性（检查 package.json）
- ✅ 查看 changelog 和 breaking changes

### 真实案例
1. **shouldShowAlert 废弃** - 如果不查最新文档，会使用废弃 API
2. **expo-sqlite API 变更** - 旧版 `openDatabase()` vs 新版 `openDatabaseAsync()`
3. **时间敏感搜索** - 2025 年搜索 "React Native 2024" 会得到旧信息

---

## 🎯 必须主动检查的场景

### 🔴 高优先级（强制）

#### 1. 开始新功能开发前
**检查：**
```bash
date                                    # 确认当前时间
cat package.json | grep "expo"         # 确认版本
```
**查询：** use context7 - 查询功能的最新 API

#### 2. 使用新的 API 或库时
**检查：**
```bash
npm list [package-name]                # 确认安装的版本
```
**查询：** use context7 - 确认该版本的正确用法

#### 3. 遇到警告或错误时
**不要猜测！** 立即查询：
```markdown
use context7: [错误信息] 最新解决方案
```

#### 4. 版本升级时
**检查：**
```bash
cat CHANGELOG.md                       # 查看变更
```
**查询：** use context7 - 确认 breaking changes 和迁移步骤

### 🟡 中优先级（建议）

#### 5. 实现核心功能前
**查询：** use context7- 最佳实践和推荐方案

#### 6. 提交重要代码前
**检查：**
```bash
npx tsc --noEmit                       # 类型检查
```

#### 7. 准备上架前
**查询：** use context7 - 商店提交要求

### 🟢 低优先级（可选）

- 重构代码时
- 性能优化时
- 学习新特性时

---

## 🔄 标准检查流程

### 三步检查法

```markdown
1️⃣ 确认时间
   → date

2️⃣ 确认版本
   → cat package.json

3️⃣ 查询文档
   → use context7
```

### 示例：添加新功能

```markdown
用户：我要实现通知功能

正确的响应：
1. [主动] date                    # 2025-11-23
2. [主动] cat package.json        # expo-notifications: 0.32.13
3. [主动] use context7: expo-notifications SDK 54 最新用法
4. 基于最新文档开始实现
5. 遇到问题再次查询
```

---

## 📋 检查清单模板

### 开始新功能前
```markdown
□ 确认当前日期：date
□ 确认项目版本：cat package.json
□ 查询最新文档：use context7 [功能名]
□ 确认 API 没有废弃
□ 查看最新最佳实践
```

### 遇到问题时
```markdown
□ 确认错误信息完整
□ 查询最新文档：use context7 [错误关键词]
□ 搜索最新解决方案
□ 验证方案适用当前版本
```

### 提交代码前
```markdown
□ TypeScript 编译通过
□ 无 console.log
□ 无废弃 API 警告
□ 已测试核心功能
```

---

## 🛠️ 工具使用优先级

### 1. Context7（最优先）✅
- **何时：** 所有涉及框架/库的 API 使用
- **优势：** 自动获取特定版本文档，消除幻觉
- **详见：** [latest-docs.md](./latest-docs.md)

### 2. date 命令（必须）⏰
- **何时：** 每次查询文档前
- **原因：** 避免搜索过时的年份

### 3. package.json（必须）📦
- **何时：** 使用新库、遇到问题时
- **原因：** 确认版本，针对性查询

### 4. WebFetch / WebSearch（辅助）🔍
- **何时：** Context7 没覆盖的内容
- **详见：** [latest-docs.md](./latest-docs.md)

---

## ✅ 自我检查问题

在编码前问自己：

1. **我确定这个 API 是最新的吗？**
   - 不确定 → use context7

2. **我知道当前日期吗？**
   - 不确定 → date

3. **这个方法会不会已经废弃？**
   - 不确定 → 查询文档

4. **有没有更好的新方法？**
   - 不确定 → 查询最佳实践

---

## 🎯 养成习惯

### 口诀
**"先查后写，用新不旧"**

### 开发节奏
```
需求 → 检查时间 → 查询文档 → 验证版本 → 开始编码
        ↑           ↑           ↑
      date    use context7   package.json
```

### 遇到问题
```
问题 → 不要猜测 → 立即查询 → 验证方案 → 应用修复
              ↑
        use context7
```

---

## 📚 相关 Skills

- **[latest-docs.md](./latest-docs.md)** - 详细的文档查询方法和工具使用
- **[pre-release-check.md](./pre-release-check.md)** - 上架前自动检查清单
- **[typescript-strict.md](./typescript-strict.md)** - TypeScript 类型安全检查

---

## 🎓 总结

### 三个核心习惯

1. **🕐 主动确认时间**
   ```bash
   date
   ```

2. **📚 主动查询文档**
   ```markdown
   use context7
   ```

3. **✅ 主动验证版本**
   ```bash
   cat package.json
   ```

### 记住

- ❌ 不要假设 API 用法
- ❌ 不要依赖可能过时的知识
- ✅ 永远查询最新文档
- ✅ 永远验证当前版本

---

**建立主动检查的习惯，写出永远最新、最正确的代码！** 🎯
