import errors from "./errors.js";
import { initAutocomplete } from "../index.js";

// region mymappiSDK

/**
 * @typedef {Object} OptionsAutocomplete
 * @property {HTMLElement | Node} input The input under which the search results will be shown
 * @property {function} postalCodeFilter The getter for the postcode value (if set the search will be based on a given postcode)
 * @property {string} apiKey The id of mymappi api
 * @property {boolean} autofocus Set to true will detect user location and search places in his nearest area (default true)
 * @property {function} focusCoordinates The getter for the array with two number values for latitude & longitude, which will be used instead of ip location (default undefined)
 * @property {string} lang If left empty, the app will detect the user browser language and use it during the search
 * @property {string} countries The countries in which the search will be done (Left empty results with search around the world)
 * @property {string} layers The layers which will be search by the api (Left empty to search in all layers)
 * @property {number} maxResults The number of results that will be shown in the list (default 5)
 * @property {number} searchDelay The delay after which the request will be sent
 * @property {boolean} missingAddressBtn If it's true, on the bottom of result array, will be shown btn to add not found address
 */

 /**
  * Check if all parameters are valid
  * @param {OptionsAutocomplete} origParams The original parameters given by the initialization
  * @return {Boolean} True if all parameters are valid
  */
export function checkInit(options) {
    let valid = true;
    // region Check apiKey parameter

    // if null/undefined, error
    if (!options.apiKey) {
        valid = false;
        throw new Error(errors.apiKeyInitUndefined);
    }

    // if not a string, error
    if (!isStringType(options.apiKey)) {
        valid = false;
        throw new Error(errors.apiKeyInitNotString);
    }

    // endregion

    // region Check input parameter

    // multiple DOM elements
    if (options.input instanceof NodeList) {
        if (options.input.length === 0) {
            throw new Error(errors.inputInitEmptyNodeList);
        }
        if (options.input.length > 1) {
            valid = false;
            throw new Error(errors.multiInput);
        }
        // if single node NodeList received, resolve to the first one
        return initAutocomplete({ ...options, input: options.input[0] });
    }

    // input sent as a string, resolve it for multiple DOM elements issue
    if (isStringType(options.input)) {
        const resolvedInput = document.querySelectorAll(options.input);
        if (resolvedInput.length === 0) {
            throw new Error(errors.inputInitStringWrongClass);
        }
        if (resolvedInput.length > 1) {
            throw new Error(errors.inputInitStringWrongClassToMany);
        }
        return initAutocomplete({ ...options, input: resolvedInput[0] });
    }

    // if not an <input>, error
    if (!(options.input instanceof HTMLInputElement)) {
        valid = false;
        throw new Error(errors.wrongInput);
    }

    // endregion

    // region Check postalCodeFilter parameter

    if (options.postalCodeFilter) {

        // if not a function, error
        if (!isFunctionType(options.postalCodeFilter)) {
            valid = false;
            throw new Error(errors.postalCodeFilterNotFunction);
        }

        // if method do not returns a string, error
        if (!isStringType(options.postalCodeFilter())){
            valid = false;
            throw new Error(errors.postalCodeFilterInitNotReturnString);
        }
    }

    // endregion

    // region autofocus parameter

    // if not a boolean, error
    if (!isBooleanType(options.autofocus)){
        valid = false;
        throw new Error(errors.autofocusNotBool);
    }

    // endregion

    // region latLong

    if (options.focusCoordinates) {
        // if not a function, error
        if (!isFunctionType(options.focusCoordinates)) {
            valid = false;
            throw new Error(errors.focusCoordinatesNotFunctionType);
        }

        // if not returning array, error
        if (!Array.isArray(options.focusCoordinates())) {
            throw new Error(errors.focusCoordinatesInitNotReturningArray);
        }

        // if length different not equal 2, error
        if (options.focusCoordinates().length !== 2) {
            valid = false;
            throw new Error(errors.focusCoordinatesInitWrongLength);
        }

        // if values are not a number, error
        if (!(isNumberType(options.focusCoordinates()[0]) && isNumberType(options.focusCoordinates()[1]))) {
            valid = false;
            throw new Error(errors.focusCoordinatesInitReturnNoNumbersType)
        }
    }

    // endregion

    // region maxResults parameter

    // if not a number, error
    if (!isNumberType(options.maxResults)) {
        valid = false;
        throw new Error(errors.maxResultsWrongType);
    }

    // if value smaller than 0, error
    if (options.maxResults <= 0) {
        valid = false;
        throw new Error(errors.maxResultsSmallNumber);
    }

    // endregion

    // region searchDelay parameter

    // if not a number, error
    if (!isNumberType(options.searchDelay)) {
        valid = false;
        throw new Error(errors.searchDelayWrongType);
    }

    // if value smaller than 0, error
    if (options.searchDelay < 0) {
        valid = false;
        throw new Error(errors.searchDelaySmallNumber);
    }

    //endregion

    // region countries parameter
    if (options.countries) {
        // if not a string, error
        if (!isStringType(options.countries)) {
            valid = false;
            throw new Error(errors.countriesNotString);
        } else {
            // if given string is smaller than 2, error
            if (options.countries.length < 2) {
                valid = false;
                throw new Error(errors.countriesStringLength);
            }
        }
    }

    // endregion

    // region layers parameter
    if (options.layers) {
        // if not a string, error
        if (!isStringType(options.layers)) {
            valid = false;
            throw new Error(errors.layersNotString);
        }
    }

    // endregion

    // region lang parameter
    if (options.lang) {
        
        // if not a string, error
        if (!isStringType(options.lang)) {
            valid = false;
            throw new Error(errors.langNotString);
        }

        // if given string is different than 2, error
        if (options.lang.length !== 2) {
            valid = false;
            throw new Error(errors.langStringLength);
        }
    }

    // endregion

    // region missingAddressBtn parameter

    if (options.missingAddressBtn) {
        // if not a boolean, error
        if (!isBooleanType(options.missingAddressBtn)) {
            valid = false;
            throw new Error(errors.missingAddressBtnNotBool)
        }
    }
    // endregion

    return valid;
}

