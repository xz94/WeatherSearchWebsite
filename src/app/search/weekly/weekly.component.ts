import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as CanvasJS from './canvasjs.min';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-weekly',
  templateUrl: './weekly.component.html',
  styleUrls: ['./weekly.component.css']
})
export class WeeklyComponent implements OnInit {
  @Input() weatherData: any;
  @ViewChild('trigger', {static: true}) triggerButton: ElementRef;
  dataPoints = [];

  date: string;
  city: string;
  summary: string;
  temperature: number;
  preciption: number;
  chanceOfRain: string;
  windSpeed: string;
  humidity: any;
  visibility: string;
  icon: string;

  icons = {
    'clear-day' : 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png',
    'clear-night' : 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png',
    'rain' : 'https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png',
    'snow' : 'https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png',
    'sleet' : 'https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png',
    'wind' : 'https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png',
    'fog' : 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png',
    'cloudy' : 'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png',
    'partly-cloudy-day' : 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png',
    'partly-cloudy-night' : 'https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png'
  }

  constructor(private http: HttpClient) { }

  getDate(timestamp) {
    var date = new Date(timestamp*1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return day + '/' + month + '/' + year;
  }

  getDataPoints() {
    this.dataPoints = [];
    var info = this.weatherData.forecast.daily.data;
    for (var i = 0; i < 8; i++) {
      var date = this.getDate(info[i].time);
      var lowTemp = Math.round(info[i].temperatureLow);
      var highTemp = Math.round(info[i].temperatureHigh);
      var dataPiece = {x: i+1, y:[lowTemp, highTemp], label: date};
      this.dataPoints.push(dataPiece);
    }
  }

  createCard(index: number, tem: number) {
    var info = this.weatherData.forecast.daily.data;
    this.date = this.getDate(info[index].time);
    this.temperature = tem;
    this.triggerButton.nativeElement.click();
  }

  ngOnInit() {
    this.getDataPoints();
		var chart = new CanvasJS.Chart("chartContainer", {
    width: 1000,
    responsive: true,
    dataPointWidth: 15,
		animationEnabled: true,
    exportEnabled: false,
		title: {
			text: "Weekly Weather"
    },
    axisX: {
      title: "Days",
    },
    axisY: {
      includeZero: false,
      title: "Temperature in Fahrenheit",
      interval: 10,
      gridThickness: 0
    }, 
    legend:{
      horizontalAlign: "center", // left, center ,right 
      verticalAlign: "top",
    },
		data: [{
      color: "rgba(165, 208, 238)",
      type: "rangeBar",
      showInLegend: true,
      indexLabel: "{y[#index]}",
      legendText: "Daywise Temperature Change",
      toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
      dataPoints: this.dataPoints,
      click: (e) => {
        var index = e.dataPointIndex;
        var info = this.weatherData.forecast.daily.data[index];
        var newDate = e.dataPoint.label;
        var lat = this.weatherData.lat;
        var lng = this.weatherData.lng;
        var time = info.time;
        var weeklyDetail;
        this.city = this.weatherData.city;
        this.http.get('http://zhuxuan-homework8.us-east-2.elasticbeanstalk.com/getWeekly?lat=' + lat + '&lng=' + lng + '&time=' + time)
        .subscribe((data) => {
          weeklyDetail = data;
          var current = weeklyDetail.forecast.currently;
          this.icon = this.icons[current.icon];
          this.date = this.getDate(current.time);
          this.summary = current.summary;
          this.temperature = Math.round(current.temperature);
          this.preciption = current.precipIntensity;
          this.chanceOfRain = current.precipProbability;
          this.windSpeed = current.windSpeed;
          this.humidity = current.humidity*100;
          this.visibility = current.visibility;
          this.triggerButton.nativeElement.click();
        });

      }
    }]
	});
  chart.render();
  }
}
