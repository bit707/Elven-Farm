export function renderAssetPanelUi({
  refs,
  state,
  data,
  captureScenes,
  steamReadyAssets,
  assetSrc,
  storeAssetEvidenceSpec,
  storeAssetEvidenceMarkup,
}) {
  const scene = captureScenes[state.currentCaptureScene] || captureScenes.start;
  const screenshotScenes = Object.entries(captureScenes);
  const storeAssetEvidence = storeAssetEvidenceSpec();
  const p0Screenshots = data.steamAssets.filter((asset) => asset.asset_type === "screenshot" && asset.priority === "P0").length;
  const assetCounts = steamReadyAssets.reduce((counts, asset) => {
    counts[asset.type] = (counts[asset.type] || 0) + 1;
    return counts;
  }, {});
  const steamReadyCard = (asset) => `
    <figure class="steam-ready-card ${asset.type}">
      <img src="${assetSrc(asset.path)}" alt="${asset.label}" loading="lazy" />
      <figcaption>
        <strong>${asset.label}</strong>
        <span>${asset.size} · PNG ready · SVG source</span>
      </figcaption>
    </figure>
  `;
  const storeCapsules = steamReadyAssets.filter((asset) => asset.type === "store_capsule").map(steamReadyCard).join("");
  const libraryAssets = steamReadyAssets.filter((asset) => asset.type === "library_asset").map(steamReadyCard).join("");
  const screenshotGrid = screenshotScenes.map(([, capture]) => `
    <figure class="store-screenshot-card">
      <img src="${assetSrc(capture.asset)}" alt="${capture.label}" />
      <figcaption><strong>${capture.label}</strong><span>${capture.log.replace("Steam 截图预置：", "")}</span></figcaption>
    </figure>
  `).join("");
  const steamScreenshotGrid = steamReadyAssets.filter((asset) => asset.type === "screenshot").map(steamReadyCard).join("");
  refs.assetPanel.innerHTML = `
    <div class="asset-preview">
      ${storeAssetEvidenceMarkup(storeAssetEvidence)}
      <img src="${assetSrc(scene.asset)}" alt="${scene.label}" />
      <div class="release-item pass"><strong>${scene.label}</strong>${scene.log}</div>
      <div class="release-item pass"><strong>Steam-ready 素材包 ${steamReadyAssets.length}/15</strong>商店胶囊 ${assetCounts.store_capsule || 0}、库资产 ${assetCounts.library_asset || 0}、1920x1080 截图 ${(assetCounts.screenshot || 0)}；当前 PNG 与 SVG 源文件均由项目自有程序化素材生成。</div>
      <section class="steam-ready-showcase">
        <div class="steam-ready-heading">
          <strong>商店胶囊图</strong>
          <span>覆盖 Header / Small / Main / Vertical，可用于商店页布局评审。</span>
        </div>
        <div class="steam-ready-grid capsule-grid">${storeCapsules}</div>
        <div class="steam-ready-heading">
          <strong>Steam 库资产</strong>
          <span>覆盖库 Capsule、Header、Hero，方便桌面客户端视觉预审。</span>
        </div>
        <div class="steam-ready-grid library-grid">${libraryAssets}</div>
        <div class="steam-ready-heading">
          <strong>商店截图 PNG</strong>
          <span>与截图脚本场景一一对应；上架前仍需由最终可执行文件替换为真实实机截图。</span>
        </div>
        <div class="steam-ready-grid screenshot-grid">${steamScreenshotGrid}</div>
      </section>
      <div class="release-item pass"><strong>Steam 商店截图集 ${screenshotScenes.length}/8</strong>P0 素材计划截图 ${p0Screenshots} 张，当前均由项目自有程序化 SVG 生成，可用于商店素材评审与后续实机替换。</div>
      <div class="store-screenshot-grid">${screenshotGrid}</div>
      <div class="icon-strip">
        <img src="${assetSrc("assets/spirit-luobo.svg")}" alt="萝卜精头像" />
        <img src="${assetSrc("assets/crop-bailuobo.svg")}" alt="灵气白萝卜图标" />
        <img src="${assetSrc("assets/crop-baicai.svg")}" alt="青芽白菜图标" />
        <img src="${assetSrc("assets/customer-villager.svg")}" alt="村民顾客头像" />
      </div>
      <img src="${assetSrc("assets/control-hints.svg")}" alt="手柄和键鼠提示图" />
    </div>
  `;
}
