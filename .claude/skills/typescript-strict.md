# TypeScript Strict - 避免 any 类型

## 目的
检测并消除代码中的 `any` 类型使用，提高类型安全性，减少运行时错误。

## 为什么避免 any？

### any 的问题：
1. **失去类型检查**：TypeScript 变成 "AnyScript"
2. **隐藏错误**：编译时不会发现问题，运行时才暴露
3. **降低可维护性**：后续开发者不知道期望的类型
4. **失去智能提示**：IDE 无法提供代码补全
5. **违背 TypeScript 初衷**：类型安全

### 正确的做法：
- ✅ 定义具体的接口和类型
- ✅ 使用泛型约束
- ✅ 使用 unknown 替代 any（更安全）
- ✅ 扩展第三方库的类型定义

---

## 检查步骤

### 第一步：扫描 any 使用

```bash
# 查找所有 any 使用
grep -rn " any\|: any\|<any>" app/ components/ lib/ store/ types/ --include="*.ts" --include="*.tsx"

# 统计数量
grep -r " any\|: any\|<any>" app/ components/ lib/ store/ types/ --include="*.ts" --include="*.tsx" | wc -l
```

### 第二步：分类 any 使用

**合理的 any（极少数情况）：**
- JSON.parse() 的返回值（但应立即转换）
- 与动态 JavaScript 库交互
- 临时占位符（应添加 TODO）

**不合理的 any（应立即修复）：**
- 函数参数
- 组件 props
- 状态定义
- API 响应

### 第三步：替代方案

#### 1. 使用具体接口
```typescript
// ❌ 不好
function process(data: any) { }

// ✅ 好
interface Data {
  id: string;
  name: string;
}
function process(data: Data) { }
```

#### 2. 使用泛型
```typescript
// ❌ 不好
function updateSetting(key: string, value: any) { }

// ✅ 好
function updateSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K]
) { }
```

#### 3. 使用 unknown（更安全的 any）
```typescript
// ❌ 不好
function parse(json: string): any {
  return JSON.parse(json);
}

// ✅ 好
function parse(json: string): unknown {
  const result = JSON.parse(json);
  // 需要类型守卫才能使用
  return result;
}
```

#### 4. 扩展第三方类型
```typescript
// ❌ 不好
const trigger = { hour: 9, minute: 0 } as any;

// ✅ 好
type CalendarTriggerInput = {
  type: Notifications.SchedulableTriggerInputTypes.CALENDAR;
  hour: number;
  minute: number;
  repeats: boolean;
};

const trigger: CalendarTriggerInput = {
  type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
  hour: 9,
  minute: 0,
  repeats: true,
};
```

#### 5. 使用联合类型
```typescript
// ❌ 不好
function handle(event: any) { }

// ✅ 好
type Event = 'click' | 'focus' | 'blur';
function handle(event: Event) { }
```

---

## 常见场景的类型定义

### React Native 组件 Props

```typescript
// ❌ 不好
function MyButton(props: any) { }

// ✅ 好
interface MyButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

function MyButton({ title, onPress, disabled, style }: MyButtonProps) { }
```

### 事件处理器

```typescript
// ❌ 不好
const handleChange = (event: any) => { };

// ✅ 好
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';

const handleChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
  const value = event.nativeEvent.text;
};

// 或者更简单
const handleChange = (text: string) => { };
```

### API 响应

```typescript
// ❌ 不好
async function fetchData(): Promise<any> {
  const response = await fetch(url);
  return response.json();
}

// ✅ 好
interface ApiResponse {
  data: {
    id: string;
    name: string;
  }[];
  total: number;
}

async function fetchData(): Promise<ApiResponse> {
  const response = await fetch(url);
  return response.json();
}
```

### Zustand Store

```typescript
// ❌ 不好
const useStore = create((set: any) => ({ }));

// ✅ 好
interface StoreState {
  count: number;
  increment: () => void;
}

const useStore = create<StoreState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

---

## 执行流程

### 自动检查

运行以下命令：
```bash
# 1. 查找所有 any
echo "=== 扫描 any 使用 ==="
grep -rn " any\|: any\|<any>" app/ components/ lib/ store/ types/ --include="*.ts" --include="*.tsx"

# 2. TypeScript 严格模式检查
echo "=== TypeScript 编译 ==="
npx tsc --noEmit

# 3. ESLint any 检查
echo "=== ESLint 检查 ==="
npx eslint . --ext .ts,.tsx --rule '@typescript-eslint/no-explicit-any: error'
```

### 手动审查

对于每个发现的 any：
1. **理解上下文**：这个值的真实类型是什么？
2. **定义类型**：创建接口或使用现有类型
3. **替换 any**：使用具体类型
4. **验证**：运行 TypeScript 编译确认

---

## 输出报告格式

```
🎯 TypeScript 类型检查报告

扫描范围：
- app/
- components/
- lib/
- store/
- types/

发现的 any 使用：

❌ components/Button.tsx:23
  function handlePress(event: any) { }

  建议修复：
  import { GestureResponderEvent } from 'react-native';
  function handlePress(event: GestureResponderEvent) { }

❌ lib/api.ts:45
  async function fetchData(): Promise<any> { }

  建议修复：
  interface ApiResponse { ... }
  async function fetchData(): Promise<ApiResponse> { }

总计：发现 5 处 any 使用
状态：⚠️ 需要修复

修复后：
✅ 0 处 any 使用
✅ TypeScript 严格模式通过
✅ 类型安全得到保障
```

---

## 最佳实践

### 1. 启用 TypeScript 严格模式

在 `tsconfig.json` 中：
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### 2. 配置 ESLint 规则

在 `eslint.config.js` 中添加：
```javascript
{
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
  }
}
```

### 3. 代码审查检查清单

每次 PR/Commit 前检查：
- [ ] 无新增 any 使用
- [ ] 所有类型都有明确定义
- [ ] 泛型使用正确
- [ ] 第三方库类型完整

---

## 快速参考

### 常用类型导入

```typescript
// React Native
import type {
  ViewStyle,
  TextStyle,
  ImageStyle,
  GestureResponderEvent,
  NativeSyntheticEvent,
} from 'react-native';

// React
import type {
  FC,
  PropsWithChildren,
  ReactNode,
  CSSProperties,
} from 'react';

// Expo
import type { Asset } from 'expo-asset';
import type { ImageSource } from 'expo-image';
```

### 实用工具类型

```typescript
// 从现有类型中提取
type UserName = User['name'];

// 部分可选
type PartialUser = Partial<User>;

// 全部必需
type RequiredUser = Required<User>;

// 选择字段
type UserBasic = Pick<User, 'id' | 'name'>;

// 排除字段
type UserWithoutPassword = Omit<User, 'password'>;

// 记录类型
type ColorMap = Record<string, string>;
```

---

## 使用方法

### 在 Claude Code 中：
```
/skill typescript-strict
```

### 命令行：
```bash
npm run type-check
```

（需要在 package.json 中添加脚本）

---

## 项目规范

### 强制规则：
1. ❌ 禁止在函数参数中使用 any
2. ❌ 禁止在组件 props 中使用 any
3. ❌ 禁止在状态定义中使用 any
4. ⚠️ 谨慎在类型断言中使用 any

### 例外情况（需要注释说明）：
- 与无类型的 JavaScript 库交互
- 动态 JSON 数据（应尽快转换为具体类型）
- 复杂的类型推导（应考虑简化）

---

**使用此 skill 可以确保代码库保持高质量的类型安全！**
