PDBe-KB CSV Exporter
=

[![Build Status](https://www.travis-ci.com/PDBe-KB/component-csv-exporter.svg?branch=main)](https://www.travis-ci.com/PDBe-KB/component-csv-exporter)
[![codecov](https://codecov.io/gh/PDBe-KB/component-csv-exporter/branch/main/graph/badge.svg?token=SADIB9IIC1)](https://codecov.io/gh/PDBe-KB/component-csv-exporter)
[![Maintainability](https://api.codeclimate.com/v1/badges/32945c274a482e312448/maintainability)](https://codeclimate.com/github/PDBe-KB/component-csv-exporter/maintainability)

This is the repository of a lightweight Angular 7 web component that allows the users to download data in CSV, JSON and BibTeX formats.

The component is used on the PDBe-KB Aggregated Views of Proteins.
### Example:

<img src="https://raw.githubusercontent.com/PDBe-KB/component-csv-exporter/main/pdbe-kb-csv-exporter.png">

## Quick Start

Get the code and install dependencies
```
git clone https://github.com/PDBe-KB/component-csv-exporter.git
cd component-csv-exporter
npm i
```

Running the app
```
ng serve
```

Running tests
```
ng test
```

## Dependencies

The main template should also have the following CSS import:
```angular2html
<link rel="stylesheet" href="https://ebi.emblstatic.net/web_guidelines/EBI-Framework/v1.3/css/ebi-global.css" type="text/css" media="all"/>
<link rel="stylesheet" href="https://ebi.emblstatic.net/web_guidelines/EBI-Icon-fonts/v1.3/fonts.css" type="text/css" media="all"/>
<link rel="stylesheet" href="https://ebi.emblstatic.net/web_guidelines/EBI-Framework/v1.3/css/theme-pdbe-green.css" type="text/css" media="all"/>
```

## Basic usage

The component can be added to any Angular7+ apps.

Import the component (e.g. in app.module.ts):
```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CsvExporterComponent } from './csv-exporter/csv-exporter.component';

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
export class AppModule { }
```

Adding the component to a template:
```angular2html
<app-csv-exporter [data]="data" [accession]="accession" [section]="section" category="publication"></app-csv-exporter>
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/PDBe-KB/component-csv-exporter/tags).

## Authors

* **Mihaly Varadi** - *Migrating to GitHub* - [mvaradi](https://github.com/mvaradi)

See also the list of [contributors](https://github.com/PDBe-KB/component-csv-exporter/contributors) who participated in this project.

## License

This project is licensed under the EMBL-EBI License - see the [LICENSE](LICENSE) file for details

## Acknowledgements

We would like to thank the [PDBe team](https://www.pdbe.org) and the [PDBe-KB partner resources](https://github.com/PDBe-KB/pdbe-kb-manual/wiki/PDBe-KB-Annotations) for their feedback and contributions.
