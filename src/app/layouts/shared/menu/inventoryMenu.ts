import { MenuItem } from './menu.model';

export const INVENTORYMENU: MenuItem[] = [
  {
    label: 'Inventory',
    isTitle: true
  },
  {
    label: 'Inventory stock',
    icon: 'gift',
    link: '/inventory/stocks',
  }
];
