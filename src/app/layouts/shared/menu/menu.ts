import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        label: 'Overview',
        icon: 'bar-chart-2',
        link: '/',
    },
    {
        label: 'Monthly overview',
        icon: 'calendar',
        link: '/details/monthly',
    },
    {
        label: 'Weekly overview',
        icon: 'align-center',
        link: '/details/weekly',
    },
    {
        label: 'Hourly overview',
        icon: 'clock',
        link: '/details/hourly',
    },
    {
        label: 'DETAILS',
        isTitle: true
    },
    {
        label: 'Sales',
        icon: 'activity',
        link: '/details/sale',
    },
    {
        label: 'Transactions',
        icon: 'trending-up',
        link: '/details/transaction',
    },
    {
        label: 'Payments',
        icon: 'briefcase',
        link: '/details/payment',
    },
    {
        label: 'Articles',
        icon: 'gift',
        link: '/details/article',
    },
    {
        label: 'COMPARISON',
        isTitle: true
    },
    {
        label: 'Shop compare',
        icon: 'award',
        link: '/compare/shop',
    },
    {
        label: 'Period compare',
        icon: 'calendar',
        link: '/compare/period',
    },

    {
        label: 'Kitchen dashboard',
        isTitle: true
    },
    {
      label: 'Usage report',
      icon: 'activity',
      link: '/kitchen/usage-report',
    },
    {
      label: 'Usage per thousand',
      icon: 'bar-chart',
      link: '/kitchen/usage-per-thousand',
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
