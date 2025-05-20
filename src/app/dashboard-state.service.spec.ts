import { TestBed } from '@angular/core/testing';

import { DashboardStateService } from './dashboard-state.service';

describe('DashboardStateService', () => {
  let service: DashboardStateService;

  beforeEach(() => {
    localStorage.removeItem('dashboardState'); 
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardStateService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default guest state if no localStorage', (done) => {
    service.state$.subscribe(state => {
      expect(state.currentUser).toBe('guest');
      expect(state.widgetVisibility['sales']).toBeTrue();
      expect(state.widgetVisibility['useractivity']).toBeFalse();
      expect(state.selectedView).toBe('sales');
      done();
    });
  });

  it('should set correct widget visibility for admin user', (done) => {
    service.switchUser('admin');
    
    service.state$.subscribe(state => {
      expect(state.currentUser).toBe('admin');
      expect(state.widgetVisibility['sales']).toBeTrue();
      expect(state.widgetVisibility['useractivity']).toBeTrue();
      expect(state.widgetVisibility['traffic']).toBeTrue();
      done();
    });
  });

  it('should return correct visibility from isWidgetVisible()', () => {
    service.switchUser('analyst');

    expect(service.isWidgetVisible('sales')).toBeTrue();
    expect(service.isWidgetVisible('useractivity')).toBeTrue();
    expect(service.isWidgetVisible('traffic')).toBeFalse();
  });

  it('should check if a widget is visible', () => {
    service.switchUser('guest');
    expect(service.isWidgetVisible('sales')).toBeTrue();
    expect(service.isWidgetVisible('useractivity')).toBeFalse();
    expect(service.isWidgetVisible('traffic')).toBeFalse();
  });

  it('should persist state to localStorage when updated', () => {
    service.updateState({ selectedView: 'useractivity' });
    const stored = localStorage.getItem('dashboardState');
    expect(stored).toContain('"selectedView":"useractivity"');
  });


   it('should store widget order in localStorage for a user', () => {
    const userId = 'testuser';
    const testOrder = [
      { title: 'traffic', route: './traffic' },
      { title: 'sales', route: './sales' }
    ];

    const setItemSpy = spyOn(localStorage, 'setItem').and.callThrough();

    service.setWidgetOrder(userId, testOrder);

    const stored = localStorage.getItem(`widgetOrder_${userId}`);
    expect(stored).toEqual(JSON.stringify(testOrder));

    const expectedKey = `widgetOrder_${userId}`;
    const expectedValue = JSON.stringify(testOrder);

   
    expect(setItemSpy).toHaveBeenCalledWith(expectedKey, expectedValue);

    const retrieved = service.getWidgetOrder(userId);
    expect(retrieved).toEqual(testOrder);
  });
  
  it('should return null if widget order is not set for user', () => {
  expect(service.getWidgetOrder('notExistingUser')).toBeNull();
  });
  
  it('should handle setting empty widget order', () => {
  const userId = 'emptyUser';
  const emptyOrder: any[] = [];

  service.setWidgetOrder(userId, emptyOrder);
  const stored = localStorage.getItem(`widgetOrder_${userId}`);
  expect(stored).toEqual(JSON.stringify(emptyOrder));

  const retrieved = service.getWidgetOrder(userId);
  expect(retrieved).toEqual(emptyOrder);
});

  it('should update widget visibility correctly', (done) => {
  const widgetName = 'sales';
  const isVisible = false;

  service.updateWidgetVisibility(widgetName, isVisible);
  service.state$.subscribe(state => {
    expect(state.widgetVisibility[widgetName]).toBeFalse();
    const storedState = JSON.parse(localStorage.getItem('dashboardState')!);
    expect(storedState.widgetVisibility[widgetName]).toBeFalse();
    done();
  });
});

it('should update widget visibility to true correctly', (done) => {
  const widgetName = 'traffic';
  const isVisible = true;

  service.updateWidgetVisibility(widgetName, isVisible);

  service.state$.subscribe(state => {
    expect(state.widgetVisibility[widgetName]).toBeTrue();
    const storedState = JSON.parse(localStorage.getItem('dashboardState')!);
    expect(storedState.widgetVisibility[widgetName]).toBeTrue();
    done();
  });
});

it('should load state from localStorage if present', (done) => {
    const mockState = {
      selectedView: 'traffic',
      filters: { region: 'north', date: '2025-05-01' },
      widgetOrder: ['traffic', 'sales'],
      widgetVisibility: { sales: true, useractivity: false, traffic: true },
      currentUser: 'admin'
    };

    localStorage.setItem('dashboardState', JSON.stringify(mockState));

    // Re-initialize to trigger loading from localStorage
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const serviceWithMock = TestBed.inject(DashboardStateService);

    serviceWithMock.state$.subscribe(state => {
      expect(state).toEqual(mockState);
      done();
    });
  });


});
