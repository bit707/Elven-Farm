import {
  townLifeMemoryKeepsakeAtCanvasPoint as townLifeMemoryKeepsakeAtCanvasPointHelper,
  townLifeMemoryKeepsakeCandidate as townLifeMemoryKeepsakeCandidateHelper,
  townLifeMemoryKeepsakePalette as townLifeMemoryKeepsakePaletteHelper,
  townLifeMemoryKeepsakeSpec as townLifeMemoryKeepsakeSpecHelper,
  townLifeMemoryNewPageAtCanvasPoint as townLifeMemoryNewPageAtCanvasPointHelper,
  townLifeMemoryNewPageEntry as townLifeMemoryNewPageEntryHelper,
  townLifeMemoryNewPageNodes as townLifeMemoryNewPageNodesHelper,
  townLifeMemoryNewPageSafetyText as townLifeMemoryNewPageSafetyTextHelper,
  townLifeMemoryNewPageSpec as townLifeMemoryNewPageSpecHelper,
  townLifeMemoryThresholdAction as townLifeMemoryThresholdActionHelper,
  townLifeMemoryThresholdCandidate as townLifeMemoryThresholdCandidateHelper,
  townLifeMemoryThresholdKeepsakeAtCanvasPoint as townLifeMemoryThresholdKeepsakeAtCanvasPointHelper,
  townLifeMemoryThresholdKeepsakeNodes as townLifeMemoryThresholdKeepsakeNodesHelper,
  townLifeMemoryThresholdKeepsakeSpec as townLifeMemoryThresholdKeepsakeSpecHelper,
  townLifeMemoryThresholdSafetyText as townLifeMemoryThresholdSafetyTextHelper,
} from "./town-life-memory-keepsakes.js";

export function townLifeMemoryKeepsakePaletteRuntime(tone = "seeded") {
  return townLifeMemoryKeepsakePaletteHelper(tone);
}

export function townLifeMemoryKeepsakeCandidateRuntime(rows = [], dependencies = {}) {
  return townLifeMemoryKeepsakeCandidateHelper(rows, dependencies);
}

export function townLifeMemoryKeepsakeSpecRuntime(rows = [], canvasWidth = 960, canvasHeight = 640, dependencies = {}) {
  return townLifeMemoryKeepsakeSpecHelper(rows, canvasWidth, canvasHeight, dependencies);
}

export function townLifeMemoryKeepsakeAtCanvasPointRuntime(px, py, dependencies = {}) {
  return townLifeMemoryKeepsakeAtCanvasPointHelper(px, py, dependencies);
}

export function townLifeMemoryNewPageSafetyTextRuntime() {
  return townLifeMemoryNewPageSafetyTextHelper();
}

export function townLifeMemoryNewPageEntryRuntime(dependencies = {}) {
  return townLifeMemoryNewPageEntryHelper(dependencies);
}

export function townLifeMemoryNewPageNodesRuntime(entry = null, dependencies = {}) {
  return townLifeMemoryNewPageNodesHelper(entry, dependencies);
}

export function townLifeMemoryNewPageSpecRuntime(rows = [], canvasWidth = 960, canvasHeight = 640, dependencies = {}) {
  return townLifeMemoryNewPageSpecHelper(rows, canvasWidth, canvasHeight, dependencies);
}

export function townLifeMemoryNewPageAtCanvasPointRuntime(px, py, dependencies = {}) {
  return townLifeMemoryNewPageAtCanvasPointHelper(px, py, dependencies);
}

export function townLifeMemoryThresholdSafetyTextRuntime() {
  return townLifeMemoryThresholdSafetyTextHelper();
}

export function townLifeMemoryThresholdActionRuntime(row = null, next = null, dependencies = {}) {
  return townLifeMemoryThresholdActionHelper(row, next, dependencies);
}

export function townLifeMemoryThresholdCandidateRuntime(rows = [], dependencies = {}) {
  return townLifeMemoryThresholdCandidateHelper(rows, dependencies);
}

export function townLifeMemoryThresholdKeepsakeNodesRuntime(candidate = null, dependencies = {}) {
  return townLifeMemoryThresholdKeepsakeNodesHelper(candidate, dependencies);
}

export function townLifeMemoryThresholdKeepsakeSpecRuntime(rows = [], canvasWidth = 960, canvasHeight = 640, dependencies = {}) {
  return townLifeMemoryThresholdKeepsakeSpecHelper(rows, canvasWidth, canvasHeight, dependencies);
}

export function townLifeMemoryThresholdKeepsakeAtCanvasPointRuntime(px, py, dependencies = {}) {
  return townLifeMemoryThresholdKeepsakeAtCanvasPointHelper(px, py, dependencies);
}
