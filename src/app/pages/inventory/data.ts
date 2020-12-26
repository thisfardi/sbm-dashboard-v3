const historyChart: ChartType = {
    chart: {
        height: 380,
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
              from: -10,
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
        olumnWidth: "80%"
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
    yaxis: {
      title: {
        text: 'QTY'
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
          return val;
        }
      },
      theme: 'dark',
      x: { show: false }
    }
};
