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
    label: 'Usage report',
    icon: 'activity',
    link: '/kitchen/usage-report',
  },
  {
    label: 'POS report',
    icon: 'bar-chart-2',
    link: '/kitchen/pos-report',
  },
  {
    label: 'Daily analysis',
    icon: 'book-open',
    link: '/kitchen/daily-analysis',
  },
  {
    label: 'Inventory analysis',
    icon: 'box',
    link: '/kitchen/inventory-analysis',
  }
];
