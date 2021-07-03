import { Context, APIGatewayEvent } from "aws-lambda";
import { EventResponse } from 'models/eventResponses';
import { ValidationResult } from 'utils/requestValidation';

type APIResponse = {
    statusCode: number;
    body: string;
};

type Lambda = (event: APIGatewayEvent, context: Context) => Promise<EventResponse>;
type ValidationFn = (event: APIGatewayEvent) => ValidationResult;

export const handler = (lambda: Lambda, validationFn: ValidationFn) => {
    return async (event: APIGatewayEvent, context: Context) => {
        const apiResponse: APIResponse = {} as APIResponse;
        const requestValidation = validationFn(event);
        if(requestValidation.isValid === false) {
            apiResponse.body = JSON.stringify({ errors: requestValidation.errorMessages });
            apiResponse.statusCode = 400;
            return apiResponse;
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
