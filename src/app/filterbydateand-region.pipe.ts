import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { SalesData, UserActivity } from './data.service';

@Pipe({
  name: 'filterbydateandRegion',
  standalone: true,
 
})
@Injectable({ providedIn: 'root' })
export class FilterbydateandRegionPipe implements PipeTransform {

  transform<T extends { region: string, date: string }>(
    data: T[], region?: string, date?: string
  ): T[] {
    
    if (!data) return [];
    return data.filter(item => {
      const regionMatch = region ? item.region.toLowerCase().includes(region.toLowerCase()) : true;
      const dateMatch = date ? item.date.startsWith(date) : true;
      return regionMatch && dateMatch;
    });
  }

}

