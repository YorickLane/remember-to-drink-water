# DEV-CHECKLIST.md — 开发执行清单（你照着做）

## A. 项目初始化（手动）

- [ ] `npx create-expo-app@latest water-reminder`
- [ ] `npm run start`
- [ ] iOS/Android 模拟器跑通
- [ ] Git 初始化

## B. 基础框架

- [ ] expo-router / tab 导航
- [ ] 全局主题（light/dark）
- [ ] 空状态、错误态组件

## C. 数据层

- [ ] sqlite 初始化与迁移
- [ ] water_logs CRUD
- [ ] settings 读写
- [ ] store（Zustand）

## D. 页面开发

- [ ] Home：今日进度 + 快捷记录
- [ ] Add：输入/选择容量
- [ ] Stats：7日/30日图表
- [ ] History：日历 + 某日详情
- [ ] Settings：目标/提醒/单位/关于/隐私

## E. 通知

- [ ] 权限请求
- [ ] schedule 生成
- [ ] 设置变更重建通知
- [ ] 通知点击跳转 Home

## F. 测试与优化

- [ ] 真机测试 iOS
- [ ] 真机测试 Android
- [ ] 离线数据稳定性
- [ ] 崩溃/异常日志检查

## G. 打包上架（手动）

- [ ] `eas build:configure`
- [ ] `eas build --profile production`
- [ ] 图标 / 启动页 / 截图
- [ ] `eas submit`
