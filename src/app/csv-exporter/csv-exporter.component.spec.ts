import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CsvExporterComponent} from './csv-exporter.component';

describe('CsvExporterComponent', () => {
  let component: CsvExporterComponent;
  let fixture: ComponentFixture<CsvExporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CsvExporterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvExporterComponent);
    component = fixture.componentInstance;
    component.section = 'section'
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sanitizeTooltip() should work', () => {
    let tooltip = 'asd<br>';
    expect(component.sanitizeTooltip(tooltip)).toEqual('asd ');
    tooltip = 'foo,';
    expect(component.sanitizeTooltip(tooltip)).toEqual('foo;');
    tooltip = '<a href="...">bar</a>';
    expect(component.sanitizeTooltip(tooltip)).toEqual('bar;');
  });

});
