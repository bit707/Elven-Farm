# Steam Ready Asset Pack

状态：`procedural_placeholder_ready`

这批素材由 `tools/generate-assets.mjs` 生成，目标是让发行/QA 先拥有尺寸正确、项目自有、可替换的 Steam 图形资产包。当前为程序化占位素材，不替代最终实机截图、正式 key art 或 PV。

## 包含

- Store Header Capsule 920x430
- Store Small Capsule 462x174
- Store Main Capsule 1232x706
- Store Vertical Capsule 748x896
- Library Capsule 600x900
- Library Header 920x430
- Library Hero 3840x1240
- 8 张 1920x1080 Steam 截图占位图

## 目录

- `source-svg/`：可编辑 SVG 源文件。
- `png/`：由本地 `sharp` 或 bundled Python/Pillow 渲染的 PNG；如运行环境缺少渲染器，manifest 会标记为 `svg_ready_renderer_unavailable`。

## 上架前边界

- 最终 Steam 页面仍应使用最终可执行文件捕获的真实截图和 PV。
- 当前 PNG 主要用于商店页布局、尺寸检查、发行清单预审和 Demo 宣发占位。
- 若美术替换，请保持 manifest 中的尺寸和文件命名规则，便于 QA 自动校验。
