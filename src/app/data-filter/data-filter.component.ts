import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardStateService } from '../dashboard-state.service';

@Component({
  selector: 'app-data-filter',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './data-filter.component.html',
  styleUrl: './data-filter.component.css'
})
export class DataFilterComponent implements OnInit{
  filterForm: FormGroup;
  
  selectedregion:string='';
  selecteddate:string='';

  @Output() filterChange= new EventEmitter<{region:string,date: string}>();

  constructor(private fb: FormBuilder,private dashboardSateService:DashboardStateService) {
    this.filterForm = this.fb.group({
      region: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Optionally, pre-fill the form with the current state from the service
    this.dashboardSateService.state$.subscribe((state)=>{
     this.filterForm.patchValue(state.filters);
    });
  }

  applyFilter(): void {
    const filters= this.filterForm.value;

    //update the state with filters 
    this.dashboardSateService.updateState({filters:filters});
     this.filterChange.emit(this.filterForm.value);
  }

  clearFilter(): void {
    this.filterForm.reset();
   this.dashboardSateService.updateState({filters:{region:'',date:''}})
   
  }

}
