import { ChartType } from './charts.model';


const salesChart: ChartType = {
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
const causalChart: ChartType = {
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
const transChart: ChartType = {
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
                    return (Math.floor(value / 1000 * 100) / 100).toString() + 'k'
                }else{
                    return (Math.floor(value * 100) / 100).toString()
                }

            }
        },
        title: {
            text: 'Transactions count',
            offsetX: 5
        },
    }],
    tooltip: {
        theme: 'dark',
        x: { show: true },
        followCursor: true,
        y: {
            formatter(y) {
                return (Math.floor(y * 100) / 100).toString()
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
const avgChart: ChartType = {
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
    colors: ['#43d39e', '#f77e53', '#ffbe0b', '#91FDFF', '#FFB0AF', '#31393C', '#D591F2', '#0A6D72', '#E0D0EA', '#6F5A96', '#40160F'],
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
                    return (Math.floor(value * 100) / 100).toString()
                }

            }
        },
        title: {
            text: 'Average bill per customer',
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
    salesChart, causalChart, transChart, avgChart
};
