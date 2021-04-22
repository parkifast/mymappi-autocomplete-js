import { initAutocomplete, removeAutocomplete, initGeocoding } from "../src/index";
const errors = require('../src/js/errors.js').default;

import * as check from '../src/js/check.js';
import { MymappiSearch } from '../src/js/mymappiSearch.js';
import { Geocoding } from '../src/js/geocoding.js';

// mocks
jest.mock("../src/js/mymappiSearch.js");

jest.mock("../src/js/geocoding.js")

jest.mock("../src/js/check.js");

let returnInit = null;
check.checkInit = jest.fn().mockImplementation(() => {return returnInit});

let returnRemove = null;
check.checkRemove = jest.fn().mockImplementation(() => {return returnRemove});

let returnGeocoding = null;
check.checkGeocoding = jest.fn().mockImplementation(() => {return returnGeocoding});


// Cleaning up
beforeEach(() => {
    jest.clearAllMocks();
    returnInit = null;
    returnRemove = null;
    returnGeocoding = null;
});

describe("initAutocomplete", () => {
    beforeAll(() => {
        jest.spyOn(MymappiSearch.prototype, 'initialize').mockImplementation((x) => {
            return Promise.resolve(MymappiSearch.mock.instances[0]);
        });
    });

    test('should return a class instance when all parameters are correct', async () => {
        const parameters = {
            apiKey: 'KEY',
            input: 'input'
        };

        returnInit = true;

        expect.assertions(1);

        await expect(initAutocomplete(parameters)).resolves.toEqual(MymappiSearch.mock.instances[0]);
    });

    test('should set delay time to 150, when searchDelay is set to smaller number than 150', async() => {
        const parameters = {
            apiKey: 'KEY',
            input: 'input',
            searchDelay: 140
        };

        const expectedParameters = {
            apiKey: 'KEY',
            input: 'input',
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

        returnInit = true;

        expect.assertions(1);

        await initAutocomplete(parameters);
        expect(check.checkInit.mock.calls[0][0]).toEqual(expectedParameters);
    });

    test('should throw an error (origParamsInitUndefined) when called without parameters', async() => {
        expect.assertions(1);
        await expect(() => initAutocomplete()).toThrow(errors.origParamsInitUndefined);
    });

    test('should call checkInit once', async () => {
        expect.assertions(1);
        await initAutocomplete({});

        expect(check.checkInit).toBeCalledTimes(1);
    })

    test('should call checkInit with given parameters when given is api, input & default values', async() => {
        const parameters = {
            apiKey: 'KEY',
            input: 'input',
        };
        const withDefaultParameters = {
            apiKey: 'KEY',
            input: 'input',
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

        initAutocomplete(parameters);
        expect.assertions(1);
        await initAutocomplete(parameters);

        expect(check.checkInit.mock.calls[0][0]).toEqual(withDefaultParameters);
    });

    test('should return undefined when given parameters are invalid', async() => {
        returnInit = false;

        const returnVal = initAutocomplete({});

        expect(returnVal).toBeUndefined();
        await expect(initAutocomplete({})).toBeUndefined();
    });
});

describe("initRemove", () => {
    test('should call remove method of instance when given is an instance of MymappiSearch class', () => {
        returnRemove = true;
        new MymappiSearch();
        removeAutocomplete(MymappiSearch.mock.instances[0]);
        expect(MymappiSearch.mock.instances[0].remove).toBeCalledTimes(1);
    });

    test('should call checkRemove once', () => {
        removeAutocomplete({});

        expect(check.checkRemove).toBeCalledTimes(1);
    });

    test('should return undefined when given parameters are invalid', () => {
        returnRemove = false;

        const resultVal = removeAutocomplete({});
        expect(resultVal).toBeUndefined();
    });
});

describe("initGeocoding", () => {
    test('should create a new instance of geocoding when given parameters are correct', () => {
        const parameters = {
            apiKey: 'KEY'
        };

        returnGeocoding = true;

        const resultVal = initGeocoding(parameters);
        expect(resultVal).toBe(Geocoding.mock.instances[0]);
    });

    test('should throw an error (origParamsGeocodingUndefined) when called without parameters', () => {
        expect(() => initGeocoding()).toThrow(errors.origParamsGeocodingUndefined);
    });

    test('should call checkGeocoding once', () => {
        initGeocoding({});

        expect(check.checkGeocoding).toHaveBeenCalledTimes(1);
    });

    test('should  call checkInit with given parameters when given is api & default values', () => {
        const parameters = {
            apiKey: 'KEY'
        };

        const withDefaultParameters = {
            apiKey: 'KEY',
            sourceLat: undefined,
            sourceLong: undefined,
            layers: "address,street,venue",
            postalCode: undefined,
            maxResults: 10,
            country: undefined,
            lang: undefined,
        };

        initGeocoding(parameters);

        expect(check.checkGeocoding.mock.calls[0][0]).toEqual(withDefaultParameters);
    });

    test('should return undefined when given parameters are invalid', () => {
        returnGeocoding = false;

        const resultVal = initGeocoding({});
        expect(resultVal).toBeUndefined();
    });
});