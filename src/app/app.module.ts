import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CsvExporterComponent} from './csv-exporter/csv-exporter.component';

@NgModule({
  declarations: [
    AppComponent,
    CsvExporterComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
