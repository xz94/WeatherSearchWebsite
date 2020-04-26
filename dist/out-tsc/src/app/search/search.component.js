import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
let SearchComponent = class SearchComponent {
    constructor(http) {
        this.http = http;
        this.options = [];
        this.formattedAddress = "";
    }
    ngOnInit() {
        this.searchForm = new FormGroup({
            'street': new FormControl(null, Validators.required),
            'city': new FormControl(),
            'state': new FormControl(),
            'curLoc': new FormControl()
        });
    }
    getGeo() {
        this.http.get('http://localhost:3000/addressWeather?street=' + this.street + '&city=' + this.city + '&state=' + this.state)
            .subscribe((data) => {
            this.weatherData = data;
            console.log(data);
        });
    }
    getCur() {
        this.http.get('http://localhost:3000/curLocWeather').subscribe((data) => {
            console.log(data);
        });
    }
    onSubmit() {
        if (this.searchForm.get('curLoc').value != true) {
            this.street = this.searchForm.get('street').value;
            this.city = this.searchForm.get('city').value;
            this.state = this.searchForm.get('state').value;
            this.getGeo();
        }
        else {
            this.getCur();
        }
    }
    onUpdateCity(event) {
        var output = event.target.value;
        this.http.get('http://localhost:3000/autoComplete?userInput=' + event.target.value)
            .subscribe((data) => {
            // data is an array with at most 5 elements
            this.options = [];
            for (var i = 0; i < 5; i++) {
                if (data[i] != undefined) {
                    // console.log(data[i].structured_formatting.main_text);
                    this.options.push(data[i].structured_formatting.main_text);
                }
                else {
                    break;
                }
            }
        });
    }
};
SearchComponent = tslib_1.__decorate([
    Component({
        selector: 'app-search',
        templateUrl: './search.component.html',
        styleUrls: ['./search.component.css']
    })
], SearchComponent);
export { SearchComponent };
//# sourceMappingURL=search.component.js.map