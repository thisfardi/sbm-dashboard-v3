import { MenuItem } from './menu.model';

export const KITCHENMENU: MenuItem[] = [
  {
    label: 'Kitchen',
    isTitle: true
  },
  {
    label: 'Item history',
    icon: 'gift',
    link: '/kitchen/item',
  },
  {
    label: 'Raw material history',
    icon: 'briefcase',
    link: '/kitchen/raw',
  }
];
