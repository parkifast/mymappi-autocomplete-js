import { MymappiSearch } from './js/mymappiSearch.js';
import { Geocoding } from './js/geocoding.js';
import { checkInit, checkRemove, checkGeocoding } from './js/check.js';
import errors from "./js/errors.js";
import "./css/styles.css";

const defaultValuesAutocomplete = {
    input: undefined,
    apiKey: undefined,
    postalCodeFilter: undefined,
    autofocus: true,
    focusCoordinates: undefined,
    maxResults: 5,
    searchDelay: 150,
    countries: undefined,
    layers: "address,street,venue",
    lang: undefined,
    missingAddressBtn: undefined
};

const defaultValuesGeocoding = {
    apiKey: undefined,
    sourceLat: undefined,
    sourceLong: undefined,
    layers: "address,street,venue",
    postalCode: undefined,
    maxResults: 10,
    country: undefined,
    lang: undefined,
};

/**
 * @typedef {Object} Options
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
 * Init the search class
 * @param {Options} origParams
 * @return {MymappiSearch} The instance of mymappiSdk
 */
function initAutocomplete(origParams) {

    // if is false, error (origParams)
    if (!origParams) {
        throw new Error(errors.origParamsInitUndefined);
    }

    // assign empty parameters with default values
    const options = Object.assign(defaultValuesAutocomplete, origParams);

    // set the default min delay time
    if (options.searchDelay < 150) {options.searchDelay = 150;}
    
    if(checkInit(options)) {
        const autocomplete = new MymappiSearch(options);
        return autocomplete.initialize();
    } else {
        return undefined;
    }
}

/**
 * Remove the instance of mymappiSdk
 * @param {MymappiSearch} classInstance 
 */
function removeAutocomplete(classInstance) {
    if (checkRemove(classInstance)) {
        classInstance.remove();
    } else {
        return;
    }
}

function initGeocoding(origParams) {
    // if is false, error (origParams)
    if (!origParams) {
        throw new Error(errors.origParamsGeocodingUndefined);
    }

    // assign empty parameters with default values
    let options = Object.assign(defaultValuesGeocoding, origParams);
    
    if(checkGeocoding(options)) {
        return new Geocoding(options);
    } else {
        return undefined;
    }
}

export { initAutocomplete, removeAutocomplete, initGeocoding };