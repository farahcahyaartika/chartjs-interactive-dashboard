// Sources:
// https://www.youtube.com/watch?v=5xRVrwFNojk
// https://www.chartjs3.com/docs/chart/getting-started/
// https://github.com/sgratzl/chartjs-chart-geo 

import { AbstractChart } from './AbstractChart';
import { Chart, registerables } from 'chart.js';
import { ChoroplethController, GeoFeature, ColorScale, ProjectionScale } from 'chartjs-chart-geo';

Chart.register(...registerables);

// register controller in chart.js and ensure the defaults are set
Chart.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale);

export class GeoChartWrapper extends AbstractChart {

    constructor(data, attribute, parentDomElement, chart) {
        super(data, attribute, parentDomElement)
        this.chart = chart;
        this.parentDomElement.addEventListener("click", this.clickListener);

    }

    // you only need to implement this method if you need to do something specific here
    update() {
        // update labels and values on the chart using this.data
        super.update();
    }

    resetAll() {
        this.data[this.attributeDimension].filterAll();
        this.initState = true;
        this.currentFilters = this.data[this.attributeGroup].map(a => a.key);
        this.update();
        console.log("Chart has been reset: ", this.attribute);
    }

    // this is probably not needed
    addObserver(obs) {
        super.addObserver(obs);
    }



}