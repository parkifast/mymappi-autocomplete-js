const { checkInit, checkRemove, checkGeocoding } =  require('../src/js/check.js');
const errors = require('../src/js/errors.js').default;
import * as init from "../src/index";

// mocks & spies
jest.mock("../src/index");

init.initAutocomplete = jest.fn().mockImplementation(() => {});

let returnQuerySelectorAll = null;
jest.spyOn(document, 'querySelectorAll').mockImplementation(() => {
    return returnQuerySelectorAll;
    }
);

let spyConsole = jest.spyOn(console, 'error').mockImplementation(() => {});

// NodeList to use in tests
NodeList.prototype.item = function item(i) {
    return this[+i || 0];
};

// Default values for tested functions
let defaultValues = null;
const prepareAutocompleteDefaultVal = () => {
    const input = document.createElement("input");
    input.type = "text";

    defaultValues = {
        input: input,
        apiKey: 'key',
        postalCodeFilter: undefined,
        autofocus: true,
        focusCoordinates: undefined,
        maxResults: 5,
        searchDelay: 0,
        countries: undefined,
        layers: "address,street,venue",
        lang: undefined,
        missingAddressBtn: undefined
    }
};


const prepareGeocodingDefaultVal = () => {
    defaultValues = {
        apiKey: 'key',
        sourceLat: undefined,
        sourceLong: undefined,
        layers: "address,street,venue",
        postalCode: undefined,
        maxResults: 10,
        country: undefined,
        lang: undefined,
    }
}

// Cleaning up

beforeEach(() => {
    defaultValues = null;
    returnQuerySelectorAll = null;
    jest.clearAllMocks();
});

