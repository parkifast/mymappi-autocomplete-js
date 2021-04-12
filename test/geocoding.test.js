const errors = require('../src/js/errors.js').default;
import { enableFetchMocks } from 'jest-fetch-mock';

import { Geocoding } from '../src/js/geocoding.js';

enableFetchMocks();

beforeEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
})

describe('Constructor', () => {
    test('should create an instance of Geocoding Class', () => {
        const parameters = {
            apiKey: 'KEY',
            postalCode: '123',
            sourceLat: 2,
            sourceLon: 3,
            lang: 'en',
            country: 'es',
            layers: 'street',
            maxResults: 4
        };

        const instance = new Geocoding(parameters);

        expect(instance).toBeInstanceOf(Geocoding);
    });

    test('shuld create a class with a set of values & expected url, for a given parameters', () => {
        const parameters = {
            apiKey: 'KEY',
            postalCode: '123',
            sourceLat: 2,
            sourceLon: 3,
            lang: 'en',
            country: 'es',
            layers: 'street',
            maxResults: 4
        };
        const expectedOptionsValues = {
            apiKey: 'KEY',
            postalCode: '123',
            sourceLat: 2,
            sourceLon: 3,
            lang: 'en',
            country: 'es',
            layers: 'street',
            maxResults: 4
        };

        const instance = new Geocoding(parameters);

        expect(instance.options).toEqual(expectedOptionsValues);
    });
});

