import errors from "./errors.js";
import btnTranslation from "./translation.js";
import city from "../assets/icons/city.svg";
import monument from "../assets/icons/monument.svg";
import point from "../assets/icons/point.svg";
import street from "../assets/icons/street.svg";
import logo from "../assets/icons/mymappi_logo.png";

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
 * @typedef {Object} Result
 * @property {number} confidence
 * @property {string} continent
 * @property {string} country
 * @property {string} country_code
 * @property {string} display_address
 * @property {string} display_address_html
 * @property {string} display_name
 * @property {string} display_name_html
 * @property {string} display_region
 * @property {string} display_region_html
 * @property {string} localadmin
 * @property {string} locality
 * @property {string} region
 * @property {string} venue
 * @property {number} lat
 * @property {number} lon
 * @property {string} layer The type of place
 * @property {string} license
 * @property {Number} scoring
 */

/**
 * @typedef {Object} MymappiSearch
 * @property {string} urlAutocomplete The url to the autocomplete api
 * @property {string} urlDetails The url to the geocoding/direct api
 * @property {URL} urlLastSearch The url of the last performed search
 * @property {Result[]} resultArray This array keeps the results of the search
 * @property {HTMLElement[]} resultHtmlElementsArray This array keeps the results of the search
 * @property {AbortController} previousRequest Keeps the previous request to be able to canceled it
 * @property {Number} selectedResult Index of the result from the resultArray which was hover
 * @property {HTMLElement} missingAddressBtn The btn from the down label of the result window
 * @property {Function} referenceWrapperListener The reference to the function of the event listener
 * @property {Function} referenceKeyDownEnterListener The reference to the function of the event listener
 * @property {Function} referenceClickNewAddressBtn The reference to the function of the event listener
 * @property {Function} referenceArrowKeyClickDetection The reference to the function of the event listener
 * @property {Event} addUnknownAddressEvent
 * @property {Elements} elements
 * @property {Options} options
 */
export class MymappiSearch {

    // Variables
    urlAutocomplete = 'https://dev-api.mymappi.com/v2/places/autocomplete';
    urlDetails = 'https://dev-api.mymappi.com/v2/geocoding/direct';
    urlLastSearch = '';
    resultsArray = [];
    resultHtmlElementsArray = [];
    delay = null;
    previousRequest = null;
    selectedResult = 0;
    missingAddressBtn = undefined;
    mymappiSearch = "mymappiSearch";

    // references to toggle event listeners
    referenceInputDetection = null;
    referenceFocusDetection = null;
    referenceClickDetection = null;
    referenceWrapperListener = null;
    referenceKeyDownEnterListener = null;
    referenceClickNewAddressBtn = null;
    referenceArrowKeyClickDetection = null;

    // Events
    addUnknownAddressEvent = new Event('mymappiMissingAddressBtnClicked');
    newResultsEvent = (results) => {
        return new CustomEvent('mymappiNewResults', {detail: results});
    }
    clickedResultEvent = (result) => {
        return new CustomEvent('mymappiClickedResult', {detail: result});
    }
    hoverResultEvent = (result) => {
        return new CustomEvent('mymappiHoverResult', {detail: result});
    }

    // region Constructor & initialization

    /**
     * @typedef {Object} Elements
     * @property {HTMLElement} input The given input from which search will get the information
     * @property {HTMLElement} resultContainer The container which will keeps the result list of the search
     * @property {HTMLElement} wrapper The div which will be wrapped around the input & resultContainer
     */

    /**
     * @param {Options} options
     */
    constructor(options) {

        this.elements = {
            input: options.input,
            resultsContainer: document.createElement("div"),
            wrapper: document.createElement('div')
        };
        this.options = options;
    }

    /**
     * Initialize the app
     * @returns {Promise} return the promise whihc will return a initialize instance of the mymappiSearch
     */
    initialize() {
        return new Promise((resolve, reject) => {
            this.elements.resultsContainer.classList.add('my-result-container');

            this.addWrapper();
            this.prepareUrl();
            this.addListeners();
            resolve(this);
        })
    }

