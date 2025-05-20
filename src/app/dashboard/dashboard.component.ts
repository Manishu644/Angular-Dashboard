import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLink, RouterOutlet,Router } from '@angular/router';
import { SalesChartComponent } from '../sales-chart/sales-chart.component';
import { UserActivityListComponent } from '../user-activity-list/user-activity-list.component';
import { TrafficSummaryComponent } from '../traffic-summary/traffic-summary.component';
import { CommonModule } from '@angular/common';
import { DataService } from '../data.service';
import { DashboardStateService } from '../dashboard-state.service';
import { WidgetConfigComponent } from '../widget-config/widget-config.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataFilterComponent } from '../data-filter/data-filter.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet,DragDropModule,CommonModule,FormsModule,DataFilterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  currentUser:string='admin';
  openConfigWidget: string | null = null;
  currentVisibility: { [key: string]: boolean } = {};
  widgets = [
    { title: 'Sales', route: 'sales' },
    { title: 'Useractivity', route: 'useractivity' },
    { title: 'Traffic', route: 'traffic' }
  ];
  showFilter: boolean=false;
  constructor(private dashboardStateService: DashboardStateService,private router:Router) {}

  ngOnInit(): void {
    this.dashboardStateService.state$.subscribe(state => {
      this.currentVisibility = state.widgetVisibility;
      this.currentUser = state.currentUser;

      // Load widget order for the current user
      const userWidgets = this.dashboardStateService.getWidgetOrder(this.currentUser);
      if (userWidgets) {
        this.widgets = userWidgets;
      }
    });

    
this.router.navigate([
    {
      outlets: {
        sales: ['sales'],
        useractivity: ['useractivity'],
        traffic: ['traffic'],
        filter:['filter']
      }
    }
  ]);
   
  }

  onDrop(event: CdkDragDrop<any[]>): void {

  if(event.previousIndex != event.currentIndex){
    moveItemInArray(this.widgets, event.previousIndex, event.currentIndex);
     this.dashboardStateService.setWidgetOrder(this.currentUser, this.widgets);
  }
}
  
  isWidgetVisible(widgetName: string): boolean {
    return this.dashboardStateService.isWidgetVisible(widgetName.toLowerCase());
  }

  toggleWidgetVisibility(widgetName: string): void {
    const name = widgetName.toLowerCase();
    const current = this.currentVisibility[name];
    this.dashboardStateService.updateWidgetVisibility(name, !current);
  }

  onUserChange(event: Event): void {
    const selectedUser = (event.target as HTMLSelectElement).value;
    this.dashboardStateService.switchUser(selectedUser);
  }

toggleFilterConfig() {
    this.showFilter= !this.showFilter;
  }

  onfilterchange(filters:{region: string,date: string}):void{

  // Update the filters in the state
  this.dashboardStateService.updateState({
    filters: { ...filters },
  });

 }


  
}