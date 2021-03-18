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

  it('createSimilarProteinsCsv() should work', () => {
    const headerData = [
      'protein-name', 'uniprot-id', 'species', 'representative-pdbs',
      'coverage', 'number-of-pdbs', 'number-of-ligands',
      'number-of-complexes', 'mapped-to-pdb'];
    expect(component.createSimilarProteinsCsv()).toBeFalsy();
    component.data = [];
    component.optionalData = {};
    expect(component.createSimilarProteinsCsv()).toEqual([headerData]);
    component.data = [{
      'description': 'foo',
    }];
    component.optionalData = {};
    const expected = ['foo', '-', '-', '-', '-', '-', '-'];
    component.pushItem = function(item: any, data: any) {return data; };
    expect(component.createSimilarProteinsCsv()).toEqual([headerData, expected]);
  });

  it('createOrSave() should work', () => {
    component.saveCsvFile = function () {
      return 'saveCsvFile';
    };
    component.saveAsJson = function () {
      return 'saveAsJson';
    };
    component.saveBibTeXFile = function () {
      return 'saveBibTeXFile';
    };
    component.createProtVistaCsv = function () {
      return 'createProtVistaCsv';
    };
    component.createPublicationCsv = function () {
      return 'createPublicationCsv';
    };
    component.createSimilarProteinsCsv = function () {
      return ['createSimilarProteinsCsv'];
    };
    expect(component.createOrSave('csv')).toEqual('saveCsvFile');
    expect(component.createOrSave('json')).toEqual('saveAsJson');
    expect(component.createOrSave('bibtex')).toEqual('saveBibTeXFile');
    expect(component.createOrSave('protvista')).toEqual('createProtVistaCsv');
    expect(component.createOrSave('publication')).toEqual('createPublicationCsv');
    expect(component.createOrSave('similar')).toEqual(['createSimilarProteinsCsv']);
    expect(component.createOrSave('')).toBeFalsy();
  });

});
