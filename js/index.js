$(document).ready(function() {
  //html element where city and country name go
  var $location = $('#location');
  var $temp = $('#temp'); //temperature in C or F
  var $tempValue = $('#temp-value'); //numeric value of temperature
  var $weather = $('#weather');
  var city, country;
  var link; //url of openweather API 
  var tempF, tempC;

  $('#location-input span').hide();

  //getting location throuhg ip-api.com
  var location = "http://ip-api.com/json/?callback=?";
  $.getJSON(location, function(json) {
    city = json.city;
    country = json.countryCode;
    //using city and country for openweathermap API 
    link = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + country + '&units=metric' + '&APPID=2f9b472a63e30a9ce15fc71fef87be77';
    $.getJSON(link, function(json) {
      getWeather(json);
    });
  });

  //finds weather specified by user 
  $('#submit').on('click touchstart', function() {
    defineLocation();
  });

  //finds weather if user presses Enter after typing city and country
  $('input').bind('enter', function() {
    defineLocation();
  });

  //switching between degrees C and degrees F  
  $('#temp').on('click', function() {
    convertTemp();
  });

  function convertTemp() {
    if ($temp.text() == 'C') {
      tempF = Math.round(tempC * 9 / 5 + 32);
      $tempValue.text(tempF);
      $temp.text('F');
    } else {
      $tempValue.text(tempC);
      $temp.text('C');
    }
  };

  //  defines event listener for pressing Enter key in the input field(s)
  $('input').keyup(function(e) {
    if (e.keyCode == 13) {
      $(this).trigger('enter');
    }
  });

  function defineLocation() {
    var $span = $('#location-input span');
    $span.hide();
    city = $('#new-city').val();
    country = $('#new-country').val();
    var reg = /[^\-.A-Za-z]/;
    if (city === "") $('span:contains("Which city")').show();
    else if (city.match(reg)) $('span:contains("Wrong city")').show();
    else if (country.match(reg)) $('span:contains("Wrong country")').show();
    else {
      link = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + country + '&units=metric' + '&APPID=2f9b472a63e30a9ce15fc71fef87be77';
      $.getJSON(link, function(json) {
        getWeather(json);
      });
    }
  }

  //gets weather for the city and country located by Google API
  function getWeather(json) {
    var cityName = json.name;
    var countryName = json.sys.country;
    if (countryName === 'GB') countryName = 'UK';
    $location.text(cityName + ', ' + countryName); //city and country
    tempC = Math.round(json.main.temp); //temp in degrees C
    $tempValue.text(tempC);
    var url = 'http://openweathermap.org/img/w/' + encodeURIComponent(json.weather[0].icon) + '.png';
    $weather.text(json.weather[0].main);
    $('#weather-icon').attr('src', url);
    window.scrollTo(0, 0);
    $('input').val("");
  };

});