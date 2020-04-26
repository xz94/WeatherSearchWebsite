import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
let HourlyComponent = class HourlyComponent {
    constructor() {
        this.barChartLabels = [];
        this.barChartOptions = {
            scaleShowVerticalLines: false,
            responsive: true
        };
    }
    // public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    for() { }
};
HourlyComponent = tslib_1.__decorate([
    Component({
        selector: 'app-hourly',
        templateUrl: './hourly.component.html',
        styleUrls: ['./hourly.component.css']
    })
], HourlyComponent);
export { HourlyComponent };
var i = 0;
i < 25;
barChartType = 'bar';
barChartLegend = true;
barChartData = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
];
ngOnInit();
{
}
//# sourceMappingURL=hourly.component.js.map