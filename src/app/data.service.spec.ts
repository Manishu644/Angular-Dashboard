import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { delay, take } from 'rxjs';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate sales data as observable with expected fields', (done) => {
    service.getSalesData().pipe(
      take(1),
      delay(1000) // Delay to simulate the interval
    ).subscribe(data => {
      expect(data).toBeDefined();
      expect(data.length).toBe(4); // 4 regions
      expect(data[0]).toEqual(jasmine.objectContaining({
        region: jasmine.any(String),
        amount: jasmine.any(Number),
        date: jasmine.any(String)
      }));
      done(); // Ensure the test finishes after the observable emits
    });
  });
  
  it('should generate user activity data as observable with expected fields', (done) => {
    service.getUserActivity().pipe(
      take(1),
      delay(1000)
    ).subscribe(data => {
      expect(data).toBeDefined();
      expect(data.length).toBe(4); // 4 regions
      expect(data[0]).toEqual(jasmine.objectContaining({
        userId: jasmine.any(String),
        region: jasmine.any(String),
        date: jasmine.any(String),
        activity: jasmine.any(String),
        duration: jasmine.any(Number)
      }));
      done();
    });
  });

  it('should generate traffic data as observable with expected fields', (done) => {
    service.getTrafficData().pipe(
      take(1),
      delay(1000)
    ).subscribe(data => {
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0); // The length should be > 0 since we're generating traffic data for regions
      expect(data[0]).toEqual(jasmine.objectContaining({
        region: jasmine.any(String),
        date: jasmine.any(String),
        traffic: jasmine.any(Number)
      }));
      done();
    });
  });

});


