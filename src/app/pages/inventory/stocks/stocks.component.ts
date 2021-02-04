import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { ParseService } from '../../../core/services/parse.service';
import { CookieService } from '../../../core/services/cookie.service';
import { ExportService } from '../../../core/services/export.service';
import { HistoryService } from '../../../core/services/history.service';
import { AuthenticationService } from '../../../core/services/auth.service';

import { ChartType } from '../charts.model';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private parseService: ParseService,
    public exportService: ExportService,
    public authService: AuthenticationService,
    public historyService: HistoryService
  ) { }

  stocksData = []
  filteredStocksData = []
  categories = ['All categories']
  selected_category = 'All categories'
  items = []
  itemHistory = []
  loading = false
  historyLoading = true
  db_error = false

  stocksChart
  itemGaugeChart
  itemHistoryChart

  chart_categories = [
    {
      category: []
    }
  ]

  chart_dataset = [
    {
      seriesname: 'Safety level',
      data: []
    },
    {
      seriesname: 'Current qty',
      data: []
    }
  ]

  selected_item

  ngOnInit() {
    this._fetchStocksData()
  }

  _fetchStocksData(){
    this.loading = true
    this.db_error = false
    this.apiService.getStocksData(this.parseService.encode({
      company: this.authService.currentUser()['company'],
      shop: this.authService.currentUser()['shop_name'],
      branch_id: this.authService.currentUser()['branch_id']
    })).pipe(first())
    .subscribe(
      data => {
        if(data['status'] == 'success'){
          this.stocksData = [...data['data']]
          this.stocksData.forEach(item => {
            if(!this.categories.includes(item.category)){
              this.categories.push(item.category)
            }
          })
          this.filterStocksData()
        }else{
          this.db_error = true
        }
        this.loading = false
      },
      error => {
        this.db_error = true
        this.loading = false
      }
    )
  }
  _fetchItemHistoryData(){
    this.historyLoading = true
    this.db_error = false
    this.apiService.getItemHistoryData(this.parseService.encode({
      company: this.authService.currentUser()['company'],
      shop: this.authService.currentUser()['shop_name'],
      branch_id: this.authService.currentUser()['branch_id'],
      purchasing_item_id: this.selected_item['id'],
    })).pipe(first())
    .subscribe(
      data => {
        if(data['status'] == 'success'){
          this.itemHistory = [...data['data']]
          this.process_history_data()
        }else{
          this.db_error = true
        }
      },
      error => {
        this.db_error = true
      }
    )
  }

  process_stocks_data(){

    let safety_level = []
    let current_stock = []
    let items = []
    this.filteredStocksData.forEach(item => {

      this.items.push(item.description)
      items.push({
        label: item.description,
        id: item.id
      })
      safety_level.push({
        value: parseInt(item.safety_qty)
      })
      current_stock.push({
        value: parseFloat(item.stock_qty_primary) + parseFloat(item.stock_qty_secondary) / this.get_sp_qty(item.packing_info)
      })
    })
    this.chart_categories[0].category = [...items]
    this.chart_dataset[0].data = [...current_stock]
    this.chart_dataset[1].data = [...safety_level]


    let stocksData = [...this.filteredStocksData]
    this.selected_item = stocksData[0]
    this.item_data_render()
    let _this = this
    this.stocksChart = {
      width: "100%",
      height: "100%",
      type: "scrollcolumn2d",
      dataFormat: "json",
      dataSource: {
        chart: {
          caption: "Stock amount / Safety level",
          subcaption: this.authService.currentUser()['company'] + ' - ' + this.authService.currentUser()['shop_name'],
          yaxisname: "QTY",
          numberprefix: "",
          drawcrossline: "1",
          theme: "fusion",
          showvalues: "0"
        },
        categories: [...this.chart_categories],
        dataset: [...this.chart_dataset]
      },
      events: {
        dataLabelClick: function(e){
          _this.selected_item = {..._this.filteredStocksData[e.data.index]}
          _this.item_data_render()
        }
      }
    }
  }
  process_history_data(){
    let x_axis = []
    let series_data = []
    this.itemHistory.forEach(item => {
      x_axis.push(moment(item.timestamp).format('MMM DD, ddd'))
      series_data.push(parseFloat(item.primary_qty_change) + parseFloat(item.secondary_qty_change) / this.get_sp_qty(this.selected_item['packing_info']))
    })
    console.log(series_data)
    this.itemHistoryChart = {
      chart: {
        height: 150,
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          colors: {
            ranges: [
              {
                from: -100,
                to: -5,
                color: "#F15B46"
              },
              {
                from: -5,
                to: 0,
                color: "#FEB019"
              }
            ]
          },
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      colors: ['#00acac', '#267f26', '#ff3333'],
      series: [{
        name: 'Stock change history',
        data: [...series_data]
      }],
      xaxis: {
          // categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        categories: [...x_axis],
        axisBorder: {
          color: '#d6ddea',
        },
        axisTicks: {
          color: '#d6ddea',
        }
      },
      yaxis: {
        title: {
          text: 'QTY'
        }
      },
      labels: {
        rotate: -90
      }
    }
    this.historyLoading = false
  }

  get_sp_qty(packing_info){
    if(packing_info.includes('/') && packing_info.includes(' ')){
      return packing_info.split('/')[0].replace(/\D/g,'')
    }else{
      return 10
    }
  }
  formatDate(date){
    return moment(date).format('MMM DD, ddd')
  }
  parse_float(data){
    return parseFloat(data)
  }
  item_data_render(){
    console.log(this.selected_item)
    this._fetchItemHistoryData()
    let _this = this
    this.itemGaugeChart = {
      width: "100%",
      height: "100%",
      type: "angulargauge",
      dataFormat: "json",
      dataSource: {
        chart: {
          "caption": _this.selected_item.description + ' current stock',
          "lowerLimit": "0",
          "upperLimit": _this.selected_item.safety_qty * 1.5,
          "showValue": "1",
          "numberSuffix": "",
          "theme": "fusion",
          "showToolTip": "1"
        },
        "colorRange": {
          "color": [{
            "minValue": "0",
            "maxValue": _this.selected_item.safety_qty / 2,
            "code": "#F2726F"
          },
          {
             "minValue": _this.selected_item.safety_qty / 2,
             "maxValue": _this.selected_item.safety_qty,
             "code": "#FFC533"
         },{
            "minValue": _this.selected_item.safety_qty,
            "maxValue": _this.selected_item.safety_qty * 1.5,
            "code": "#29c3be"
          }]
        },
        "dials": {
          "dial": [{
            "value": parseFloat(_this.selected_item.stock_qty_primary) + parseFloat(_this.selected_item.stock_qty_secondary) / _this.get_sp_qty(_this.selected_item.packing_info)
          }]
        }
      }
    }
  }
  export_history_data(el){
    this.exportService.exportToCSV(
      el,
      'Inventory stock change history for ' + this.authService.currentUser()['shop_name'] + ', On ' + moment().format('DD, MMM YYYY'));
  }
  export_stock_data(el){
    this.exportService.exportToCSV(
      el,
      'Inventory stock data for ' + this.authService.currentUser()['shop_name'] + ', On ' + moment().format('DD, MMM YYYY'));
  }
  filterStocksData(){
    if(this.selected_category == 'All categories'){
      this.filteredStocksData = [...this.stocksData]
    }else{
      this.filteredStocksData = [...this.stocksData.filter(item => item.category == this.selected_category)]
    }
    this.process_stocks_data()
  }
  get_total_value(){
    let value = 0
    this.stocksData.forEach(item => {
      value += (parseFloat(item.price) * (parseFloat(item.stock_qty_primary) + parseFloat(item.stock_qty_secondary) / this.get_sp_qty(item.packing_info)))
    })
    return value
  }
}
