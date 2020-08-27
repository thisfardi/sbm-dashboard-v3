const saleChart: Object = {
    type: "stackedcolumn3dlinedy",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource: {
        chart: {
            caption: "Total sales comparison",
            subcaption: "",
            yaxisname: "Netsale and discount [USD]",
            numberprefix: "$",
            syaxisname: "Transactions count [Number]",
            theme: "fusion"
        },
        categories: [{
            category: []
        }],
        dataset: []
    }
}
const saleDetailChart: Object = {
    type: "msline",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource: {
        chart: {
            caption: "Sale details comparison",
            subcaption: "",
            showhovereffect: "1",
            numberprefix: "$",
            yaxisname: "Netsale[USD]",
            drawcrossline: "1",
            plottooltext: "<b>$dataValue</b> $seriesName",
            theme: "fusion"
        },
        categories: [{
            category: []
        }],
        dataset: []
    }
}
const avgChart: Object = {
    type: "column3d",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource: {
        chart: {
            caption: "Average bill",
            yaxisname: "Bill per customer [USD]",
            showvalues: "1",
            numberprefix: "$",
            theme: "fusion"
        },
        data: []
    }
}
const promotionChart: Object = {
    type: "column3d",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource: {
        chart: {
            caption: "Promotion",
            yaxisname: "Promotion [USD]",
            showvalues: "1",
            numberprefix: "$",
            theme: "fusion"
        },
        data: []
    }
}
const tipChart: Object = {
    type: "column3d",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource: {
        chart: {
            caption: "Tips",
            yaxisname: "Tips [USD]",
            showvalues: "1",
            numberprefix: "$",
            theme: "fusion"
        },
        data: []
    }
}
const taxChart: Object = {
    type: "column3d",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource: {
        chart: {
            caption: "Tax",
            yaxisname: "Tax [USD]",
            showvalues: "1",
            numberprefix: "$",
            theme: "fusion"
        },
        data: []
    }
}
const paymentChart: Object = {
    width: "100%",
    height: "100%",
    type: "sunburst",
    dataFormat: "json",
    dataSource: {
        chart: {
            caption: "Payment details comparison",
            baseFontColor: "#000",
            showplotborder: "0.1",
            theme: "gammel",
            labelDisplay: "Auto",
            plotToolText: "$label <br> Amount: $dataValue <br> Percent: $percentValue",
            toolTipBgColor: "#000000",
            toolTipColor: "#eeeeee",
            toolTipBgAlpha: "80",
            showBorder: "0",
        },
        data: [],
        styles: {
            definition: [{
                name: "myHTMLFont",
                type: "font",
                ishtml: "1"
            }],
            application: [{
                toobject: "TOOLTIP",
                styles: "myHTMLFont"
            }]
        }
    }
}
const articleChart: Object = {
    width: "100%",
    height: "100%",
    type: "sunburst",
    dataFormat: "json",
    dataSource: {
        chart: {
            caption: "Groups and articls comparison",
            baseFontColor: "#000",
            showplotborder: "0.1",
            theme: "gammel",
            labelDisplay: "Auto",
            plotToolText: "$label <br> Amount: $dataValue <br> Percent: $percentValue",
            toolTipBgColor: "#000000",
            toolTipColor: "#eeeeee",
            toolTipBgAlpha: "80",
            showBorder: "0",
            decimals: "2"
        },
        data: [],
        styles: {
            definition: [{
                name: "myHTMLFont",
                type: "font",
                ishtml: "1"
            }],
            application: [{
                toobject: "TOOLTIP",
                styles: "myHTMLFont"
            }]
        }
    }
}

const netsalePeriodChart: Object = {
    type: "column3d",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource: {
        chart: {
            caption: "Netsale compare",
            yaxisname: "Netsale [USD]",
            showvalues: "1",
            numberprefix: "$",
            theme: "fusion"
        },
        data: []
    }
}
const transactionPeriodChart: Object = {
    type: "column3d",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource: {
        chart: {
            caption: "Transaction compare",
            yaxisname: "Transaction count",
            showvalues: "1",
            numberprefix: "",
            theme: "fusion"
        },
        data: []
    }
}
const avgPeriodChart: Object = {
    type: "column3d",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource: {
        chart: {
            caption: "Average bill",
            yaxisname: "USD",
            showvalues: "1",
            numberprefix: "$",
            theme: "fusion"
        },
        data: []
    }
}
const taxPeriodChart: Object = {
    type: "column3d",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource: {
        chart: {
            caption: "Tax compare",
            yaxisname: "USD",
            showvalues: "1",
            numberprefix: "$",
            theme: "fusion"
        },
        data: []
    }
}
const tipPeriodChart: Object = {
    type: "column3d",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource: {
        chart: {
            caption: "Tip compare",
            yaxisname: "USD",
            showvalues: "1",
            numberprefix: "$",
            theme: "fusion"
        },
        data: []
    }
}
const promotionPeriodChart: Object = {
    type: "column3d",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource: {
        chart: {
            caption: "Promotion compare",
            yaxisname: "USD",
            showvalues: "1",
            numberprefix: "$",
            theme: "fusion"
        },
        data: []
    }
}
const discountPeriodChart: Object = {
    type: "column3d",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource: {
        chart: {
            caption: "Discount compare",
            yaxisname: "USD",
            showvalues: "1",
            numberprefix: "",
            theme: "fusion"
        },
        data: []
    }
}
const paymentPeriodChart: Object = {
    type: "column3d",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource: {
        chart: {
            caption: "Payment compare",
            yaxisname: "USD",
            showvalues: "1",
            numberprefix: "",
            theme: "fusion"
        },
        data: []
    }
}
export{
    saleChart,
    saleDetailChart,
    avgChart,
    promotionChart,
    tipChart,
    taxChart,
    paymentChart,
    articleChart,
    netsalePeriodChart,
    transactionPeriodChart,
    avgPeriodChart,
    taxPeriodChart,
    tipPeriodChart,
    promotionPeriodChart,
    discountPeriodChart,
    paymentPeriodChart
}
