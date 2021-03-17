import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-csv-exporter',
  templateUrl: './csv-exporter.component.html',
  styleUrls: ['./csv-exporter.component.css']
})
export class CsvExporterComponent {

  @Input() data: any;
  @Input() optionalData: any;
  @Input() accession: string;
  @Input() section: string;
  @Input() category: string;
  csvData: any;
  bibData: any;
  downloadType: string;

  constructor() {
    this.csvData = [];
    this.bibData = [];
  }

  getSectionId() {
    return this.section.split(' ').join('_').toLowerCase();
  }

  setDownloadType(type: string) {
    this.downloadType = type;
    this.createCsv();
    if (this.category === 'publication') {
      this.createBibTeX();
    }
  }

  saveData() {
    if (this.downloadType === 'csv') {
      this.saveCsvFile();
    } else if (this.downloadType === 'json') {
      this.saveAsJson();
    } else if (this.downloadType === 'bibtex') {
      this.saveBibTeXFile();
    }
  }

  saveAsJson() {
    const filename = this.accession + '-' + this.section + '.json';
    const jsonStr = JSON.stringify(this.data);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  createCsv() {
    if (this.category === 'protvista') {
      this.createProtVistaCsv();
    } else if (this.category === 'publication') {
      this.createPublicationCsv();
    } else if (this.category === 'similar') {
      this.createSimilarProteinsCsv();
    }
  }

  createSimilarProteinsCsv() {
    const csvData = [];
    csvData.push([
      'protein-name', 'uniprot-id', 'species', 'representative-pdbs',
      'coverage', 'number-of-pdbs', 'number-of-ligands',
      'number-of-complexes', 'mapped-to-pdb']);
    const optionalData = this.optionalData;
    this.data.forEach(function (item) {
      const csvRow = [];
      csvRow.push(item.description ? item.description : '-');
      csvRow.push(item.uniprot_id ? item.uniprot_id : '-');
      csvRow.push(item.species ? item.species : '-');
      if (item.representative_pdbs && item.representative_pdbs.length > 0) {
        const pdbRow = [];
        item.representative_pdbs.forEach(function (pdb) {
          pdbRow.push(pdb.pdb_id + '_' + pdb.best_chain);
        });
        csvRow.push(pdbRow.join(';'));
      } else {
        csvRow.push('-');
      }
      csvRow.push(item.coverage ? item.coverage : '-');
      csvRow.push(optionalData[item.uniprot_id] ? optionalData[item.uniprot_id]['pdbs'] : '-');
      csvRow.push(optionalData[item.uniprot_id] ? optionalData[item.uniprot_id]['ligands'] : '-');
      csvRow.push(optionalData[item.uniprot_id] ? optionalData[item.uniprot_id]['interaction_partners'] : '-');
      if (item.mapped_segment.length > 0) {
        const pdbRow = [];
        item.mapped_segment.forEach(function (pdb) {
          pdbRow.push(pdb.pdb_id + '_' + pdb.best_chain);
        });
        csvRow.push(pdbRow.join(';'));
      } else {
        csvRow.push('-');
      }
      csvData.push(csvRow);
    });
    this.csvData = csvData;
  }

  createProtVistaCsv() {
    const csvData = [];
    csvData.push(['accession', 'type', 'label', 'start', 'end', 'notes']);
    const tracks = this.data['tracks'];
    for (let i = 0; i < tracks.length; i++) {
      for (let j = 0; j < tracks[i]['data'].length; j++) {
        const label = tracks[i]['data'][j]['accession'];
        const type = tracks[i]['label'];
        for (let k = 0; k < tracks[i]['data'][j]['locations'].length; k++) {
          for (let l = 0; l < tracks[i]['data'][j]['locations'][k]['fragments'].length; l++) {
            const csvRow = [];
            csvRow.push(this.accession);
            csvRow.push(type);
            csvRow.push(label);
            csvRow.push(tracks[i]['data'][j]['locations'][k]['fragments'][l]['start']);
            csvRow.push(tracks[i]['data'][j]['locations'][k]['fragments'][l]['end']);
            const rawTooltip = tracks[i]['data'][j]['locations'][k]['fragments'][l]['tooltipContent'];
            csvRow.push(this.sanitizeTooltip(rawTooltip));
            csvData.push(csvRow);
          }
        }
      }
    }
    this.csvData = csvData;
  }

  createPublicationCsv() {
    const csvData = [];
    if (this.data['publications'][0]['associated_pdbs'].length > 0) {
      csvData.push(['PubMed ID', 'Title', 'Related PDB entries']);
    } else {
      csvData.push(['PubMed ID', 'Title']);
    }

    this.data['publications'].forEach(function (row) {
      const csvRow = [];
      csvRow.push(row['pubmed_id']);
      csvRow.push(row['title'].replace(/,/g, ' '));
      if (row['associated_pdbs'].length > 0) {
        csvRow.push(row['associated_pdbs'].join(';'));
      }
      csvData.push(csvRow);
    });
    this.csvData = csvData;
  }

  createBibTeX() {
    const bibData = [];
    this.data['publications'].forEach(function (publication) {
      bibData.push('@article {' + publication['pubmed_id'] + ',');
      bibData.push('\tTitle = {' + publication['title'] + '},');
      if (publication['doi']) {
        bibData.push('\tDOI = {' + publication['doi'] + '},');
      }
      bibData.push('}\n');
    });
    this.bibData = bibData;
  }

  sanitizeTooltip(tooltip: string) {
    if (tooltip) {
      tooltip = tooltip.replace(/<br>/g, ' ');
      tooltip = tooltip.replace(/,/g, ';');
      tooltip = tooltip.replace(/<a.*?>/, '');
      tooltip = tooltip.replace(/<a.*?>/, '');
      tooltip = tooltip.replace(/<\/a>/g, ';');
    }
    return tooltip;
  }

  saveBibTeXFile() {
    let fileContent = '';
    const data = this.bibData;
    data.forEach(function (dataString, index) {
      fileContent += index < data.length ? dataString + '\n' : dataString;
    });
    const fileName = this.accession + '-' + this.section + '.bib';
    this.downloadFile(fileContent, fileName, 'text/csv;encoding:utf-8');
  }

  saveCsvFile() {
    // Building the CSV from the Data two-dimensional array
    // Each column is separated by ";" and new line "\n" for next row
    let csvContent = '';
    const data = this.csvData;
    data.forEach(function (infoArray, index) {
      const dataString = infoArray.join(',');
      csvContent += index < data.length ? dataString + '\n' : dataString;
    });

    // The download function takes a CSV string, the filename and mimeType as parameters
    // Scroll/look down at the bottom of this snippet to see how download is called
    const fileName = this.accession + '-' + this.section + '.csv';
    this.downloadFile(csvContent, fileName, 'text/csv;encoding:utf-8');
  }

  downloadFile(content, fileName, mimeType) {
    const a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';

    if (navigator.msSaveBlob) { // IE10
      navigator.msSaveBlob(new Blob([content], {
        type: mimeType
      }), fileName);
    } else if (URL && 'download' in a) { // html5 A[download]
      a.href = URL.createObjectURL(new Blob([content], {
        type: mimeType
      }));
      a.setAttribute('download', fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
    }
  }

}
