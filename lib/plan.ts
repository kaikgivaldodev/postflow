export type PlanAccessInfo = {
  plan_status: string;
  trial_ends_at: string | null;
};

export function hasActiveAccess(profile: PlanAccessInfo): boolean {
  if (profile.plan_status === "active") return true;
  if (profile.plan_status === "trial" && profile.trial_ends_at) {
    return new Date(profile.trial_ends_at) > new Date();
  }
  return false;
}

export function trialDaysRemaining(trialEndsAt: string | null): number {
  if (!trialEndsAt) return 0;
  const diffMs = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}
