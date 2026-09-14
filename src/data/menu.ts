export interface SizeOption {
  label: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  sizes: SizeOption[] | null;
  price: number | null;
  pairs: string[] | null;
  featured: boolean;
  moq_required: boolean;
  available: boolean;
  sort_order: number;
}

export const menuCategories = [
  'Rice Dishes',
  'Beans & Yam',
  'Plantain Dishes',
  'Bean Cakes',
  'Pepper Soups',
  'Nigerian Soups',
  'Pasta',
  'Peppered Proteins',
  'Snacks',
  'Sauces',
  'Special Proteins',
] as const;