describe('checkInit', () => {
    beforeEach(() => prepareAutocompleteDefaultVal());

    test('should return true for default values with given input & apiKey', () => {
        const isValid = checkInit(defaultValues);
        expect(isValid).toBeTruth;
    });

    describe('apiKey', () => {
        test('should throw error (apiKeyInitUndefined) if apiKey is undefined', () => {
            defaultValues.apiKey = undefined;
            expect(() => checkInit(defaultValues)).toThrow(errors.apiKeyInitUndefined);
        })

        test('should throw error (apiKeyInitNotString) if apiKey is a number', () => {
            defaultValues.apiKey = 23;
            expect(() => checkInit(defaultValues)).toThrow(errors.apiKeyInitNotString);
        })
    })

    describe('input', () => {

        test('should throw error (wrongInput) if input is not a HTMLInputElement (HTMLElement, bool, number)', () => {
            defaultValues.input = document.createElement('div');
            expect(() => checkInit(defaultValues)).toThrow(errors.wrongInput);

            defaultValues.input = true;
            expect(() => checkInit(defaultValues)).toThrow(errors.wrongInput);

            defaultValues.input = 1;
            expect(() => checkInit(defaultValues)).toThrow(errors.wrongInput);
        });

        describe('input given as nodeList', () => {
            test('should call initAutocomplete function once', () => {
                const input = defaultValues.input;

                const nodeList = Reflect.construct(Array, [input], NodeList);
                defaultValues.input = nodeList

                checkInit(defaultValues);
    
                expect(init.initAutocomplete).toHaveBeenCalledTimes(1);
            });

            test('should call initAutocomplete function with given input as parameter', () => {
                const input = defaultValues.input;

                const nodeList = Reflect.construct(Array, [input], NodeList);
                defaultValues.input = nodeList

                checkInit(defaultValues);
    
                expect(init.initAutocomplete.mock.calls[0][0].input).toEqual(input);
            });

            test('should throw error (inputInitEmptyNodeList) if given nodeList is empty', () => {
                const nodeList = Reflect.construct(Array, [], NodeList);
                defaultValues.input = nodeList

                expect(() => checkInit(defaultValues)).toThrow(errors.inputInitEmptyNodeList)
            })

            test('should throw error (multiInput) if given nodeList length is bigger than 1', () => {
                const nodeList = Reflect.construct(Array, [defaultValues.input, defaultValues.input], NodeList);
                defaultValues.input = nodeList;

                expect(() => checkInit(defaultValues)).toThrow(errors.multiInput)
            })
        });
        describe('input given as a string', () => {
            test('should call initAutocomplete once', () => {
                returnQuerySelectorAll = Reflect.construct(Array, [defaultValues.input], NodeList);

                defaultValues.input = '.input';
                checkInit(defaultValues);

                expect(init.initAutocomplete).toBeCalledTimes(1);
            });

            test('should call initAutocomplete with given node list', () => {
                returnQuerySelectorAll = Reflect.construct(Array, [defaultValues.input], NodeList);

                defaultValues.input = '.input';
                checkInit(defaultValues);

                expect(document.querySelectorAll).toBeCalledTimes(1);
                expect(init.initAutocomplete.mock.calls[0][0].input).toEqual(returnQuerySelectorAll[0]);
            });

            test('should throw error (inputInitStringWrongClass) when query search returns no node element for the given class', () => {
                returnQuerySelectorAll = Reflect.construct(Array, [], NodeList);

                defaultValues.input = '.input';

                expect(() => checkInit(defaultValues)).toThrow(errors.inputInitStringWrongClass);
            });

            test('should throw error (inputInitStringWrongClassToMany) when query search returns more than one objects for the given class', () => {
                returnQuerySelectorAll = Reflect.construct(Array, [defaultValues.input, defaultValues.input], NodeList);

                defaultValues.input = '.input';

                expect(() => checkInit(defaultValues)).toThrow(errors.inputInitStringWrongClassToMany);
            });
        });
    });

    describe('postalCodeFilter', () => {
        test('should throw error (postalCodeFilterNotFunction) if is not a function', () => {
            defaultValues.postalCodeFilter = 'string';
            expect(() => checkInit(defaultValues)).toThrow(errors.postalCodeFilterNotFunction);

            defaultValues.postalCodeFilter = 2;
            expect(() => checkInit(defaultValues)).toThrow(errors.postalCodeFilterNotFunction);
        });

        test('should throw error (postalCodeFilterInitNotReturnString) if not returning string', () => {
            defaultValues.postalCodeFilter = () => {return 2};
            expect(() => checkInit(defaultValues)).toThrow(errors.postalCodeFilterInitNotReturnString);
        });
    });

    describe('autofocus', () => {
        test('should throw error (autofocusNotBool) if is not a boolean', () => {
            defaultValues.autofocus  = 2;
            expect(() => checkInit(defaultValues)).toThrow(errors.autofocusNotBool);

            defaultValues.autofocus  = '2';
            expect(() => checkInit(defaultValues)).toThrow(errors.autofocusNotBool);
        });
    })

    describe('focusCoordinates', () => {
        test('should throw error (focusCoordinatesNotFunctionType) when is not a function', () => {
            defaultValues.focusCoordinates  = 2;
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesNotFunctionType);

            defaultValues.focusCoordinates  = '2';
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesNotFunctionType);
        });

        test('should throw error (focusCoordinatesInitNotReturningArray) when function do not return an array', () => {
            defaultValues.focusCoordinates  = () => {return 2};
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesInitNotReturningArray);

            defaultValues.focusCoordinates  = () => {return '2'};
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesInitNotReturningArray);

            defaultValues.focusCoordinates  = () => {return ''};
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesInitNotReturningArray);

            defaultValues.focusCoordinates  = () => {return undefined};
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesInitNotReturningArray);
        });

        test('should throw error (focusCoordinatesInitWrongLength) when length of returned array is different than 2', () => {
            defaultValues.focusCoordinates  = () => {return [1,2,3]};
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesInitWrongLength);

            defaultValues.focusCoordinates  = () => {return []};
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesInitWrongLength);

            defaultValues.focusCoordinates  = () => {return [1]};
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesInitWrongLength);
        });

        test('should throw error (focusCoordinatesInitReturnNoNumbersType) when values of the array are not a number type', () => {
            defaultValues.focusCoordinates  = () => {return [1,'2']};
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesInitReturnNoNumbersType);

            defaultValues.focusCoordinates  = () => {return ['1',2]};
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesInitReturnNoNumbersType);

            defaultValues.focusCoordinates  = () => {return ['1','2']};
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesInitReturnNoNumbersType);

            defaultValues.focusCoordinates  = () => {return [1, undefined]};
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesInitReturnNoNumbersType);

            defaultValues.focusCoordinates  = () => {return [undefined, 2]};
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesInitReturnNoNumbersType);

            defaultValues.focusCoordinates  = () => {return [undefined, undefined]};
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesInitReturnNoNumbersType);

            defaultValues.focusCoordinates  = () => {return [1, null]};
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesInitReturnNoNumbersType);

            defaultValues.focusCoordinates  = () => {return [null, 2]};
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesInitReturnNoNumbersType);

            defaultValues.focusCoordinates  = () => {return [null, null]};
            expect(() => checkInit(defaultValues)).toThrow(errors.focusCoordinatesInitReturnNoNumbersType);
        });
    });

    describe('maxResults', () => {
        test('should throw error (maxResultsWrongType) when is not a number', () => {
            defaultValues.maxResults  = '1';
            expect(() => checkInit(defaultValues)).toThrow(errors.maxResultsWrongType);

            defaultValues.maxResults  = '';
            expect(() => checkInit(defaultValues)).toThrow(errors.maxResultsWrongType);

            defaultValues.maxResults  = null;
            expect(() => checkInit(defaultValues)).toThrow(errors.maxResultsWrongType);

            defaultValues.maxResults  = undefined;
            expect(() => checkInit(defaultValues)).toThrow(errors.maxResultsWrongType);

            defaultValues.maxResults  = false;
            expect(() => checkInit(defaultValues)).toThrow(errors.maxResultsWrongType);
        });

        test('should throw error (maxResultsSmallNumber) when is smaller or equal to 0', () => {
            defaultValues.maxResults  = 0;
            expect(() => checkInit(defaultValues)).toThrow(errors.maxResultsSmallNumber);

            defaultValues.maxResults  = -2;
            expect(() => checkInit(defaultValues)).toThrow(errors.maxResultsSmallNumber);
        });
    });

    describe('searchDelay', () => {
        test('should throw error (searchDelayWrongType) when is not a number', () => {
            defaultValues.searchDelay  = '1';
            expect(() => checkInit(defaultValues)).toThrow(errors.searchDelayWrongType);

            defaultValues.searchDelay  = '';
            expect(() => checkInit(defaultValues)).toThrow(errors.searchDelayWrongType);

            defaultValues.searchDelay  = true;
            expect(() => checkInit(defaultValues)).toThrow(errors.searchDelayWrongType);

            defaultValues.searchDelay  = null;
            expect(() => checkInit(defaultValues)).toThrow(errors.searchDelayWrongType);

            defaultValues.searchDelay  = undefined;
            expect(() => checkInit(defaultValues)).toThrow(errors.searchDelayWrongType);
        });

        test('should throw error (searchDelaySmallNumber) when is smaller than 0', () => {
            defaultValues.searchDelay  = -1;
            expect(() => checkInit(defaultValues)).toThrow(errors.searchDelaySmallNumber);
        });
    });

    describe('countries', () => {
        test('should throw error (countriesNotString) when is not a string', () => {
            defaultValues.countries  = 1;
            expect(() => checkInit(defaultValues)).toThrow(errors.countriesNotString);

            defaultValues.countries  = true;
            expect(() => checkInit(defaultValues)).toThrow(errors.countriesNotString);
        });

        test('should throw error (countriesStringLength) when string length is smaller than 2', () => {
            defaultValues.countries  = '1';
            expect(() => checkInit(defaultValues)).toThrow(errors.countriesStringLength);
        });
    });

    describe('layers', () => {
        test('should throw error (layersNotString) when is not a string', () => {
            defaultValues.layers  = 1;
            expect(() => checkInit(defaultValues)).toThrow(errors.layersNotString);
        });
    });

    describe('lang', () => {
        test('should throw error (langNotString) when is not a string', () => {
            defaultValues.lang  = 1;
            expect(() => checkInit(defaultValues)).toThrow(errors.langNotString);

            defaultValues.lang  = true;
            expect(() => checkInit(defaultValues)).toThrow(errors.langNotString);
        });

        test('should throw error (langStringLength) when string length is different than 2', () => {
            defaultValues.lang  = '1';
            expect(() => checkInit(defaultValues)).toThrow(errors.langStringLength);

            defaultValues.lang  = '123';
            expect(() => checkInit(defaultValues)).toThrow(errors.langStringLength);
        })
    });

    describe('missingAddressBtn', () => {
        test('should throw error () when is not a boolean', () => {
            defaultValues.missingAddressBtn  = '1';
            expect(() => checkInit(defaultValues)).toThrow(errors.missingAddressBtnNotBool);

            defaultValues.missingAddressBtn  = 1;
            expect(() => checkInit(defaultValues)).toThrow(errors.missingAddressBtnNotBool);
        })
    });

});

