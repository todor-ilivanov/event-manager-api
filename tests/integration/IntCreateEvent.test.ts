import { Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { cleanUp, getNewItemFromDb } from '../testutils/dynamoDbUtils';
import { createEvent } from '../../src/createEvent';
import { mockSuccessfulCreationRequest } from '../__mocks__/mockRequestObjects';
import { buildMockRequest } from '../testutils/eventBuilders';

describe('createEvent lambda integration test', () => {

    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

    beforeAll(() => {
        process.env.tableName = 'event-manager-table-test';
        process.env.AWS_REGION = 'eu-west-2';
    });

    it('events are created successfully in the test dynamo db instance', async () => {

        const event = buildMockRequest(mockSuccessfulCreationRequest);
        const context = {} as Context;

        const response = await createEvent(event, context);
        const userId = JSON.parse(response.body).userId;
        const newEventId = JSON.parse(response.body).eventId;

        const result = await getNewItemFromDb(dynamoDbClient, userId, newEventId);

        expect(result.Item.headline).toBe('Test event');
        await cleanUp(dynamoDbClient, userId, newEventId);
    });
});
