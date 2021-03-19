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
    component.section = 'section';
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
    component.createSimilarProteinsCsv();
    expect(component.csvData).toEqual([]);
    component.data = [];
    component.optionalData = {};
    component.createSimilarProteinsCsv();
    expect(component.csvData).toEqual([headerData]);
    component.data = [{
      'description': 'foo',
    }];
    component.optionalData = {};
    const expected = ['foo', '-', '-', '-', '-', '-', '-'];
    component.pushItem = function (item: any, data: any) {
      return data;
    };
    component.createSimilarProteinsCsv();
    expect(component.csvData).toEqual([headerData, expected]);
  });

  it('pushItem() should work', () => {
    const item = [
      {'pdb_id': '1foo', 'best_chain': 'A'},
      {'pdb_id': '2bar', 'best_chain': 'B'}
    ];
    const expected = ['1foo_A;2bar_B'];
    expect(component.pushItem(item, [])).toEqual(expected);
    expect(component.pushItem([], [])).toEqual(['-']);
  });

  it('saveAsJson() should work', () => {
    component.accession = 'accession';
    component.section = 'section';
    component.data = [];
    expect(component.saveAsJson()).toEqual('accession-section.json');
  });

  it('createPublicationCsv() should work', () => {
    // Test if empty data is handled
    component.data = undefined;
    component.createPublicationCsv();
    expect(component.csvData).toEqual([]);

    // Test if data with no associated PDB entries is handled
    component.data = {
      'publications': [
        {
          'pubmed_id': 'PMID 123',
          'title': 'FOO,BAR',
          'associated_pdbs': []
        }
      ]
    };
    const expectedNoPDB = [
      ['PubMed ID', 'Title'],
      ['PMID 123', 'FOO BAR']
    ];
    component.createPublicationCsv();
    expect(component.csvData).toEqual(expectedNoPDB);

    // Test if data with associated PDB entries is handled
    component.data = {
      'publications': [
        {
          'pubmed_id': 'PMID 123',
          'title': 'FOO,BAR',
          'associated_pdbs': ['1foo', '2bar']
        }
      ]
    };
    const expectedWithPDB = [
      ['PubMed ID', 'Title', 'Related PDB entries'],
      ['PMID 123', 'FOO BAR', '1foo;2bar']
    ];
    component.createPublicationCsv();
    expect(component.csvData).toEqual(expectedWithPDB);

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
      return 'createSimilarProteinsCsv';
    };
    expect(component.createOrSave('csv')).toEqual('saveCsvFile');
    expect(component.createOrSave('json')).toEqual('saveAsJson');
    expect(component.createOrSave('bibtex')).toEqual('saveBibTeXFile');
    expect(component.createOrSave('protvista')).toEqual('createProtVistaCsv');
    expect(component.createOrSave('publication')).toEqual('createPublicationCsv');
    expect(component.createOrSave('similar')).toEqual('createSimilarProteinsCsv');
    expect(component.createOrSave('')).toBeFalsy();
  });

});
