

export class AbstractChart {
    constructor(data, attribute, parentDomElement) {
        this.data = data;
        this.attribute = attribute;
        this.attributeGroup = attribute + "Group";
        this.attributeDimension = attribute + "Dimension";
        this.backgroundColor = null;
        this.initBackgroundColor = null;

        this.parentDomElement = parentDomElement;
        // this needs to be implemented by the subclasses
        this.chart = null;
        this.observers = [];
        this.currentFilters = [];
        this.updateBackgroundColor = null;
        this.initState = true;

        // the click listener will do the following:
        this.clickListener = (evt) => {
            // determine the selected value

            const activeSector = this.chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
            if (activeSector.length) {

                // get event
                const firstPoint = activeSector[0];
                const label = this.chart.data.labels[firstPoint.index];
                const value = this.chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
                console.log("clicked!", label, value);

                // save current filter attributes
                if (this.currentFilters.includes(label))
                    this.currentFilters = this.currentFilters.filter(e => e !== label)
                else
                    this.currentFilters.push(label);

                // do the filtering
                if (this.currentFilters.length > 0)
                    this.data[this.attributeDimension].filter(a =>
                        this.currentFilters.includes(a)
                    );
                else
                    this.data[this.attributeDimension].filter(null);

                console.log("current filters " + this.attributeDimension, this.currentFilters, this.data[this.attributeDimension].currentFilter());

                // update background color

                if (this.initBackgroundColor)
                    this.updateBackgroundColor(firstPoint.index);

                // update all charts
                this.observers.forEach(obs => obs.update());
            }
        }
    }

    update() {
        // update chart
        this.chart.data.labels = this.data[this.attributeGroup].map(a => a.key);
        this.chart.data.datasets[0].data = this.data[this.attributeGroup].map(a => a.value);
        this.countFilteredData();
        this.chart.update();
    }

    countFilteredData() {
        const sumAttr = this.data.sumAttr;
        var filteredDataCount = this.data.groupAll().reduceSum(function (d) { return d[sumAttr]; }).value();
        filteredDataCount.toLocaleString(
            undefined, // leave undefined to use the visitor's browser 
            // locale or a string like 'en-US' to override it.
            { minimumFractionDigits: 2 }
        );
        document.getElementById("filter-count").innerHTML = filteredDataCount;
    }

    addObserver(obs) {
        this.observers.push(obs);
    }

}
