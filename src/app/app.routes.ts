import { Routes } from '@angular/router';
import { SalesChartComponent } from './sales-chart/sales-chart.component';
import { UserActivityListComponent } from './user-activity-list/user-activity-list.component';
import { TrafficSummaryComponent } from './traffic-summary/traffic-summary.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataFilterComponent } from './data-filter/data-filter.component';

export const routes: Routes = [
    {path:'', component:DashboardComponent,
        children:[
            {path:'sales', component : SalesChartComponent,outlet:'sales'},
            {path:'useractivity',component : UserActivityListComponent,outlet:'useractivity'},
            {path:'traffic', component : TrafficSummaryComponent,outlet:'traffic'},
            {path:'filter',component:DataFilterComponent,outlet:'filter'}
        ],
        
    },
    
   { path: '**', redirectTo: '' }
];
