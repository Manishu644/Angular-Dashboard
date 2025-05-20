import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataService } from '../data.service';
import { DashboardStateService } from '../dashboard-state.service';
import { FilterbydateandRegionPipe } from '../filterbydateand-region.pipe';
import { of } from 'rxjs';
import { ChartType } from '../sales-chart/sales-chart.component'; // ✅ Use local ChartType

import { TrafficSummaryComponent } from './traffic-summary.component';

describe('TrafficSummaryComponent', () => {
  let component: TrafficSummaryComponent;
  let fixture: ComponentFixture<TrafficSummaryComponent>;
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; 
   
   const mockTrafficData = [
    { region: 'North', date: todayStr, traffic: 120 },
    { region: 'South', date: '2025-05-02', traffic: 80 }
  ];

  let mockDataService: any;
  let mockDashboardStateService: any;

  beforeEach(async () => {
    

    mockDataService = {
      getTrafficData: jasmine.createSpy().and.returnValue(of(mockTrafficData))
    };

    mockDashboardStateService = {
      state$: of({ filters: { region: '', date: '' } }),
      updateState: jasmine.createSpy()
    };
    await TestBed.configureTestingModule({
      imports: [TrafficSummaryComponent,FilterbydateandRegionPipe],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: DashboardStateService, useValue: mockDashboardStateService }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load traffic data and update chart on init', () => {
    expect(component.traffic.length).toBe(2);
    expect(component.chartData.labels?.length).toBeGreaterThan(0);
  });
  it('should update chart when config changes', () => {
    component.config = { chartType: 'bar', dataRange: 'Last 7 Days' };
    component.ngOnChanges({
      config: {
        currentValue: component.config,
        previousValue: null,
        isFirstChange: () => true,
        firstChange: true
      }
    });
    expect(component.currentChartType).toBe('bar');
  });

  it('should update dashboard state when filter changes', () => {
    const filters = { region: 'North', date: '2025-05-01' };
    component.onfilterchange(filters);
    expect(mockDashboardStateService.updateState).toHaveBeenCalledWith({
      filters: { ...filters }
    });
  })

   it('should switch to region-level view on goBack', () => {
    component.chartLevel = 'date';
    component.selectedRegion = 'North';
    component.goBack();
    expect(component.chartLevel).toBe('region');
    expect(component.selectedRegion).toBe('');
  });

  it('should emit updated config when widget config changes', () => {
    spyOn(component.configChange, 'emit');
    const newConfig = { chartType: 'line' as ChartType, dataRange: 'Last 1 Days' };
    component.onWidgetConfigChange(newConfig);
    expect(component.configChange.emit).toHaveBeenCalledWith(newConfig);
  });

   it('should toggle config visibility', () => {
  const initial = component.showConfig;
  component.toggleConfig();
  expect(component.showConfig).toBe(!initial);
 });

 it('should fetch detailed data for a region', () => {
  component.traffic = mockTrafficData;
  component.fetchDetailedData('North');
  expect(component.detailedData.every(d => d.region === 'North')).toBeTrue();
});


  
 it('should update chart for region level', () => {
  component.chartLevel = 'region';
  component.traffic = mockTrafficData;
  component.updateChart();
  expect(component.chartData.labels?.length).toBeGreaterThan(0);
});

it('should update chart for date level', () => {
  component.chartLevel = 'date';
  component.selectedRegion = 'North';
  component.traffic = mockTrafficData;
  component.updateChart();
  expect(component.chartData.labels?.length).toBeGreaterThan(0);
});

it('should group data by region correctly', () => {
  const grouped = component.groupBy(mockTrafficData, 'region');
  expect(grouped['North']).toBe(120); 
  expect(grouped['South']).toBe(80);
});

it('should switch chart level to date on chart click', () => {
  component.chartLevel = 'region';
  component.chartData.labels = ['North'];
  component.traffic = mockTrafficData;
  const clickHandler = component.chartOptions?.onClick!;
  clickHandler({} as any, [{ index: 0 }] as any,{} as any);
  expect(component.chartLevel).toBe('date');
});


it('should filter data for last 1 day', () => {
  component.config = { chartType: 'bar', dataRange: 'Last 1 Days' };
  component.traffic= mockTrafficData;
  component.updateChart();
  const labels = component.chartData.labels;
  const data = component.chartData.datasets[0].data;

  expect(labels?.length).toBe(1);
  expect(data[0]).toBe(120);
  // assert based on the filtered length
});
});