describe('prepareUrl', () => {

    test('should create expectedUrl for a given parameters as options', () => {
        const parameters = {
            apiKey: 'KEY',
            postalCode: '123',
            sourceLat: 2,
            sourceLon: 3,
            lang: 'en',
            country: 'es',
            layers: 'street',
            maxResults: 4
        }

        const expectedUrl = 'https://dev-api.mymappi.com/v2/geocoding/direct?apikey=KEY&country_code=es&layers=street&lang=en&limit=4&postal_code=123&source_lat=2&source_lon=3&q=';

        const instance = new Geocoding(parameters);

        expect(instance.url).toEqual(expectedUrl);
    });

    describe('country parameter', () => {
        test('should not add country parameters when country is undefined', () => {
            const parameters = {
                apiKey: 'KEY'
            }

            const expectedUrl = 'https://dev-api.mymappi.com/v2/geocoding/direct?apikey=KEY&lang=en&limit=10&q=';

            const instance = new Geocoding(parameters);

            expect(instance.url).toEqual(expectedUrl);
        });

        test('should add country parameter when country is given', () => {
            const parameters = {
                apiKey: 'KEY',
                country: 'gb'
            }
            const expectedUrl = 'https://dev-api.mymappi.com/v2/geocoding/direct?apikey=KEY&country_code=gb&lang=en&limit=10&q=';

            const instance = new Geocoding(parameters);

            expect(instance.url).toEqual(expectedUrl);
        });

        test('should remove a space when given is more than one country', () => {
            const parameters = {
                apiKey: 'KEY',
                country: 'gb,pl,es'
            }
            const expectedUrl = 'https://dev-api.mymappi.com/v2/geocoding/direct?apikey=KEY&country_code=gb,pl,es&lang=en&limit=10&q=';

            const instance = new Geocoding(parameters);

            expect(instance.url).toEqual(expectedUrl);

            instance.options.country = ' gb,pl,es';

            instance.prepareUrl();
            expect(instance.url).toEqual(expectedUrl);

            instance.options.country = ' gb ,pl,es';

            instance.prepareUrl();
            expect(instance.url).toEqual(expectedUrl);

            instance.options.country = ' gb , pl,es';

            instance.prepareUrl();
            expect(instance.url).toEqual(expectedUrl);

            instance.options.country = ' gb , pl ,es';

            instance.prepareUrl();
            expect(instance.url).toEqual(expectedUrl);

            instance.options.country = ' gb , pl , es';

            instance.prepareUrl();
            expect(instance.url).toEqual(expectedUrl);

            instance.options.country = ' gb , pl , es ';

            instance.prepareUrl();
            expect(instance.url).toEqual(expectedUrl);

            instance.options.country = '     gb , pl , es ';

            instance.prepareUrl();
            expect(instance.url).toEqual(expectedUrl);

            instance.options.country = 'gb, pl      , es ';

            instance.prepareUrl();
            expect(instance.url).toEqual(expectedUrl);

            instance.options.country = 'gb, pl , es           ';

            instance.prepareUrl();
            expect(instance.url).toEqual(expectedUrl);

            instance.options.country = ' gb   ,   pl   ,        es ';
        })
    });

    describe('layers parameter', () => {
        test('should not add layers parameters when layers is undefined', () => {
            const parameters = {
                apiKey: 'KEY'
            }

            const expectedUrl = 'https://dev-api.mymappi.com/v2/geocoding/direct?apikey=KEY&lang=en&limit=10&q=';

            const instance = new Geocoding(parameters);

            expect(instance.url).toEqual(expectedUrl);
        });

        test('should add layers parameters when layers are given', () => {
            const parameters = {
                apiKey: 'KEY',
                layers: 'street'
            }

            const expectedUrl = 'https://dev-api.mymappi.com/v2/geocoding/direct?apikey=KEY&layers=street&lang=en&limit=10&q=';

            const instance = new Geocoding(parameters);

            expect(instance.url).toEqual(expectedUrl);
        });
    });

    describe('lang parameter', () => {
        test(`should add 'lang = en' parameters when lang is undefined`, () => {
            const parameters = {
                apiKey: 'KEY',
            }

            const expectedUrl = 'https://dev-api.mymappi.com/v2/geocoding/direct?apikey=KEY&lang=en&limit=10&q=';

            const instance = new Geocoding(parameters);

            expect(instance.url).toEqual(expectedUrl);
        });

        test('should add lang parameter with a given language when lang is set in parameters', () => {
            const parameters = {
                apiKey: 'KEY',
                lang: 'fr'
            }

            const expectedUrl = 'https://dev-api.mymappi.com/v2/geocoding/direct?apikey=KEY&lang=fr&limit=10&q=';

            const instance = new Geocoding(parameters);

            expect(instance.url).toEqual(expectedUrl);
        });
    });

    describe('maxResults parameter', () => {
        test(`should add 'limit=10' parameter to the url, when maxResults is undefined`, () => {
            const parameters = {
                apiKey: 'KEY'
            }

            const expectedUrl = 'https://dev-api.mymappi.com/v2/geocoding/direct?apikey=KEY&lang=en&limit=10&q=';

            const instance = new Geocoding(parameters);

            expect(instance.url).toEqual(expectedUrl);
        });

        test(`should add 'limit=4' parameter to the url, when maxResults is given with vlaue 4`, () => {
            const parameters = {
                apiKey: 'KEY',
                maxResults: 4
            }

            const expectedUrl = 'https://dev-api.mymappi.com/v2/geocoding/direct?apikey=KEY&lang=en&limit=4&q=';

            const instance = new Geocoding(parameters);

            expect(instance.url).toEqual(expectedUrl);
        });
    });

    describe('postalCode parameter', () => {
        test('should not add postal_code parameter to the url, when postalCode is undefined', () => {
            const parameters = {
                apiKey: 'KEY'
            }

            const expectedUrl = 'https://dev-api.mymappi.com/v2/geocoding/direct?apikey=KEY&lang=en&limit=10&q=';

            const instance = new Geocoding(parameters);

            expect(instance.url).toEqual(expectedUrl);
        });

        test('should add postal_code parameter to the url, when postalCode is given', () => {
            const parameters = {
                apiKey: 'KEY',
                postalCode: '123'
            }

            const expectedUrl = 'https://dev-api.mymappi.com/v2/geocoding/direct?apikey=KEY&lang=en&limit=10&postal_code=123&q=';

            const instance = new Geocoding(parameters);

            expect(instance.url).toEqual(expectedUrl);
        });
    });

    describe('sourceLat/Lon', () => {
        test('should add source_lat parameter to the url, when sourceLat is given', () => {
            const parameters = {
                apiKey: 'KEY',
                sourceLat: 2
            }

            const expectedUrl = 'https://dev-api.mymappi.com/v2/geocoding/direct?apikey=KEY&lang=en&limit=10&source_lat=2&q=';

            const instance = new Geocoding(parameters);

            expect(instance.url).toEqual(expectedUrl);
        });

        test('should add source_lon parameter to the url, when sourceLon is given', () => {
            const parameters = {
                apiKey: 'KEY',
                sourceLon: 3
            }

            const expectedUrl = 'https://dev-api.mymappi.com/v2/geocoding/direct?apikey=KEY&lang=en&limit=10&source_lon=3&q=';

            const instance = new Geocoding(parameters);

            expect(instance.url).toEqual(expectedUrl);
        });
    });

    describe('detectLang', () => {
        test(`should return 'en'`, () => {
            const parameters = {
                apiKey: 'KEY'
            }

            const instance = new Geocoding(parameters);

            expect(instance.detectLang()).toEqual('en');
        });
    });

    describe('detectLayers', () => {
        test('should return a list without spaces for a given string', () => {
            const parameters = {
                apiKey: 'KEY'
            };

            const instance = new Geocoding(parameters);

            let layers = 'street,venue,address';

            expect(instance.detectLayers(layers)).toEqual('street,venue,address');

            layers = ' street,venue,address';

            expect(instance.detectLayers(layers)).toEqual('street,venue,address');

            layers = 'street, venue,address';

            expect(instance.detectLayers(layers)).toEqual('street,venue,address');

            layers = 'street,venue, address';

            expect(instance.detectLayers(layers)).toEqual('street,venue,address');

            layers = 'street,venue,address ';

            expect(instance.detectLayers(layers)).toEqual('street,venue,address');

            layers = 'street ,venue ,address';

            expect(instance.detectLayers(layers)).toEqual('street,venue,address');

            layers = '     street,venue,address';

            expect(instance.detectLayers(layers)).toEqual('street,venue,address');

            layers = 'street,        venue,       address';

            expect(instance.detectLayers(layers)).toEqual('street,venue,address');

            layers = 'street  ,venue     ,address      ';

            expect(instance.detectLayers(layers)).toEqual('street,venue,address');

            layers = 'street   ,     venue,address   ';

            expect(instance.detectLayers(layers)).toEqual('street,venue,address');

            layers = '    street,     venue,     address';

            expect(instance.detectLayers(layers)).toEqual('street,venue,address');

            layers = '   street  ,   venue    ,    address    ';

            expect(instance.detectLayers(layers)).toEqual('street,venue,address');
        });

        test(`should return '' for given full list of layers or 'fullList'`, () => {
            let layers = 'venue,address,street,neighbourhood,borough,localadmin,locality,county,macrocounty,region,macroregion,country,postalcode';

            const parameters = {
                apiKey: 'KEY'
            };

            const instance = new Geocoding(parameters);

            expect(instance.detectLayers(layers)).toEqual('');

            layers = 'fullList';

            expect(instance.detectLayers(layers)).toEqual('');
        });
    });
      
});


