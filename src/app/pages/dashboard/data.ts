import { ChartType } from './dashboard.model';

function getDaysInMonth(month, year) {
    const date = new Date(year, month, 1);
    const days = [];
    let idx = 0;
    while (date.getMonth() === month && idx < 15) {
        const d = new Date(date);
        days.push(d.getDate() + ' ' + d.toLocaleString('en-us', { month: 'short' }));
        date.setDate(date.getDate() + 1);
        idx += 1;
    }
    return days;
}

const now = new Date();
const labels = getDaysInMonth(now.getMonth(), now.getFullYear());
const revenueAreaChart: ChartType = {
    chart: {
        height: 282,
        type: 'area',
        toolbar: {
            show: true
        },
    },
    tooltip: {
        theme: 'dark',
        x: { show: false }
    },
    stroke: {
        curve: 'smooth',
        width: 4
    },
    series: [{
        name: 'Netsale',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }],
    dataLabels: {
        enabled: false
    },
    zoom: {
        enabled: false
    },
    legend: {
        show: false
    },
    colors: ['#43d39e'],
    xaxis: {
        type: 'string',
        categories: labels,
        tooltip: {
            enabled: false
        },
        axisBorder: {
            show: false
        },
    },
    yaxis: {
        labels: {
            formatter(val) {
                return '$' + val;
            }
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            type: 'vertical',
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [45, 100]
        },
    },
};

const targetsBarChart: ChartType = {
    chart: {
        height: 282,
        type: 'bar',
        stacked: true,
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '45%',
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
    series: [{
        name: 'Transactions',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }],
    xaxis: {
        categories: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        axisBorder: {
            show: false
        },
    },
    legend: {
        show: false
    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        },
        borderColor: '#f3f4f7'
    },
    tooltip: {
        theme: 'dark',
        y: {
            formatter: (val: any) => {
                return val;
            }
        }
    },
    colors: ['#5369f8', '#43d39e', '#f77e53', '#ffbe0b'],
};

const salesDonutChart: ChartType = {
    plotOptions: {
        pie: {
            donut: {
                size: '70%',
            },
            expandOnClick: false
        }
    },
    chart: {
        height: 298,
        type: 'donut',
    },
    colors: ['#5369f8', '#43d39e', '#f77e53', '#ffbe0b', '#91FDFF', '#FFB0AF', '#31393C', '#D591F2', '#0A6D72', '#E0D0EA', '#6F5A96', '#40160F'],
    legend: {
        show: true,
        position: 'right',
        horizontalAlign: 'left',
        itemMargin: {
            horizontal: 6,
            vertical: 3
        }
    },
    series: [],
    labels: [],
    responsive: [{
        breakpoint: 480,
        options: {
            legend: {
                position: 'bottom'
            }
        }
    }],
    tooltip: {
        y: {
            formatter: (value) => {
                return '$' + value;
            }
        },
    }
};

/*------------------------- Orders table Data ----------------------- */

const ordersData = [
    {
        id: '#98754',
        product: 'ASOS Ridley High',
        name: 'Otto B',
        price: '$79.49',
        status: 'Pending',
    },
    {
        id: '#98753',
        product: 'Marco Lightweight Shirt',
        name: 'Mark P',
        price: '$125.49',
        status: 'Delivered',
    },
    {
        id: '#98752',
        product: 'Half Sleeve Shirt',
        name: 'Dave B',
        price: '$35.49',
        status: 'Declined',
    },
    {
        id: '#98751',
        product: 'Lightweight Jacket',
        name: 'laguna',
        price: '$49.49',
        status: 'Delivered',
    },
    {
        id: '#98750',
        product: 'Marco Shoes',
        name: 'Rik N',
        price: '$69.49',
        status: 'Declined',
    },
];

export { revenueAreaChart, targetsBarChart, salesDonutChart, ordersData };
