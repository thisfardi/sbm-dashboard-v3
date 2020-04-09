import { ChartType } from './charts.model';


const multipleYAxisChart: ChartType = {
    chart: {
        height: 380,
        type: 'line',
        stacked: false,
        toolbar: {
            show: true
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: [3]
    },
    series: [],
    colors: ['#5369f8'],
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
                    return '$' + (Math.floor(value / 1000 * 100) / 100).toString() + 'k'
                }else{
                    return '$' + (Math.floor(value * 100) / 100).toString()
                }

            }
        },
        title: {
            text: 'Netsale [USD]',
            offsetX: 5
        },
    }],
    tooltip: {
        theme: 'dark',
        x: { show: true },
        followCursor: true,
        y: {
            formatter(y) {
                return '$' + (Math.floor(y * 100) / 100).toString()
            }
        }
    },
    responsive: [{
        breakpoint: 600,
        options: {
            legend: {
                show: false
            }
        }
    }]
};


export {
    multipleYAxisChart
};
