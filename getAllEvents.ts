import { APIGatewayEvent, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { handler } from './genericHandler';
import { EventDTO } from './models/event';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const getAllEvents = handler(async (
    event: APIGatewayEvent,
    context: Context
): Promise<EventDTO[]> => {
    const params = {
        TableName: process.env.tableName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': event.requestContext.identity.cognitoIdentityId,
        },
    };

    const result = await dynamoDb.query(params).promise();

    return result.Items.map(item => item as EventDTO);
});