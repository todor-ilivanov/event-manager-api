import { handler } from './genericHandler';
import { Context, APIGatewayEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';
import { EventResponse } from './models/eventResponses';
import { validateCreateRequest } from './utils/requestValidation';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const createEvent = handler(async (
    event: APIGatewayEvent,
    context: Context
): Promise<EventResponse> => {
    const data = JSON.parse(event.body);

    const params = {
        TableName: process.env.tableName,
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            eventId: uuid.v1(),
            headline: data.headline,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            imageUrl: data.imageUrl,
            location: data.location
        }
    };

    await dynamoDb.put(params).promise();

    return params.Item;
}, validateCreateRequest);
