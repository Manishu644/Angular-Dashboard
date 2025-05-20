import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartType } from '../sales-chart/sales-chart.component';


@Component({
  selector: 'app-widget-config',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './widget-config.component.html',
  styleUrl: './widget-config.component.css'
})
export class WidgetConfigComponent {
 @Input() config: any;
 @Input() defaultConfig!: { chartType: ChartType; dataRange: string };
 @Output() configChange=new EventEmitter< { chartType: ChartType; dataRange: string }>();


 chartTypes: string[] = ['bar', 'line', 'pie','doughnut','polarArea'];
 dataRanges: string[] = ['Last 1 Days', 'Last 7 Days', 'Last 30 days'];
 widgetConfigForm:FormGroup;
 constructor(private fb: FormBuilder) {
   this.widgetConfigForm = this.fb.group({
     chartType: ['bar', Validators.required],  // Example configuration option
     dataRange: ['Last 7 Days', Validators.required]
   });
 }

  //fetchs the initial state from component and emits the changes 
 ngOnInit(): void {
  if (this.config) {
    this.widgetConfigForm.patchValue(this.config);  // Set initial form values based on existing config
  }

  this.widgetConfigForm.valueChanges.subscribe((value) => {
    this.configChange.emit(value);
  });
  
}

 //on clearing configuration sets to default 
clearWidgetConfig():void{

  this.widgetConfigForm.reset(this.defaultConfig);   // Reset form values
  this.configChange.emit(this.defaultConfig);   

}

}
