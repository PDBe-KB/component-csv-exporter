import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {CsvExporterComponent} from './csv-exporter/csv-exporter.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CsvExporterComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
