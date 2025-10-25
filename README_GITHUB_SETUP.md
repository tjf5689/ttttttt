# uiojoi（GitHub-only 构建 APK）
## 用法（全部在 GitHub 上完成）
1. 创建空仓库 `uiojoi`（Public 或 Private 均可）。
2. 在仓库主页 → **Add file → Upload files**，将本压缩包**解压后的所有文件/文件夹**整体拖拽上传（包含 `android/`、`src/`、`.github/` 等）。
3. 提交到 `main`（或 `master`）。
4. 打开 **Actions** → 选择 **Build Android Debug APK (GitHub-only)** → 查看运行 → 在底部 **Artifacts** 下载 `android-debug-apk`（`app-debug.apk`）。

> 无需本地环境与签名。
