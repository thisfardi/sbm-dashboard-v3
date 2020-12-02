import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';
import { ExportService } from '../../../core/services/export.service';
import { HistoryService } from '../../../core/services/history.service';

import { ChartType } from '../charts.model';
import { inventoryOverviewChart, inventoryMonthChart } from '../data';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private parseService: ParseService,
    public exportService: ExportService,
    public historyService: HistoryService,
    public authService: AuthenticationService
  ) { }

  db_error = false
  loading = false

  inventory_history = []

  yearHistory = []
  monthHistory = []
  detailHistory = []

  inventory_overview_chart: ChartType;
  inventory_month_chart: ChartType;

  selectedYear = moment().format('YYYY')
  selectedMonth = moment().format('MMM')

  YEARS = [2020, 2021, 2022, 2023, 2024, 2025]
  MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  ngOnInit() {
    this.inventory_overview_chart = inventoryOverviewChart
    this.inventory_month_chart = inventoryMonthChart
    this.reset_values()
    this.get_inventory_history()
  }

  private reset_values = () => {
    this.yearHistory = []
    for(let i = 1; i <= 12; i++){
      this.yearHistory.push({
        month: i,
        value: 0
      })
    }
    this.monthHistory = []
    this.detailHistory = []
  }

  private get_inventory_history = () => {
    this.loading = true
    this.apiService.getInventoryHistory(this.parseService.encode({
      // Add param here
    })).pipe(first()).subscribe(
      data => {
        if(data['status'] == 'success'){
          this.inventory_history = [...data['data']]
          this.process_data()
        }
        this.loading = false
      },
      error => {
        console.log(error)
        this.loading = false
      }
    )
  }

  public process_data = () => {
    let yearHistory = []
    let monthHistory = []
    let detailHistory = []
    this.inventory_history.forEach(item => {
      if(moment(item.timestamp).format('YYYY') == this.selectedYear){
        yearHistory.push(item)
      }
      if((moment(item.timestamp).format('YYYY') == this.selectedYear) && (moment(item.timestamp).format('MMM') == this.selectedMonth)){
        monthHistory.push(item)
      }
      detailHistory.push(item)
    })

    this.yearHistory = []
    for(let i = 1; i <= 12; i++){
      this.yearHistory.push({
        month: i,
        value: 0
      })
    }
    this.yearHistory.map(item => {
      yearHistory.forEach(_item => {
        if(item.month == _item.timestamp.split('-')[1]){
          item.value += parseFloat(_item.value)
        }
      })
    })
    this.monthHistory = [...monthHistory]
    this.detailHistory = [...detailHistory]
    this.detailHistory.sort((a, b) => {
      return moment(a.timestamp).isAfter(moment(b.timestamp)) ? -1 : 1
    })
    this.detailHistory.map(item => {
      item.timestamp = moment(item.timestamp).format('MMM D')
    })
    this.render_overview_chart()
    this.render_month_chart()
    console.log(this.detailHistory)
  }

  private render_overview_chart = () => {
    this.inventory_overview_chart.series = []
    this.inventory_overview_chart.xaxis.categories = [...this.MONTHS]
    let data = {
      name: 'Inventory values',
      type: 'line',
      data: []
    }
    this.yearHistory.forEach(item => {
      data.data.push(item.value)
    })
    this.inventory_overview_chart.series.push(data)
  }

  private render_month_chart = () => {
    this.inventory_month_chart.series = []
    this.inventory_month_chart.xaxis.categories = []
    let data = {
      name: 'Item value',
      type: 'column',
      data: []
    }
    this.monthHistory.forEach(item => {
      data.data.push(item.value)
      this.inventory_month_chart.xaxis.categories.push(item.description)
    })
    this.inventory_month_chart.series.push(data)
  }

  public get_primary_uom = (packing_info: string) => {
    let s = packing_info.split('/')[1]
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
  public get_secondary_uom = (packing_info: string) => {
    let s = packing_info.split('/')[0].replace(/[0-9]/g, '')
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
}
