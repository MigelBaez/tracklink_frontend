import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'clientes',
                title    : 'clientes',
                translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'account_box',
                url      : '/clientes'
            
            }
        ]
    }
];
