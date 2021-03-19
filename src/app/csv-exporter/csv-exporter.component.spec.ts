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

  it('sanitizeTooltip() should handle <br>', () => {
    // Test if <br> tags are changed in whitespace
    const tooltip = 'asd<br>';
    expect(component.sanitizeTooltip(tooltip)).toEqual('asd ');
  });

  it('sanitizeTooltip() should convert , to ;', () => {
    // Test if commas (,) are changed to semi-colons (;)
    const tooltip = 'foo,';
    expect(component.sanitizeTooltip(tooltip)).toEqual('foo;');
  });

  it('sanitizeTooltip() should remove a-tags', () => {
    // Test if <a> tags are correctly removed
    const tooltip = '<a href="...">bar</a>';
    expect(component.sanitizeTooltip(tooltip)).toEqual('bar;');
  });

  it('createSimilarProteinsCsv() should handle missing data', () => {
    // Test if missing data leads to empty output
    component.createSimilarProteinsCsv();
    expect(component.csvData).toEqual([]);
  });

  it('createSimilarProteinsCsv() should work with data', () => {
    // Test if headers and data are saved as intended
    const headerData = [
      'protein-name', 'uniprot-id', 'species', 'representative-pdbs',
      'coverage', 'number-of-pdbs', 'number-of-ligands',
      'number-of-complexes', 'mapped-to-pdb'];
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

  it('pushItem() should handle empty data', () => {
    // Test is missing data returns the right output
    expect(component.pushItem([], [])).toEqual(['-']);
  });

  it('pushItem() should work with correct data', () => {
    // Test if data are pushed to an array as expected
    const item = [
      {'pdb_id': '1foo', 'best_chain': 'A'},
      {'pdb_id': '2bar', 'best_chain': 'B'}
    ];
    const expected = ['1foo_A;2bar_B'];
    expect(component.pushItem(item, [])).toEqual(expected);
  });

  it('saveAsJson() should work', () => {
    // Test if the method can save JSON files with the correct file name
    component.accession = 'accession';
    component.section = 'section';
    component.data = [];
    expect(component.saveAsJson()).toEqual('accession-section.json');
  });

  it('createPublicationCsv() should handle empty data', () => {
    // Test if empty data is handled
    component.data = undefined;
    component.createPublicationCsv();
    expect(component.csvData).toEqual([]);
  });

  it('createPublicationCsv() should work when there are no PDBs', () => {
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
  });

  it('createPublicationCsv() should work with associated PDBs', () => {
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
