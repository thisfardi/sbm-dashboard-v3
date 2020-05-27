// Service for making object data to form data, so that API can accept
import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { HistoryService } from '../services/history.service';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    constructor(private historyService: HistoryService) { }

    exportToCSV(el, name){
        let table = el.target.parentElement.querySelector('table');
        let filename = name + '_Export_timestamp_ ' + moment().format('YYYY-MM-DD:hh-mm-ss') + '.csv';

        let csv = [];
        let rows = table.querySelectorAll('tr');

        for (let i = 0; i < rows.length; i++) {
            let row = [], cols = rows[i].querySelectorAll("td, th");
            for (let j = 0; j < cols.length; j++)
                row.push(cols[j].innerText.replace(',', ' '));
            csv.push(row.join(","));
        }

        let csvFile = new Blob([csv.join("\n")], {type: "text/csv"});
        let downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        this.historyService.logHistory('export', name);
    }

    exportToExcel(){

    }

    exportToPDF(){

    }
}
