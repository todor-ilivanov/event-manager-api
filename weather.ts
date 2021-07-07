import { APIGatewayEvent, Context } from 'aws-lambda';
import axios from 'axios';
import { config } from './externalApiConfig';
import { WeatherResponse } from 'models/weatherResponse';
import { handler } from './genericHandler';

const convertKtoC = (tempK: number): number => {
    const roundedTemp = (tempK - 273.15).toFixed(2)
    return parseFloat(roundedTemp);
};

export const getWeather = handler(async (
    event: APIGatewayEvent,
    context: Context
): Promise<WeatherResponse> => {

    const city = event.queryStringParameters['city'];
    
    try {
        const response = await axios.get(config.WEATHER_API_URL,
            { params: { q: city, appid: process.env.weatherApiKey } }
        );
        const weatherData = response.data;
        return {
            city: city,
            degreesC: convertKtoC(weatherData.main.temp),
            description: weatherData.weather[0].main,
            icon: weatherData.weather[0].icon
        } as WeatherResponse;
    } catch(error) {
        return { error: error.message } as WeatherResponse;
    }
});