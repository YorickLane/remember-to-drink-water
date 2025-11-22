# README-START.md — 你该怎么开始（手动步骤总览）

## 0. 你要手动做的事（总览）

必须你自己本地完成：

1. **环境搭建**
   - Node / Git
   - Expo CLI（由 create-expo-app 自带）
   - Android Studio + Android SDK（跑安卓模拟器）
   - Xcode（跑 iOS 模拟器，mac 必须）

2. **初始化项目**

3. **安装依赖**

4. **本地跑起来**（iOS/Android/真机）

5. **配置 Expo/EAS**（打包 & 上架）

6. **商店账号与上架表单**
   - Apple Developer Program（付费）
   - Google Play Console（付费）
   - Play 健康类声明 + Data safety 表单

---

## 1. 环境搭建（Expo 路线）

### 1.1 安装 Node 与 Git

- Node 建议 LTS（当前一般是 20.x / 22.x LTS）
- Git 任意版本即可

验证：

```bash
node -v
npm -v
git --version
```

### 1.2 iOS 环境（macOS）

1. App Store 安装 Xcode
2. 打开一次 Xcode，安装命令行组件
3. （可选）安装 CocoaPods：

```bash
sudo gem install cocoapods
pod --version
```

RN 官方 iOS 环境要求见[这里](https://reactnative.dev/docs/environment-setup)。

### 1.3 Android 环境

1. 安装 Android Studio
2. SDK Manager 里装：
   - Android SDK Platform（建议最新稳定）
   - Android Emulator
   - Android SDK Build-Tools
3. 配环境变量（[官方步骤](https://reactnative.dev/docs/environment-setup)）

验证 emulator 可跑即可。

---

## 2. 项目初始化（你手动执行）

在你要放项目的目录：

```bash
npx create-expo-app@latest water-reminder
cd water-reminder
npm run start
```

`create-expo-app` 是 [Expo 官方初始化入口](https://docs.expo.dev/get-started/create-a-project/)。

### 跑模拟器

- **iOS：**

```bash
npm run ios
```

- **Android：**

```bash
npm run android
```

### 跑真机

- 手机安装 "Expo Go"
- 电脑终端 `npm run start` 后扫二维码

[Expo 官方开发流程说明](https://docs.expo.dev/workflow/development-mode/)。

---

## 3. 初始化 Git（推荐你手动做）

```bash
git init
git add .
git commit -m "init expo app"
```

---

## 4. EAS（打包、上架需要你手动配置）

```bash
npm install -g eas-cli
eas login
eas build:configure
```

然后：

- **开发包（dev build）：**

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

- **生产包（准备上架）：**

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

### 提交商店：

```bash
eas submit --platform ios
eas submit --platform android
```

[EAS Submit 官方说明](https://docs.expo.dev/submit/introduction/)。

---

## 5. 如果你坚持 RN CLI（非 Expo）

[RN 官方"无需 framework 的路线"入口](https://reactnative.dev/docs/environment-setup)：

你需要：

```bash
npx @react-native-community/cli init WaterReminder
cd WaterReminder
npm run ios
npm run android
```

但上架打包、原生配置会更重。你现在这个项目强烈建议 Expo 先走通。
