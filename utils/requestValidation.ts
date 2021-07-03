import { APIGatewayEvent } from 'aws-lambda';

export type ValidationResult = {
    isValid: boolean;
    errorMessages: string[];
};

export const validateCreateRequest = (event: APIGatewayEvent): ValidationResult => {
    const data = JSON.parse(event.body);

    const parameters = ['headline', 'description', 'startDate', 'endDate', 'imageUrl', 'location'];
    const errorMessages = parameters
        .filter(param => data[param] === undefined)
        .map(param => `Missing parameter: ${param}`);

    const validationResult = errorMessages.length > 0 ?
        { isValid: false, errorMessages: errorMessages } : { isValid: true, errorMessages: [] };

    return validationResult;
};