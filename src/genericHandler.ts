import { Context, APIGatewayEvent } from "aws-lambda";
import { EventDTO } from 'models/event';
import { ValidationResult } from 'utils/requestValidation';

type APIResponse = {
    statusCode: number;
    body: string;
    headers: { [key: string]: string | boolean };
};

type Lambda = (event: APIGatewayEvent, context: Context) => Promise<EventDTO | EventDTO[]>;
type ValidationFn = (event: APIGatewayEvent) => ValidationResult;

export const handler = (lambda: Lambda, validationFn?: ValidationFn) => {
    return async (event: APIGatewayEvent, context: Context) => {
        const apiResponse: APIResponse = {} as APIResponse;
        apiResponse.headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        };

        if(validationFn !== undefined) {
            const requestValidation = validationFn(event);
            if(requestValidation.isValid === false) {
                apiResponse.body = JSON.stringify({ errors: requestValidation.errorMessages });
                apiResponse.statusCode = 400;
                return apiResponse;
            }
        }

        try {
            const lambdaResult = await lambda(event, context);
            apiResponse.body = JSON.stringify(lambdaResult);
            apiResponse.statusCode = 200;
        } catch(error) {
            apiResponse.body = JSON.stringify({ error: error.message });
            apiResponse.statusCode = 500;
        }

        return apiResponse;
    };
};
