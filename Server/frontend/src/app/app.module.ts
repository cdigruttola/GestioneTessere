﻿import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, forwardRef } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';


import { AppRoutingModule } from './app-routing.module';
import { VieweditModule } from './viewedit/viewedit.module'
import { MaterialModule } from './material.module'

import { SociComponent } from './soci/main.component'
import { AggiuntaSocioComponent } from './soci/aggiunta.component'
import { SociService } from './soci/main.service'
import { DettagliSocioComponent } from './soci/dettagli.component'

import { DirettivoComponent } from './direttivo/main.component'
import { DirettivoService } from './direttivo/main.service'
import { AggiuntaDirettivoComponent } from './direttivo/aggiunta.component'

import { CorsiComponent } from './corsi/main.component'
import { CorsiService } from './corsi/main.service'

import { TesseramentiService } from './tesseramenti/main.service'
import { TesseramentiComponent } from './tesseramenti/main.component'

import { LoginComponent } from './login/main.component'
import { LoginService, LoggedinGuard, AdminGuard } from './login/main.service'

import { ConfirmDialog, TextInputDialog, CreateCarrieraDialog, CreateTesseraDialog, MessageDialog } from './dialogs'

import { ToolbarComponent } from './toolbar.component'
import { TitleBarComponent } from './titlebar.component'


import { EqualFieldsValidatorDirective, DialogErrorHandler } from './common'

@NgModule({
  declarations: [
    AppComponent,
    SociComponent,
    DirettivoComponent,
    CorsiComponent,
    AggiuntaSocioComponent,
    DettagliSocioComponent,
    TesseramentiComponent,
    ConfirmDialog,
    TextInputDialog,
    CreateCarrieraDialog,
    CreateTesseraDialog,
    LoginComponent,
    ToolbarComponent,
    TitleBarComponent,
    AggiuntaDirettivoComponent,
    EqualFieldsValidatorDirective,
    MessageDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    VieweditModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    SociService,
    CorsiService,
    TesseramentiService,
    DirettivoService,
    LoginService,
    LoggedinGuard,
    AdminGuard,
    { provide: ErrorHandler, useClass: DialogErrorHandler }
  ],
  entryComponents: [
    AggiuntaSocioComponent,
    DettagliSocioComponent,
    ConfirmDialog,
    CreateCarrieraDialog,
    TextInputDialog,
    CreateTesseraDialog,
    AggiuntaDirettivoComponent,
    MessageDialog
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
