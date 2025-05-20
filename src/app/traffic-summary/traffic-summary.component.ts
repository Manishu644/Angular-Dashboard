import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DataService, TrafficData } from '../data.service';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { FilterbydateandRegionPipe } from '../filterbydateand-region.pipe';
import { DataFilterComponent } from '../data-filter/data-filter.component';
import { DashboardStateService } from '../dashboard-state.service';
import { ChartType } from '../sales-chart/sales-chart.component';
import { WidgetConfigComponent } from '../widget-config/widget-config.component';
import { differenceInDays, parseISO } from 'date-fns';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-traffic-summary',
  imports: [CommonModule,NgChartsModule,FilterbydateandRegionPipe,WidgetConfigComponent,FormsModule],
  templateUrl: './traffic-summary.component.html',
  styleUrl: './traffic-summary.component.css'
})
export class TrafficSummaryComponent implements OnInit,OnChanges{
  @Input() config: { chartType: ChartType; dataRange: string }=  { chartType: 'line', dataRange: 'Last 30 Days' };
  @Output() configChange = new EventEmitter<{ chartType: ChartType; dataRange: string }>();
  traffic: TrafficData[] = [];
  selectedRegion: string='';
  selectedDate:string='';
  filtredData:TrafficData[]=[]
   detailedData: TrafficData[] = [];
    chartLevel: 'region' | 'date' = 'region';
    currentChartType: ChartType = 'line';
    showConfig: boolean = false;
    showFilteredData:boolean=false;
      showDetailedData:boolean=false;

@ViewChild(BaseChartDirective) chart?: BaseChartDirective;
constructor(private dataService: DataService,private dashboardStateService:DashboardStateService,private cdr:ChangeDetectorRef) {}
private filterPipe = inject(FilterbydateandRegionPipe);
chartData: ChartConfiguration<ChartType>['data'] = {
  labels: [],
  datasets: [
    {
      data: [],
      label: 'Sales',
      backgroundColor: [
        '#4CAF50', // Green
        '#2196F3', // Blue
        '#FFC107', // Amber
        '#FF5722'  // Deep Orange
      ],
      borderColor: '#1976D2',
      borderWidth: 2,
      hoverBackgroundColor: 'rgba(154, 229, 247, 0.9)',
      hoverBorderColor: '#0D47A1',
      borderRadius: 8,
      barPercentage: 0.6,
      categoryPercentage: 0.5
    }
  ]
};

chartOptions: ChartConfiguration<ChartType>['options'] = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: '#444',
        font: {
          size: 13,
          weight: '600'
        },
        boxWidth: 20,
        padding: 15
      }
    },
    tooltip: {
      enabled: true,
      backgroundColor: '#2d2d2d',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: {
        color: '#eee'
      },
      ticks: {
        color: '#555',
        font: {
          size: 12
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#f0f0f0'
      },
      ticks: {
        color: '#555',
        font: {
          size: 12
        }
      }
    }
  },
  animation: {
    duration: 800,
    easing: 'easeOutQuart'
  },
  onClick: (event, elements) => {
    if (elements.length > 0) {
      const idx = elements[0].index;
      if (this.chartLevel === 'region') {
        const region = this.chartData.labels?.[idx] as string;
        this.selectedRegion = region;
        this.chartLevel = 'date';
        this.updateChart();
        this.fetchDetailedData(region);
      }
    }
  }
};



  ngOnInit() {
    this.dashboardStateService.state$.subscribe((state) => 
      {
        this.selectedRegion= state.filters.region;
        this.selectedDate= state.filters.date;
        this.updateChart();
      })


    this.dataService.getTrafficData().subscribe((data)=>{
    this.traffic= data;
    this.updateChart();
    }

    );

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']?.currentValue) {
      this.currentChartType = this.config.chartType;
      this.updateChart();  // Ensure chart updates when config changes
    }
  
  }
  onfilterchange(filters:{region:string,date:string}){
    this.dashboardStateService.updateState({
      filters: { ...filters },
    });
  }
   
  updateChart(){

    let filtered= this.filterPipe.transform(this.traffic,this.selectedRegion,this.selectedDate);
   
    const today = new Date();
        let days = 30;
        if (this.config.dataRange === 'Last 1 Days') {
          days = 1;
        } else if (this.config.dataRange === 'Last 7 Days') {
          days = 7;
        } else if (this.config.dataRange === 'Last 30 Days') {
          days = 30;
        }
        
            filtered = filtered.filter(activity => {
              const activityDate = parseISO(activity.date);
              return differenceInDays(today, activityDate) <= days;
            });
        


    if (this.chartLevel === 'region') {
      const grouped = this.groupBy(filtered, 'region');
      this.chartData.labels = Object.keys(grouped);
      this.chartData.datasets[0].data = Object.values(grouped);
      this.chartData.datasets[0].label = 'Sales by Region';
    } else {
      const regionSales = filtered.filter((item) => item.region === this.selectedRegion);
      const grouped = this.groupBy(regionSales, 'date');
      this.chartData.labels = Object.keys(grouped);
      this.chartData.datasets[0].data = Object.values(grouped);
      this.chartData.datasets[0].label = `Sales for ${this.selectedRegion}`;
    }
    this.currentChartType = this.config.chartType;
    this.chartData.datasets[0].type = this.currentChartType;
    this.cdr.detectChanges();
    
   
    
    this.chart?.update();

  }

  groupBy(data: TrafficData[], key: 'region' | 'date'): Record<string, number> {
         const groupedData: Record<string, number> = {};

  for (const item of data) {
    const value = item[key];
    groupedData[value] = (groupedData[value] || 0) + item.traffic;
  }

  return groupedData;
  }

      // Go back to the region-level view
    goBack(): void {
      this.chartLevel = 'region';
      this.selectedRegion = '';
      this.updateChart();
    }
   
  
  fetchDetailedData(region: string): void {
    this.detailedData = this.traffic.filter(item => item.region === region);
    console.log('Detailed Data:', this.detailedData);
    this.cdr.detectChanges();
  }
  onWidgetConfigChange(updatedConfig: { chartType: ChartType; dataRange: string }): void {
    this.config = updatedConfig;
    this.configChange.emit(this.config);
    this.updateChart();
  }

  toggleConfig() {
    this.showConfig = !this.showConfig;
  }


}
