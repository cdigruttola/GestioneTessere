import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core'
import { Router } from '@angular/router'
import { ObservableMedia } from '@angular/flex-layout'
import { Sort } from '@angular/material'

import { Socio } from '../model'
import { FilteredSortedDataSource, BACKEND_SERVER } from '../common'
import { SociService } from './main.service'
import { DettagliSocioComponent } from './dettagli.component'

import { MatSort, MatDialog, MatDialogRef, PageEvent, MatAnchor } from '@angular/material'

import { Subscription, fromEvent, of } from 'rxjs';
import { map } from 'rxjs/operators'

@Component({
  selector: 'soci',
  templateUrl: './main.component.html',
  styleUrls: ['../common/style.css', '../common/mainroutes.style.css', './main.component.css'],
})
export class SociComponent implements OnInit, OnDestroy {

  BACKEND_SERVER = BACKEND_SERVER;

  displayedColumns = [];
  sociSource: FilteredSortedDataSource<Socio>;
  mediaSubscription: Subscription;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sorter: MatSort;

  filename: string;
  fileurl: string;
  once = false;

  @ViewChild('downloadAnchor') anchor: MatAnchor;

  constructor(public socisrv: SociService,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private media: ObservableMedia,
    private router: Router) {
  }

  updateColumns() {
    if (this.media.isActive('lt-sm')) {
      this.displayedColumns = ['tessera', 'nome', 'cognome', 'cellulare', 'azioni'];
    } else if (this.media.isActive('lt-md')) {
      this.displayedColumns = ['tessera', 'nome', 'cognome', 'email', 'cellulare', 'azioni'];
    } else {
      this.displayedColumns = ['tessera', 'nome', 'cognome', 'email', 'carriera', 'cellulare', 'facebook', 'azioni'];
    }
  }

  ngOnInit() {
    this.socisrv.paginate = true;
    let filterObs = fromEvent(this.filter.nativeElement, 'keyup').pipe(
      map(() => this.filter.nativeElement.value)
    )
    /*
      // this code allows to use server-side ordering, faster, but doesn't work well with pagination
      let dummySort: Sort = {active: "", direction: ""};
      let dummySortObs: Observable<Sort> = of(dummySort);
      this.sociSource = new FilteredSortedDataSource(this.socisrv.getSoci(), dummySortObs, filterObs)
      this.sorter.sortChange.subscribe(
      (sortInfo: Sort) => {
          this.socisrv.orderasc = sortInfo.direction == "asc";
          this.socisrv.orderby = sortInfo.active;
          this.socisrv.getSoci();
        }
    )
    */
   
    this.sociSource = new FilteredSortedDataSource(this.socisrv.getSoci(), this.sorter.sortChange, filterObs);

    this.changeDetector.detectChanges();
    this.updateColumns();
    this.mediaSubscription = this.media.asObservable().subscribe(() => { this.updateColumns(); });
  }

  ngOnDestroy() {
    this.mediaSubscription.unsubscribe();
  }

  addSocio() {
    this.router.navigate(['tessere/new']);
  }

  editSocio(selected: Socio) {
    let diagopened: MatDialogRef<DettagliSocioComponent> = this.dialog.open(DettagliSocioComponent, {
      width: "80vw",
      data: { socio: selected }
    });
  }

  pageChange(event: PageEvent) {
    this.socisrv.index = event.pageIndex;
    this.socisrv.limit = event.pageSize;
    this.socisrv.getSoci();
  }

  togglePagination() {
    this.socisrv.paginate = !this.socisrv.paginate;
    this.socisrv.getSoci();
  }

  downloadCsv() {
    if (!this.once) {
      this.socisrv.requestCsv().subscribe(
        (file: File) => {
          this.once = true;
          this.anchor._elementRef.nativeElement.download = file.name;
          this.anchor._elementRef.nativeElement.href = URL.createObjectURL(file);
          this.anchor._elementRef.nativeElement.click();
        }
      );
      return false;
    } else {
      this.once = false;
      return true;
    }
  }
}