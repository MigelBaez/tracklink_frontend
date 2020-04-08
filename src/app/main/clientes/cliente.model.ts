import { FuseUtils } from '@fuse/utils';

export class Cliente
{
    id: string;
    nombre: string;
    apellido: string;
    avatar: string;
    email: string;
    telefono: string;
    direccion: string;

    /**
     * Constructor
     *
     * @param cliente
     */
    constructor(cliente)
    {
        {
            this.id = cliente.id || FuseUtils.generateGUID();
            this.nombre = cliente.nombre || '';
            this.apellido = cliente.apellido || '';
            this.avatar = cliente.avatar || 'https://www.zooniverse.org/assets/simple-avatar.png' ;     
            this.email = cliente.email || '';
            this.telefono = cliente.telefono || '';
            this.direccion = cliente.direccion || '';
          
        }
    }
}
