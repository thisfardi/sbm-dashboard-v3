import { ChartType } from './charts.model';

const amountChart: ChartType = {
    chart: {
        height: 380,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '55%',
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
    series: [],
    // series: [{
    //     name: 'Net Profit',
    //     data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    // }, {
    //     name: 'Revenue',
    //     data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    // }, {
    //     name: 'Free Cash Flow',
    //     data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
    // }],
    xaxis: {
        // categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        categories: [],
        axisBorder: {
            color: '#d6ddea',
        },
        axisTicks: {
            color: '#d6ddea',
        }
    },
    legend: {
        show: false
    },
    yaxis: {
        title: {
            text: 'Amount (g)'
        }
    },
    fill: {
        opacity: 1

    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        },
        borderColor: '#f1f3fa'
    },
    tooltip: {
        y: {
            formatter(val) {
              if(parseInt(val) > 1000){
                return (Math.floor(val / 1000 * 100) / 100).toString() + 'kg'
              }else{
                return (Math.floor(val * 100) / 100).toString() + 'g'
              }
            }
        },
        theme: 'dark',
        x: { show: false }
    }
};
const itemChart: ChartType = {
    chart: {
        height: 380,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '55%',
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
    series: [],
    // series: [{
    //     name: 'Net Profit',
    //     data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    // }, {
    //     name: 'Revenue',
    //     data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    // }, {
    //     name: 'Free Cash Flow',
    //     data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
    // }],
    xaxis: {
        // categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        categories: [],
        axisBorder: {
            color: '#d6ddea',
        },
        axisTicks: {
            color: '#d6ddea',
        }
    },
    legend: {
        show: false
    },
    yaxis: {
        title: {
            text: 'Amount (g)'
        }
    },
    fill: {
        opacity: 1

    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        },
        borderColor: '#f1f3fa'
    },
    tooltip: {
        y: {
            formatter(val) {
              if(parseInt(val) > 1000){
                return (Math.floor(val / 1000 * 100) / 100).toString() + 'kg'
              }else{
                return (Math.floor(val * 100) / 100).toString() + 'g'
              }
            }
        },
        theme: 'dark',
        x: { show: false }
    }
};
const ratioChart: ChartType = {
    chart: {
        height: 380,
        type: 'pie',
        toolbar: {
            show: true
        }
    },
    series: [],
    labels: [],
    colors: ['#00acac', '#267f26', '#ff3333'],
    legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        verticalAlign: 'middle',
        floating: false,
        fontSize: '14px',
        offsetX: 0,
        offsetY: -10
    },
    dataLabels: {
        enabled: true
    },
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                height: 380
            },
            legend: {
                show: true,
                offsetY: 0
            },
        }
    }]
};


