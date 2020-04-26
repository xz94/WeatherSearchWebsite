import { Component, OnInit, Input,OnChanges } from '@angular/core';

@Component({
  selector: 'app-hourly',
  templateUrl: './hourly.component.html',
  styleUrls: ['./hourly.component.css']
})
export class HourlyComponent implements OnInit {
  @Input() weatherData: any;

  showTemp = true;
  showPres = false;
  showHumi = false;
  showOzone = false;
  showVisi = false;
  showWindm= false;

  hourlyData : any;
  barChartLabels = [];
  dataPiece = [];
  color = [];
  hoverColor = [];
  barChartType = 'bar';
  labelStringCollection: {
  };
  labelString: string;

  
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      display: true,
      onClick: function (e) {
        e.stopPropagation();
    }
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Fahrenheit"
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Time Difference from Current Hour'
        }
      }]
    }
  }
  
  barChartData = [];

  test: any;
  constructor() { }

  ngOnInit() {
      this.labelStringCollection = {
        temperature: 'Fahrenheit', 
        pressure: 'Millibars',
        humidity: '% Humidity',
        ozone: 'Dobson Units',
        visibility: 'Miles',
        windSpeed: 'Miles'
      }
      this.labelString = "Fahrenheit";
      this.barChartLabels = [];
      this.barChartData = [];
      this.hourlyData = this.weatherData.forecast.hourly.data;
      for (var i = 0; i < 24; i++) {
        this.barChartLabels.push(i.toString());
        this.dataPiece.push(this.hourlyData[i]['temperature']);
        this.color.push('rgb(152, 206, 238)');
        this.hoverColor.push('gray');
      }
      this.barChartData = [
        {data: this.dataPiece, label: 'temperature', backgroundColor: this.color, hoverBackgroundColor : this.hoverColor}
      ];
      
  }

  changeCate(value) {
    this.barChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      legend: {
        display: true,
        onClick: function (e) {
          e.stopPropagation();
      }
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: this.labelStringCollection[value]
          }
        }],
        xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Time Difference from Current Hour'
        }
      }]
      }
    };
    this.barChartLabels = [];
    this.barChartData = [];
    this.dataPiece = [];
    this.hourlyData = this.weatherData.forecast.hourly.data;
    for (var i = 0; i < 24; i++) {
      this.barChartLabels.push(i.toString());
      if (value == 'humidity') {
        this.dataPiece.push(this.hourlyData[i][value]*100);
      } else {
        this.dataPiece.push(this.hourlyData[i][value]);
      }
      this.color.push('rgb(152, 206, 238)');
      this.hoverColor.push('gray');
    }
    this.barChartData = [
      {data: this.dataPiece, label: value, backgroundColor: this.color, hoverBackgroundColor : this.hoverColor}
    ];

  }
}