    /**
     * Initialize wrapper and move the input and other children to its inside
     */
    addWrapper() {
        this.elements.wrapper.classList.add('my-wrapper');
        const parent = this.elements.input.parentNode;

        // Move input parent children to wrapper (omit input)
        this.moveChildrenOfInputParentToWrapper(parent);
        
        // Set wrapper as child of input parent
        parent.innerHTML = '';
        parent.appendChild(this.elements.wrapper);

        // Put the input & resultContainer inside of the wrapper
        this.elements.wrapper.appendChild(this.elements.resultsContainer);
    }

    /**
     * Prepare url based on the given in the constructor options
     */
    prepareUrl() {
        this.urlAutocomplete += `?apikey=${this.options.apiKey}`;

        // Set the search area
        if (this.options.countries) {
            // remove spaces in the string
            this.options.countries = this.options.countries.replace(/\s/g,'');

            this.urlAutocomplete += `&country_code=${this.options.countries}`;
        }

        // Set the search layers
        if (this.options.layers) {
            const layers = this.detectLayers(this.options.layers)
    
            if (layers) {
                this.urlAutocomplete += `&layers=${this.options.layers}`;
            }
        }

        // Set the result language
        if (!this.options.lang) {
            this.options.lang = this.detectLang();
        }
        this.urlAutocomplete += `&lang=${this.options.lang}`;

        // Set the results limit
        if (this.options.maxResults) {
            this.urlAutocomplete += `&limit=${this.options.maxResults}`
        } else {
            this.urlAutocomplete += '&limit=5';
        }

        // Check if user gives a autofocus
        if (this.options.autofocus) {
            this.urlAutocomplete += `&auto_focus=true`;
        } else {
            this.urlAutocomplete += `&auto_focus=false`;
        }
    }

    /**
     * Initialize input event listeners
     */
    addListeners() {

        // Perform a new search with every written letter
        this.addInputDetection();

        // Event listener to catch the input value which was set by the outside method
        this.addFocusDetection();

        // On a click event check the length of the result list & if it's not empty, show it to the user
        this.addClickDetection();
    }

    // endregion

    // region Create result list

    /**
     * Updates the HTML to display each result under the search bar
     * @param {Result[]} results
     */
    populateResults(results) {
        this.resultsArray = results ? results : [];
        
        this.closeResultList();
        this.resultHtmlElementsArray = [];
        this.selectedResult = 0;

        const icon = new Image();
        icon.src = logo;
        icon.classList.add('my-results-container-end-img');
        icon.alt = 'myMappi';
        
        const addNewAddressBtn = `<div id="my-result-container-end-btn" class="my-result-container-end-btn">${this.getAddNewAddressBtnText()}</div>`;

        const endDiv =
            `<div class="my-results-container-end">
                ${this.options.missingAddressBtn ? addNewAddressBtn : ''}
                <a class="my-result-container-end-company-link" href="https://mymappi.com/" target="_blank">
                    <span class="my-results-container-end-text">powered by</span>
                    ${icon.outerHTML}
                </a>
             </div>`;

        // Delete old results
        while (this.elements.resultsContainer.firstChild) {
            this.elements.resultsContainer.removeChild(this.elements.resultsContainer.firstChild);
        }

        if (this.resultsArray) {
            if (this.resultsArray.length > 0) {

                // Update list of results under the search bar
                for (const [index, result] of results.entries()) {
                    this.elements.resultsContainer.appendChild(this.createResultElement(result, index));
                }

                this.elements.resultsContainer.insertAdjacentHTML('beforeend', endDiv);

                // Add the class to first element to show which will be added after clicking the enter
                this.moveHoverEffect();

                if (this.options.missingAddressBtn) {
                    this.missingAddressBtn = document.getElementById('my-result-container-end-btn');
                }

                this.showResultList();
            }
        }
    }

