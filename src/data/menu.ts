export interface MenuItem {
  id: number;
  name: string;
  category: string;
  sizes_available: string[] | null;
  pairs_with: string[] | null;
  price: number | null;
  image_url: string | null;
  available: boolean;
  featured: boolean;
  moq_required: boolean;
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
