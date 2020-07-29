import { ChartType } from './charts.model';

const itemChart: ChartType = {
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
        width: [3, 1, 1, 1, 1],
        curve: 'smooth'
    },
    series: [],
    colors: ['#5369f8', '#43d39e', '#f77e53', '#ffbe0b', '#91FDFF', '#FFB0AF', '#31393C', '#D591F2', '#0A6D72', '#E0D0EA', '#6F5A96', '#40160F'],
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
            text: 'Item qty [g]',
            offsetX: 5
        },
    }],
    tooltip: {
        theme: 'dark',
        x: { show: true },
        followCursor: true,
        y: {
            formatter(y) {
                return (Math.floor(y * 100) / 100).toString() + 'g'
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
    colors: ['#43d39e', '#f77e53', '#ffbe0b', '#91FDFF', '#FFB0AF', '#31393C', '#D591F2', '#0A6D72', '#E0D0EA', '#6F5A96', '#40160F'],
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
    itemChart, ratioChart
};
