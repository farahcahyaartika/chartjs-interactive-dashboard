import { AbstractChart } from './AbstractChart';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export class BarChartWrapper extends AbstractChart {

    constructor(data, attribute, parentDomElement) {
        super(data, attribute, parentDomElement)

        // then create the bar chart and attach it to the parentDomElement

        this.initBackgroundColor = [
            'rgba(255, 99, 132)',
            'rgba(255, 159, 64)',
            'rgba(255, 205, 86)',
            'rgba(75, 192, 192)',
            'rgba(54, 162, 235)',
            'rgba(153, 102, 255)',
            'rgba(201, 203, 207)'
        ];
        this.backgroundColor = [...this.initBackgroundColor];

        this.resetLink = document.getElementById("bar-reset");

        // var backgroundColor = [
        //     'rgba(75, 192, 192, 0.2)',
        //     'rgba(75, 192, 192, 0.2)',
        //     'rgba(75, 192, 192, 0.2)',
        //     'rgba(75, 192, 192, 0.2)',
        //     'rgba(75, 192, 192, 0.2)',
        //     'rgba(75, 192, 192, 0.2)',
        //     'rgba(75, 192, 192, 0.2)'
        // ]

        console.log("age group", this.data[this.attributeGroup]);
        const chartData = {
            // labels: this.data[this.attributeGroup].map(a => a.key),
            datasets: [{
                label: 'My First Dataset',
                // data: this.data[this.attributeGroup].map(a => a.value),
                data: this.data[this.attributeGroup],
                backgroundColor: this.backgroundColor,
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        };

        const chartConfig = {
            type: 'bar',
            data: chartData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                parsing: {
                    xAxisKey: 'key',
                    yAxisKey: 'value'
                },
                responsive: true,
                maintainAspectRatio: false
            },
        };

        if (this.chart instanceof Chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(
            this.parentDomElement,
            chartConfig
        );

        this.parentDomElement.addEventListener("click", this.clickListener);


        // this.updateBackgroundColor = (index) => {
        //     let color = this.backgroundColor[index];
        //     if (!color.includes(', 0.2)'))
        //         this.backgroundColor[index] = color.replace(')', ', 0.2)')
        //     else
        //         this.backgroundColor[index] = color.replace(', 0.2)', ')')

        //     this.chart.data.datasets[0].backgroundColor = this.backgroundColor;
        // }

        this.updateBackgroundColor = (index) => {
            console.log("Init State: ", this.initState);
            if (this.initState) {
                for (let i = 0; i < this.backgroundColor.length; i++) {
                    if (i == index) continue;
                    let color = this.backgroundColor[i];
                    this.backgroundColor[i] = color.replace(')', ', 0.2)')
                }
                this.initState = false;
            } else {
                let color = this.backgroundColor[index];
                if (!color.includes(', 0.2)'))
                    this.backgroundColor[index] = color.replace(')', ', 0.2)')
                else
                    this.backgroundColor[index] = color.replace(', 0.2)', ')')
            }

            // assign new background color
            this.chart.data.datasets[0].backgroundColor = this.backgroundColor;
        }

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
        this.currentFilters = [];
        // this.currentFilters = this.data[this.attributeGroup].map(a => a.key);
        this.backgroundColor = [...this.initBackgroundColor];
        this.chart.data.datasets[0].backgroundColor = this.backgroundColor;
        console.log("Background Color", this.chart.data.datasets[0].backgroundColor)

        this.update();
        console.log("Chart has been reset: ", this.attribute);
    }



    // this is probably not needed
    addObserver(obs) {
        super.addObserver(obs);
    }

}