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

  function rowByKey(rows: ShopRow[], key: string, value: string): ShopRow | null {
    return rows.find((row) => row[key] === value) || null;
  }

  function customerArchetype(customer: ShopRow | null | undefined): string {
    return customer?.archetype || customer?.archetype_id || "";
  }

  function compactJoin(values: Array<string | undefined>): string {
    return values.filter(Boolean).join("|");
  }

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

    return {
      customerPriceRule,
      customerProfile,
      shopReputationScore,
      customerViewFor,
      customerBudget,
      pricedGood,
    };
  }
}
