import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Routes } from '@angular/router';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { DashboardStateService } from '../dashboard-state.service';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { SalesChartComponent } from '../sales-chart/sales-chart.component';
import { UserActivityListComponent } from '../user-activity-list/user-activity-list.component';
import { TrafficSummaryComponent } from '../traffic-summary/traffic-summary.component';
import { DataFilterComponent } from '../data-filter/data-filter.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDrop, DragDropModule } from '@angular/cdk/drag-drop';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
   let mockDashboardStateService: jasmine.SpyObj<DashboardStateService>;

 const mockState: {
  widgetVisibility: { [key: string]: boolean }; 
  currentUser: string;
  filters: {
    region: string;
    date: string;
  };
  selectedView: string;
  widgetOrder: string[];
} = {
  widgetVisibility: {
    sales: true,
    useractivity: true,
    traffic: true
  },
  currentUser: 'admin',
  filters: {
    region: '',
    date: ''
  },
  selectedView: 'sales',
  widgetOrder: ['sales', 'useractivity', 'traffic']
};
const mockRoutes: Routes = [
  { path: 'sales', component: SalesChartComponent },
  { path: 'useractivity', component: UserActivityListComponent },
  { path: 'traffic', component: TrafficSummaryComponent },
];

beforeEach(async () => {
  mockDashboardStateService = jasmine.createSpyObj('DashboardStateService', [
      'state$',
      'getWidgetOrder',
      'setWidgetOrder',
      'updateWidgetVisibility',
      'switchUser',
      'isWidgetVisible',
      'updateState'
    ]);

    mockDashboardStateService.state$ = of(mockState);
    mockDashboardStateService.getWidgetOrder.and.returnValue([
      { title: 'Sales', route: 'sales' },
      { title: 'Useractivity', route: 'useractivity' },
      { title: 'Traffic', route: 'traffic' }
    ]);
   mockDashboardStateService.isWidgetVisible.and.callFake(
  (name: string) => (mockState.widgetVisibility as { [key: string]: boolean })[name]
);

  await TestBed.configureTestingModule({
    imports: [DashboardComponent,SalesChartComponent,UserActivityListComponent,DataFilterComponent,CommonModule,FormsModule,DragDropModule,ReactiveFormsModule],
   
    providers: [
      {
        provide: DashboardStateService,
        useValue: mockDashboardStateService},
        {provide:ActivatedRoute, useValue: {
      snapshot: { paramMap: new Map() },
      params: of({}),
      queryParams: of({}),
      // add other observables or properties your component uses
    }},
         provideRouter(mockRoutes),
    ]
  }).compileComponents();
  fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
});
  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
   it('should load current user and widget visibility from state service', () => {
    expect(component.currentUser).toBe('admin');
    expect(component.isWidgetVisible('sales')).toBeTrue();
    expect(component.isWidgetVisible('traffic')).toBeTrue();
     expect(component.isWidgetVisible('useractivity')).toBeTrue();
  });

  it('should load widget order if available from state', () => {
    mockDashboardStateService.getWidgetOrder.and.returnValue([
      { title: 'Traffic', route: 'traffic' },
      { title: 'Sales', route: 'sales' }
    ]);
    component.ngOnInit();
    expect(component.widgets[0].title).toBe('Traffic');
  });

   it('should update widget visibility when toggleWidgetVisibility is called', () => {
    component.toggleWidgetVisibility('sales');
    expect(mockDashboardStateService.updateWidgetVisibility).toHaveBeenCalledWith('sales', false);
  });

  it('should toggle widget visibility from false to true', () => {
  component.currentVisibility = { useractivity: false };
  component.toggleWidgetVisibility('useractivity');
  expect(mockDashboardStateService.updateWidgetVisibility).toHaveBeenCalledWith('useractivity', true);
});

  
  it('should switch user on user change', () => {
    const mockEvent = { target: { value: 'guest' } } as any;
    component.onUserChange(mockEvent);
    expect(mockDashboardStateService.switchUser).toHaveBeenCalledWith('guest');
  });

  it('should update dashboard state when filter changes', () => {
    const filters = { region: 'north', date: '2024-12-31' };
    component.onfilterchange(filters);
    expect(mockDashboardStateService.updateState).toHaveBeenCalledWith({ filters });
  });

  it('should toggle config visibility', () => {
  const initial = component.showFilter;
  component.toggleFilterConfig();
  expect(component.showFilter).toBe(!initial);
  });
  
  it('should update widget order and call setWidgetOrder on drag-and-drop', () => {
  const event = {
    previousIndex: 0,
    currentIndex: 1
  } as any;

  const originalWidgets = [...component.widgets];
  component.onDrop(event);

  expect(mockDashboardStateService.setWidgetOrder).toHaveBeenCalledWith('admin', component.widgets);
  expect(component.widgets[0]).toEqual(originalWidgets[1]);
  });

  it('should not call setWidgetOrder if drag index does not change', () => {
  const event = { previousIndex: 1, currentIndex: 1 } as any;

  component.onDrop(event);

  expect(mockDashboardStateService.setWidgetOrder).not.toHaveBeenCalled();
});



});
