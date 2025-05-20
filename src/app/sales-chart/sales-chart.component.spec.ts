import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterbydateandRegionPipe } from '../filterbydateand-region.pipe';
import { SalesChartComponent } from './sales-chart.component';
import { of } from 'rxjs';
import { DashboardStateService } from '../dashboard-state.service';
import { DataService} from '../data.service';
import { ChartType } from './sales-chart.component';

describe('SalesChartComponent', () => {
  let component: SalesChartComponent;
  let fixture: ComponentFixture<SalesChartComponent>;

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; 
   
   
   const mockSalesData = [
    { region: 'North', date: todayStr, amount: 100 },
    { region: 'South', date: '2025-05-02', amount: 200 },
    { region: 'North', date: '2025-05-15', amount: 150 }
  ];

  const mockDataService = {
    getSalesData: () => of(mockSalesData)
  };

  const mockDashboardStateService = {
    state$: of({
      filters: { region: '', date: '' }
    }),
    updateState: jasmine.createSpy('updateState')
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesChartComponent],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: DashboardStateService, useValue: mockDashboardStateService },
         FilterbydateandRegionPipe
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and filter data on init', () => {
    expect(component.sales.length).toBeGreaterThan(0);
    expect(component.chartData.labels!.length).toBeGreaterThan(0);
  });
  it('should update chart when config changes', () => {
    component.config = { chartType: 'pie', dataRange: 'Last 7 Days' };
    component.ngOnChanges({
      config: {
        currentValue: component.config,
        previousValue: null,
        isFirstChange: () => true,
        firstChange: true
      }
    });
    expect(component.currentChartType).toBe('pie');
  });

  it('should emit configChange when widget config changes', () => {
    spyOn(component.configChange, 'emit');
    const newConfig = { chartType: 'line' as ChartType, dataRange: 'Last 7 Days' };
    component.onWidgetConfigChange(newConfig);
    expect(component.configChange.emit).toHaveBeenCalledWith(newConfig);
  });

   it('should go back to region level on goBack()', () => {
    component.chartLevel = 'date';
    component.selectedRegion = 'North';
    component.goBack();
    expect(component.chartLevel).toBe('region');
    expect(component.selectedRegion).toBe('');
  });

  it('should update filters and call updateState', () => {
    component.onfilterchange({ region: 'South', date: '2025-05-02' });
    expect(mockDashboardStateService.updateState).toHaveBeenCalledWith({
      filters: { region: 'South', date: '2025-05-02' }
    });
  });

  it('should toggle config visibility', () => {
  const initial = component.showConfig;
  component.toggleConfig();
  expect(component.showConfig).toBe(!initial);
 });

 it('should fetch detailed data for a region', () => {
  component.sales = mockSalesData;
  component.fetchDetailedData('North');
  expect(component.detailedData.every(d => d.region === 'North')).toBeTrue();
});


 it('should update chart for region level', () => {
  component.chartLevel = 'region';
  component.sales = mockSalesData;
  component.updateChart();
  expect(component.chartData.labels?.length).toBeGreaterThan(0);
});

it('should update chart for date level', () => {
  component.chartLevel = 'date';
  component.selectedRegion = 'North';
  component.sales = mockSalesData;
  component.updateChart();
  expect(component.chartData.labels?.length).toBeGreaterThan(0);
});

it('should switch chart level to date on chart click', () => {
  component.chartLevel = 'region';
  component.chartData.labels = ['North'];
  component.sales= mockSalesData;
  const clickHandler = component.chartOptions?.onClick!;
  clickHandler({} as any, [{ index: 0 }] as any,{} as any);
  expect(component.chartLevel).toBe('date');
});



it('should group data by region correctly', () => {
  const grouped = component.groupBy(mockSalesData, 'region');
  expect(grouped['North']).toBe(250); 
  expect(grouped['South']).toBe(200);
});

it('should filter data for last 1 day', () => {
  component.config = { chartType: 'bar', dataRange: 'Last 1 Days' };
  component.sales= mockSalesData;
  component.updateChart();
  const labels = component.chartData.labels;
  const data = component.chartData.datasets[0].data;

  expect(labels?.length).toBe(1);
  expect(data[0]).toBe(100);
  // assert based on the filtered length
});



});
