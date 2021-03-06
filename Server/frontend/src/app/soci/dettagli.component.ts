import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core'
import { Router } from '@angular/router'
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material'

import { Socio, Tessera, Carriera, Corso } from '../model'

import { PATTERN_NUMERO_TESSERA, PATTERN_CELLULARE, PATTERN_MATRICOLA, 
            SubjectDataSource, BACKEND_SERVER } from '../common'


import { SociService } from './main.service'
import { TesseramentiService } from '../tesseramenti/main.service'

import { BehaviorSubject, Subscription } from 'rxjs';

import { CreateCarrieraDialog, CreateTesseraDialog, MessageDialog } from '../dialogs'


@Component({
    selector: 'dettagli-socio',
    templateUrl: './dettagli.component.html',
    styleUrls: ['./dettagli.component.css', '../common/style.css']
})
export class DettagliSocioComponent implements OnInit, OnDestroy {

    // fix: only import doesn't show in view, must define local variable
    private PATTERN_NUMERO_TESSERA = PATTERN_NUMERO_TESSERA;
    private PATTERN_CELLULARE = PATTERN_CELLULARE;
    private PATTERN_MATRICOLA = PATTERN_MATRICOLA;
    private BACKEND_SERVER = BACKEND_SERVER;

    public loaded = false;

    //model and editing data
    editing: boolean = false; // true if you are editing data, false if you are just reading
    model: Socio; //working model, where changes happen
    id: number; //id of the requested Socio
    hasTessera: boolean = false; // true se ha una tessera dell'ultimo tesseramento, quello attivo
    initialSocio: Socio;
    socioSubscription: Subscription;

    //properties for carriere table
    carriereSource: SubjectDataSource<Carriera> = new SubjectDataSource<Carriera>();
    carriereColumns: string[] = ['studente', 'dettagli']; // showed columns
    carriereEditing = {}; // obj to enable editing of a single row

    //properties for tessere table
    tessereSource: SubjectDataSource<Tessera> = new SubjectDataSource<Tessera>();
    tessereColumns: string[] = ['numero', 'anno', 'azioni'];  // showed columns
    tessereEditing = {}; // obj to enable editing of a single row



    constructor(
        private _socisrv: SociService,
        private _tesssrv: TesseramentiService,
        private _dialog: MatDialog,
        private _router: Router,
        @Optional() @Inject(MAT_DIALOG_DATA) private data: any,
        @Optional() private diagref: MatDialogRef<DettagliSocioComponent>
    ) {
    }


    ngOnInit() {
        if (this.data) { //if we are in a dialog and data have been given to us, use them
            this.socioSubscription = this._socisrv.getSocioById(this.data.socio.id).subscribe(
                socio => { this.initData(socio); },
                (x) => {
                    if (x.status && x.status == 404) {
                        this.diagref.close();
                        this._dialog.open(MessageDialog, {
                            data: {
                                message: "Nessun socio trovato con questo ID!"
                            }
                        })
                    } else {
                        throw x;
                    }
                }
            );
        } else {
            this._dialog.open(MessageDialog, {
                data: {
                    message: "Nessun socio trovato con questo ID!"
                }
            })
        }
    }

    ngOnDestroy(){
        this.socioSubscription.unsubscribe();
    }

    /**
     * Used to initialize the data given the socio
     * @param socio the socio to use for the model
     */
    private initData(socio: Socio): void {
        this.initialSocio = socio.clone();
        this.loaded = true;
        this.model = socio;
        this.model.carriere.forEach(
            //init single row editing in the map
            (carr: Carriera) => { this.carriereEditing[carr.id] = false; }
        );
        this._tesssrv.getTesseramentoAttivo().subscribe(
            (tessAttivo) => {
                this.model.tessere.forEach(
                    (tess: Tessera) => {
                        this.tessereEditing[tess.id] = false;
                        if (tess.anno.equals(tessAttivo)) {
                            this.hasTessera = true
                            // si importano le tessere per il controllo
                            // si esclude la tessera corrente
                            tess.anno.tessere = tessAttivo.tessere.filter((x: number) => { return x != tess.numero });
                        }
                    }
                );
            },
            () => { }
        )
        this.carriereSource.update(this.model.carriere);
        this.tessereSource.update(this.model.tessere);
    }

    /**
     * 
     */
    enableEditing() {
        this.editing = true;
        this.carriereColumns.push('azioni');
    }

    disableEditing() {
        Object.keys(this.carriereEditing).forEach(
            (prop: string) => { this.carriereEditing[prop] = false; }
        );
        Object.keys(this.tessereEditing).forEach(
            (prop: string) => { this.tessereEditing[prop] = false; }
        );
        this.editing = false;
        this.carriereColumns.pop();
    }

    /**
     * Used to close the dialog, or to go back at the previous route depending on how the component is displayed
     */
    exit() {
        this.diagref.close(null);
    }

    /**
     * Used to confirm the editing of the data
     * @param form the form submitted
     */
    confirm(form: any) {
        if (!form.invalid) {
            this.disableEditing();
            this._socisrv.updateSocio(this.model);
        }
        return false; //to prevent Edge from reloading
    }

    /**
     * USed to revert the editing of the data
     * @param form the form to revert
     */
    revert(form: any) {
        this.model.reinit(this.initialSocio);
        this.disableEditing();
        return false; //to prevent Edge from reloading
    }

    addCarriera() {
        this._dialog.open(CreateCarrieraDialog).afterClosed().subscribe(
            (new_carriera: Carriera) => {
                if (new_carriera) {
                    this.model.carriere.forEach(
                        (carriera) => (carriera.attiva = false)
                    )
                    this.model.carriere.unshift(new_carriera);
                    this.carriereSource.update(this.model.carriere);
                }
            }
        )
    }

    deleteCarriera(id: number) {
        let index = this.model.carriere.findIndex(x => x.id == id);
        this.model.carriere.splice(index, 1);
        this.carriereSource.update(this.model.carriere);
    }

    addTessera() {
        this.diagref.close();
        this._router.navigate(['tessere', this.model.id]);
    }

}