describe('checkRemove', () => {
    test('should return true, when given proper class instance', () => {
        const parameters = {mymappiSearch: "mymappiSearch"};
        const valid = checkRemove(parameters);

        expect(valid).toBeTruth;
    });

    test('should console.error (removeClassInstanceIsNull) when parameter is undefined', () => {
        checkRemove();

        expect(console.error).toBeCalledTimes(1);
        expect(spyConsole.mock.calls[0][0]).toContain(errors.removeClassInstanceIsNull);
    });

    test('should return false when parameter is undefined', () => {
        const valid = checkRemove();

        expect(valid).toBeFalse;
    });

    test('should return false when parameter is different than MymappiSearch class instance', () => {
        let parameters = {};

        expect(checkRemove(parameters)).toBeFalse;

        parameters = '12';

        expect(checkRemove(parameters)).toBeFalse;

        parameters = 12;

        expect(checkRemove(parameters)).toBeFalse;

        parameters = true;

        expect(checkRemove(parameters)).toBeFalse;
    });

    test('should console.error (removeClassInstanceNotMymappiSdk) when parameter is different than MymappiSearch class instance', () => {
        checkRemove({});

        expect(console.error).toBeCalledTimes(1);
        expect(spyConsole.mock.calls[0][0]).toContain(errors.removeClassInstanceNotMymappiSdk);
    });
})

