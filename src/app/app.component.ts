import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // TODO add optionalData attribute
  // TODO link to proper data model
  accession: string;
  section: string;
  data: any;

  constructor() {
    this.accession = 'P12345';
    this.section = 'annotations';
    this.data = [];
  }
}
