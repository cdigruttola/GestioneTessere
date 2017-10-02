import { Component, OnInit, Inject } from '@angular/core'
import { MD_DIALOG_DATA } from '@angular/material';

import { MdDialogRef, MdSnackBar } from '@angular/material'

import { Socio, Tessera, Carriera, CdL, Tesseramento } from '../common/all'
import { CorsiService } from '../corsi/main.service'

import { TesseramentiService } from '../tesseramenti/main.service'

@Component({
    selector: 'aggiunta-socio',
    templateUrl: './aggiunta.component.html',
    styleUrls: ['./aggiunta.component.css', '../common/style.css']
})
export class AggiuntaSocioComponent implements OnInit {

    error: boolean;
    model: Socio;
    allCdL: CdL[];

    constructor(private _corsisrv: CorsiService,
        private _tessserv: TesseramentiService,
        private _snackbar: MdSnackBar,
        private _diagref: MdDialogRef<AggiuntaSocioComponent>) {
    }

    ngOnInit() {
        this._corsisrv.getCorsi().combineLatest(
            this._tessserv.getTesseramentoAttivo(),
            (in_corsi: CdL[], in_tessAtt: Tesseramento) => { return { corsi: in_corsi, tesseramento: in_tessAtt } }
        ).subscribe(
            (x) => {
                this.error = false;
                this.model = new Socio({
                    nome: "", cognome: "", email: "", cellulare: "", facebook: "",
                    tessere: [new Tessera({ numero: '', anno: x.tesseramento })],
                    carriere: [new Carriera({ matricola: '', corso: x.corsi[0] })]
                });
            },
            () => { this.error = true; }
        )
    }

    submitForm(form: any) {
        if (!form.invalid) {
            this._diagref.close(this.model);
        } else {
            this._snackbar.open("Tutti i campi sono obbligatori", "Ok", {
                duration: 1500
            })
        }
        return false; //to prevent Edge from reloading
    }

    revertForm(form: any) {
        this._diagref.close(null);
        return false; //to prevent Edge from reloading
    }
}