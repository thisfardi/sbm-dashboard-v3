import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

   // bread crumb items
   breadCrumbItems: Array<{}>;

   constructor() { }

   ngOnInit() {
     this.breadCrumbItems = [{ label: 'SBM Dashboard v3.0', path: '/' }, { label: 'Pages', path: '/' }, { label: 'Invoice', active: true }];
   }
}
