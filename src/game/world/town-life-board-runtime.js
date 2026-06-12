import {
  townLifeOpportunityActionMarkup as townLifeOpportunityActionMarkupHelper,
  townLifeOpportunityBoardMarkup as townLifeOpportunityBoardMarkupHelper,
  townLifeOpportunityRows as townLifeOpportunityRowsHelper,
  townLifeRelationshipWorldBoardPalette as townLifeRelationshipWorldBoardPaletteHelper,
  townLifeRelationshipWorldBoardSpec as townLifeRelationshipWorldBoardSpecHelper,
  townLifeRouteWorldBoardAtCanvasPoint as townLifeRouteWorldBoardAtCanvasPointHelper,
  townLifeRouteWorldBoardEntry as townLifeRouteWorldBoardEntryHelper,
  townLifeRouteWorldBoardSpec as townLifeRouteWorldBoardSpecHelper,
  townLifeWorldBoardShortText as townLifeWorldBoardShortTextHelper,
} from "./town-life-boards.js";

export function townLifeOpportunityActionMarkupRuntime(opportunity) {
  return townLifeOpportunityActionMarkupHelper(opportunity);
}

export function townLifeOpportunityRowsRuntime(rows = [], limit = 4, dependencies = {}) {
  return townLifeOpportunityRowsHelper(rows, limit, dependencies);
}

export function townLifeOpportunityBoardMarkupRuntime(rows = [], dependencies = {}) {
  return townLifeOpportunityBoardMarkupHelper(rows, dependencies);
}

export function townLifeWorldBoardShortTextRuntime(text = "", limit = 18) {
  return townLifeWorldBoardShortTextHelper(text, limit);
}

export function townLifeRouteWorldBoardEntryRuntime(row = null, index = 0, dependencies = {}) {
  return townLifeRouteWorldBoardEntryHelper(row, index, dependencies);
}

export function townLifeRouteWorldBoardSpecRuntime(rowsInput = null, canvasWidth = 960, canvasHeight = 640, dependencies = {}) {
  return townLifeRouteWorldBoardSpecHelper(rowsInput, canvasWidth, canvasHeight, dependencies);
}

export function townLifeRouteWorldBoardAtCanvasPointRuntime(px, py, dependencies = {}) {
  return townLifeRouteWorldBoardAtCanvasPointHelper(px, py, dependencies);
}

export function townLifeRelationshipWorldBoardPaletteRuntime(tone = "daily") {
  return townLifeRelationshipWorldBoardPaletteHelper(tone);
}

export function townLifeRelationshipWorldBoardSpecRuntime(rows = [], canvasWidth = 960, canvasHeight = 640, dependencies = {}) {
  return townLifeRelationshipWorldBoardSpecHelper(rows, canvasWidth, canvasHeight, dependencies);
}
