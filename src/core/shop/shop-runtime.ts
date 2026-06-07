namespace XiannongCore.Shop {
  export type ShopRow = Record<string, string | undefined>;

  export interface ShopRuntimeState {
    fame?: number;
    shopPriceMultiplier?: number;
  }

  export interface ShopRuntimeData {
    shopPriceRules: ShopRow[];
    customerProfiles: ShopRow[];
    shopFeedback: ShopRow[];
    priceRulesByArchetype?: Map<string, ShopRow>;
    customerProfilesBy?: Map<string, ShopRow>;
  }

  export interface ShopRuntime {
    customerPriceRule(customer: ShopRow | null | undefined): ShopRow | null;
    customerProfile(customer: ShopRow | null | undefined): ShopRow;
    shopReputationScore(): number;
    customerViewFor(customer: ShopRow | null | undefined, segment?: ShopRow | null): ShopRow;
    customerBudget(customer: ShopRow | null | undefined, segment?: ShopRow | null): number;
    pricedGood(choice: ShopGoodChoice | null | undefined, customer: ShopRow | null | undefined, options?: PricedGoodOptions): PricedGoodResult;
    customerPurchaseDecision(input: CustomerPurchaseDecisionInput): CustomerPurchaseDecision;
    salePricePlan(input: SalePricePlanInput): SalePricePlan;
    themeMatchScore(goods?: ShopGoodChoice[] | null, theme?: ShopRow | null): number;
    expandShopSemanticTags(tags?: string[] | null): string[];
    shopTagsOverlap(leftTags?: string[] | null, rightTags?: string[] | null): boolean;
    isExpressiveShopTag(tag?: string | null): boolean;
    shopTagPriority(tag?: string | null): number;
    prioritizeShopTag(tags?: string[] | null, counts?: ShopTagCounts | null, fallback?: string): string;
    shopHotTag(goods?: ShopTaggedGoodChoice[] | null, theme?: ShopRow | null, fallback?: string): string;
    shopFeedbackEntryMatchesTag(entry?: ShopRow | null, tag?: string | null): boolean;
    shopFeedbackForSegment(type: string, customerSegment?: string | null, tag?: string | null): ShopRow | null;
    shopWordOfMouthVisitBias(customer?: ShopRow | null, segment?: ShopRow | null, spec?: ShopWordOfMouthSpec | null): number;
    shopWordOfMouthBudgetBonus(customer?: ShopRow | null, choiceTags?: string[] | null, spec?: ShopWordOfMouthSpec | null): number;
    shopCompendiumCustomerSupport(input?: ShopCompendiumCustomerSupportInput | null): ShopCompendiumCustomerSupportPlan;
    shopWeatherShelfChoiceSupport(input?: ShopWeatherShelfChoiceSupportInput | null): ShopWeatherShelfChoiceSupportPlan;
    shopWeatherShelfChoiceWeight(input?: ShopWeatherShelfChoiceWeightInput | null): ShopWeatherShelfChoiceWeightPlan;
    matchCustomerGood(input?: ShopCustomerGoodMatchInput | null): ShopCustomerGoodMatchPlan;
    shopSalesStatsDelta(input?: ShopSalesStatsDeltaInput | null): ShopSalesStatsDelta;
  }

  export interface ShopGoodChoice {
    item?: ShopRow;
    itemId?: string;
  }

  export interface ShopTaggedGoodChoice extends ShopGoodChoice {
    count?: number | string;
    tags?: string[] | null;
  }

  export type ShopTagCounts = Map<string, number> | Record<string, number | undefined>;

  export interface ShopWordOfMouthSpec {
    preferredArchetypes?: string[] | null;
    hotTag?: string;
    visitBias?: number | string;
    tagVisitBias?: number | string;
    budgetBonus?: number | string;
    tagBudgetBonus?: number | string;
  }

  export interface ShopCompendiumDisplay {
    archetypes?: string[] | null;
    tags?: string[] | null;
    budgetBonus?: number | string;
    [key: string]: unknown;
  }

  export interface ShopCompendiumCustomerSupportInput {
    displays?: ShopCompendiumDisplay[] | null;
    customerArchetype?: string | null;
    preferredTags?: string[] | null;
    itemTags?: string[] | null;
    hotTag?: string | null;
  }

  export interface ShopCompendiumCustomerSupportPlan {
    budgetBonus: number;
    matched: ShopCompendiumDisplay[];
  }

  export interface ShopWeatherShelfGood {
    itemId?: string;
    matchedTags?: string[] | null;
  }

  export interface ShopWeatherShelfSpec {
    active?: boolean;
    kind?: string;
    desiredTags?: string[] | null;
    topGoods?: ShopWeatherShelfGood[] | null;
  }

  export interface ShopWeatherShelfChoiceSupportInput {
    itemId?: string | null;
    itemTags?: string[] | null;
    shelf?: ShopWeatherShelfSpec | null;
  }

  export interface ShopWeatherShelfChoiceSupportPlan {
    active: boolean;
    itemId: string;
    isTopGood: boolean;
    matchedTags: string[];
    labelTag: string;
    budgetBonus: number;
    priceRelief: number;
  }

  export interface ShopWeatherShelfChoiceWeightInput {
    support?: ShopWeatherShelfChoiceSupportPlan | null;
    itemTags?: string[] | null;
    preferredTags?: string[] | null;
  }

  export interface ShopWeatherShelfChoiceWeightPlan {
    support: ShopWeatherShelfChoiceSupportPlan;
    score: number;
    preferredBridge: number;
    topWeight: number;
    budgetWeight: number;
    labelKind: "top" | "match" | "";
  }

  export interface ShopCustomerGoodCandidate {
    good?: ShopGoodChoice | null;
    dislikedHit?: boolean;
    preferredHit?: boolean;
    weatherWeightScore?: number | string;
    stockWeight?: number | string;
    index?: number | string;
  }

  export interface ShopCustomerGoodScoredCandidate extends ShopCustomerGoodCandidate {
    weatherWeightScore: number;
    stockWeight: number;
    index: number;
    score: number;
  }

  export interface ShopCustomerGoodMatchInput {
    candidates?: ShopCustomerGoodCandidate[] | null;
    fallbackGood?: ShopGoodChoice | null;
  }

  export type ShopCustomerGoodMatchReason = "preferred" | "weather" | "score" | "fallback";

  export interface ShopCustomerGoodMatchPlan {
    good: ShopGoodChoice | null;
    candidate: ShopCustomerGoodScoredCandidate | null;
    reason: ShopCustomerGoodMatchReason;
  }

  export interface ShopSalesStatsCustomer {
    archetype?: string | null;
  }

  export interface ShopSalesStatsReportEntry {
    reason?: string | null;
    customerArchetype?: string | null;
    itemId?: string | null;
  }

  export interface ShopSalesStatsDeltaInput {
    customers?: Array<ShopSalesStatsCustomer | null> | null;
    report?: Array<ShopSalesStatsReportEntry | null> | null;
    sold?: number | string;
    sessionSales?: number | string;
    themeScore?: number | string;
    shelfTheme?: string | null;
    lowStockCount?: number | string;
  }

  export interface ShopSalesStatsDelta {
    sessions: number;
    visitors: number;
    buyers: number;
    soldCount: number;
    sales: number;
    positive: number;
    themeTotal: number;
    stockWarnings: number;
    stockSafeSessions: number;
    itemSales: Record<string, number>;
    customerVisits: Record<string, number>;
    customerBuys: Record<string, number>;
    themeUsage: Record<string, number>;
  }

  export interface PricedGoodOptions {
    themeScore?: number;
    shelfTheme?: ShopRow | null;
    term?: ShopRow | null;
  }

  export interface PricedGoodResult {
    price: number;
    multiplier: number;
    overprice: boolean;
    rule: ShopRow | null;
  }

  export interface CustomerPurchaseDecisionInput {
    priced: PricedGoodResult;
    budget: number;
    behavior?: ShopRow | null;
    customer?: ShopRow | null;
    choice?: { count?: number | string } | null;
    hasStock?: boolean;
    budgetBonuses?: Record<string, number | undefined>;
    priceReliefs?: Record<string, number | undefined>;
  }

  export type CustomerPurchaseDecisionReason = "buy" | "price" | "stock" | "tag";

  export interface CustomerPurchaseDecision {
    effectiveBudget: number;
    priceTolerance: number;
    priceSensitive: number;
    stockPressure: boolean;
    rejectedByPrice: boolean;
    canBuy: boolean;
    reason: CustomerPurchaseDecisionReason;
  }

  export interface SalePricePlanInput {
    priced: PricedGoodResult;
    profitBuff?: number;
    dessertChoice?: boolean;
    dessertSaleBonusRate?: number;
  }

  export interface SalePricePlan {
    baseSalePrice: number;
    salePrice: number;
    dessertSaleBonus: number;
    dessertBonusGold: number;
  }

  function rowByKey(rows: ShopRow[], key: string, value: string): ShopRow | null {
    return rows.find((row) => row[key] === value) || null;
  }

  function customerArchetype(customer: ShopRow | null | undefined): string {
    return customer?.archetype || customer?.archetype_id || "";
  }

  function compactJoin(values: Array<string | undefined>): string {
    return values.filter(Boolean).join("|");
  }

  const semanticTagGroups = [
    ["festival", "festival_food", "festival_gift"],
    ["gift", "festival_gift", "flower_food"],
    ["premium", "premium_luxury", "luxury", "rare_goods"],
    ["portable_food", "portable_supply"],
    ["route_rare", "rare_goods"],
    ["drink", "cooling_drink"],
    ["cooling", "cooling_drink", "refreshing"],
    ["cheap", "low_price", "cheap_crop"],
    ["crop", "common_crop", "cheap_crop"],
    ["batch", "batch_standard"],
    ["water_food", "water"],
    ["recover_sp", "heal_sp"],
    ["recover_hp", "heal_hp"],
    ["dessert", "sweet_food", "festival_food", "flower_food", "fruit_food"],
    ["material", "workshop_supply"],
    ["medicine", "relief"],
    ["staple", "portable_supply"],
  ];

  const expressiveShopTags = new Set(["refreshing", "water_food", "food_cold", "clean_food", "cooling", "recover_sp"]);

  const shopTagPriorities: Record<string, number> = {
    ecology_product: 20,
    spirit_crafted: 19,
    route_rare: 18,
    refreshing: 18,
    water_food: 17,
    food_cold: 16,
    clean_food: 15,
    cooling: 14,
    recover_sp: 13,
    staple: 12,
    fresh_food: 11,
    medicine: 10,
    drink: 9,
    gift: 8,
    premium: 7,
    festival: 7,
    vegetable: 6,
    material: 5,
    cheap: 2,
    low_price: 2,
    food: 1,
  };

  export function createShopRuntime(state: ShopRuntimeState, data: ShopRuntimeData): ShopRuntime {
    function customerPriceRule(customer: ShopRow | null | undefined): ShopRow | null {
      const archetype = customerArchetype(customer);
      return (archetype ? data.priceRulesByArchetype?.get(archetype) : null)
        || rowByKey(data.shopPriceRules, "customer_archetype", archetype)
        || data.shopPriceRules[0]
        || null;
    }

    function customerProfile(customer: ShopRow | null | undefined): ShopRow {
      const archetype = customerArchetype(customer);
      return (archetype ? data.customerProfilesBy?.get(archetype) : null)
        || rowByKey(data.customerProfiles, "archetype_id", archetype)
        || {};
    }

    function shopReputationScore(): number {
      return Number(state.fame || 0) * 100;
    }

    function customerViewFor(customer: ShopRow | null | undefined, segment: ShopRow | null = null): ShopRow {
      const source = customer || {};
      const profile = customerProfile(source);
      return {
        ...source,
        preferred_tags: compactJoin([
          source.preferred_tags,
          profile.preferred_tags,
          segment?.preferred_tags_extra,
        ]),
        disliked_tags: compactJoin([
          profile.disliked_tags,
          segment?.disliked_tags_extra,
        ]),
      };
    }

    function customerBudget(customer: ShopRow | null | undefined, segment: ShopRow | null = null): number {
      const profile = customerProfile(customer);
      const baseBudget = Number(profile.base_budget || 0);
      const csvBudget = Number(customer?.budget_max || customer?.budget_min || 0);
      const budgetRate = Number(segment?.budget_rate || 1);
      return Math.round(Math.max(baseBudget, csvBudget) * budgetRate);
    }

    function pricedGood(choice: ShopGoodChoice | null | undefined, customer: ShopRow | null | undefined, options: PricedGoodOptions = {}): PricedGoodResult {
      const item = choice?.item || {};
      const rule = customerPriceRule(customer);
      const basePrice = Number(item.sell_price_base || 0);
      const maxMarkup = Number(rule?.base_markup_max || 0.12);
      const shelfTheme = options.shelfTheme || null;
      const themeScore = Number(options.themeScore || 0);
      const themeBonus = themeScore >= Number(shelfTheme?.min_theme_ratio || 1) ? 0.05 : 0;
      const itemTags = compactJoin([item.tags]).split("|").filter(Boolean);
      const marketTags = compactJoin([options.term?.market_bonus_tags]).split("|").filter(Boolean);
      const termBonus = itemTags.some((tag) => marketTags.some((marketTag) => marketTag.includes(tag) || tag.includes(marketTag))) ? 0.06 : 0;
      const multiplier = Math.max(0.5, Number(state.shopPriceMultiplier || 0) + themeBonus + termBonus);
      const price = Math.max(1, Math.round(basePrice * multiplier));
      const overpriceLimit = 1 + Number(rule?.penalty_overprice_threshold || maxMarkup);
      return {
        price,
        multiplier,
        overprice: multiplier > overpriceLimit,
        rule,
      };
    }

    function sumValues(values: Record<string, number | undefined> = {}): number {
      let total = 0;
      for (const value of Object.values(values)) total += Number(value || 0);
      return total;
    }

    function customerPurchaseDecision(input: CustomerPurchaseDecisionInput): CustomerPurchaseDecision {
      const priced = input.priced;
      const budgetBonus = sumValues(input.budgetBonuses);
      const effectiveBudget = Math.round(Number(input.budget || 0) * (1 + budgetBonus));
      const priceTolerance = Number(input.behavior?.price_tolerance || 0.7);
      const priceSensitive = Math.max(Number(input.customer?.price_sensitive || 0.5), 1 - priceTolerance);
      const stockPressure = Number(input.behavior?.stock_sensitivity || 0.7) > 0.8 && Number(input.choice?.count || 0) <= 1;
      const priceRelief = sumValues(input.priceReliefs);
      const rejectedByPrice = priced.overprice && priceSensitive > Math.max(0.35, 0.55 - priceRelief);
      const canBuy = Boolean(input.hasStock) && priced.price <= effectiveBudget && !rejectedByPrice && !stockPressure;
      return {
        effectiveBudget,
        priceTolerance,
        priceSensitive,
        stockPressure,
        rejectedByPrice,
        canBuy,
        reason: canBuy ? "buy" : priced.price > effectiveBudget || rejectedByPrice ? "price" : stockPressure ? "stock" : "tag",
      };
    }

    function salePricePlan(input: SalePricePlanInput): SalePricePlan {
      const priced = input.priced;
      const profitBuff = Number(input.profitBuff || 0);
      const dessertSaleBonus = input.dessertChoice ? Number(input.dessertSaleBonusRate || 0) : 0;
      const baseSalePrice = Math.max(1, Math.round(Number(priced.price || 0) * (1 + profitBuff)));
      const salePrice = Math.max(1, Math.round(Number(priced.price || 0) * (1 + profitBuff + dessertSaleBonus)));
      return {
        baseSalePrice,
        salePrice,
        dessertSaleBonus,
        dessertBonusGold: Math.max(0, salePrice - baseSalePrice),
      };
    }

    function splitTags(value?: string): string[] {
      return String(value || "").split("|").map((tag) => tag.trim()).filter(Boolean);
    }

    function themeMatchScore(goods: ShopGoodChoice[] | null = [], theme: ShopRow | null = null): number {
      const safeGoods = Array.isArray(goods) ? goods : [];
      if (!theme || safeGoods.length === 0) return 0;
      const required = splitTags(theme.required_item_tags);
      const matched = safeGoods.filter((good) => splitTags(good.item?.tags).some((tag) => required.includes(tag))).length;
      return matched / safeGoods.length;
    }

    function expandShopSemanticTags(tags: string[] | null = []): string[] {
      const expanded = new Set((Array.isArray(tags) ? tags : []).filter(Boolean));
      let changed = true;
      while (changed) {
        changed = false;
        for (const group of semanticTagGroups) {
          if (!group.some((tag) => expanded.has(tag))) continue;
          for (const tag of group) {
            if (expanded.has(tag)) continue;
            expanded.add(tag);
            changed = true;
          }
        }
      }
      return [...expanded];
    }

    function shopTagsOverlap(leftTags: string[] | null = [], rightTags: string[] | null = []): boolean {
      const left = Array.isArray(leftTags) ? leftTags : [];
      const right = Array.isArray(rightTags) ? rightTags : [];
      if (!left.length || !right.length) return false;
      const expandedRight = new Set(expandShopSemanticTags(right));
      return expandShopSemanticTags(left).some((tag) => expandedRight.has(tag));
    }

    function isExpressiveShopTag(tag: string | null = ""): boolean {
      return expressiveShopTags.has(String(tag || ""));
    }

    function shopTagPriority(tag: string | null = ""): number {
      return shopTagPriorities[String(tag || "")] || 0;
    }

    function tagCount(counts: ShopTagCounts | null | undefined, tag: string): number {
      if (!counts) return 0;
      if (counts instanceof Map) return Number(counts.get(tag) || 0);
      return Number(counts[tag] || 0);
    }

    function prioritizeShopTag(tags: string[] | null = [], counts: ShopTagCounts | null = null, fallback = "food"): string {
      const unique = [...new Set((Array.isArray(tags) ? tags : []).filter(Boolean))];
      if (!unique.length) return fallback;
      return unique
        .slice()
        .sort((a, b) => (shopTagPriority(b) * 10 + tagCount(counts, b)) - (shopTagPriority(a) * 10 + tagCount(counts, a)))[0]
        || fallback;
    }

    function shopHotTag(goods: ShopTaggedGoodChoice[] | null = [], theme: ShopRow | null = null, fallback = "food"): string {
      const safeGoods = Array.isArray(goods) ? goods : [];
      const required = splitTags(theme?.required_item_tags || "");
      const counts = new Map<string, number>();
      for (const good of safeGoods) {
        const tags = Array.isArray(good.tags) ? good.tags.filter(Boolean) : splitTags(good.item?.tags || "");
        for (const tag of tags) {
          counts.set(tag, Number(good.count || 1) + Number(counts.get(tag) || 0));
        }
      }
      const available = [...counts.keys()];
      const featured = available.filter((tag) => required.includes(tag) || isExpressiveShopTag(tag) || ["ecology_product", "spirit_crafted", "route_rare"].includes(tag));
      return prioritizeShopTag(featured.length ? featured : available, counts, required[0] || fallback);
    }

    function shopFeedbackEntryMatchesTag(entry: ShopRow | null = null, tag: string | null = ""): boolean {
      if (!entry || !tag) return true;
      const trigger = String(entry.trigger_condition || "");
      const hotTag = trigger.match(/hot_tag==([a-z_]+)/)?.[1] || "";
      if (hotTag) return hotTag === tag;
      const tagMatches = [...trigger.matchAll(/tag_match==([a-z_]+)/g)].map((match) => match[1]);
      if (tagMatches.length) return tagMatches.includes(tag);
      return true;
    }

    function shopFeedbackForSegment(type: string, customerSegment: string | null = "", tag: string | null = ""): ShopRow | null {
      if (!customerSegment) return null;
      const exact = data.shopFeedback.filter((entry) => entry.feedback_type === type && entry.customer_segment === customerSegment);
      if (!exact.length) return null;
      const matched = tag ? exact.filter((entry) => shopFeedbackEntryMatchesTag(entry, tag)) : exact;
      return matched[0] || null;
    }

    function shopWordOfMouthVisitBias(customer: ShopRow | null = null, segment: ShopRow | null = null, spec: ShopWordOfMouthSpec | null = null): number {
      if (!customer || !spec) return 0;
      let bonus = 0;
      if ((spec.preferredArchetypes || []).includes(customerArchetype(customer))) bonus += Number(spec.visitBias || 0);
      if (spec.hotTag) {
        const view = customerViewFor(customer, segment);
        const tags = expandShopSemanticTags(splitTags(view.preferred_tags || ""));
        if (shopTagsOverlap(tags, [spec.hotTag])) bonus += Number(spec.tagVisitBias || 0);
      }
      return bonus;
    }

    function shopWordOfMouthBudgetBonus(customer: ShopRow | null = null, choiceTags: string[] | null = [], spec: ShopWordOfMouthSpec | null = null): number {
      if (!customer || !Array.isArray(choiceTags) || !spec) return 0;
      let bonus = 0;
      if ((spec.preferredArchetypes || []).includes(customerArchetype(customer))) bonus += Number(spec.budgetBonus || 0);
      if (spec.hotTag && shopTagsOverlap(choiceTags, [spec.hotTag])) bonus += Number(spec.tagBudgetBonus || 0);
      return bonus;
    }

    function shopCompendiumCustomerSupport(input: ShopCompendiumCustomerSupportInput | null = null): ShopCompendiumCustomerSupportPlan {
      const displays = Array.isArray(input?.displays) ? input.displays : [];
      if (!displays.length) return { budgetBonus: 0, matched: [] };
      const customerArchetypeId = String(input?.customerArchetype || "");
      const preferredTags = Array.isArray(input?.preferredTags) ? input.preferredTags : [];
      const itemTags = Array.isArray(input?.itemTags) ? input.itemTags : [];
      const hotTag = String(input?.hotTag || "");
      const matched = displays.filter((display) => {
        const archetypes = Array.isArray(display.archetypes) ? display.archetypes : [];
        const tags = Array.isArray(display.tags) ? display.tags : [];
        const archetypeMatched = Boolean(customerArchetypeId && archetypes.includes(customerArchetypeId));
        return archetypeMatched || tags.some((tag) => shopTagsOverlap([tag], preferredTags) || shopTagsOverlap([tag], itemTags) || tag === hotTag);
      });
      return {
        budgetBonus: Math.min(0.16, matched.reduce((sum, display) => sum + Number(display.budgetBonus || 0), 0)),
        matched,
      };
    }

    function inactiveWeatherShelfPlan(itemId = ""): ShopWeatherShelfChoiceSupportPlan {
      return {
        active: false,
        itemId,
        isTopGood: false,
        matchedTags: [],
        labelTag: "",
        budgetBonus: 0,
        priceRelief: 0,
      };
    }

    function shopWeatherShelfChoiceSupport(input: ShopWeatherShelfChoiceSupportInput | null = null): ShopWeatherShelfChoiceSupportPlan {
      const itemId = String(input?.itemId || "");
      const shelf = input?.shelf || null;
      if (!itemId || !shelf?.active) return inactiveWeatherShelfPlan(itemId);
      const itemTags = Array.isArray(input?.itemTags) ? input.itemTags : [];
      const topGoods = Array.isArray(shelf.topGoods) ? shelf.topGoods : [];
      const desiredTags = Array.isArray(shelf.desiredTags) ? shelf.desiredTags : [];
      const topGood = topGoods.find((good) => good.itemId === itemId) || null;
      const matchedTags = desiredTags.filter((tag) => shopTagsOverlap(itemTags, [tag]));
      if (!topGood && matchedTags.length === 0) return inactiveWeatherShelfPlan(itemId);
      const weatherKindBonus = ["hot-wind", "drought", "frost", "snow", "storm-rain"].includes(String(shelf.kind || "")) ? 0.015 : 0;
      const topBonus = topGood ? 0.045 : 0;
      const tagBonus = Math.min(0.035, matchedTags.length * 0.018);
      const budgetBonus = Math.min(0.085, topBonus + tagBonus + weatherKindBonus);
      const topMatchedTags = Array.isArray(topGood?.matchedTags) ? topGood?.matchedTags || [] : [];
      return {
        active: true,
        itemId,
        isTopGood: Boolean(topGood),
        matchedTags,
        labelTag: matchedTags[0] || topMatchedTags[0] || desiredTags[0] || "",
        budgetBonus,
        priceRelief: Math.min(0.06, budgetBonus * 0.7),
      };
    }

    function shopWeatherShelfChoiceWeight(input: ShopWeatherShelfChoiceWeightInput | null = null): ShopWeatherShelfChoiceWeightPlan {
      const support = input?.support || inactiveWeatherShelfPlan("");
      if (!support.active) {
        return {
          support,
          score: 0,
          preferredBridge: 0,
          topWeight: 0,
          budgetWeight: 0,
          labelKind: "",
        };
      }
      const itemTags = Array.isArray(input?.itemTags) ? input.itemTags : [];
      const preferredTags = Array.isArray(input?.preferredTags) ? input.preferredTags : [];
      const preferredBridge = shopTagsOverlap(itemTags, preferredTags) ? 12 : 0;
      const topWeight = support.isTopGood ? 34 : 18;
      const budgetWeight = Math.round(Number(support.budgetBonus || 0) * 180);
      return {
        support,
        score: topWeight + budgetWeight + preferredBridge,
        preferredBridge,
        topWeight,
        budgetWeight,
        labelKind: support.isTopGood ? "top" : "match",
      };
    }

    function scoreCustomerGoodCandidate(candidate: ShopCustomerGoodCandidate): ShopCustomerGoodScoredCandidate {
      const weatherWeightScore = Number(candidate.weatherWeightScore || 0);
      const stockWeight = Number(candidate.stockWeight || 0);
      const index = Number(candidate.index || 0);
      return {
        ...candidate,
        weatherWeightScore,
        stockWeight,
        index,
        score: (candidate.preferredHit ? 80 : 0) + weatherWeightScore + stockWeight - index * 0.01,
      };
    }

    function topCustomerGoodCandidate(candidates: ShopCustomerGoodScoredCandidate[]): ShopCustomerGoodScoredCandidate | null {
      return [...candidates].sort((a, b) => Number(b.score || 0) - Number(a.score || 0))[0] || null;
    }

    function matchCustomerGood(input: ShopCustomerGoodMatchInput | null = null): ShopCustomerGoodMatchPlan {
      const scoredCandidates = (Array.isArray(input?.candidates) ? input.candidates : []).map(scoreCustomerGoodCandidate);
      const candidates = scoredCandidates.filter((candidate) => !candidate.dislikedHit);
      const preferredCandidate = topCustomerGoodCandidate(candidates.filter((candidate) => candidate.preferredHit));
      if (preferredCandidate?.good) return { good: preferredCandidate.good, candidate: preferredCandidate, reason: "preferred" };
      const weatherCandidate = topCustomerGoodCandidate(candidates.filter((candidate) => candidate.weatherWeightScore > 0));
      if (weatherCandidate?.good) return { good: weatherCandidate.good, candidate: weatherCandidate, reason: "weather" };
      const scoredCandidate = topCustomerGoodCandidate(candidates);
      if (scoredCandidate?.good) return { good: scoredCandidate.good, candidate: scoredCandidate, reason: "score" };
      return { good: input?.fallbackGood || null, candidate: null, reason: "fallback" };
    }

    function incrementShopStatsCount(counts: Record<string, number>, key?: string | null): void {
      const safeKey = String(key || "");
      if (!safeKey) return;
      counts[safeKey] = Number(counts[safeKey] || 0) + 1;
    }

    function shopSalesStatsDelta(input: ShopSalesStatsDeltaInput | null = null): ShopSalesStatsDelta {
      const customers = Array.isArray(input?.customers) ? input.customers : [];
      const report = Array.isArray(input?.report) ? input.report : [];
      const boughtRows = report.filter((entry) => entry?.reason === "buy");
      const itemSales: Record<string, number> = {};
      const customerVisits: Record<string, number> = {};
      const customerBuys: Record<string, number> = {};
      const themeUsage: Record<string, number> = {};
      for (const customer of customers) incrementShopStatsCount(customerVisits, customer?.archetype);
      for (const entry of boughtRows) {
        incrementShopStatsCount(customerBuys, entry?.customerArchetype);
        incrementShopStatsCount(itemSales, entry?.itemId);
      }
      incrementShopStatsCount(themeUsage, input?.shelfTheme);
      const lowStock = Number(input?.lowStockCount || 0) > 0;
      return {
        sessions: 1,
        visitors: customers.length,
        buyers: Number(input?.sold || 0),
        soldCount: Number(input?.sold || 0),
        sales: Number(input?.sessionSales || 0),
        positive: boughtRows.length,
        themeTotal: Number(input?.themeScore || 0),
        stockWarnings: lowStock ? 1 : 0,
        stockSafeSessions: lowStock ? 0 : 1,
        itemSales,
        customerVisits,
        customerBuys,
        themeUsage,
      };
    }

    return {
      customerPriceRule,
      customerProfile,
      shopReputationScore,
      customerViewFor,
      customerBudget,
      pricedGood,
      customerPurchaseDecision,
      salePricePlan,
      themeMatchScore,
      expandShopSemanticTags,
      shopTagsOverlap,
      isExpressiveShopTag,
      shopTagPriority,
      prioritizeShopTag,
      shopHotTag,
      shopFeedbackEntryMatchesTag,
      shopFeedbackForSegment,
      shopWordOfMouthVisitBias,
      shopWordOfMouthBudgetBonus,
      shopCompendiumCustomerSupport,
      shopWeatherShelfChoiceSupport,
      shopWeatherShelfChoiceWeight,
      matchCustomerGood,
      shopSalesStatsDelta,
    };
  }
}
