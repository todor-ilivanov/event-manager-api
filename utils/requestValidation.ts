import { APIGatewayEvent } from 'aws-lambda';

export type ValidationResult = {
    isValid: boolean;
    errorMessages: string[];
};

const validateMissingParams = (event: APIGatewayEvent, parameters: string[]): ValidationResult => {
    const data = JSON.parse(event.body);

    const errorMessages = parameters
        .filter(param => data[param] === undefined)
        .map(param => `Missing parameter: ${param}`);

    const validationResult = errorMessages.length > 0 ?
        { isValid: false, errorMessages: errorMessages } : { isValid: true, errorMessages: [] };

    return validationResult;
};

export const validateCreateRequest = (event: APIGatewayEvent): ValidationResult => {
    const parameters = ['headline', 'description', 'startDate', 'endDate', 'imageUrl', 'city'];
    return validateMissingParams(event, parameters);
};