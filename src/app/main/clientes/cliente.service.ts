import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Cliente } from 'app/main/clientes/cliente.model';

@Injectable()
export class ClienteService implements Resolve<any>
{
    onClientesChanged: BehaviorSubject<any>;
    onSelectedClientesChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    clientes: Cliente[];
    user: any;
    selectedClientes: string[] = [];

    searchText: string;
    filterBy: string;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onClientesChanged = new BehaviorSubject([]);
        this.onSelectedClientesChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getClientes()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getClientes();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getClientes();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get clientes
     *
     * @returns {Promise<any>}
     */
    getClientes(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get('http://localhost:8080/api/clientes')
                    .subscribe((response: any) => {

                        this.clientes = response;
                     
                        this.clientes = this.clientes.map(cliente => {
                            return new Cliente(cliente);
                        });

                        this.onClientesChanged.next(this.clientes);
                        resolve(this.clientes);
                    }, reject);
            }
        );
    }


 



    /**
     * Update cliente
     *
     * @param cliente
     * @returns {Promise<any>}
     */
    updateCliente(cliente): Promise<any>
    {
    return new Promise((resolve, reject) => {

            this._httpClient.put('http://localhost:8080/api/cliente/', {...cliente})
                .subscribe(response => {
                    this.getClientes();
                    resolve(response);
                });
        });
    }


        /**
     * add cliente
     *
     * @param cliente
     * @returns {Promise<any>}
     */
    addCliente(cliente): Promise<any>
    {
        cliente = { 
                     id: {
                        counter: 0,
                        date: new Date(),
                        machineIdentifier: 0,
                        processIdentifier: 0,
                        time: 0,
                        timeSecond: 0,
                        timestamp: 0
                    },
                    nombre : cliente.nombre,
                    apellido : cliente.apellido,
                    telefono : cliente.telefono,
                    email : cliente.email,
                    direccion : cliente.direccion }
        return new Promise((resolve, reject) => {

            this._httpClient.post('http://localhost:8080/api/cliente/', {...cliente})
                .subscribe(response => {
                    this.getClientes();
                    resolve(response);
                });
        });
    }


    /**
     * Delete cliente
     *
     * @param cliente
     */
    deleteCliente(cliente): void
    {
                this._httpClient.delete('http://localhost:8080/api/cliente/'+ cliente.id)
                .subscribe(response => {
                    this.getClientes();
                 
                });
    }


}