describe('checkGeocoding', () => {
    beforeEach(() => prepareGeocodingDefaultVal());
    afterEach(() => defaultValues = null);

    test('should return true with default values and given apiKey', () => {
        expect(() => checkGeocoding(defaultValues)).toBeTruth;
    });

    describe('apiKey', () => {
        test('should throw error (apiKeyGeocodingUndefined) is undefined', () => {
            defaultValues.apiKey = undefined;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.apiKeyGeocodingUndefined);
        })

        test('should throw error () when is not a string', () => {
            defaultValues.apiKey = 1;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.apiKeyGeocodingNotString);

            defaultValues.apiKey = true;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.apiKeyGeocodingNotString);
        });
    });

    describe('postalCode', () => {
        test('should throw error (postalCodeGeocodingNotString) is not a string', () => {
            defaultValues.postalCode = 2;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.postalCodeGeocodingNotString);

            defaultValues.postalCode = true;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.postalCodeGeocodingNotString);
        });
    });

    describe('sourceLat', () => {
        test('should throw error (sourceLatGeocodingWrongType) when is not a number', () => {
            defaultValues.sourceLat = 'true';
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.sourceLatGeocodingWrongType);

            defaultValues.sourceLat = true;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.sourceLatGeocodingWrongType);
        });
    });

    describe('sourceLon', () => {
        test('should throw error (sourceLonGeocodingWrongType) when is not a number', () => {
            defaultValues.sourceLon = 'true';
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.sourceLonGeocodingWrongType);

            defaultValues.sourceLon = true;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.sourceLonGeocodingWrongType);
        });
    });

    describe('lang', () => {
        test('should throw error (langGeocodingNotString) when is not a string', () => {
            defaultValues.lang  = 1;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.langGeocodingNotString);

            defaultValues.lang  = true;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.langGeocodingNotString);
        });

        test('should throw error (langGeocodingStringLength) when string length is different than 2', () => {
            defaultValues.lang  = '1';
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.langGeocodingStringLength);

            defaultValues.lang  = '123';
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.langGeocodingStringLength);
        })
    });

    describe('country', () => {
        test('should throw error (countryGeocodingNotString) when is not a string', () => {
            defaultValues.country  = 1;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.countryGeocodingNotString);

            defaultValues.country  = true;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.countryGeocodingNotString);
        });

        test('should throw error (countryGeocodingStringLength) string length different than 2 or 3', () => {
            defaultValues.country  = '1';
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.countryGeocodingStringLength);

            defaultValues.country  = '1234';
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.countryGeocodingStringLength);
        });
    });

    describe('layers', () => {
        test('should throw error (layersGeocodingNotString) when is not a string', () => {
            defaultValues.layers  = 1;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.layersGeocodingNotString);

            defaultValues.layers  = true;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.layersGeocodingNotString);
        });
    });

    describe('maxResults', () => {
        test('should throw error (maxResultsGeocodingWrongType) when is not a number', () => {
            defaultValues.maxResults  = '1';
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.maxResultsGeocodingWrongType);

            defaultValues.maxResults  = '';
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.maxResultsGeocodingWrongType);

            defaultValues.maxResults  = null;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.maxResultsGeocodingWrongType);

            defaultValues.maxResults  = undefined;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.maxResultsGeocodingWrongType);

            defaultValues.maxResults  = false;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.maxResultsGeocodingWrongType);
        });

        test('should throw error (maxResultsGeocodingSmallNumber) when is smaller or equal to 0', () => {
            defaultValues.maxResults  = 0;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.maxResultsGeocodingSmallNumber);

            defaultValues.maxResults  = -2;
            expect(() => checkGeocoding(defaultValues)).toThrow(errors.maxResultsGeocodingSmallNumber);
        });
    });
})