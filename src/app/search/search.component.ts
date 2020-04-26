import { Component, OnInit, Directive, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpEvent } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchForm : FormGroup;
  street: string;
  city: string;
  state: string;
  sealLink = "";
  sealData: any;
  weatherData: any;
  curLocDetails: any;
  formattedAddress = ""; 
  lat: any;
  lng: any;
  
  showResult = false;
  // if the favorite button is already clicked, or if the city is already in the favorite list
  fav = false;
  // if the favorite table is shown
  haveFavorite = false;
  // if the favorite button is clicked
  clickFavorite = false;
  // alert for invalid input
  invalidInput = false;
  showProBar = false;
  showFavAlert = false;
  favList = [];
  elements: any = [];
  options: string[] = [];
  headElements = ['#', 'Image', 'City', 'State', 'Favorite'];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      'street': new FormControl(null, [Validators.required]),
      'city': new FormControl(null, [Validators.required]),
      'state': new FormControl(null, [Validators.required]),
      'curLoc': new FormControl()
    });

  }

  resetForm() {
    this.searchForm.reset();
    this.showResult = false;
    this.invalidInput = false;
    this.showFavAlert = false;
  }

  switchToResult() {
    this.clickFavorite = false;
    this.showFavAlert = false;
    this.haveFavorite = false;
    if (!this.weatherData.forecast) {
      this.invalidInput = true;
    } else {
      if (localStorage.getItem(this.weatherData.city) === null) {
        this.fav = false;
      } else {
        this.fav = true;
      }
      this.showResult = true;
    }
  }

  checkboxChange(checked) {
    if (checked) {
      this.searchForm.get('street').disable();
      this.searchForm.get('city').disable();
      this.searchForm.get('state').disable();
    } else {
      this.searchForm.get('street').enable();
      this.searchForm.get('city').enable();
      this.searchForm.get('state').enable();
    }
  }

  twit() {
    var url = 'https://twitter.com/intent/tweet?hashtags=CICS571WeatherSearch&text=The+current+temperature+at+'
    + this.city + '+is+' + this.weatherData.forecast.currently.temperature + '℉.+The+weather+condition+are+' 
    + this.weatherData.forecast.currently.summary + '.';
    window.open(url, "_blank");
  }

  getSeal() {
    this.showProBar = false;
    this.http.get('http://zhuxuan-homework8.us-east-2.elasticbeanstalk.com/getStateSeal?state=' + this.state)
    .subscribe((data) => {
      this.sealData = data;
      if (this.sealData.sealData.items) {
        this.sealLink = this.sealData.sealData.items[0].link;
        this.showResult = true;
      } else {
        console.log(this.sealData.sealData)
      }
    })
  }

  getGeo() {
    this.http.get('http://zhuxuan-homework8.us-east-2.elasticbeanstalk.com/addressWeather?street=' + this.street + '&city=' + this.city + '&state=' + this.state)
    .subscribe((data) => {
      this.weatherData = data;
      if (this.weatherData.forecast === undefined) {
        this.showProBar = false;
        this.invalidInput = true;
      } else {
        this.getSeal();
      }
    });
    
  }

  showForecast(city, state) {
    this.clickFavorite = false;
    this.haveFavorite = false;
    this.showProBar = true;
    this.http.get('http://zhuxuan-homework8.us-east-2.elasticbeanstalk.com/addressWeather?street=&city=' + city + '&state=' + state)
    .subscribe((data) => {
      if (localStorage.getItem(city) === null) {
        this.fav = false;
      } else {
        this.fav = true;
      }
      this.weatherData = data;
      this.city = this.weatherData.city;
      this.state = this.weatherData.state;
      this.getSeal();
    });
  }

  deleteFavo(city) {
    localStorage.removeItem(city);
    this.getFav();
  }



  getCur() {
    this.http.get('http://ip-api.com/json').subscribe((data) => {
      this.curLocDetails = data;
      this.city = this.curLocDetails.city;
      this.state = this.curLocDetails.region;
      this.lat = this.curLocDetails.lat;
      this.lng = this.curLocDetails.lon;
      if (localStorage.getItem(this.city) === null) {
        this.fav = false;
      } else {
        this.fav = true;
      }
      this.http.get('http://zhuxuan-homework8.us-east-2.elasticbeanstalk.com/getForecast?lat=' + this.lat + '&lng=' + this.lng + '&city=' + this.city + '&state=' + this.state).subscribe((data) => {
        this.weatherData = data;
        this.getSeal();
      })
    });
  }

  getFav() {
    this.showResult = false;
    this.invalidInput = false;
    if (localStorage.length <= 0) {
      this.haveFavorite = false;
      this.showFavAlert = true;
      this.clickFavorite = true;
    } else {
      for (var i = 0; i < localStorage.length; i++) {
        var city = localStorage.key(i);
        var fav = JSON.parse(localStorage.getItem(city));
        this.favList.push({
          city: city,
          state: fav.state,
          seal: fav.seal
        });
      }
      this.showFav();
    }
  }

  showFav() {
    this.elements = [];
    for (var i = 0; i < localStorage.length; i++) {
      var city = localStorage.key(i);
      var places = JSON.parse(localStorage.getItem(city));
      var tableElement = {
        id: i + 1, 
        image: places.seal,
        city: city, 
        state: places.state,
        delete: "delete"
      }
      this.elements.push(tableElement);
    }
    this.showResult = false;
    this.haveFavorite = true;
    this.clickFavorite = true;
  }

  setFav() {
    if (this.fav == false) {
      var place = {
        city: this.city, 
        state: this.state,
        seal: this.sealLink
      }
      localStorage.setItem(this.city, JSON.stringify(place));
      this.fav = true;
    } else {
      localStorage.removeItem(this.city);
      this.fav = false;
    }
  }


  onSubmit() {
    this.showResult = false;
    this.haveFavorite =false;
    this.invalidInput = false;
    this.showFavAlert = false;
    this.clickFavorite = false;
    this.showProBar = true;
    if (this.searchForm.get('curLoc').value != true) {
      this.street = this.searchForm.get('street').value;
      this.city = this.searchForm.get('city').value;
      this.state = this.searchForm.get('state').value;
      if (localStorage.getItem(this.city) === null) {
        this.fav = false;
      } else {
        this.fav = true;
      }
      this.getGeo();
    } else {
      this.getCur();
    }
  }

  
  onUpdateCity(event: Event) {
    this.http.get('http://zhuxuan-homework8.us-east-2.elasticbeanstalk.com/autoComplete?userInput=' + (<HTMLInputElement>event.target).value)
    .subscribe((data) => {
      this.options = [];
      for (var i = 0; i < 5; i++) {
        if (data[i] != undefined) {
          this.options.push(data[i].structured_formatting.main_text);
        } else {
          break;
        }
      }
    })
  }

  reset() {
    this.showResult = false;
  }

}
