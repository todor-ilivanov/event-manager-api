import { APIGatewayEvent, Context } from 'aws-lambda';
import axios from 'axios';
import { WeatherResponse } from 'models/weatherResponse';
import { getWeather } from '../../weather';

const mockOpenWeatherAPIResponse = {
    "weather": [
        {
            "main": "Clear",
            "icon": "01n"
        }
    ],
    "main": {
        "temp": 289.98
    }
};

const invokeWeatherLambda = async (): Promise<WeatherResponse> => {
    const event = {} as APIGatewayEvent;
    event.queryStringParameters = { city: 'Sofia' };
    const response = await getWeather(event, {} as Context);
    const responseBody = JSON.parse(response.body) as WeatherResponse;
    return responseBody;
};

describe('weather lambda', () => {

    it('fetches and parses the weather data correctly', async () => {
        axios.get = jest.fn().mockImplementation(() => Promise.resolve({ data: mockOpenWeatherAPIResponse }));
        const response = await invokeWeatherLambda();
        expect(response.city).toBe('Sofia');
        expect(response.degreesC).toEqual(16.83);
        expect(response.icon).toBe('01n');
        expect(response.description).toBe('Clear');
    });

    it('returns an error response when the API call fails', async () => {
        axios.get = jest.fn().mockImplementation(() => Promise.reject({ message: 'Error fetching weather data.' }));
        const response = await invokeWeatherLambda();
        expect(response.error).toBe('Error fetching weather data.');
    });
});