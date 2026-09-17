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
  { key: 'special_edition', label: 'Chef Special' },
  { key: 'todays_menu', label: "Today's Menu" },
  { key: 'combo_meal', label: 'Combo Meal' },
  { key: 'vegan_option', label: 'Vegan Option' },
] as const;

export const categoryTranslations: Record<string, string> = {
  'Rice Dishes': 'Iresi',
  'Beans & Yam': 'Ewa ati Yam',
  'Plantain Dishes': 'Dodo',
  'Bean Cakes': 'Akara',
  'Pepper Soups': 'Obe Ata',
  'Nigerian Soups': 'Obe Naijiria',
  'Pasta': 'Pasta',
  'Peppered Proteins': 'Eran Ata',
  'Snacks': 'Awon Onje',
  'Sauces': 'Obe',
  'Special Proteins': 'Eran Pataki',
};

export const defaultAddOns: AddOn[] = [
  { name: 'Extra Plantain', price: 2.50 },
  { name: 'Extra Meat', price: 3.50 },
  { name: 'Extra Sauce', price: 1.50 },
  { name: 'Side Salad', price: 3.00 },
];
