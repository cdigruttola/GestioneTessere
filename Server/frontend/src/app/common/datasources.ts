import { DataSource } from '@angular/cdk/table'
import { Sort } from '@angular/material'

import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { TableChangeData } from './tableChangeData'

export class ObservableDataSource<T> implements DataSource<T>{

    constructor(private _obs: Observable<T[]>) { }

    connect(): Observable<T[]> { return this._obs; }

    disconnect() { }
}

export class SubjectDataSource<T> implements DataSource<T>{

    _sub: Subject<T[]> = new BehaviorSubject<T[]>(null);

    constructor() { }

    update(value: T[]) { this._sub.next(value); }

    connect(): Observable<T[]> { return this._sub; }

    disconnect() { }
}

export class FilteredSortedDataSource<T extends Searchable & Comparable<T>  > extends DataSource<T>{

    _filterChange = new BehaviorSubject('');
    set filter(filter: string) { this._filterChange.next(filter); }

    _sortChange = new BehaviorSubject<Sort>({ active: '', direction: '' }); //aliased observable to assure a first emission. sortChange doesn't do that
    set sort(next: Sort) { this._sortChange.next(next); }

    constructor(private _obs: Observable<T[]>) {
        super();
    }

    connect(): Observable<T[]> {
        const displayDataChanges = [
            this._filterChange,
            this._sortChange,
            this._obs
        ];

        return Observable.combineLatest(
            ...displayDataChanges,
            (filter_in: string, sort_in: Sort, input: T[]) => {
                return { data: input, filter: filter_in, sort: sort_in }
            }).map(
            (input: TableChangeData<T[]>) => {
                let data = input.data.slice().filter((item: T) => {
                    return item.contains(input.filter.toLowerCase());
                })
                if (!input.sort.active || input.sort.direction == '') {
                    return data;
                } else {
                    return data.sort((a, b) => {
                        return a.compare(b, input.sort.active, input.sort.direction);
                    });
                }

            });
    }

    disconnect() { }
}

export interface Comparable<T>{
    compare(other: T, property: string, order: string): number;
}

export interface Searchable{
    contains(needle: string): boolean;
}