    /**
     * Create the HTML to represent a single result in the list of results
     * @param {Result} result An instant search result
     * @param {number} index Index of the result from resultArray
     * @return {HTMLAnchorElement}
     */
    createResultElement(result, index) {
        const anchorElement = document.createElement('div');
        anchorElement.classList.add("my-result");
        anchorElement.onclick = () => {
            this.selectedResult = index;
            this.displayResultInInput();
            this.closeResultList();
        }
        anchorElement.onmouseenter = () => {
            this.selectedResult = index;
            this.moveHoverEffect();
        }
        anchorElement.insertAdjacentHTML('afterbegin', this.createResultHtmlElement(result));

        this.resultHtmlElementsArray.push(anchorElement);

        return anchorElement;
    }

    /**
     *
     * @param {Result} result
     * @return {string}
     */
    createResultHtmlElement(result) {
        // get the proper svg icon name
        let svgLink = {
            'address': point,
            'street': street,
            'venue': monument,
            'locality': city,
            'localadmin': city
        }[result.layer];

        // Default point when not category matched
        if (!svgLink) {
            svgLink = point;
        }

        // Special class for point which is a little bigger then others svg
        const svgClass = svgLink === point ? 'my-result-icon-point' : 'my-result-icon';

        return `<div class="my-result-icon-container">
                    <img class="${svgClass}" src="${svgLink}" alt="icon">
                </div>
                <div class="my-result-address">
                    ${result.display_address_html}
                </div>
                <div class="my-result-region">
                    ${result.display_region_html}
                </div>`;
    }

    // endregion

    /**
     * Get the result array from the response
     * @param responseData
     * @return {Result[]}
     */
    responseParser(responseData) {
        return responseData.data;
    }

