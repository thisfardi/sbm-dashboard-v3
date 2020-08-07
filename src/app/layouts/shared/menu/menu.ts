import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        label: 'Overview',
        icon: 'bar-chart-2',
        link: '/',
    },
    {
        label: 'Weekly overview',
        icon: 'bar-chart-2',
        link: '/details/weekly',
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
