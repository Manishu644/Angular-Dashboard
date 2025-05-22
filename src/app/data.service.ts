import { Injectable } from '@angular/core';
import { interval, Observable,of,map, delay, shareReplay} from 'rxjs';

 export interface SalesData{
  region:string;
  amount:number;
  date:string;

 }

 export interface UserActivity{
  userId:string;
  region:string;
  date:string;
  activity:string;
  duration:number;

 }
 
 export interface TrafficData{
  date:string;
  region:string;
  traffic:number;
 }


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly regions = ['North', 'South', 'East', 'West'];
  constructor() { }

 
  getSalesData(): Observable<SalesData[]> {
    return interval(1000).pipe(
      map(() => {
        const now = new Date();
        return this.regions.map(region => {
          // Generate a random number of days ago (0–29)
          const daysAgo = Math.floor(Math.random() * 30);
          const pastDate = new Date(now);
          pastDate.setDate(now.getDate() - daysAgo);
  
          return {
            region,
            amount: Math.floor(Math.random() * 6000),
            date: pastDate.toISOString()
          };
        });
      }),
      shareReplay(1)
    );
  }
  
    // return interval(1000).pipe(
    //   map(() => [
    //     { region: 'North', amount: Math.random() * 3000, date: new Date().toISOString() },
    //     { region: 'South', amount: Math.random() * 2000, date: new Date().toISOString() },
    //     { region: 'East', amount: Math.random() * 4000, date: new Date().toISOString() },
    //     { region: 'West', amount: Math.random() * 6000, date: new Date().toISOString() },
    //   ])
    // );
  
   
  
    getUserActivity(): Observable<UserActivity[]> {
      const activities = ['Login', 'View Dashboard', 'Navigating', 'Logout'];
    
      return interval(1000).pipe(
        map(() => {
          const now = new Date();
          return this.regions.map((region, index) => {
            const daysAgo = Math.floor(Math.random() * 30);
            const pastDate = new Date(now);
            pastDate.setDate(now.getDate() - daysAgo);
    
            return {
              userId: `u${index + 1}`,
              region,
              date: pastDate.toISOString(),
              activity: activities[index % activities.length],
              duration: Math.floor(Math.random() * 60)
            };
          });
        }),
        shareReplay(1)
      );
    
    
    // return interval(1000).pipe(
    //   map(() => [
    //     { userId: 'u1', region: 'North', date: new Date().toISOString(), activity: 'Login', duration: Math.random() * 60 },
    //     { userId: 'u2', region: 'South', date: new Date().toISOString(), activity: 'View Dashboard', duration: Math.random() * 40 },
    //     { userId: 'u3', region: 'East', date: new Date().toISOString(), activity: 'Navigating', duration: Math.random() * 30 },
    //     { userId: 'u4', region: 'west', date: new Date().toISOString(), activity: 'Logout', duration: Math.random() * 45 },
    //   ])
    // );
  }

  getTrafficData(): Observable<TrafficData[]> {
    return interval(1000).pipe(
      map(() => {
        const now = new Date();
        return this.regions.map(region => {
          const daysAgo1 = Math.floor(Math.random() * 30);
         
          const date1 = new Date(now);
          
          date1.setDate(now.getDate() - daysAgo1);
          
  
          return{
              region,
              date: date1.toISOString(),
              traffic: Math.floor(Math.random() * 3000)
             };
           
        
        });
      }),
      shareReplay(1)
    );
  }
  
    // return interval(1000).pipe(
    //   map(() => [
    //     { region: 'North', date: new Date().toISOString(), traffic: Math.random() * 1200 },
    //     { region: 'South', date: new Date().toISOString(), traffic: Math.random() * 2000 },
    //     { region: 'East', date: new Date().toISOString(), traffic: Math.random() * 1400 },
    //     { region: 'West', date: new Date().toISOString(), traffic: Math.random() * 2000 },
    //     { region: 'South', date: new Date().toISOString(), traffic: Math.random() * 3500 },
    //     { region: 'North', date: new Date().toISOString(), traffic: Math.random() * 2000 },
    //     { region: 'East', date: new Date().toISOString(), traffic: Math.random() * 1300 },
    //     { region: 'West', date: new Date().toISOString(), traffic: Math.random() * 3000 },

    //   ])
    // );


  }

  

