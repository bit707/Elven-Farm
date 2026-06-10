export function renderAcceptancePanelUi({
  refs,
  data,
  checklistSummary,
  evaluateVerticalAcceptance,
  evaluateQaCheck,
  evaluateReleaseGate,
  stabilityQaStatus,
  stabilityQaEvidenceMarkup,
}) {
  const groups = [
    {
      title: "垂直切片",
      rows: data.verticalSlice.filter((entry) => entry.priority === "P0"),
      evaluator: evaluateVerticalAcceptance,
      idKey: "accept_id",
      nameKey: "module",
      detailKey: "acceptance_criteria",
    },
    {
      title: "Demo QA",
      rows: data.demoQa.filter((entry) => entry.priority === "P0"),
      evaluator: evaluateQaCheck,
      idKey: "qa_id",
      nameKey: "check_item",
      detailKey: "acceptance_criteria",
    },
    {
      title: "Release Gate",
      rows: data.releaseGates.filter((entry) => entry.priority === "P0"),
      evaluator: evaluateReleaseGate,
      idKey: "gate_id",
      nameKey: "requirement",
      detailKey: "pass_condition",
    },
  ];

  refs.acceptancePanel.innerHTML = "";
  for (const group of groups) {
    const summary = checklistSummary(group.rows, group.evaluator);
    const header = document.createElement("div");
    header.className = `acceptance-summary ${summary.passed === summary.total ? "pass" : "warn"}`;
    header.innerHTML = `<strong>${group.title} ${summary.label}</strong><span>当前构建实时判定</span>`;
    refs.acceptancePanel.append(header);

    for (const row of group.rows) {
      const pass = group.evaluator(row);
      const stabilityEvidence = row.accept_id === "vsa_009" ? stabilityQaStatus() : null;
      const node = document.createElement("div");
      node.className = `acceptance-card ${pass ? "pass" : "warn"}`;
      node.innerHTML = `
        <strong>${row[group.nameKey]}</strong>
        <span>${row[group.detailKey]}</span>
        <small>${row[group.idKey]} · ${pass ? "通过" : "待补"} · 证据：${row.evidence || row.evidence_source || row.related_doc}</small>
        ${stabilityEvidence ? stabilityQaEvidenceMarkup(stabilityEvidence, { compact: true }) : ""}
      `;
      refs.acceptancePanel.append(node);
    }
  }
}

export function renderSaveSchemaPanelUi({
  refs,
  state,
  data,
  saveSchemaVersion,
  serializeState,
  saveSchemaCoverage,
  saveFieldValue,
}) {
  const payload = serializeState();
  const report = state.saveSchemaReport || saveSchemaCoverage(payload);
  const p0Fields = data.saveSchemaRegistry.filter((field) => field.qa_priority === "P0");
  const requiredFields = data.saveSchemaRegistry.filter((field) => field.persist_required === "true");
  refs.saveSchemaPanel.innerHTML = "";
  const summary = document.createElement("div");
  summary.className = `save-schema-summary ${report.missing.length ? "warn" : "pass"}`;
  summary.innerHTML = `
    <strong>存档 Schema v${saveSchemaVersion} · 必存字段 ${report.covered}/${report.required}</strong>
    <span>P0 字段 ${p0Fields.length} 个 · 迁移计划 ${data.saveMigrationPlan.length} 条 · Cloud schema ${saveSchemaVersion}</span>
    <small>${report.missing.length ? `缺失：${report.missing.join(" / ")}` : "当前序列化 payload 覆盖全部必存字段。"}</small>
  `;
  refs.saveSchemaPanel.append(summary);

  const migrationNode = document.createElement("div");
  migrationNode.className = "save-schema-card";
  const history = state.saveMigrationHistory || [];
  migrationNode.innerHTML = `
    <strong>迁移历史 ${history.length} 条${state.saveMigratedFrom !== null ? ` · 来源 v${state.saveMigratedFrom}` : ""}</strong>
    <span>${history.slice(-3).map((entry) => `${entry.id}: v${entry.from}->v${entry.to}`).join(" · ") || "当前存档已是最新 schema，暂无迁移历史。"}</span>
  `;
  refs.saveSchemaPanel.append(migrationNode);

  for (const field of requiredFields.slice(0, 8)) {
    const value = saveFieldValue(field, payload);
    const covered = value !== undefined;
    const node = document.createElement("div");
    node.className = `save-schema-card ${covered ? "pass" : "warn"}`;
    node.innerHTML = `
      <strong>${field.field_id} · ${field.qa_priority}</strong>
      <span>${field.module_path}.${field.field_name} · ${field.data_type} · v${field.added_version}</span>
      <small>${covered ? "已映射到当前原型状态" : `默认值 ${field.default_value}`} · 迁移 ${field.migration_required}</small>
    `;
    refs.saveSchemaPanel.append(node);
  }

  for (const migration of data.saveMigrationPlan.slice(0, 4)) {
    const node = document.createElement("div");
    node.className = "save-migration-card";
    node.innerHTML = `
      <strong>${migration.migration_id} · v${migration.from_version}->v${migration.to_version}</strong>
      <span>${migration.affected_module} · ${migration.operation}</span>
      <small>校验：${migration.validation_check} · 回滚：${migration.rollback_policy}</small>
    `;
    refs.saveSchemaPanel.append(node);
  }
}

