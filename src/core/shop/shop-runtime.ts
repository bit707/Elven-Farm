namespace XiannongCore.Shop {
  export type ShopRow = Record<string, string | undefined>;

  export interface ShopRuntimeState {
    fame?: number;
    shopPriceMultiplier?: number;
  }

  export interface ShopRuntimeData {
    shopPriceRules: ShopRow[];
    customerProfiles: ShopRow[];
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
  }

  export interface ShopGoodChoice {
    item?: ShopRow;
    itemId?: string;
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
    };
  }
}
