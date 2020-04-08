
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Cliente } from 'app/main/clientes/cliente.model';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ClienteFormComponent
{
    action: string;
    cliente: Cliente;
    clienteForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<ClienteFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ClienteFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Editar Cliente';
            this.cliente = _data.cliente;
        }
        else
        {
            this.dialogTitle = 'Nuevo Cliente';
            this.cliente = new Cliente({});
        }

        this.clienteForm = this.createClienteForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createClienteForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.cliente.id],
            nombre    : [this.cliente.nombre],
            apellido: [this.cliente.apellido],
            email   : [this.cliente.email],
            telefono   : [this.cliente.telefono],
            direccion : [this.cliente.direccion]
        });
    }
}