describe('search', () => {
    const expectedArray = [
        {
            display_region: "Alcalá De Henares, Madrid, España",
            layer: "venue",
        },
        {
            display_region: "Porriño, Pontevedra, España",
            layer: "venue",
        }
    ];

    const mockSuccessfullRequest = () => {
        fetch.mockResponseOnce(JSON.stringify({data: expectedArray}));
    };

    let geocodingInstance;
    beforeAll(() => {
        const parameters = {
            apiKey: 'KEY'
        };

        geocodingInstance = new Geocoding(parameters);
    })

    test(`should fetch correctly and return parsed data`, async () => {
        mockSuccessfullRequest();

        const result = await geocodingInstance.search('sdf');
        expect(result).toEqual(expectedArray);
    });

    test('should throw error (queryGeocodingNotString) when given query is not a string', async () => {
        await expect(geocodingInstance.search(1)).rejects.toThrow(errors.queryGeocodingNotString);

        await expect(geocodingInstance.search(true)).rejects.toThrow(errors.queryGeocodingNotString);
    });

    test('should throw error (queryGeocodingEmptyString) when given query is a string of length 0', async () => {
        await expect(geocodingInstance.search('')).rejects.toThrow(errors.queryGeocodingEmptyString);
    });

    test('should call abort once on previousRequest if previousRequest is not a null', async () => {
        geocodingInstance.previousRequest = new AbortController();

        const spyAbort = jest.spyOn(geocodingInstance.previousRequest, 'abort');

        mockSuccessfullRequest();

        await geocodingInstance.search('sdf');

        expect(spyAbort).toHaveBeenCalledTimes(1);
    });

    test('should set previousRequest to null after a successful fetch', async () => {
        mockSuccessfullRequest();

        await geocodingInstance.search('sdf');

        expect(geocodingInstance.previousRequest).toBeNull();
    });

    test('should call fetch method once', async () => {
        mockSuccessfullRequest();

        await geocodingInstance.search('sdf');

        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('should call fetch method with a given url', async () => {
        mockSuccessfullRequest();

        const expectedUrl = 'https://dev-api.mymappi.com/v2/geocoding/direct?apikey=KEY&lang=en&limit=10&q=sdf';

        await geocodingInstance.search('sdf');

        expect(fetch.mock.calls[0][0]).toEqual(expectedUrl);
    });

    test('should throw error (response) & write an error by console.error, on a failed fetch request', async () => {
        const spyConsole = jest.spyOn(console, 'error').mockImplementation(() => {});
        fetch.mockReject(errors.response);

        await expect(geocodingInstance.search('sdf')).rejects.toThrow(errors.response);
        await expect(spyConsole.mock.calls[0][0]).toContain(errors.response);
    });

    test('should return undefined when request is aborted', async () => {
        fetch.mockAbortOnce();

        const result = await geocodingInstance.search('sdf');

        expect(result).toBeUndefined();
    });

    describe('responseParser', () => {
        test('should return result from given response', () => {
            const response = {
                data: expectedArray
            }

            const result = geocodingInstance.responseParser(response);

            expect(result).toEqual(expectedArray);
        });
    });
});