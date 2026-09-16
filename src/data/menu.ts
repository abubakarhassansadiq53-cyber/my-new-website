export interface AddOn {
  name: string;
  price: number;
}

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
  addons?: AddOn[] | null;
}

export interface ChefSpecial {
  id: number;
  name: string;
  special_type: 'special_edition' | 'todays_menu' | 'combo_meal' | 'vegan_option';
  price: number;
  description: string | null;
  image_url: string | null;
  is_todays_meal: boolean;
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

export const chefSpecialTypes = [
  { key: 'special_edition', label: 'Special Edition Meal' },
  { key: 'todays_menu', label: "Today's Menu" },
  { key: 'combo_meal', label: 'Combo Meal' },
  { key: 'vegan_option', label: 'Vegan Option' },
] as const;

export const defaultAddOns: AddOn[] = [
  { name: 'Extra Plantain', price: 2.50 },
  { name: 'Extra Meat', price: 3.50 },
  { name: 'Extra Sauce', price: 1.50 },
  { name: 'Side Salad', price: 3.00 },
];
