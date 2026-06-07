# 《仙农洞天：精怪工坊》Desktop Shell Staging

当前状态：`desktop_shell_staging`

这个目录提供一个 Electron 兼容桌面壳骨架，用于把 `standalone-offline/index.html` 接进 Windows 桌面客户端，并通过 preload 注入 `globalThis.XiannongSteamworks`。

## 当前具备

- `main.mjs`：创建桌面窗口，优先加载 `standalone-offline/index.html`。
- `preload.cjs`：注入 `XiannongSteamworks` stub，覆盖成就、Remote Storage、Overlay、Stats 四个接口形态。
- IPC 本地证据：stub 调用会写入 Electron `userData/steamworks-stub-evidence/`，包括 `steamworks-stub-events.jsonl`、`latest-steamworks-stub-event.json` 和 `remote-storage/` 下的云存档 payload。
- `package.template.json`：Electron/electron-builder 打包模板。

## 重要边界

- 当前 bridge 的 `sdkReady` 为 `false`，不会让游戏误判 Release Gate `rrg_012` 已通过。
- 当前 bridge 的 `bridgeReady` 为 `true`，可用于桌面壳本地文件级证据记录。
- 正式上架前必须把 stub 替换为真实 Steamworks SDK/Greenworks/原生扩展，并填入真实 AppID。
- 正式包仍需代码签名、安装器、SteamCMD preview、崩溃日志、路径权限和 2 小时人工 QA。
