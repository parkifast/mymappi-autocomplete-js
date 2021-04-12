export default {
    // init
    origParamsInitUndefined: `mymappiSDK: initAutocomplete(): Couldn't find an options object.
    Check if by the mistake you forgot to add a parameter to the init method, or the variable given as parameter is null/undefined.`,
    apiKeyInitUndefined: `mymappiSDK: initAutocomplete(): 'apiKey' is undefined, null, Infinity, NaN or empty string.
    'apiKey' should be a string value with a code which you got from our company.
    If you don't have it, please contact us: https://parkifast.freshdesk.com/support/home
    `,
    apiKeyInitNotString: `mymappiSDK: initAutocomplete(): 'apiKey' must be a string.`,
    multiInput: `mymappiSDK: initAutocomplete(): "input" must point to a single <input> element.
    Instance the library twice if you want to bind two <inputs>`,
    inputInitEmptyNodeList: `mymappiSDK: initAutocomplete(): The nodelist given as 'input' parameter is empty`,
    inputInitStringWrongClass: `mymappiSDK: initAutocomplete(): Culdn't find any node elemnt for the given class specified as a string value in 'input' parameter`,
    inputInitStringWrongClassToMany: `mymappiSDK: initAutocomplete(): Find more than one element in node list for given class specified as string in 'input' parameter`,
    wrongInput: `mymappiSDK: initAutocomplete(): 'input' must point to an <input> element.`,
    postalCodeFilterNotFunction: `mymappiSDK: initAutocomplete(): 'postalCodeFilter' must be a function.`,
    postalCodeFilterInitNotReturnString: `mymappiSDK: initAutocomplete(): 'postalCodeFilter' must return a string.`,
    maxResultsWrongType: `mymappiSDK: initAutocomplete(): 'numbersOfResults' must be a number.
    Check if by mistake you haven't add a undefined, null, Infinity, NaN or string value.`,
    maxResultsSmallNumber: `mymappiSDK: initAutocomplete(): 'maxResults' must be bigger than 0.`,
    searchDelayWrongType: `mymappiSDK: initAutocomplete(): 'searchDelay' must be a number.
    Check if by mistake you haven't add a undefined, null, Infinity, NaN or string value.`,
    searchDelaySmallNumber: `mymappiSDK: initAutocomplete(): 'searchDelay' can't be smaller than 0`,
    countriesNotString: `mymappiSDK: initAutocomplete(): 'countries' must be a string.`,
    countriesStringLength: `mymappiSDK: initAutocomplete(): 'countries' must be at least a 2 letters string, cause the countries should be given in ISO-3166 country code in either alpha2 or alpha3 format.
    Also can't be given an empty string. If you don't want to set any specific country, please don't add this parameter at all.`,
    layersNotString: `mymappiSDK: initAutocomplete(): 'layers' must be a string`,
    layersStringLength: `mymappiSDK: initAutocomplete(): 'layers' can't be an empty string.
    If you don't want to search for any specific layer please don't add this parameter at all.`,
    langNotString: `mymappiSDK: initAutocomplete(): 'lang' must be a string.`,
    langStringLength: `mymappiSDK: initAutocomplete(): 'lang' must be a two letter string: 'es', 'en'...
    If you want to automatic detect user lang from the browser, please don't add this parameter at all.`,
    autofocusNotBool: `mymappiSDK: initAutocomplete(): 'autofocus' must be a boolean value.`,
    focusCoordinatesNotFunctionType: `mymappiSDK: initAutocomplete(): 'focusCoordinatesetter' should be a function which will return the lat long coordinates on which the search will be based on.`,
    focusCoordinatesInitWrongLength: `mymappiSDK: initAutocomplete(): 'focusCoordinatesetter' has to return an array with two values.
    If you don't want to specific lat/long values, you can avoid this parameter.
    Remember that if you want to get a search result without any lat/lon specification, you should set 'autofocus: false' and avoid setting 'focusCoordinatesetter' parameter.
    `,
    focusCoordinatesInitReturnNoNumbersType: `mymappiSDK: initAutocomplete(): Both values given by getter from 'focusCoordinatesetter' parameter should be of type number: [number, number].
    Check if by mistake you haven't add a undefined, null, Infinity, NaN or number in a string.
    `,
    focusCoordinatesInitNotReturningArray: `mymappiSDK: initAutocomplete(): value returned by method given as 'focusCoordinates' shuld be an array type`,
    missingAddressBtnNotBool: `mymappiSDK: initAutocomplete(): 'missingAddressBtn' must be a boolean value.`,

    // during request
    postalCodeFilterNotReturnString: `mymappiSDK:  During the preparation of the request: 'postCodeGetter' must return a string.`,
    postalCodeFilterSearchWithoutPostCode: ` This search was done without a postcode.`,
    focusCoordinatesReturnNoNumbersType: `mymappiSDK: During the preparation of the request: Both values given by getter from 'focusCoordinatesetter' parameter should be of type number: [number, number].
    Check if by mistake you haven't add a undefined, null, Infinity, NaN or number in a string.
    `,
    focusCoordinatesWrongLength: `mymappiSDK: During the preparation of the request: 'focusCoordinatesetter' has to return an array with two values.
    If you don't want to specific lat/long values, you can avoid this parameter.
    Remember that if you want to get a search result without any lat/lon specification, you should set 'autofocus: false' and avoid setting 'focusCoordinatesetter' parameter.
    `,
    focusCoordinatesSearchWithoutLatLon: ` This search was done without the lat/lot coordinates.`,
    response: 'mymappiSDK:  An error has occured: ',

    // remove
    removeClassInstanceIsNull: `mymappiSDK: remove(): Given variable is a null|undefined. The parameter of the remove method should be an instance of mymappi-sdk class.
    Check if by mistake you haven't give an empty/not initialised variable, or if this instance of the class wasn't removed earlier.`,
    removeClassInstanceNotMymappiSdk: `mymappiSDK: remove(): Given variable is not an instance of the mymappi-sdk class.
    Check if by mistake you haven't add wrong variable as a parameter to remove method.`,

    // geocoding
    origParamsGeocodingUndefined: `mymappiSDK: initGeocoding(): Couldn't find an options object.
    Check if by the mistake you forgot to add a parameter to the geocoding method, or the variable given as parameter is null/undefined.`,
    apiKeyGeocodingUndefined: `mymappiSDK: initGeocoding(): 'apiKey' is undefined, null, Infinity, NaN or empty string.
    'apiKey' should be a string value with a code which you got from our company.
    If you don't have it, please contact us: https://parkifast.freshdesk.com/support/home
    `,
    apiKeyGeocodingNotString: `mymappiSDK: initGeocoding(): 'apiKey' must be a string.
    'apiKey' should be a string value with a code which you got from our company.
    This parameter is mandatory to use the geocoding method.
    If you don't have it, please contact us: https://parkifast.freshdesk.com/support/home`,
    queryGeocodingEmptyString: `mymappiSDK: Geocoding: search(): 'query' is an empty string.`,
    queryGeocodingNotString: `mymappiSDK: Geocoding: search(): 'query' must be a string.`,
    postalCodeGeocodingNotString: `mymappiSDK: initGeocoding(): 'postalCode' must be a string.`,
    sourceLatGeocodingWrongType: `mymappiSDK: initGeocoding(): 'sourceLat' parameter should be a number.
    Check if by mistake you haven't add a undefined, null, Infinity, NaN or number in a string.`,
    sourceLonGeocodingWrongType: `mymappiSDK: initGeocoding(): 'sourceLon' parameter should be a number.
    Check if by mistake you haven't add a undefined, null, Infinity, NaN or number in a string.`,
    langGeocodingNotString: `mymappiSDK: initGeocoding(): 'lang' must be a string.`,
    langGeocodingStringLength: `mymappiSDK: initGeocoding(): 'lang' must be a two letter string: 'es', 'en'...
    If you want to automatic detect user lang from the browser, please don't add this parameter at all.`,
    countryGeocodingNotString: `mymappiSDK: initGeocoding(): 'country' must be a string.
    If you don't want to set any specific country, please don't add this parameter at all.`,
    countryGeocodingStringLength: `mymappiSDK: initGeocoding(): 'country' must be at least a 2 letters string, cause the country should be given in ISO-3166 country code in either alpha2 or alpha3 format.
    Also can't be given an empty string. If you don't want to set any specific country, please don't add this parameter at all.`,
    layersGeocodingNotString: `mymappiSDK: initGeocoding(): 'layers' must be a string.`,
    layersGeocodingStringLength: `mymappiSDK: initGeocoding(): 'layers' can't be an empty string.
    If you don't want to search for any specific layer please don't add this parameter at all.`,
    maxResultsGeocodingWrongType: `mymappiSDK: initGeocoding(): 'maxResults' must be a number.
    Check if by mistake you haven't add a undefined, null, Infinity, NaN or string value.`,
    maxResultsGeocodingSmallNumber: `mymappiSDK: initGeocoding(): 'maxResults' must be bigger than 0.`
}