    /**
     * Makes the request at the search URL and retrives results
     * @param {string} query - search query
     */
    async performSearch(query) {

        // If previous request is still pending, abort it
        if (this.previousRequest) {
            this.previousRequest.abort();
        }

        // Do not perform search when query is empty
        if (query.length === 0) {
            // return the empty array for resultsArray
            return new Promise(function(resolve, reject) {
                resolve([]);
            });
        }

        let urlAddition = '';

        // Check if search should be based on lat/lon
        if (this.options.focusCoordinates) {
            let latLongArray = this.options.focusCoordinates();
            
            // if length different not equal 2, error
            if (latLongArray.length !== 2) {
                console.error(errors.latLongWrongLength + errors.focusCoordinatesSearchWithoutLatLon);
            
                // if values are not a number, error
            } else if (!(Number.isFinite(latLongArray[0]) && Number.isFinite(latLongArray[1]))) {
                console.error(errors.focusCoordinatesReturnNoNumbersType + errors.focusCoordinatesSearchWithoutLatLon)
            } else {
                urlAddition += `&source_lat=${latLongArray[0]}&source_lon=${latLongArray[1]}`;
            }           
        }

        // Check if search should by based on postcode
        if (this.options.postalCodeFilter) {
            let postcode = this.options.postalCodeFilter();
            // if it's not a string, error
            if (typeof postcode !== 'string'){
                console.error(errors.postalCodeFilterNotReturnString + errors.postalCodeFilterSearchWithoutPostCode);
            } else {
                urlAddition += `&postal_code=${postcode}`
            }
        }

        urlAddition += '&q=';

        this.urlLastSearch = new URL(this.urlAutocomplete.toString()  + urlAddition + query);

        const controller = new AbortController();
        this.previousRequest = controller;

        try {
            const response = await fetch(this.urlLastSearch, {
                method: 'get',
                signal: controller.signal
            });
    
            if (!response.ok) {
                throw new Error(errors.response + response.status);
            }
    
            const responseJson = await response.json();
            this.previousRequest = null;

            const parsedResponse = this.responseParser(responseJson)
            this.emitNewResultsEvent(parsedResponse);
            return parsedResponse;
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error(error);
                throw new Error(errors.response);
            } else {
                return [];
            }
        }
        
    }

    /**
     * Make a request to get a detail version of the given result
     * @param {String} autocomplete_id - id of result
     */
    async getFullResultdata(autocomplete_id) {
        try {
            const response = await fetch(
                this.urlDetails + this.urlLastSearch.search + `&autocomplete_id=${autocomplete_id}`,
                 { method: 'get' }
            );

            if (!response.ok) {
                throw new Error(errors.response + response.status);
            }

            const responseData = await response.json();
            return this.responseParser(responseData)[0];
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error(error);
                throw new Error(errors.response);
            }
            return null;
        }
    }

    // region Helper methods

    /**
     * Detect the user language based on language set in the browser
     * @return {string}
     */
    detectLang() {
        return navigator.language.slice(0,2);
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

    /**
     * Move the children nodes (without input) from the input parent to the wrapper
     * @param {HTMLElement} parent - The parent of the input element
     */
    moveChildrenOfInputParentToWrapper(parent) {
        const children = parent.childNodes;
        const _this = this;

        // Going reverse direction fix the issue with dissapearing nodes
        for (let i = children.length - 1; i >= 0; i--) {
            _this.elements.wrapper.insertBefore(children[i],  _this.elements.wrapper.firstChild);
        }
    }

    /**
     * Put selectedResult from resultArray as input value
     */
    displayResultInInput() {
        this.elements.input.value = this.resultsArray[this.selectedResult].display_name;
        this.emitClickedResultEvent(this.resultsArray[this.selectedResult]);
    }

    /**
     * Get the translation for the addNewAddress btn
     * @return {string}
     */
    getAddNewAddressBtnText() {
        const translation = btnTranslation[this.options.lang];
        return translation ? translation : btnTranslation.en;
    }

    // Moving through the list

    /**
     * Remove hover effect from previous result and move it to the selectedResult
     */
    moveHoverEffect() {
        this.removeAllHoverEffects();
        this.addHoverEffectResult();
        this.emitHoverResultEvent();
    }

    /**
     * Remove the hover effect from the all results & img of the resultHtmlElementsArray
     */
    removeAllHoverEffects() {
        this.resultHtmlElementsArray.forEach(resultHtml => {
            let img = resultHtml.getElementsByTagName('img')[0];

            resultHtml.classList.remove('my-result-hover');
            img.classList.remove('my-result-icon-hover');
        })
    }

    /**
     * Add the hover effect to the selectedResult and img element inside of it
     */
    addHoverEffectResult() {
        let resultHtml = this.resultHtmlElementsArray[this.selectedResult];
        let img = resultHtml.getElementsByTagName('img')[0];

        resultHtml.classList.add('my-result-hover');
        img.classList.add('my-result-icon-hover');
    }

    // Open/close resultList

    /**
     * Add the class to result list container & set the event listeners
     */
    showResultList() {
        this.elements.resultsContainer.classList.add("my-results-container--visible");

        this.addKeyDownEnterDetection();
        this.addMovingByArrowKeyDetection();
        this.addOutsideClickDetection();
        if (this.options.missingAddressBtn) {
            this.addNewAddressBtnClickDetection();
        }
    }

    /**
     * Remove the css class from the result list container & remove the event listeners
     */
    closeResultList() {
        // remove event listeners
        this.removeOutsideClickDetection();
        this.removeMovingByArrowKeyDetection();
        this.removeKeyDownEnterDetection();
        if (this.options.missingAddressBtn) {
            this.removeNewAddressBtnClickDetection();
        }

        this.elements.resultsContainer.classList.remove("my-results-container--visible");
    }

    // endregion

    // region EventListeners

    // Input

    /**
     * Perform a new search with every written letter
     */
    performSearchOnInput() {
        clearTimeout(this.delay);

        this.delay = setTimeout(() => {
            const query = this.elements.input.value;
            this.performSearch(query).then(results => {
            this.populateResults(results);
        });
        }, this.options.searchDelay);
    }

    /**
     * Event listener to catch the input value which was set by the outside method
     */
    performSearchOnFocus() {
        const query = this.elements.input.value;
        if (query.length > 3) {
            this.performSearch(query).then(results => {
                this.populateResults(results);
            });
        }
    }

    /**
     * On a click event check the length of the result list & if it's not empty, show it to the user
     */
    showResultsListOnClick() {
        if (this.resultsArray.length > 0) {
            this.populateResults(this.resultsArray);
        }
    }

    /**
     * On the keydown (enter) display the selectedResult in the input field & close the result list
     * @param {KeyboardEvent} key The event triggered by the user keyboard
     */
    displayResultOnEnterKey(key) {
        if (key.code === "Enter") {
            this.displayResultInInput();
            this.closeResultList();
        }
    }

    /**
     * Detect the key (up/down) to move through the list and change the selectResult & move the hover effect
     * @param key
     */
    movingByArrowsKeyDetection(key) {
        if (this.resultsArray.length !== 0) {
            switch(key.code) {
                case 'ArrowUp': //if the UP key is pressed
                    if (this.selectedResult === 0) {
                        this.selectedResult = this.resultsArray.length - 1;
                    } else {
                        this.selectedResult--;
                    }
                    break;
                case 'ArrowDown': // if key DOWN is pressed
                    if (this.selectedResult === this.resultsArray.length - 1) {
                        this.selectedResult = 0;
                    } else {
                        this.selectedResult++;
                    }
                    break;
            }
            this.moveHoverEffect();
        }
    }

    // window

    /**
     * Detect the click event outside of the input container. When detected, delete the event listener & close the result list
     * @param e - event that occurs
     */
    outsideClickDetection(e) {
        if (this.elements.wrapper.contains(e.target)){
            // Clicked in Box
        } else{
            this.removeOutsideClickDetection();
            this.closeResultList();
        }
    }

    // endregion

    // region Events emitters

    /**
     * Emit the 'addNewAddress' on the input element
     */
    emitAddNewAddressEvent() {
        this.elements.input.dispatchEvent(this.addUnknownAddressEvent);
    }

    /**
     * Emit the 'myNewResults' event on the input element, with list of results as 'results'
     * @param {Result[]} results
     */
    emitNewResultsEvent(results) {
        this.elements.input.dispatchEvent(this.newResultsEvent(results));
    }

    /**
     * Emit the 'myClickedResult' event on the input element. Get the detailed result and add it to the 'detail' of the event
     * @param {Result} result 
     */
    emitClickedResultEvent(result) {
        this.getFullResultdata(result.autocomplete_id).then(detailResult => {
            this.elements.input.dispatchEvent(this.clickedResultEvent(detailResult));
        });
    }

    /**
     * Emit the 'myHoverResult' event on the input element, with selectedResult as 'result'
     */
    emitHoverResultEvent() {
        this.elements.input.dispatchEvent(this.hoverResultEvent(this.resultsArray[this.selectedResult]));
    }

    // endregion

    // region Add/Remove event listeners

    // Window

    /**
     * Detect the click event outside of the input container, if so delete the event listener & close the result list
     */
    addOutsideClickDetection() {
        if (this.referenceWrapperListener === null) {
            window.addEventListener('click', this.referenceWrapperListener = this.outsideClickDetection.bind(this));
        }
    }

    /**
     * Remove the click detection set on a window
     */
    removeOutsideClickDetection() {
        if (this.referenceWrapperListener) {
            window.removeEventListener('click', this.referenceWrapperListener);
            this.referenceWrapperListener = null;
        }
    }

    // Input

    /**
     * Add a input detection to perform a new search with every written letter
     */
    addInputDetection() {
        if (this.referenceInputDetection === null) {
            this.elements.input.addEventListener("input", this.referenceInputDetection = this.performSearchOnInput.bind(this));
        }
    }

    /**
     * Remove the input detection from the input element
     */
    removeInputDetection() {
        if (this.referenceInputDetection) {
            this.elements.input.removeEventListener("input", this.referenceInputDetection);
            this.referenceInputDetection = null;
        }
    }

    /**
     * Add on focus event listener to catch the input value which was set by the outside method
    */
    addFocusDetection() {
        if (this.referenceFocusDetection === null) {
            this.elements.input.addEventListener("focus", this.referenceFocusDetection = this.performSearchOnFocus.bind(this));
        }
    }

    /**
     * Remove on focus event listener from the input element
     */
    removeFocusDetection() {
        if (this.referenceFocusDetection) {
            this.elements.input.removeEventListener("focus", this.referenceFocusDetection);
            this.referenceFocusDetection = null;
        }
    }

    /**
     * Add a click event listener to check the length of the result list & if it's not empty, show it to the user
     */
    addClickDetection() {
        if (this.referenceClickDetection === null) {
            this.elements.input.addEventListener("click", this.referenceClickDetection = this.showResultsListOnClick.bind(this));
        }
    }

    /**
     * Remove on click event listener from the input element
     */
    removeClickDetection() {
        if (this.referenceClickDetection) {
            this.elements.input.removeEventListener("click", this.referenceClickDetection);
            this.referenceClickDetection = null;
        }
    }

    /**
     * Add the key down detection on input to detect the enter click to display the selectedResult in the input field & close the result list
     */
    addKeyDownEnterDetection() {
        if (this.referenceKeyDownEnterListener === null) {
            this.elements.input.addEventListener('keydown', this.referenceKeyDownEnterListener = this.displayResultOnEnterKey.bind(this));
        }
    }

    /**
     * Delete the enter click detection from the input
     */
    removeKeyDownEnterDetection() {
        if (this.referenceKeyDownEnterListener) {
            this.elements.input.removeEventListener('keydown', this.referenceKeyDownEnterListener);
            this.referenceKeyDownEnterListener = null;
        }
    }

    /**
     * Add a keydown detection on window to detect the arrow keys (up/down) to move through the list and change the selectResult & move the hover effect
     */
    addMovingByArrowKeyDetection() {
        if (this.referenceArrowKeyClickDetection ===  null) {
            this.elements.input.addEventListener('keydown', this.referenceArrowKeyClickDetection = this.movingByArrowsKeyDetection.bind(this));
        }
    }

    /**
     * remove the keydown detection from the window
     */
    removeMovingByArrowKeyDetection() {
        if (this.referenceArrowKeyClickDetection) {
            this.elements.input.removeEventListener('keydown', this.referenceArrowKeyClickDetection);
            this.referenceArrowKeyClickDetection = null;
        }
    }

    // missingAddressBtn

    /**
     * Add the click detection on addNewAddressBtn to Emit the 'addNewAddress' on the input element
     */
    addNewAddressBtnClickDetection() {
        if (this.referenceClickNewAddressBtn === null) {
            this.missingAddressBtn.addEventListener('click', this.referenceClickNewAddressBtn = this.emitAddNewAddressEvent.bind(this));
        }
    }

    /**
     * Remove the click detection from the addNewAddressBtn
     */
    removeNewAddressBtnClickDetection() {
        if (this.referenceClickNewAddressBtn) {
            this.missingAddressBtn.removeEventListener('click', this.referenceClickNewAddressBtn);
            this.referenceClickNewAddressBtn = null;
        }
    }

    // endregion

    // region Destructor

    /**
     * Remove the instance of search, all listeners & wrapper with resultContainer
     */
    remove() {
        this.closeResultList();
        this.deleteListeners();
        this.deleteWrapper();

        this.elements.input = null;
    }

    /**
     * Remove the wrapper & move it's children to previous place
     */
    deleteWrapper() {
        // Move wrapper children to parent
        this.moveChildrenOfWrapperToParent(this.elements.wrapper);
        
        // clean children of the wrapper
        this.elements.wrapper.innerHTML = '';

        this.elements.resultsContainer.remove();
        this.elements.resultsContainer = null;
        this.elements.wrapper.remove();
        this.elements.wrapper = null;
    }

    /**
     * Move the children of the wrapper to previous place (wrapper parent)
     * @param {HTMLElement} wrapper 
     */
    moveChildrenOfWrapperToParent(wrapper) {
        const children = wrapper.childNodes;
        const _this = this;

        // Going reverse direction fix the issue with dissapearing nodes
        for (let i = children.length - 1; i >= 0; i--) {
            if (!children[i].isSameNode(_this.elements.resultsContainer)) {
                wrapper.parentNode.insertBefore(children[i],  wrapper.parentNode.firstChild);
            }
        }
    }

    /**
     * Remove all the listeners from the input
     */
    deleteListeners() {
        this.removeInputDetection();
        this.removeFocusDetection();
        this.removeClickDetection();
    }

    // endregion
}
