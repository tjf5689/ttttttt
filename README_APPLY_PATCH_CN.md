# 打卡系统重构补丁包（方案 B：重设计存储；iOS/Android 通用）
本补丁 **不依赖签名**，直接替换/新增源码即可本地/CI 构建 **Android Debug APK**，并支持 **iOS**（需在 macOS 上用 Xcode 运行或构建）。

> 说明：
> - 本补丁是“覆盖式”改造：新增 `src/` 代码、替换 `App.tsx`、更新 `package.json` 依赖（需要 `npm i`/`yarn`）；
> - 存储结构 **重设计**（清空旧数据）；
> - UI/交互完全按你的清单：微信风格、右上角 +、今日/日模板/统计/个人四页、左右滑动切换、动画打卡/补做、统计记录、头像与用户名置顶等；
> - Android 可直接构建 debug APK；iOS 需在 macOS 上用 Xcode 运行。

---

## 一、如何应用补丁
1. **备份**你的仓库（可建新分支 `refactor/checkin-v2`）。
2. 在项目根目录，把本补丁包解压：
   - `src/` 覆盖到你的项目（若你已有 `src`，请合并，保留本补丁里的文件）。
   - 用本补丁的 `App.tsx` 覆盖你的 `App.tsx`（如你项目入口不是 `App.tsx`，请把 `src/app/RootNavigator.tsx` 在你的入口引用）。
   - 合并本补丁 `package.json` 里的 **dependencies/devDependencies/scripts**（见下文合并说明）。
3. 安装依赖：`npm i` 或 `yarn`。
4. iOS 额外步骤（如需运行 iOS）：
   ```bash
   cd ios && pod install && cd ..
   ```
5. 运行：
   - Android：`npm run android`（或 `yarn android`）
   - iOS（macOS）：`npm run ios`（或 Xcode 打开 `ios/*.xcworkspace` 运行）

> 若你项目已有导航/状态管理，可逐步迁移到本补丁提供的 `src/` 结构。

---

## 二、package.json 合并说明
把以下字段合并到你项目的 `package.json`：

```jsonc
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "lint": "eslint ."
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "^1.23.1",
    "@react-navigation/bottom-tabs": "^6.5.20",
    "@react-navigation/native": "^6.1.18",
    "@react-navigation/native-stack": "^6.9.26",
    "react-native-gesture-handler": "^2.21.2",
    "react-native-mmkv": "^3.0.3",
    "react-native-reanimated": "^3.16.1",
    "react-native-safe-area-context": "^4.10.5",
    "react-native-screens": "^3.32.0",
    "zustand": "^4.5.5",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-native": "^0.73.0"
  }
}
```

> 注意：`react-native-reanimated` 需要在 `babel.config.js` 中添加插件：
```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```
> 同时在入口最顶端 **import 'react-native-gesture-handler';** 并确保 Android 的 `MainActivity`/`MainApplication` 没有禁用 gesture。

---

## 三、主要功能点（本补丁已实现）
- 右上角「+」：添加**单项任务**与**按天任务模板**（可设置未来 N 天生成；可设置每周必须完成的星期几）。
- 今日任务页：仅显示任务名；「打卡/补做」按钮点击有 **与按钮大小一致**的缩放动画，随后弹出**成功窗口**；今日列表不显示时间。
- 左右滑动切换四大页面（今日 / 日模板 / 统计 / 个人），切换为**缓慢淡入淡出**。
- 日模板页：大小与文字布局重新设计，支持一键生成**未来一周/一月**的每日任务。
- 个人主页：顶端显示**头像 + 用户名**；新增**全部打卡记录**（每条含任务名、打卡时间、今天第几次/本周第几次）；下方为**任务统计**、**设置**、**个人四项**（习惯目标、提醒偏好、备份同步、导入导出）。
- 统计页：点击具体任务可查看该任务**全部打卡统计记录**。
- 账户支持**名称**；所有页面**微信风格配色**；**每次打卡后自动更新保存**（新版存储结构）。
- **存储重设计**：旧数据不再沿用；数据保存在 `MMKV`（Android/iOS 都支持）。

---

## 四、文件结构（新增/覆盖）
```
src/
  app/
    RootNavigator.tsx            // 底部四页 + 手势左右滑动 + 淡入淡出
    theme.ts                     // 颜色 & 尺寸
  store/
    useStore.ts                  // Zustand + MMKV，新的数据结构 & 持久化
    types.ts
    migration.ts                 // 兼容入口（B 方案默认清空）
  screens/
    TodayScreen.tsx
    TemplatesScreen.tsx
    StatsScreen.tsx
    ProfileScreen.tsx
    TaskDetailScreen.tsx
  components/
    AddSheet.tsx
    TaskRow.tsx
    EmptyState.tsx
  utils/
    date.ts
    counters.ts
App.tsx                          // 入口，引用 RootNavigator
```

---

## 五、Android 打包（Debug，无签名）
```bash
npm run android
# 或
cd android && ./gradlew assembleDebug
# 产物一般在 android/app/build/outputs/apk/debug/app-debug.apk
```

## 六、iOS 运行（Debug）
在 macOS：
```bash
cd ios && pod install && cd ..
npm run ios
```
或用 Xcode 打开 `ios/*.xcworkspace` 直接运行到设备/模拟器。

---

如需我帮你把补丁**直接合并到你仓库并输出 APK**，把仓库 ZIP 或私有仓库临时访问权给我即可。
