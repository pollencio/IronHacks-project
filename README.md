# Yelis3's Project - Find Your Home

### Introduction


This is the application that comes up in response to the problem posed by ironhacks:
*_“Find me a safe and affordable place to rent near Department of Computer Science – University of Illinois, Chicago”_*

#### Author:
Yeliana Torres Medina (mail: yatorresm@unal.edu.co - username: Yelis3)   

#### Description of the solution:

Provide real-time data about the conditions of the places that are available for rent, taking into account the price of the apartment (provided by Zillow API), the security score (calculated based on the number of crimes per 1000 inhabitants in the apartment area), and the distance (from there to the Department of Computer Science in the University of Illinois).

To do this, three different types of maps will be displayed:
1. **The price map**, which shows, by color tones, the most expensive areas of the city, where the darkest is the most expensive and the clearest is the most affordable.
2. **The security map**, very similar to the price, with color tones indicating the most dangerous areas (where the area tends to be red). In addition, when click in the pin button (in the right side of the map), it will show specific cases of crimes reported in the city.
3. Finally, the **distance map**, which will show circles of different radios (every 3Km) with center in the Department of Computer Science, to make it easier to identify the proximity or remoteness of the apartments offered, with respect to the location of the university.

In all maps can be marked the places available for rent, crimes in Chicago from 2001 to present, police stations, fire stations, libraries and grocery stores, so that the user can identify the areas that he is interested in analyzing.

In addition, statistics will be shown in the "Statistics" section with numerical data of the three aspects previously described (which will be the most relevant when analyzing the places), to facilitate the decision of the student who does not have knowledge about the city.

#### Datasets:
The datasets and APIs that are used in the application to get all the relevant information are:
1. **Police Stations:** https://data.cityofchicago.org/Public-Safety/Police-Stations/9rg7-mz9y
2. **Libraries - Locations, Hours and Contact Information:** https://data.cityofchicago.org/Education/Libraries-Locations-Hours-and-Contact-Information/psqp-6rmg
3. **Fire Stations:** https://data.cityofchicago.org/Public-Safety/Fire-Stations/b4bk-rjxe
4. **Grocery Stores - 2013:** https://data.cityofchicago.org/Community-Economic-Development/Grocery-Stores-2013/j97f-trs4
5. **Affordable Rental Housing Developments:** https://data.cityofchicago.org/Community-Economic-Development/Affordable-Rental-Housing-Developments/uahe-iimk
6. **Crimes - 2001 to present:** https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-present/6zsd-86xi
7. **OpenWeather 16 day / daily forecast data API:** http://openweathermap.org/forecast16
8. **Zillow GetSearchResults API:** https://www.zillow.com/howto/api/GetSearchResults.htm

#### Keywords:

Rent houses, Rating, Chicago, Real-time, Position, Price, Distance, Security, University of Illinois at Chicago

#### Application URL:

http://datarips.com/hackaton/
