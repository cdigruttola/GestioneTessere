import { Injectable } from '@angular/core'

import { HttpClient } from '@angular/common/http'

import { Corso } from '../model'

import { HTTP_GLOBAL_OPTIONS } from '../common'

import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

const REST_ENDPOINT: string = "https://www.studentingegneria.it/socisi/backend/cdl.php"

@Injectable()
export class CorsiService{

    _obs = new Subject<Corso[]>();

    constructor(private http: HttpClient){

    }

    private updateSub(value){
        let temp : Corso[] = [];
        value.forEach(
            (old) => {temp.push(new Corso(old));}
        )
        this._obs.next(temp);
    }
    
    getCorsi(): Observable<Corso[]>{
        this.http.get<Corso[]>(REST_ENDPOINT, HTTP_GLOBAL_OPTIONS).subscribe(
            (value) => {this.updateSub(value)}
        )
        return this._obs;
    }

    addCorso(nome: string){
        this.http.post<Corso[]>(REST_ENDPOINT, {'nome': nome}, HTTP_GLOBAL_OPTIONS).subscribe(
            (value) => { this.updateSub(value) }
        );
    }

    deleteCorso(corso: Corso){
        this.http.delete<Corso[]>(REST_ENDPOINT+'/'+corso.id, HTTP_GLOBAL_OPTIONS).subscribe(
            (value) => { this.updateSub(value) }
        );
    }

    updateCorso(newCorso: Corso){
        this.http.post<Corso[]>(REST_ENDPOINT, newCorso, HTTP_GLOBAL_OPTIONS).subscribe(
            (value) => { this.updateSub(value) }
        );
    }
}