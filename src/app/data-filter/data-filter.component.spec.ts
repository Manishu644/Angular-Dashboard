import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataFilterComponent } from './data-filter.component';
import { of } from 'rxjs';
import { DashboardStateService } from '../dashboard-state.service';
import { CommonModule } from '@angular/common';


describe('DataFilterComponent', () => {
  let component: DataFilterComponent;
  let fixture: ComponentFixture<DataFilterComponent>;
   let mockDashboardStateService: jasmine.SpyObj<DashboardStateService>;


   const mockState= {
    widgetVisibility: {},
    currentUser: 'testuser',
    filters: { region: 'North', date: '2025-05-01' },
    selectedView: '',
    widgetOrder: []
  };

  beforeEach(async () => {
    mockDashboardStateService = jasmine.createSpyObj('DashboardStateService', ['state$', 'updateState']);
    mockDashboardStateService.state$ = of(mockState);
    await TestBed.configureTestingModule({
      imports: [DataFilterComponent,ReactiveFormsModule,FormsModule,CommonModule],
      providers: [
        { provide: DashboardStateService, useValue: mockDashboardStateService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch form values from state on init', () => {
    expect(component.filterForm.value).toEqual(mockState.filters);
  })

   it('should emit filterChange and update state on applyFilter', () => {
    spyOn(component.filterChange, 'emit');
    component.filterForm.setValue({ region: 'East', date: '2025-05-10' });

    component.applyFilter();

    expect(mockDashboardStateService.updateState).toHaveBeenCalledWith({
      filters: { region: 'East', date: '2025-05-10' }
    });
    expect(component.filterChange.emit).toHaveBeenCalledWith({
      region: 'East',
      date: '2025-05-10'
    });
  });

  it('should clear filters and update state on clearFilter', () => {
    component.clearFilter();

    expect(component.filterForm.value).toEqual({ region: null, date: null });
    expect(mockDashboardStateService.updateState).toHaveBeenCalledWith({
      filters: { region: '', date: '' }
    });
  });
});
