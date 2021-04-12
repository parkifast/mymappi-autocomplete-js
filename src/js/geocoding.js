import errors from "./errors.js";

/**
 * @typedef {Object} Options
 * @property {string} apiKey The id of mymappi api
 * @property {string} postalCode The postal code value (if set the search will be based on a given postal code)
 * @property {number} sourceLat The source latitude of the place to search
 * @property {number} sourceLon The source latitude of the place to search
 * @property {string} lang If left empty, the app will detect the user browser language and use it during the search
 * @property {string} country The country in which the search will be done (Left empty results with search around the world)
 * @property {string} layers The layers which will be search by the api (Left empty to search in all layers)
 * @property {number} maxResults The number of results that will be shown in the list (default 5, max 10)
 */

export class Geocoding {
    url = "";
    previousRequest = null;
    options = {};

    /**
     * 
     * @param {Options} options 
     */
    constructor(options) {
        this.options = options;
        this.prepareUrl();
    }

    prepareUrl() {
        this.url = 'https://dev-api.mymappi.com/v2/geocoding/direct';
    
        // Add apiKey
        this.url += `?apikey=${this.options.apiKey}`;
    
        // Set the search area
        if (this.options.country) {
            // remove spaces in the string
            this.options.country = this.options.country.replace(/\s/g,'');
    
            this.url += `&country_code=${this.options.country}`;
        }
    
        // Set the search layers
        if (this.options.layers) {
            const layers = this.detectLayers(this.options.layers)
    
            if (layers) {
                this.url += `&layers=${this.options.layers}`;
            }
        }
    
        // Set the result language
        if (!this.options.lang) {
            this. options.lang = this.detectLang();
        }
        this.url += `&lang=${this.options.lang}`;
    
        // Set the results limit
        if (this.options.maxResults) {
            this.url += `&limit=${this.options.maxResults}`
        } else {
            this.url += '&limit=10';
        }
    
        // Set the postal code
        if (this.options.postalCode) {
            this.url += '&postal_code=' + this.options.postalCode;
        }
    
        // Set the sourceLat
        if (this.options.sourceLat) {
            this.url += '&source_lat=' + this.options.sourceLat;
        }
    
        // Set the sourceLon
        if (this.options.sourceLon) {
            this.url += '&source_lon=' + this.options.sourceLon;
        }
    
        // Add query
        this.url += `&q=`
    }

    async search(query) {
        if (typeof query !== 'string') {
            throw new Error(errors.queryGeocodingNotString);
        }else if (query.length === 0) {
            throw new Error(errors.queryGeocodingEmptyString);
        }

        // If previous request is still pending, abort it
        if (this.previousRequest) {
            this.previousRequest.abort();
        }

        const controller = new AbortController();
        this.previousRequest = controller;
    
        try {
            const response = await fetch(this.url + query, {
                method: 'get',
                signal: controller.signal
            });
    
            if (!response.ok) {
                throw new Error(errors.response + response.status);
            }
    
            const responseJson = await response.json();
            this.previousRequest = null;
            
            return this.responseParser(responseJson);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error(error);
                throw new Error(errors.response);
            } else {
                return;
            }
        }
    }

    /**
     * Detect the user language based on language set in the browser
     * @return {string}
     */
    detectLang() {
        return navigator.language.slice(0,2);
    }

    /**
     * Get the result array from the response
     * @param responseData
     * @return {Result[]}
     */
    responseParser(responseData) {
        return responseData.data;
    }

    /**
     * Detect the layers, delete the spaces between them and return empty string for full list of layers
     * @param {String} str 
     * @return {String} the proper list of layers. If full list then empty
     */
    detectLayers(str) {
        const fullLayser = ["venue","address","street","neighbourhood","borough","localadmin","locality","county","macrocounty","region","macroregion","country","postalcode"];
        const layers = str.split(/[ ,]+/).filter(Boolean);
        let isEvery = false;

        if (layers.length === fullLayser.length) {
            isEvery = fullLayser.every(item => layers.includes(item));
        }

        if (layers[0] === 'fullList') { isEvery = true; }

        return isEvery ? "" : layers.toString();
    }

}