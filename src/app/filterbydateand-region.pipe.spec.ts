import { FilterbydateandRegionPipe } from './filterbydateand-region.pipe';

describe('FilterbydateandRegionPipe', () => {
const mockData = [
    { region: 'North', date: '2025-05-15T10:00:00Z' },
    { region: 'South', date: '2025-05-14T12:00:00Z' },
    { region: 'East', date: '2025-05-15T18:30:00Z' },
    { region: 'North', date: '2025-05-13T09:15:00Z' }
  ];
  let pipe: FilterbydateandRegionPipe;


  beforeEach(() => {
    pipe = new FilterbydateandRegionPipe();
  });

  it('create an instance', () => {
    const pipe = new FilterbydateandRegionPipe();
    expect(pipe).toBeTruthy();
  });

  it('should filter by region only', () => {
    const result = pipe.transform(mockData, 'North');
    expect(result.length).toBe(2);
    expect(result.every(item => item.region === 'North')).toBeTrue();
  });

  it('should filter by date only (prefix match)', () => {
    const result = pipe.transform(mockData, '', '2025-05-15');
    expect(result.length).toBe(2);
    expect(result.every(item => item.date.startsWith('2025-05-15'))).toBeTrue();
  });

  it('should filter by both region and date', () => {
    const result = pipe.transform(mockData, 'North', '2025-05-15');
    expect(result.length).toBe(1);
    expect(result[0].region).toBe('North');
    expect(result[0].date.startsWith('2025-05-15')).toBeTrue();
  });

   it('should return empty array if no match found', () => {
    const result = pipe.transform(mockData, 'West', '2025-01-01');
    expect(result.length).toBe(0);
  });

  it('should return empty array if input is null or undefined', () => {
    expect(pipe.transform(null as any)).toEqual([]);
    expect(pipe.transform(undefined as any)).toEqual([]);
  });  



});