export function renderLocalizationPanelUi({
  refs,
  data,
  localizationSummary,
  localizationCoverageFor,
}) {
  refs.localizationPanel.innerHTML = "";
  const summaryP0 = localizationSummary("P0");
  const summary = document.createElement("div");
  summary.className = `localization-summary ${summaryP0.passed === summaryP0.total ? "pass" : "warn"}`;
  summary.innerHTML = `
    <strong>P0 本地化 ${summaryP0.passed}/${summaryP0.total} · 平均 ${summaryP0.avg}%</strong>
    <span>扫描 localization_text.csv 与已接入配置表，按 localization_coverage_plan.csv 的 key_pattern、目标覆盖率和 QA 方法评估。</span>
  `;
  refs.localizationPanel.append(summary);

  for (const plan of data.localizationCoverage) {
    const result = localizationCoverageFor(plan);
    const node = document.createElement("div");
    node.className = `localization-card ${result.pass ? "pass" : "warn"}`;
    node.innerHTML = `
      <strong>${plan.coverage_id} · ${plan.language} · ${result.coverage}% / ${result.target}%</strong>
      <span>${plan.content_area} · ${plan.source_table} · ${plan.key_pattern}</span>
      <small>${result.plannedOnly ? "发行计划项：当前原型无可扫描 key，以素材/文案计划存在作为预检查。" : `Key ${result.present.length}/${result.keys.length}`} · QA ${plan.qa_method} · Owner ${plan.owner}</small>
      ${result.missing.length ? `<small>缺失示例：${result.missing.join(" / ")}</small>` : ""}
    `;
    refs.localizationPanel.append(node);
  }
}

export function renderCommunityPanelUi({
  refs,
  data,
  communityCalendarSummary,
  communityAssetReady,
}) {
  refs.communityPanel.innerHTML = "";
  const summaryData = communityCalendarSummary();
  const summary = document.createElement("div");
  summary.className = `community-summary ${summaryData.ready >= Math.ceil(summaryData.total * 0.75) ? "pass" : "warn"}`;
  summary.innerHTML = `
    <strong>社区宣发 ${summaryData.ready}/${summaryData.total} · Steam ${summaryData.steamBeats} · Demo CTA ${summaryData.demoBeats}</strong>
    <span>读取 community_content_calendar.csv，并对照 Steam 素材计划与当前实机系统，判断每条内容是否已有可制作素材。</span>
  `;
  refs.communityPanel.append(summary);

  const entries = data.communityContentCalendar
    .slice()
    .sort((a, b) => Number(a.week_offset || 0) - Number(b.week_offset || 0));
  for (const entry of entries) {
    const readiness = communityAssetReady(entry);
    const node = document.createElement("div");
    node.className = `community-card ${readiness.ready ? "pass" : "warn"}`;
    node.innerHTML = `
      <strong>${entry.week_offset} 周 · ${entry.phase} · ${entry.content_theme}</strong>
      <span>${entry.format} · ${entry.target_channel.replaceAll("|", " / ")} · CTA ${entry.cta}</span>
      <small>素材：${entry.primary_asset} · ${readiness.reason}</small>
      <small>来源：${entry.source_doc} · Owner ${entry.owner}</small>
    `;
    refs.communityPanel.append(node);
  }
}

export function renderConditionPanelUi({
  refs,
  conditionQaSummary,
  conditionGroupFor,
}) {
  refs.conditionPanel.innerHTML = "";
  const summaryData = conditionQaSummary();
  const summary = document.createElement("div");
  summary.className = `condition-summary ${summaryData.supported === summaryData.total ? "pass" : "warn"}`;
  summary.innerHTML = `
    <strong>条件组 ${summaryData.passed}/${summaryData.total} 当前满足</strong>
    <span>${summaryData.supported}/${summaryData.total} 条表达式可解析；不可解析项保留旧逻辑兜底并进入 QA 待修表。</span>
  `;
  refs.conditionPanel.append(summary);

  const visible = summaryData.statuses
    .slice()
    .sort((a, b) => Number(conditionGroupFor(b.id)?.priority || 0) - Number(conditionGroupFor(a.id)?.priority || 0))
    .slice(0, 12);

  for (const status of visible) {
    const group = conditionGroupFor(status.id) || {};
    const node = document.createElement("div");
    node.className = `condition-card ${!status.supported ? "warn" : status.pass ? "pass" : "locked"}`;
    node.innerHTML = `
      <strong>${status.id} · ${status.supported ? status.pass ? "已满足" : "未满足" : "需修表"}</strong>
      <span>${status.expression}</span>
      <small>${group.usage_hint || "runtime"} · P${group.priority || 0} · ${status.reason}</small>
    `;
    refs.conditionPanel.append(node);
  }
}