/**
 * Check if all parameters are valid
 * @param {MymappiSearch} classInstance The instance of mymappiSdk
 * @return {boolean} True if all parameters are valid
 */
export function checkRemove(classInstance) {
        // if null/undefined, error
        if (!classInstance) {
            console.error(errors.removeClassInstanceIsNull);
            return false;
        }
    
        // if it's not an instance of mymappiSdk, error
        if (!classInstance.mymappiSearch) {
            console.error(errors.removeClassInstanceNotMymappiSdk);
            return false;
        }
    return true;
}

// endregion

// region geocoding

/**
 * @typedef {Object} OptionsGeocoding 
 * @property {string} apiKey The id of mymappi api
 * @property {string} postalCode The postal code value (if set the search will be based on a given postal code)
 * @property {number} sourceLat The source latitude of the place to search
 * @property {number} sourceLon The source latitude of the place to search
 * @property {string} lang If left empty, the app will detect the user browser language and use it during the search
 * @property {string} country The country in which the search will be done (Left empty results with search around the world)
 * @property {string} layers The layers which will be search by the api (Left empty to search in all layers)
 * @property {number} maxResults The number of results that will be shown in the list (default 5, max 10)
 */

 /**
  * Check if all parameters are valid
  * @param {OptionsGeocoding} options 
  * @return {options} The options with validated parameters
  */
export function checkGeocoding(options) {

    // region apiKey parameter

    // if null/undefined, error
    if (!options.apiKey) {
        throw new Error(errors.apiKeyGeocodingUndefined);
    }

    // if not a string, error
    if (!isStringType(options.apiKey)) {
        throw new Error(errors.apiKeyGeocodingNotString);
    }

    // endregion

    // region postalCode parameter

    if (options.postalCode) {
        // if not a string, error
        if (!isStringType(options.postalCode)){
            throw new Error(errors.postalCodeGeocodingNotString);
        }
    }

    // endregion

    // region sourceLat parameter

    if (options.sourceLat) {
        // if not a number, error
        if (!isNumberType(options.sourceLat)) {
            throw new Error(errors.sourceLatGeocodingWrongType);
        }
    }

    // endregion

    // region sourceLon parameter

    if (options.sourceLon) {
        // if not a number, error
        if (!isNumberType(options.sourceLon)) {
            throw new Error(errors.sourceLonGeocodingWrongType);
        }
    }

    // endregion

    // region lang parameter

    if (options.lang) {
        // if not a string, error
        if (!isStringType(options.lang)) {
            throw new Error(errors.langGeocodingNotString);
            // if given string is different than 2, error
        } else if (options.lang.length !== 2) {
            throw new Error(errors.langGeocodingStringLength);
        }
    }

    // endregion

    // region country parameter

    if (options.country) {
        // if not a string, error
        if (!isStringType(options.country)) {
            throw new Error(errors.countryGeocodingNotString);
                // if given string is smaller than 2, error
        } else if (!(options.country.length === 2 || options.country.length === 3)) {
            throw new Error(errors.countryGeocodingStringLength);
        }
    }

    // endregion

    // region layers parameter

    if (options.layers) {
        // if not a string, error
        if (!isStringType(options.layers)) {
            throw new Error(errors.layersGeocodingNotString);
        }
    }

    // endregion

    // region maxResults parameter

     // if not a number, error
     if (!isNumberType(options.maxResults)) {
        throw new Error(errors.maxResultsGeocodingWrongType);
    } else {
        // if value smaller than 0, error
        if (options.maxResults <= 0) {
            throw new Error(errors.maxResultsGeocodingSmallNumber);
        }
    }

    // endregion

    return true;
}

// endregion

// helper methods
function isStringType(val) {
    return typeof val === 'string';
}

function isNumberType(val) {
    return Number.isFinite(val);
}

function isFunctionType(val) {
    return val.constructor === Function;
}

function isBooleanType(val) {
    return typeof val === 'boolean'
}