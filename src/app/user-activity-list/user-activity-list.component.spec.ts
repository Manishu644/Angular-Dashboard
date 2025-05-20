import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataService, UserActivity } from '../data.service';
import { of } from 'rxjs';
import { FilterbydateandRegionPipe } from '../filterbydateand-region.pipe';
import { DashboardStateService } from '../dashboard-state.service';
import { ChartType } from '../sales-chart/sales-chart.component';
import { ChangeDetectorRef } from '@angular/core';
import { UserActivityListComponent } from './user-activity-list.component';

describe('UserActivityListComponent', () => {
  let component: UserActivityListComponent;
  let fixture: ComponentFixture<UserActivityListComponent>;
  let mockDataService: any;
  let mockDashboardStateService: any;

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'


  const mockActivities: UserActivity[] = [
    { userId: '1', region: 'North', date: todayStr,activity:'login', duration: 10 },
    { userId: '2', region: 'South', date: '2025-05-14',activity:'navigating', duration: 20 },
    { userId: '3', region: 'North', date: '2025-05-14',activity:'logout', duration: 15 }
  ];

  beforeEach(async () => {
     mockDataService = {
      getUserActivity: jasmine.createSpy().and.returnValue(of(mockActivities))
    };

   mockDashboardStateService = {
      state$: of({ filters: { region: '', date: '' } }),
      updateState: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      imports: [UserActivityListComponent], providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: DashboardStateService, useValue: mockDashboardStateService },
        FilterbydateandRegionPipe,
        ChangeDetectorRef
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and fetch user activities', () => {
    expect(component.activities.length).toBe(3);
   expect(component.chartData.labels?.length).toBeGreaterThan(0);
     expect(mockDataService.getUserActivity).toHaveBeenCalled();
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
    const newConfig = { chartType: 'bar' as ChartType, dataRange: 'Last 1 Days' };
    component.onWidgetConfigChange(newConfig);
    expect(component.configChange.emit).toHaveBeenCalledWith(newConfig);
  });

  it('should toggle config visibility', () => {
  const initial = component.showConfig;
  component.toggleConfig();
  expect(component.showConfig).toBe(!initial);
});

it('should fetch detailed data for a region', () => {
  component.activities = mockActivities;
  component.fetchDetailedData('North');
  expect(component.detailedData.every(d => d.region === 'North')).toBeTrue();
});

it('should update chart for region level', () => {
  component.chartLevel = 'region';
  component.activities = mockActivities;
  component.updateChart();
  expect(component.chartData.labels?.length).toBeGreaterThan(0);
});

it('should update chart for date level', () => {
  component.chartLevel = 'date';
  component.selectedRegion = 'North';
  component.activities = mockActivities;
  component.updateChart();
  expect(component.chartData.labels?.length).toBeGreaterThan(0);
});

it('should group data by region correctly', () => {
  const grouped = component.groupBy(mockActivities, 'region');
  expect(grouped['North']).toBe(25); // 10 + 15
  expect(grouped['South']).toBe(20);
});

it('should switch chart level to date on chart click', () => {
  component.chartLevel = 'region';
  component.chartData.labels = ['North'];
  component.activities = mockActivities;
  const clickHandler = component.chartOptions?.onClick!;
  clickHandler({} as any, [{ index: 0 }] as any,{} as any);
  expect(component.chartLevel).toBe('date');
});

it('should filter data for last 1 day', () => {
  component.config = { chartType: 'bar', dataRange: 'Last 1 Days' };
  component.activities = mockActivities;
  component.updateChart();
  const labels = component.chartData.labels;
  const data = component.chartData.datasets[0].data;

  expect(labels?.length).toBe(1);
  expect(data[0]).toBe(10);
  // assert based on the filtered length
});


  
});
