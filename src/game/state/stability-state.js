export function createInitialStabilityStateData() {
  return {
    targetFps: 30,
    minStableFps: 27,
    longFrameMs: 66,
    maxAcceptableFrameMs: 500,
    requiredSamples: 30,
    frameSamples: 0,
    elapsedMs: 0,
    averageFps: 0,
    worstFrameMs: 0,
    longFrames: 0,
    lastFrameAt: 0,
    lastRenderAt: 0,
    lastActionAt: 0,
    actionsLogged: 0,
    renderCount: 0,
    errorCount: 0,
    softlockWarnings: [],
    qaNote: "目标帧稳定哨兵采样中",
  };
}
