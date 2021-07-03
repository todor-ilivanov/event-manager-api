import { APIGatewayEvent, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { handler } from 'genericHandler';
import { EventResponse } from 'models/eventResponses';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const getAllEvents = handler(async (
    event: APIGatewayEvent,
    context: Context
): Promise<EventResponse[]> => {
    const params = {
        TableName: process.env.tableName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': event.requestContext.identity.cognitoIdentityId,
        },
    };

    const result = await dynamoDb.query(params).promise();

    return result.Items.map(item => item as EventResponse);
});