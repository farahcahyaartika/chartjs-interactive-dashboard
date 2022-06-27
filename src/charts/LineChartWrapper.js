// Source: https://www.youtube.com/watch?v=TwO5-gdpRmY

import { AbstractChart } from './AbstractChart';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
// import selectPlugin from 'chartjs-plugin-select';
import 'chartjs-adapter-moment';

Chart.register(...registerables);
Chart.register(zoomPlugin);
// Chart.register(selectPlugin);


export class LineChartWrapper extends AbstractChart {

    constructor(data, attribute, parentDomElement) {
        super(data, attribute, parentDomElement)

        // then create the line chart and attach it to the parentDomElement

        this.backgroundColor = 'rgba(255, 99, 132, 0.5)';

        this.resetLink = document.getElementById("line-reset");

        const chartData = {
            // labels: this.data[this.attributeGroup].map(a => a.key),
            datasets: [{
                label: 'My First Dataset',
                // data: this.data[this.attributeGroup].map(a => a.value),
                data: this.data[this.attributeGroup],
                // borderColor: 'rgba(255, 99, 132, 1)',
                borderColor: [this.backgroundColor],
                // backgroundColor: 'rgba(255, 99, 132, 0.2)'
                backgroundColor: [this.backgroundColor]
            }]
        };

        let timer;
        this.zoomListener = ({ chart }) => {
            const { min, max } = chart.scales.x;
            const minDate = new Date(min);
            const maxDate = new Date(max);
            clearTimeout(timer);
            timer = setTimeout(() => {
                console.log('Fetched data between ' + minDate + ' and ' + maxDate);

                // do the filtering
                this.data[this.attributeDimension].filter([minDate, maxDate]);

                // update all charts
                this.observers.forEach(obs => obs.update());


                // chart.stop(); // make sure animations are not running
                // chart.update('none');
            }, 500);
        }

        const chartConfig = {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Chart.js Line Chart'
                    },
                    zoom: {
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true
                            },
                            drag: {
                                enabled: false
                            },
                            mode: 'x',
                            onZoomComplete: this.zoomListener
                        },
                        pan: {
                            enabled: true,
                            mode: 'x',
                            onPanComplete: this.zoomListener
                        },
                        // limits: {
                        //     x: { min: 'original', max: 'original', minRange: 60 * 1000 },
                        // },
                    },
                    // select: {
                    //     select: {
                    //         events: ['mousedown', 'mouseup'], // this is important!
                    //         selectCallback: (startPoint, endPoint) => {
                    //             /*
                    //               Callback after drag select has completed.
                    //             */
                    //             console.log("range start", startPoint);
                    //             console.log("range end", endPoint);
                    //         }
                    //     }
                    // }
                },
                scales: {
                    x: {
                        type: 'time',
                    },
                },
                parsing: {
                    xAxisKey: 'key',
                    yAxisKey: 'value'
                },

            }
        };

        if (this.chart instanceof Chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(
            this.parentDomElement,
            chartConfig
        );

        this.clickResetListener = () => {
            this.resetAll();
            this.observers.forEach(obs => obs.update());
        }

        this.resetLink.addEventListener("click", this.clickResetListener);
    }

    // you only need to implement this method if you need to do something specific here
    update() {
        // update labels and values on the chart using this.data
        super.update();
    }

    resetAll() {
        this.data[this.attributeDimension].filterAll();
        this.initState = true;
        // this.currentFilters = this.data[this.attributeGroup].map(a => a.key);
        this.chart.resetZoom();
        this.update();
        console.log("Chart has been reset: ", this.attribute);
    }
    
    // this is probably not needed
    addObserver(obs) {
        super.addObserver(obs);
    }

}