const daily_finished_products_amount_chart: ChartType = {
    chart: {
        height: 180,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '10%',
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
    colors: ['#00acac', '#ff3333', '#267f26'],
    series: [],
    // series: [{
    //     name: 'Amount',
    //     data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    // }, {
    //     name: 'Cost',
    //     data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    // }],
    xaxis: {
        //categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        categories: [],
        axisBorder: {
            color: '#d6ddea',
        },
        axisTicks: {
            color: '#d6ddea',
        },
        labels: {
            rotate: 0,
            hideOverlappingLabels: false,
            trim: true
        }
    },
    legend: {
        show: false
    },
    yaxis: {
        title: {
            text: 'Amount (g)'
        },
        labels: {
          style: {
            color: '#FFB0AF',
          },
          formatter: function (value) {
            if(parseInt(value) > 1000){
              return (Math.floor(value / 1000 * 100) / 100).toString() + 'kg'
            }else{
              return (Math.floor(value * 100) / 100).toString() + 'g'
            }

          }
        },
    },
    fill: {
        opacity: 1

    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        },
        borderColor: '#f1f3fa'
    },
    tooltip: {
        y: {
            formatter(val) {
              if(parseInt(val) > 1000){
                return (Math.floor(val / 1000 * 100) / 100).toString() + 'kg'
              }else{
                return (Math.floor(val * 100) / 100).toString() + 'g'
              }
            }
        },
        theme: 'dark',
        x: { show: true }
    }
}
const daily_finished_products_price_chart: ChartType = {
    chart: {
        height: 180,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '10%',
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
    colors: ['#ff3333'],
    series: [],
    // series: [{
    //     name: 'Amount',
    //     data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    // }, {
    //     name: 'Cost',
    //     data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    // }],
    xaxis: {
        //categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        categories: [],
        axisBorder: {
            color: '#d6ddea',
        },
        axisTicks: {
            color: '#d6ddea',
        },
        labels: {
            rotate: 0,
            hideOverlappingLabels: false,
            trim: true
        }
    },
    legend: {
        show: false
    },
    yaxis: {
        title: {
            text: 'Cost ($)'
        },
        labels: {
          style: {
            color: '#FFB0AF',
          },
          formatter: function (value) {
            if(parseInt(value) > 1000){
              return '$' + (Math.floor(value / 1000 * 100) / 100).toString() + 'k'
            }else{
              return '$' + (Math.floor(value * 100) / 100).toString()
            }

          }
        },
    },
    fill: {
        opacity: 1

    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        },
        borderColor: '#f1f3fa'
    },
    tooltip: {
        y: {
          formatter(val) {
            if(parseInt(val) > 1000){
              return '$' + (Math.floor(val / 1000 * 100) / 100).toString() + 'k'
            }else{
              return '$' + (Math.floor(val * 100) / 100).toString()
            }
          }
        },
        theme: 'dark',
        x: { show: true }
    }
}
const daily_ingredients_amount_chart: ChartType = {
    chart: {
        height: 180,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '10%',
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
    colors: ['#267f26', '#ff3333', '#267f26'],
    series: [],
    // series: [{
    //     name: 'Amount',
    //     data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    // }, {
    //     name: 'Cost',
    //     data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    // }],
    xaxis: {
        //categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        categories: [],
        axisBorder: {
            color: '#d6ddea',
        },
        axisTicks: {
            color: '#d6ddea',
        },
        labels: {
            rotate: 0,
            hideOverlappingLabels: false,
            trim: true
        }
    },
    legend: {
        show: false
    },
    yaxis: {
        title: {
            text: 'Amount (g)'
        },
        labels: {
          style: {
            color: '#FFB0AF',
          },
          formatter: function (value) {
            if(parseInt(value) > 1000){
              return (Math.floor(value / 1000 * 100) / 100).toString() + 'kg'
            }else{
              return (Math.floor(value * 100) / 100).toString() + 'g'
            }

          }
        },
    },
    fill: {
        opacity: 1

    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        },
        borderColor: '#f1f3fa'
    },
    tooltip: {
        y: {
          formatter(val) {
            if(parseInt(val) > 1000){
              return (Math.floor(val / 1000 * 100) / 100).toString() + 'kg'
            }else{
              return (Math.floor(val * 100) / 100).toString() + 'g'
            }
          }
        },
        theme: 'dark',
        x: { show: true }
    }
}
const daily_ingredients_price_chart: ChartType = {
    chart: {
        height: 180,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '10%',
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
    colors: ['#F7A072'],
    series: [],
    // series: [{
    //     name: 'Amount',
    //     data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    // }, {
    //     name: 'Cost',
    //     data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    // }],
    xaxis: {
        //categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        categories: [],
        axisBorder: {
            color: '#d6ddea',
        },
        axisTicks: {
            color: '#d6ddea',
        },
        labels: {
            rotate: 0,
            hideOverlappingLabels: false,
            trim: true
        }
    },
    legend: {
        show: false
    },
    yaxis: {
        title: {
            text: 'Cost ($)'
        },
        labels: {
          style: {
            color: '#FFB0AF',
          },
          formatter: function (value) {
            if(parseInt(value) > 1000){
              return '$'+(Math.floor(value / 1000 * 100) / 100).toString() + 'k'
            }else{
              return '$'+(Math.floor(value * 100) / 100).toString()
            }

          }
        },
    },
    fill: {
        opacity: 1

    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        },
        borderColor: '#f1f3fa'
    },
    tooltip: {
        y: {
          formatter(val) {
            if(parseInt(val) > 1000){
              return '$' + (Math.floor(val / 1000 * 100) / 100).toString() + 'k'
            }else{
              return '$' + (Math.floor(val * 100) / 100).toString()
            }
          }
        },
        theme: 'dark',
        x: { show: true }
    }
}
const daily_waste_amount_chart: ChartType = {
    chart: {
        height: 180,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '10%',
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
    colors: ['#DCB8CB', '#ff3333', '#267f26'],
    series: [],
    // series: [{
    //     name: 'Amount',
    //     data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    // }, {
    //     name: 'Cost',
    //     data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    // }],
    xaxis: {
        //categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        categories: [],
        axisBorder: {
            color: '#d6ddea',
        },
        axisTicks: {
            color: '#d6ddea',
        },
        labels: {
            rotate: 0,
            hideOverlappingLabels: false,
            trim: true
        }
    },
    legend: {
        show: false
    },
    yaxis: {
        title: {
            text: 'Amount (g)'
        },
        labels: {
          style: {
            color: '#FFB0AF',
          },
          formatter: function (value) {
            if(parseInt(value) > 1000){
              return (Math.floor(value / 1000 * 100) / 100).toString() + 'kg'
            }else{
              return (Math.floor(value * 100) / 100).toString() + 'g'
            }

          }
        },
    },
    fill: {
        opacity: 1

    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        },
        borderColor: '#f1f3fa'
    },
    tooltip: {
        y: {
            formatter(val) {
              if(parseInt(val) > 1000){
                return (Math.floor(val / 1000 * 100) / 100).toString() + 'kg'
              }else{
                return (Math.floor(val * 100) / 100).toString() + 'g'
              }
            }
        },
        theme: 'dark',
        x: { show: true }
    }
}
const daily_waste_price_chart: ChartType = {
    chart: {
        height: 180,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '10%',
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
    colors: ['#B80C09'],
    series: [],
    // series: [{
    //     name: 'Amount',
    //     data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    // }, {
    //     name: 'Cost',
    //     data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    // }],
    xaxis: {
        //categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        categories: [],
        axisBorder: {
            color: '#d6ddea',
        },
        axisTicks: {
            color: '#d6ddea',
        },
        labels: {
            rotate: 0,
            hideOverlappingLabels: false,
            trim: true
        }
    },
    legend: {
        show: false
    },
    yaxis: {
        title: {
            text: 'Cost ($)'
        },
        labels: {
          style: {
            color: '#FFB0AF',
          },
          formatter: function (value) {
            if(parseInt(value) > 1000){
              return '$' + (Math.floor(value / 1000 * 100) / 100).toString() + 'k'
            }else{
              return '$' + (Math.floor(value * 100) / 100).toString()
            }

          }
        },
    },
    fill: {
        opacity: 1

    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        },
        borderColor: '#f1f3fa'
    },
    tooltip: {
        y: {
          formatter(val) {
            if(parseInt(val) > 1000){
              return '$' + (Math.floor(val / 1000 * 100) / 100).toString() + 'k'
            }else{
              return '$' + (Math.floor(val * 100) / 100).toString()
            }
          }
        },
        theme: 'dark',
        x: { show: true }
    }
}

