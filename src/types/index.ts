export type UserRole = 'MEMBER' | 'MODERATOR' | 'ADMIN';
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type CardRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';

export interface TierListItem {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface TierListTier {
  id: string;
  name: string;
  color: string;
  items: TierListItem[];
}

export interface TierListData {
  tiers: TierListTier[];
}

export type CardAttributes = Record<string, number>;
