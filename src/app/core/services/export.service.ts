// Service for making object data to form data, so that API can accept
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    constructor() { }

    exportToCSV(el){
        console.log(el);
    }

    exportToExcel(){

    }

    exportToPDF(){

    }
}
