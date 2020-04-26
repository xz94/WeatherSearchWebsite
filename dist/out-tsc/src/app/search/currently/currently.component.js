import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
let CurrentlyComponent = class CurrentlyComponent {
    constructor() { }
    ngOnInit() {
    }
    ngOnChanges() {
        if (this.weatherData) {
            this.test = this.weatherData.forecast.cloudCover;
        }
    }
};
tslib_1.__decorate([
    Input()
], CurrentlyComponent.prototype, "weatherData", void 0);
CurrentlyComponent = tslib_1.__decorate([
    Component({
        selector: 'app-currently',
        templateUrl: './currently.component.html',
        styleUrls: ['./currently.component.css']
    })
], CurrentlyComponent);
export { CurrentlyComponent };
//# sourceMappingURL=currently.component.js.map