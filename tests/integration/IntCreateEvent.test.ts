import { APIGatewayEvent, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { cleanUp, getNewItemFromDb } from '../testutils/dynamoDbUtils';
import { createEvent } from '../../createEvent';
import { mockSuccessfulCreationRequest } from '../__mocks__/mockRequestObjects';

describe('test event creation', () => {

    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

    beforeAll(() => {
        process.env.tableName = 'event-manager-table-test';
        process.env.AWS_REGION = 'eu-west-2';
    });

    it('test event creation and retrieval', async () => {

        const event = { body: JSON.stringify(mockSuccessfulCreationRequest) } as APIGatewayEvent;
        const context = {} as Context;

        const response = await createEvent(event, context);
        const userId = JSON.parse(response.body).userId;
        const newEventId = JSON.parse(response.body).eventId;

        const result = await getNewItemFromDb(dynamoDbClient, userId, newEventId);

        expect(result.Item.headline).toBe('Test event');
        await cleanUp(dynamoDbClient, userId, newEventId);
    });
});
