namespace XiannongCore.Shop {
  export type ShopRow = Record<string, string | undefined>;

  export interface ShopRuntimeState {
    fame?: number;
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

    return {
      customerPriceRule,
      customerProfile,
      shopReputationScore,
      customerViewFor,
      customerBudget,
    };
  }
}
