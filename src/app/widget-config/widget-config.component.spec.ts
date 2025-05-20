import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetConfigComponent } from './widget-config.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('WidgetConfigComponent', () => {
  let component: WidgetConfigComponent;
  let fixture: ComponentFixture<WidgetConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetConfigComponent,ReactiveFormsModule]
      
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetConfigComponent);
    component = fixture.componentInstance;
    component.config = {
      chartType: 'bar',
      dataRange: 'Last 7 Days'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should initialize form with input config values', () => {
    expect(component.widgetConfigForm.value).toEqual({
      chartType: 'bar',
      dataRange: 'Last 7 Days'
    });
  });


  it('should emit configChange when form values change', () => {
    spyOn(component.configChange, 'emit');
    const form = component.widgetConfigForm;
    form.controls['chartType'].setValue('line');
    form.controls['dataRange'].setValue('Last 30 days');

    expect(component.configChange.emit).toHaveBeenCalledWith({
      chartType: 'line',
      dataRange: 'Last 30 days'
    });
  });
  

  it('should validate required fields', () => {
    const form = component.widgetConfigForm;
    form.controls['chartType'].setValue('');
    form.controls['dataRange'].setValue('');
    expect(form.valid).toBeFalse();
  });

  it('should reset form and emit defaultConfig when clearWidgetConfig is called', () => {
  component.defaultConfig = {
    chartType: 'pie',
    dataRange: 'Last 1 Days'
  };

  spyOn(component.configChange, 'emit');

  component.clearWidgetConfig();

  expect(component.widgetConfigForm.value).toEqual({
    chartType: 'pie',
    dataRange: 'Last 1 Days'
  });

  expect(component.configChange.emit).toHaveBeenCalledWith({
    chartType: 'pie',
    dataRange: 'Last 1 Days'
  });
});

  



});
