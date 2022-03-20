import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridUpcomingComponent } from './dvr/grid/grid.component';
import { GridComponent as EpgGridComponent } from './grid/grid.component';
import { IgnoreListManagmentComponent } from './ignore-list-managment/ignore-list-managment.component';

export const routes: Routes = [
	{ path: "grid", component: EpgGridComponent, data: { icon: "view_list", friendlyName: "Grid" } },
	{ path: "upcoming_recording", component: GridUpcomingComponent, data: {  icon: "videocam", friendlyName: "Upcoming Recordings"} },
	{ path: "ignore", component: IgnoreListManagmentComponent, data: { icon: "thumb_down", friendlyName: "Ignore List" } },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
