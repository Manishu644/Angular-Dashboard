import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DashboardState{
  selectedView:string,
  filters:{
  region:string,date:string
},
widgetOrder:string[],
widgetVisibility: {
  [widgetName: string]: any; // Track visibility per widget
};
currentUser:string;
}
@Injectable({
  providedIn: 'root'
})
export class DashboardStateService{

  constructor() { }

  private userProfiles: { [userId: string]: DashboardState['widgetVisibility'] } = {
    admin: { sales: true, useractivity: true, traffic: true },
    guest: { sales: true, useractivity: false, traffic: false },
    analyst: { sales: true, useractivity: true, traffic: false }
  };

  private defaultState:DashboardState={
    selectedView :'sales',
    filters:{
      region:'',date:''
    },
    widgetOrder: ['sales', 'useractivity', 'traffic'],
    widgetVisibility: this.userProfiles['guest'],
    currentUser:'guest'
   }
   private stateSubject = new BehaviorSubject<DashboardState>(
    this.loadStateFromLocalStorage() || this.defaultState
  );

  state$ = this.stateSubject.asObservable();  // Observable to subscribe to state changes



   // Load state from localStorage if it exists, else return default state
   private loadStateFromLocalStorage(): DashboardState | null {
    const savedState = localStorage.getItem('dashboardState');
    if (savedState) {
      return JSON.parse(savedState);
    }
    return null;
  }



  updateState(newState: Partial<DashboardState>): void {
    const updatedState = { ...this.stateSubject.value, ...newState };
    this.stateSubject.next(updatedState); // Emit the new state
    localStorage.setItem('dashboardState', JSON.stringify(updatedState));  // Persist state to localStorage
  }
 
  switchUser(userId: string): void {
    const widgetVisibility = this.userProfiles[userId] || this.defaultState.widgetVisibility;
    const newState: Partial<DashboardState> = {
      currentUser: userId,
      widgetVisibility: widgetVisibility,
      selectedView: 'sales' // Optionally reset view
    };

    this.updateState(newState);
  }
 

  getWidgetOrder(userId: string): { title: string, route: string }[] | null {
    const key = `widgetOrder_${userId}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  }

  setWidgetOrder(userId: string, widgets: { title: string }[]): void {
    const key = `widgetOrder_${userId}`;
    localStorage.setItem(key, JSON.stringify(widgets));
  }
 

  updateWidgetVisibility(widgetName: string, isVisible: boolean): void {
    const updatedVisibility = { ...this.stateSubject.value.widgetVisibility, [widgetName]: isVisible };
    this.updateState({ widgetVisibility: updatedVisibility });
  }

  // Check if a widget should be visible based on user profile and widget visibility
  isWidgetVisible(widgetName: string): boolean {
    const widgetVisibility = this.stateSubject.value.widgetVisibility;
    return widgetVisibility[widgetName] ?? false;

  }


}
