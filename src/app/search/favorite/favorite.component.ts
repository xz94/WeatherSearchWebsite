import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  @Input() favList: any;
  elements: any = [];
  weatherData: any;

  headElements = ['#', 'Image', 'City', 'State', 'Favorite'];

  constructor(private http: HttpClient) { }

  showForecast(city, state) {
    this.http.get('http://localhost:3000/addressWeather?street=' + '&city=' + city + '&state=' + state)
    .subscribe((data) => {
      this.weatherData = data;
    });
  }

  ngOnInit() {
    this.elements = [];
    for (var i = 0; i < localStorage.length; i++) {
      var city = localStorage.key(i);
      var places = JSON.parse(localStorage.getItem(city));
      var tableElement = {
        id: i + 1, 
        image: places.seal,
        city: city, 
        state: places.state
      }
      this.elements.push(tableElement);
    }
  }

}
