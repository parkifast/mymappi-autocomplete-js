# mymappi-sdk

- [Autocomplete](#autocomplete)
  - [About](#about)
  - [Installation](#installation)
      - [Styling](#styling)
  - [Options](#options)
    - [Static options](#static-options)
  - [Methods](#methods)
    - [`initAutocomplete`](#initautocomplete)
    - [`removeAutocomplete(autocompleteInstance)`](#removeautocompleteautocompleteinstance)
  - [Events](#events)
    - [Types](#types)
  - [Types](#types-1)
    - [Results](#results)
    - [Layers](#layers)
  - [Styles](#styles)
    - [List of styles](#list-of-styles)
- [geocoding](#geocoding)
  - [About](#about-1)
  - [Installation](#installation-1)
  - [Options](#options-1)
  - [Methods](#methods-1)
    - [`search(query)`](#searchquery)

# Autocomplete
## About
The purpose of this library is to implement our autocomplete functionality on your website.

## Installation 

To use the mymappiSDK all you need is an `<input>`, and some javascript code to load the package library.

Our js library is available on the [npm](https://www.npmjs.com/package/mymappi-sdk).

**This is the small example of using it:**

install the package by npm command:
```
npm i mymappi-sdk
```

And implement it in your project in one of the ways listed below:
- in html file:
    ```
    <input id="input" type="text" id="address" placeholder="Write here you address">

    <script src="./node_modules/mymappi-sdk/dist/mymappiSDK.js"></script>
    <script>
        var input = document.getElementById('input');
        var options = {
                input: input,
                apiKey: 'YOUR_API_KEY'
            };

        var mymappi;
    
        mymappiSDK.initAutocomplete(options).then((instance) => {
            mymappi = instance;
        });
    </script>  
    ```

- by `require` in your js file:
    ```
    const mymappiSDK = require('mymappi-sdk');

    var input = document.getElementById('input');

    var options = {
        input: input,
        apiKey: 'YOUR_API_KEY'
    };

    var mymappi;
    
    mymappiSDK.initAutocomplete(options).then((instance) => {
        mymappi = instance;
    });
    ```

- by `import` in your js file:
    ```
    import * as mymappiSDK from 'mymappi-sdk';

    var input = document.getElementById('input');
    var options = {
            input: input,
            apiKey: 'YOUR_API_KEY'
        };

    var mymappi;

    mymappiSDK.initAutocomplete(options).then((instance) => {
        mymappi = instance;
    });
    ```

After the initialization your html structure will change from this: 
```
<div class="input-container">
  <input id="input" type="text">
  <label for="input">Search for address</label>
</div>
```

To this:  
```
<div class="input-container">
  <div class="wrapper">
      <input id="input" type="text">
      <label for="input">Search for address</label>
      <div class="result-container"></div>
  </div>
</div>
```

The `wrapper` is added as the child node of the `input-container`. The `input` field will be moved inside of the `wrapper` and set as the first child of it. If you have some event listeners on the `input`, it will still work. The last child of the `wrapper` will be the `div` which will contain the search results.
#### Styling
By default the wrapper is set to `width: 100%`, so it will take all available space in the `input-container`. So the best way to style the width of your input is to set the input to `width: 100%`. Thanks to this the width of input and shearch results list will depend on the width of `input-container`

ex:
**styles.css:**
```
.input-container {
    width: 300px;
}
input {
    width: 100%;
}
```
The style above will set the width of the input and search result list on 300px.

> In case of some visual deformation of the input (wrong width, or input not in the center of input-container), adding to the input style `box-sizing: border-box;` may fix it.

## Options
### Static options

These options can only be set during the instantiation of the autocomplete application using

| Static options | Description |
| --- | --- |
| `input` **\*** <br><br>type: [HTMLElement](https://www.w3.org/2003/01/dom2-javadoc/org/w3c/dom/html2/HTMLInputElement.html)<br><br> **\*** **Required** | The input from the page. You just need to pass a reference to an Element. Obtained via `document.getElementById` for example.<br><br>**Important:** This parameter can only be set at instantiation. |
| `apiKey` **\***<br><br>type: **string**<br><br>**\*** **Required** | Your private api id which you get from us.<br><br>**Important:** This parameter can only be set at instantiation. |
| `maxResults`<br><br>type: **number**<br>**Default: 5** | It determines the number of results which will be shown on the list.<br><br>**Default value is 5**. If you want a different value add this parameter ex. `maxResults: 8`. **The value must be bigger than 0** <br><br>**Important:** This parameter can only be set at instantiation.|
| `searchDelay`<br><br>type: **number**<br>**Default: 0** | It determines the delay time with which the request will be executed after entering the last value into the input field. **Remember that this value should be given in miliseconds**.<br><br> **Default value is 0**. If you want to set a different delay time, please add this parameter ex. `searchDelay: 2000`<br><br>**Important:** This parameter can only be set at instantiation. |
| `autofocus` <br><br>type: **boolean**<br>**Default: true** | Decides whether the user's ip address will be retrieved in order to get the lat/lon coordinates, which will be used to better match the search results.<br><br>**Default it's set to true** if you want to disable it, you should add this parameter with false value ex.`autofocus: false`. **Remember that this parqmeter has no effect when latLonGetter is specified**<br><br>**Important:** This parameter can only be set at instantiation. |
| `lang`<br><br>type: **string** | Determines the language in which the result will be shown. Expect format is two letters ex. 'es', 'en'...<br><br>**If not set it will be determined based on user browser language**<br><br>**Important:** This parameter can only be set at instantiation. |
| `countries`<br><br>type: **string** | This parameter determines the countries on which the search will be based. The country code should be in ISO-3166 country code in either alpha2 or alpha3 format. You can specify multiple comma separated country codes, ex. `countries: 'gb,pl,es'`.<br><br>Add this parameter to get more accurate results to your needs. Skip this parameter if you don't want the search to be limited to a specific countries<br><br>**Important:** This parameter can only be set at instantiation. |
| `layers`<br><br>type: **string** ([layers](#layers))<br>**Default:  address,street,venue** | Filter only by the kind of places that you want to find. You can specify multiple comma separated layers, ex. `layers: 'venue,street'`. **Adding `'fullList'` as value for this parameter will provide search results based on the full layer list** <br><br>**Important:** This parameter can only be set at instantiation. |
| `missingAddressBtn`<br><br>type: **boolean** | This parameter determines if on the bottom or result array will be shown an extra btn. This btn allow you to let the user add the address that wasn't find by the search.<br><br>**Clicking on the button will activate the event trigger. Handling this event is on your side, we only provide the option of such button and an event informing about its click**.<br><br>To detect the event set on the event listener on input. Name of the event is '**mymappiMissingAddressBtnClicked**'.<br><br>**Important:** This parameter can only be set at instantiation. |
| `postalCodeFilter`<br><br>type: **Function: string** | This parameter determines the postal code on which the search should be based.<br><br>In this place you should give the function which will return the value of type **string**. You can have a special separate input for that, just add the function which returns its value.<br><br>**Important:** This parameter can only be set at instantiation. |
| `focusCoordinates`<br><br>type: **function: [number,number]** | This one determines the approximation for search, which will be based on the latitude and longitude values.<br><br>Here you should add the function which will return the array with both (lat/lon) coordinates, **both should have a type of number**.<br><br>Rember that when this parameter is set than we won't get the lat/lon from the user IP address.<br><br>**Important:** This parameter can only be set at instantiation. |

## Methods

### `initAutocomplete`

`initAutocomplete(options)` - This method will return the promise with the instance of the class of mymappiSdk on the given input element. The parameter of this method is an object which include [options parameters](#static-options).

Example of implementation:

```
let input = document.getElementById('input');
const options = {
    input: input,
    apiKey: 'YOUR_API_KEY',
    postalCodeFilter: getPostcode(),
    countries: 'en'
};

let mymappi;

mymappiSDK.initAutocomplete(options).then((instance) => {
    mymappi = instance;
});
```


### `removeAutocomplete(autocompleteInstance)`

`removeAutocomplete(autocompleteInstance)` - This method will remove given instance of the autocomplete from your app. All the extra HTMLelemnts will be removed, children of the `input` parent will be restored to the same order as before initialization and all event listeners will also be removed. The parameter of this methos is an instance of autocomplete.

Example of usage:

```
let mymappi;

mymappiSDK.initAutocomplete(options).then((instance) => {
    mymappi = instance;
});

mymappiSDK.remove(mymappi);
```
## Events 

All the events will be dispatch on the given input, so to catch the event set the event listener on your input:

```
let input = document.getElementById('super-input');
input.addEventListener('mymappiClickedResult', (e) => {
    console.log('clickedResult: ');
    console.log(e.detail);	
});
```

### Types
| Event name | Description |
| --- | --- |
| `mymappiMissingAddressBtnClicked` | This event will be triggered when the user will click on unknownAddress button. You can use it to detect when to display a special window with a form to enter the address when the user does not find the address they are looking for using the search function |
| `mymappiClickedResult`<br><br>detail: **[Result](#types-1)** | This event will be triggered when the user clicks on the result. In the detail parameter `event.detail` you'll be able to find the details about the result which you may use to display in your form etc.. |
| `mymappiNewResults`<br><br>detail: array of **[Result](#types-1)** | This event will be triggered everytime when the fetch method will return some values. In the detail parameter `event.detail` you'll be able to find the details about the results which were find. **It will also return an empty array `[]` when there was no results.** |
| `mymappiHoverResult`<br><br>detail: **[Result](#types-1)** | This event will be triggered everytime when user will hover over the one of the results. In the detail parameter `event.detail` you'll be able to find the details about the hovered result |

## Types

### Results

| type name | Description |
| --- | --- |
| Result | - `alpha2_country_code` - ISO 3166-1 alpha-2 – two-letter country code<br> - `alpha3_country_code` - ISO 3166-1 alpha-3 – three-letter country code<br> - `confidence`  - <br> - `continent` - The continent where the result lies<br> - `country` - The country full name, where the result is located<br> - `display_address` - The address part of the result<br> - `display_name` - Full result displayed name in one string<br> - `display_region` - The region part of the result<br> - `localadmin` - superior local administrative city<br> - `locality` - The locality from the result<br> - `neighbourhood` - The name of the result neghbourhood<br> - `region` - The name of the result region<br> - `venue` - The venue from the result<br> - `lat` - Latitude <br> - `lon` - Longitude <br> - `layer` - Type of the result. [Layer types](#Layers)<br><br>**Important:** The content of result depends on the value of layer. Different types of results may not have some of the parameters listed above  |
| Options |  |

### Layers
| layer name | Description |
| --- | --- |
| `venue` | Points of interest, businesses, things with walls |
| `address` | Places with a street address |
| `street` | Streets, roads, highways |
| `neighbourhood` | Social communities, neighbourhoods |
| `borough` | A local administrative boundary, currently only used for New York City |
| `localadmin` | Local administrative boundaries |
| `locality` | Towns, hamlets, cities |
| `county` | Official governmental area; usually bigger than a locality, almost always smaller than a region |
| `macrocounty` | A related group of counties, mostly in Europe |
| `region` | States and provinces |
| `macroregion` | A related group of regions, mostly in Europe |
| `country` | Places that issue passports, nations, nation-states |
| `coarse` | Alias for simultaneously using all administrative layers (everything exept `venue` and `address`) |
| `postalcode` | Postal code used by mail services |

## Styles
Here are the list of the css classes. The full css code can be find on the [github page](https://). By knowing the classes names you can manipulate them by some css tricks like changing the width of the wrapper to your custom one:
```
.input-container > my-wrapper {
    width: 80%;
}
```

### List of styles
```
/* The input wrapper */
.my-wrapper {}

/* Container for all results */
.my-result-container {}

/* The styles change to make results visible */
.my-results-container--visible {}

/* Result box style */
.my-result {}

/* Hover effect for result box */
.my-result-hover {}

/* The container of the result icon */
.my-result-icon-container {}

/* The style of the svg icon */
.my-result-icon {}

/* Special style for point svg */
.my-result-icon-point {}

/* Hover effect for icons */
.my-result-icon-container > .my-result-icon-hover {}

/* The style of address part of the result */
.my-result-address {}

/* The style of region part of the result */
.my-result-region {}

/* The end bar of the result container */
.my-results-container-end {}

/* The style of text of the bottom bar */
.my-results-container-end-text {}

/* The size of the company logo */
.my-results-container-end-img {}

/* Ths style for addNewAddress btn */
.my-result-container-end-btn {}

/* Hover effect for the addNewAddress btn */
.my-result-container-end-btn:hover {}

/* The company logo layout styles */
.my-result-container-end-company-link {}

/* Hover effect for company logo */
.my-result-container-end-company-link:hover {}
```

# geocoding

## About
A class that you can use to send a direct request to the geocoding api containing the query.

## Installation

Our js library is available on the [npm](https://npm.com).

install the package by npm command:
```
npm install mymappi-sdk --save
```

And implement it in your project in one of the ways listed below:

- in html file:
    ```
    <script src="./node_modules/mymappi-sdk/dist/mymappiSDK.js"></script>
    <script>
        const options = {
            apiKey: 'API_KEY',
        };

        const geocoding = mymappiSDK.initGeocoding(options)
            .then(function (result) {
                console.log(result);
            });
    </script>  
    ```

- by `require` in your js file:
    ```
    const mymappiSDK = require('mymappi-sdk');

    const options = {
        apiKey: 'API_KEY',
    };

    const geocoding = mymappiSDK.initGeocoding(options);
    ```

- by `import` in your js file:
    ```
    import * as mymappiSDK from 'mymappi-sdk';

    const options = {
        apiKey: 'API_KEY',
    };

    const geocoding = mymappiSDK.initGeocoding(options);
    ```

## Options
This options may be passed to the constructor during the initialization of the class to set more strict rules for searching api.

| Options | Description |
| --- | --- |
| `apiKey` **\***<br><br>type: **string**<br><br>**\*** **Required** | Your private api id which you get from us. |
| `maxResults`<br><br>type: **number**<br>**Default: 10** | It determines the number of results which will be shown on the list.<br><br>**Default value is 10**. If you want a different value add this parameter ex. `maxResults: 8`. **The value must be bigger than 0** |
| `lang`<br><br>type: **string** | Determines the language in which the result will be shown. Expect format is two letters ex. 'es', 'en'...<br><br>**If not set it will be determined based on user browser language** |
| `country`<br><br>type: **string** | This parameter determines the country on which the search will be based. The country code should be in ISO-3166 country code in either alpha2 or alpha3 format.<br><br>Add this parameter to get more accurate results to your needs. Skip this parameter if you don't want the search to be limited to a specific countries |
| `layers`<br><br>type: **string** ([layers](#layers))<br>**Default: address,street,venue** | Filter only by the kind of places that you want to find. You can specify multiple comma separated layers, ex. `layers: 'venue,street'`. **Adding `'fullList'` as value for this parameter will provide search results based on the full layer list**  |
| `postalCode`<br><br>type: **string** | This parameter determines the postal code on which the search should be based. |
| `sourceLat`<br><br>type: **number** | This one determines the approximation for search, which will be based on the latitude values. |
| `sourceLong`<br><br>type: **number** | This one determines the approximation for search, which will be based on the longitude values. |

## Methods

### `search(query)`

The search method will prepare the request with given query to get the search result from the api. This method will return a promise. **The abort method is implemented into fetch, so all aborted requests will return `undefined`**. There are 3 types of result which may be returned:
- `undefined` - This mean that the request was aborted or some errors happend during the fetch.
- `[]` - when nothing was found
- `[results]` - When api found results for the given query

So good practice is to give an if statement inside of `then()`, to catch all the undesirable results. For ex.
```
const geocoding = mymappiSDK.initGeocoding(options);

geocoding.search("some street")
    .then(function (result) {
        if (result) {
            console.log(result);
        }
    });
```


Icons by [Free Preloaders](https://freeicons.io/profile/726) on [freeicons.io](https://freeicons.io).