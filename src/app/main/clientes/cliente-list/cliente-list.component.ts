import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ClienteService } from 'app/main/clientes/cliente.service';
import { ClienteFormComponent } from 'app/main/clientes/cliente-form/cliente-form.component';

@Component({
  selector: 'cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ClienteListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent', {static: false})
    dialogContent: TemplateRef<any>;

    clientes: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = [ 'nombre', 'email', 'telefono',  'buttons'];
    selectedClientes: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ClienteService} _clienteService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _clienteService: ClienteService,
        public _matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.dataSource = new FilesDataSource(this._clienteService);

        this._clienteService.onClientesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(clientes => {
                this.clientes = clientes;

                this.checkboxes = {};
                clientes.map(cliente => {
                    this.checkboxes[cliente.id] = false;
                });
            });

 



   
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit contact
     *
     * @param contact
     */
    editContact(cliente): void
    {
        this.dialogRef = this._matDialog.open(ClienteFormComponent, {
            panelClass: 'cliente-form',
            data      : {
                cliente: cliente,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                console.log(actionType)
                switch ( actionType )
                {
           
                    /**
                     * Save
                     */
                    case 'save':

                        this._clienteService.updateCliente(formData.getRawValue());

                        break;
                            /**
                     * Save
                     */
                    case 'add':

                        this._clienteService.addCliente(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this._clienteService.deleteCliente(cliente);

                        break;
                }
            });
    }

    /**
     * Delete Contact
     */
    deleteContact(contact): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Está seguro que desea eliminar el cliente?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._clienteService.deleteCliente(contact);
            }
            this.confirmDialogRef = null;
        });

    }



}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {ContactsService} _clienteService
     */
    constructor(
        private _clienteService: ClienteService
    )
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._clienteService.onClientesChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
