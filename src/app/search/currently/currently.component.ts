import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-currently',
  templateUrl: './currently.component.html',
  styleUrls: ['./currently.component.css']
})
export class CurrentlyComponent implements OnInit {
  @Input() weatherData: any;
  @Input() sealLink: any;

  city: string;
  timeZone: string;
  temperature: number;
  summary: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
  visibility: number;
  cloudCover: number;
  oZone: number;
  constructor() { }

  ngOnInit() {
    
  }

  ngOnChanges() {
    var info = this.weatherData.forecast.currently;
    this.city = this.weatherData.city;
    this.timeZone = this.weatherData.forecast.timezone;
    this.temperature = Math.round(info.temperature);
    this.summary = info.summary;
    this.humidity = info.humidity;
    this.pressure = info.pressure;
    this.windSpeed = info.windSpeed;
    this.visibility = info.visibility;
    this.cloudCover = info.cloudCover;
    this.oZone = info.ozone;
    
  }

}
