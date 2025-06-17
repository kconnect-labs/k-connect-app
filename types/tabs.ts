export const profileTabs = ['posts', 'wall','info'] as const;
export type ProfileTabKey = (typeof profileTabs)[number];
