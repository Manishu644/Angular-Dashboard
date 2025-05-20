import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SalesChartComponent } from './sales-chart/sales-chart.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Interactive-Dashboard';
}