const pos_daily_usage_amount_chart: ChartType = {
    chart: {
        height: 180,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '10%',
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
    colors: ['#bfacfb', '#ff3333', '#267f26'],
    series: [],
    // series: [{
    //     name: 'Amount',
    //     data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    // }, {
    //     name: 'Cost',
    //     data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    // }],
    xaxis: {
        //categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        categories: [],
        axisBorder: {
            color: '#d6ddea',
        },
        axisTicks: {
            color: '#d6ddea',
        },
        labels: {
            rotate: 0,
            hideOverlappingLabels: false,
            trim: true
        }
    },
    legend: {
        show: false
    },
    yaxis: {
        title: {
            text: 'Amount (g)'
        },
        labels: {
          style: {
            color: '#FFB0AF',
          },
          formatter: function (value) {
            if(parseInt(value) > 1000){
              return (Math.floor(value / 1000 * 100) / 100).toString() + 'kg'
            }else{
              return (Math.floor(value * 100) / 100).toString() + 'g'
            }

          }
        },
    },
    fill: {
        opacity: 1

    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        },
        borderColor: '#f1f3fa'
    },
    tooltip: {
        y: {
            formatter(val) {
              if(parseInt(val) > 1000){
                return (Math.floor(val / 1000 * 100) / 100).toString() + 'kg'
              }else{
                return (Math.floor(val * 100) / 100).toString() + 'g'
              }
            }
        },
        theme: 'dark',
        x: { show: true }
    }
}
const pos_daily_usage_price_chart: ChartType = {
    chart: {
        height: 180,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '10%',
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
    colors: ['#f58549'],
    series: [],
    // series: [{
    //     name: 'Amount',
    //     data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    // }, {
    //     name: 'Cost',
    //     data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    // }],
    xaxis: {
        //categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        categories: [],
        axisBorder: {
            color: '#d6ddea',
        },
        axisTicks: {
            color: '#d6ddea',
        },
        labels: {
            rotate: 0,
            hideOverlappingLabels: false,
            trim: true
        }
    },
    legend: {
        show: false
    },
    yaxis: {
        title: {
            text: 'Cost ($)'
        },
        labels: {
          style: {
            color: '#FFB0AF',
          },
          formatter: function (value) {
            if(parseInt(value) > 1000){
              return '$' + (Math.floor(value / 1000 * 100) / 100).toString() + 'k'
            }else{
              return '$' + (Math.floor(value * 100) / 100).toString()
            }

          }
        },
    },
    fill: {
        opacity: 1

    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        },
        borderColor: '#f1f3fa'
    },
    tooltip: {
        y: {
          formatter(val) {
            if(parseInt(val) > 1000){
              return '$' + (Math.floor(val / 1000 * 100) / 100).toString() + 'k'
            }else{
              return '$' + (Math.floor(val * 100) / 100).toString()
            }
          }
        },
        theme: 'dark',
        x: { show: true }
    }
}
const pos_daily_ingredient_amount_chart: ChartType = {
    chart: {
        height: 180,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '10%',
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
    colors: ['#00bbf9', '#ff3333', '#267f26'],
    series: [],
    // series: [{
    //     name: 'Amount',
    //     data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    // }, {
    //     name: 'Cost',
    //     data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    // }],
    xaxis: {
        //categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        categories: [],
        axisBorder: {
            color: '#d6ddea',
        },
        axisTicks: {
            color: '#d6ddea',
        },
        labels: {
            rotate: 0,
            hideOverlappingLabels: false,
            trim: true
        }
    },
    legend: {
        show: false
    },
    yaxis: {
        title: {
            text: 'Amount (g)'
        },
        labels: {
          style: {
            color: '#FFB0AF',
          },
          formatter: function (value) {
            if(parseInt(value) > 1000){
              return (Math.floor(value / 1000 * 100) / 100).toString() + 'kg'
            }else{
              return (Math.floor(value * 100) / 100).toString() + 'g'
            }

          }
        },
    },
    fill: {
        opacity: 1

    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        },
        borderColor: '#f1f3fa'
    },
    tooltip: {
        y: {
            formatter(val) {
              if(parseInt(val) > 1000){
                return (Math.floor(val / 1000 * 100) / 100).toString() + 'kg'
              }else{
                return (Math.floor(val * 100) / 100).toString() + 'g'
              }
            }
        },
        theme: 'dark',
        x: { show: true }
    }
}
const pos_daily_ingredient_price_chart: ChartType = {
    chart: {
        height: 180,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '10%',
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
    colors: ['#008000'],
    series: [],
    // series: [{
    //     name: 'Amount',
    //     data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    // }, {
    //     name: 'Cost',
    //     data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    // }],
    xaxis: {
        //categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        categories: [],
        axisBorder: {
            color: '#d6ddea',
        },
        axisTicks: {
            color: '#d6ddea',
        },
        labels: {
            rotate: 0,
            hideOverlappingLabels: false,
            trim: true
        }
    },
    legend: {
        show: false
    },
    yaxis: {
        title: {
            text: 'Cost ($)'
        },
        labels: {
          style: {
            color: '#FFB0AF',
          },
          formatter: function (value) {
            if(parseInt(value) > 1000){
              return '$' + (Math.floor(value / 1000 * 100) / 100).toString() + 'k'
            }else{
              return '$' + (Math.floor(value * 100) / 100).toString()
            }

          }
        },
    },
    fill: {
        opacity: 1

    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        },
        borderColor: '#f1f3fa'
    },
    tooltip: {
        y: {
            formatter(val) {
              if(parseInt(val) > 1000){
                return '$' + (Math.floor(val / 1000 * 100) / 100).toString() + 'k'
              }else{
                return '$' + (Math.floor(val * 100) / 100).toString()
              }
            }
        },
        theme: 'dark',
        x: { show: true }
    }
}


