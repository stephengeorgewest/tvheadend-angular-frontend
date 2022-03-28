import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { UpcomingComponent } from './dvr/upcoming/upcoming.component';
import { FinishedComponent } from './dvr/finished/finished.component';
import { EpgComponent } from './epg/epg.component';
import { IgnoreListManagmentComponent } from './ignore-list-managment/ignore-list-managment.component';
export const routes: Routes = [
	// TODO: https://dev.to/brandontroberts/setting-page-titles-natively-with-the-angular-router-393j
	{ path: "grid", component: EpgComponent, data: { icon: "view_list", friendlyName: "Grid" } },
	{ path: "upcoming_recording", component: UpcomingComponent, data: {  icon: "videocam", friendlyName: "Upcoming Recordings"} },
	{ path: "finished_recording", component: FinishedComponent, data: {  icon: "save", friendlyName: "Finished Recordings"} },
	{ path: "ignore", component: IgnoreListManagmentComponent, data: { icon: "thumb_down", friendlyName: "Ignore List" } },
	{ path: "about", component: AboutComponent, data: { icon: "info", friendlyName: "About" } },

];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
