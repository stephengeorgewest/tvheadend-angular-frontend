import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridComponent } from './grid/grid.component';
import { IgnoreListManagmentComponent } from './ignore-list-managment/ignore-list-managment.component';

export const routes: Routes = [
	{ path: "grid", component: GridComponent, data: { icon: "view_list", friendlyName: "Grid" } },
	//{ path: "recording", component: GridComponent, data: {  icon: "save", friendlyName: "Recordings"} }},
	{ path: "ignore", component: IgnoreListManagmentComponent, data: { icon: "thumb_down", friendlyName: "Ignore List" } },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
