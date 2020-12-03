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
import { inventoryOverviewChart, inventoryMonthChart, inventoryCurrentChart } from '../data';

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

  inventory_overview_chart: ChartType
  inventory_month_chart: ChartType
  inventory_current_chart: ChartType

  currentTotalValue = 0

  selectedYear = moment().format('YYYY')
  selectedMonth = moment().format('MMMM')

  YEARS = ['2020', '2021', '2022', '2023', '2024', '2025']
  MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Sepember', 'October', 'November', 'December']

  ngOnInit() {
    this.inventory_overview_chart = inventoryOverviewChart
    this.inventory_month_chart = inventoryMonthChart
    this.inventory_current_chart = inventoryCurrentChart
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
          this.render_current_chart()
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
      if((item.counter_name != null) && (item.timestamp.split('-')[0] == this.selectedYear)){
        yearHistory.push(item)
      }
      if((item.counter_name != null) && (item.timestamp.split('-')[0] == this.selectedYear) && (item.timestamp.split('-')[1] == (this.MONTHS.indexOf(this.selectedMonth) + 1))){
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

    this.render_overview_chart()
    this.render_month_chart()
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
    let uniq_items = []

    this.inventory_history.forEach(item => {
      if(uniq_items.indexOf(item.inventory_id) == -1){
        uniq_items.push(item.inventory_id)
        data.data.push(0)
        this.inventory_month_chart.xaxis.categories.push(item.vendor_description)
      }
    })
    this.inventory_history.forEach(item => {
      if((item.counter_name != null) && (item.timestamp.split('-')[0] == this.selectedYear) && (item.timestamp.split('-')[1] == (this.MONTHS.indexOf(this.selectedMonth) + 1))){
        data.data[uniq_items.indexOf(item.inventory_id)] = item.value ? item.value : 0
      }
    })
    this.inventory_month_chart.series.push(data)
  }

  private render_current_chart = () => {
    this.currentTotalValue = 0
    this.inventory_current_chart.series = []
    this.inventory_current_chart.xaxis.categories = []
    let data = {
      name: 'Item value',
      data: []
    }
    let uniq_items = []

    this.inventory_history.forEach(item => {
      if(uniq_items.indexOf(item.inventory_id) == -1){
        uniq_items.push(item.inventory_id)
        data.data.push(0)
        this.inventory_current_chart.xaxis.categories.push(item.vendor_description)
      }
    })
    this.inventory_history.forEach(item => {
      if((item.counter_name != null) && (item.timestamp.split('-')[0] == moment().format('YYYY')) && (item.timestamp.split('-')[1] == (this.MONTHS.indexOf(moment().format('MMMM')) + 1))){
        data.data[uniq_items.indexOf(item.inventory_id)] = item.value ? parseFloat(item.value) : 0
      }
    })
    data.data.forEach(item => {
      this.currentTotalValue += parseFloat(item)
    })
    this.inventory_current_chart.series.push(data)
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
