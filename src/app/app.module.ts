import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'

import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GridComponent } from './grid/grid.component';
import { FormsModule } from '@angular/forms';
import { ListNamesFilterPipe } from './list-name.pipe';
import { ListManagmentComponent } from './list-managment/list-managment.component';
import { EntryListComponent, NewDatePipe } from './grid/entry-list/entry-list.component';
import { TitleListComponent } from './grid/title-list/title-list.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    NewDatePipe,
    ListNamesFilterPipe,
    ListManagmentComponent,
    EntryListComponent,
    TitleListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatMenuModule,
    MatSidenavModule,
    MatSnackBarModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