const daily_finished_products_comparison_chart: ChartType = {
  chart: {
    height: 380,
    type: 'bar',
    stacked: false,
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  series: [],
  colors: ['#5369f8', '#A4303F', '#444'],
    xaxis: {
      categories: [],
    },
    yaxis: [{
      labels: {
        style: {
          color: '#FFB0AF',
        },
        formatter: function (value) {
          if(parseInt(value) > 1000){
            return (Math.floor(value / 1000 * 100) / 100).toString() + 'kg'
          }else{
            return (Math.floor(value * 100) / 100).toString() + 'g'
          }

        }
      },
      title: {
        text: 'Amount',
        offsetX: 5
      },
    }],
    tooltip: {
      theme: 'dark',
      x: { show: true },
      followCursor: true,
      y: {
        formatter(value) {
          if(parseInt(value) > 1000){
            return (Math.floor(value / 1000 * 100) / 100).toString() + 'kg'
          }else{
            return (Math.floor(value * 100) / 100).toString() + 'g'
          }
        }
      }
    },
    responsive: [{
      breakpoint: 600,
      options: {
        legend: {
          show: true
        }
      }
    }]
};
const pos_daily_usage_comparison_chart: ChartType = {
  chart: {
    height: 380,
    type: 'bar',
    stacked: false,
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  series: [],
  colors: ['#5369f8', '#A4303F', '#444'],
    xaxis: {
      categories: [],
    },
    yaxis: [{
      labels: {
        style: {
          color: '#FFB0AF',
        },
        formatter: function (value) {
          if(parseInt(value) > 1000){
            return (Math.floor(value / 1000 * 100) / 100).toString() + 'kg'
          }else{
            return (Math.floor(value * 100) / 100).toString() + 'g'
          }

        }
      },
      title: {
        text: 'Amount',
        offsetX: 5
      },
    }],
    tooltip: {
      theme: 'dark',
      x: { show: true },
      followCursor: true,
      y: {
        formatter(value) {
          if(parseInt(value) > 1000){
            return (Math.floor(value / 1000 * 100) / 100).toString() + 'kg'
          }else{
            return (Math.floor(value * 100) / 100).toString() + 'g'
          }
        }
      }
    },
    responsive: [{
      breakpoint: 600,
      options: {
        legend: {
          show: true
        }
      }
    }]
};
const pos_daily_ingredient_comparison_chart: ChartType = {
  chart: {
    height: 380,
    type: 'bar',
    stacked: false,
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  series: [],
  colors: ['#5369f8', '#A4303F', '#444'],
    xaxis: {
      categories: [],
    },
    yaxis: [{
      labels: {
        style: {
          color: '#FFB0AF',
        },
        formatter: function (value) {
          if(parseInt(value) > 1000){
            return (Math.floor(value / 1000 * 100) / 100).toString() + 'kg'
          }else{
            return (Math.floor(value * 100) / 100).toString() + 'g'
          }

        }
      },
      title: {
        text: 'Amount',
        offsetX: 5
      },
    }],
    tooltip: {
      theme: 'dark',
      x: { show: true },
      followCursor: true,
      y: {
        formatter(value) {
          if(parseInt(value) > 1000){
            return (Math.floor(value / 1000 * 100) / 100).toString() + 'kg'
          }else{
            return (Math.floor(value * 100) / 100).toString() + 'g'
          }
        }
      }
    },
    responsive: [{
      breakpoint: 600,
      options: {
        legend: {
          show: true
        }
      }
    }]
};

const netsale_material_waste_comparison_chart: ChartType = {
    chart: {
        height: 380,
        type: 'pie',
        toolbar: {
            show: true
        }
    },
    series: [],
    labels: [],
    colors: ['#43d39e', '#f77e53', '#ffbe0b'],
    legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        verticalAlign: 'middle',
        floating: false,
        fontSize: '14px',
        offsetX: 0,
        offsetY: -10
    },
    dataLabels: {
        enabled: true
    },
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                height: 380
            },
            legend: {
                show: true,
                offsetY: 0
            },
        }
    }]
};

export {
  amountChart, ratioChart, itemChart,
  daily_finished_products_amount_chart,
  daily_finished_products_price_chart,
  daily_ingredients_amount_chart,
  daily_ingredients_price_chart,
  daily_waste_amount_chart,
  daily_waste_price_chart,

  pos_daily_usage_amount_chart,
  pos_daily_usage_price_chart,
  pos_daily_ingredient_amount_chart,
  pos_daily_ingredient_price_chart,

  daily_finished_products_comparison_chart,
  pos_daily_usage_comparison_chart,
  pos_daily_ingredient_comparison_chart,
  netsale_material_waste_comparison_chart
};
