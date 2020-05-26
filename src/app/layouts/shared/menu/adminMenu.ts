import { MenuItem } from './menu.model';

export const ADMINMENU: MenuItem[] = [
    {
        label: 'ADMIN',
        isTitle: true
    },
    {
        label: 'Users',
        icon: 'user',
        link: '/admin/users',
    },
    {
        label: 'User events',
        icon: 'airplay',
        link: '/admin/user-events'
    },
    {
        label: 'Shops',
        icon: 'home',
        link: '/admin/shops'
    }
];
