import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth.guard';

import { AboutComponent } from './about/about.component';
import { UpcomingComponent } from './dvr/upcoming/upcoming.component';
import { FinishedComponent } from './dvr/finished/finished.component';
import { EpgComponent } from './epg/epg.component';
import { IgnoreListManagmentComponent } from './ignore-list-managment/ignore-list-managment.component';
import { InputComponent } from './status/input/input.component';
import { SubscriptionsComponent } from './status/subscriptions/subscriptions.component';
import { ConnectionsComponent } from './status/connections/connections.component';

export const routes: Routes = [
	{
		path: "grid",
		component: EpgComponent,
		data: { icon: "view_list", friendlyName: "Grid" }
	},
	{
		path: "upcoming_recording",
		component: UpcomingComponent,
		data: { icon: "videocam", friendlyName: "Upcoming Recordings", guard: "dvr" },
		canActivate: [AuthGuard]
	},
	{
		path: "finished_recording",
		component: FinishedComponent,
		data: { icon: "save", friendlyName: "Finished Recordings", guard: "dvr" },
		canActivate: [AuthGuard]
	},
	{
		path: "stream",
		component: InputComponent,
		data: { icon: "insights", friendlyName: "Streams", guard: "admin" },
		canActivate: [AuthGuard]
	},
	{
		path: "subscriptions",
		component: SubscriptionsComponent,
		data: { icon: "hub", friendlyName: "Subscriptions", guard: "admin" },
		canActivate: [AuthGuard]
	},
	{
		path: "connections",
		component: ConnectionsComponent,
		data: { icon: "settings_ethernet", friendlyName: "Connections", guard: "admin" },
		canActivate: [AuthGuard]
	},
	{
		path: "ignore",
		component: IgnoreListManagmentComponent,
		data: { icon: "thumb_down", friendlyName: "Ignore List" }
	},
	{
		path: "about",
		component: AboutComponent,
		data: { icon: "info", friendlyName: "About" }
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
