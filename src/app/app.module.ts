import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'

import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field"
import { FormsModule } from "@angular/forms"
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { GridUpcomingComponent } from './dvr/grid/grid.component';
import { UpcomingEntryListComponent } from './dvr/grid/entry-list/upcoming-entry-list.component';
import { DvrUpcomingEntryComponent, UpcomingEntryDialog } from './dvr/grid/entry-list/entry/upcoming-entry.component';

import { GridComponent as EpgGridComponent } from './grid/grid.component';
import { EntryListComponent } from './grid/entry-list/entry-list.component';
import { TitleListComponent } from './grid/title-list/title-list.component';
import { EntryComponent, EntryDialog } from './grid/entry-list/entry/entry.component';
import { NavigationComponent } from './navigation/navigation/navigation.component';

import { IgnoreListManagmentComponent } from './ignore-list-managment/ignore-list-managment.component';

import { NewDatePipe } from './date-from-unix-date.pipe';
import { ListNamesFilterPipe } from './list-name.pipe';
import { AboutComponent } from './about/about.component';

@NgModule({
	declarations: [
		AppComponent,

		GridUpcomingComponent,
		UpcomingEntryListComponent,
		DvrUpcomingEntryComponent,
		GridUpcomingComponent,
		UpcomingEntryDialog,

		EpgGridComponent,
		EntryListComponent,
		TitleListComponent,
		EntryDialog,
		EntryComponent,
		EntryDialog,

		IgnoreListManagmentComponent,
 		NavigationComponent,
		
		NewDatePipe,
		ListNamesFilterPipe,
		AboutComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpClientModule,
		MatButtonModule,
		MatDialogModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatSidenavModule,
		MatSnackBarModule,
		MatTabsModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
