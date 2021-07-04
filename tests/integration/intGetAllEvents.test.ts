import { Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { cleanUpMultiple, populateDbWithEvents } from '../testutils/dynamoDbUtils';
import { getAllEvents } from '../../getAllEvents';
import { buildMockRequest } from '../testutils/eventBuilders';
import { EventDTO } from 'models/event';

describe('getAllEvents lambda integration test', () => {

    const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

    const mockEvents: EventDTO[] = [
        {
            headline: 'Test event 1',
            description: 'Test event 1 descr',
            startDate: '03/07/2021',
            endDate: '03/07/2021',
            imageUrl: 'image1.com',
            city: 'Michigan',
        } as EventDTO,
        {
            headline: 'Test event 2',
            description: 'Test event 2 descr',
            startDate: '03/07/2021',
            endDate: '03/07/2021',
            imageUrl: 'image2.com',
            city: 'Venice',
        } as EventDTO
    ];

    beforeAll(() => {
        process.env.tableName = 'event-manager-table-test';
        process.env.AWS_REGION = 'eu-west-2';
    });

    it('test event retrieval when user has at least one event', async () => {

        const event = buildMockRequest({});
        const userId = event.requestContext.identity.cognitoIdentityId;
        const context = {} as Context;

        await populateDbWithEvents(dynamoDbClient, userId, mockEvents);
        
        const response = await getAllEvents(event, context);
        const responseData = JSON.parse(response.body);

        expect(response.statusCode).toBe(200);
        expect(responseData.length).toBe(2);
        expect(responseData[0].headline).toBe('Test event 1');
        expect(responseData[1].headline).toBe('Test event 2');

        await cleanUpMultiple(dynamoDbClient, userId, responseData);
    });

    it('test event retrieval when user has no events', async () => {

        const event = buildMockRequest({});
        const context = {} as Context;
        const response = await getAllEvents(event, context);
        const responseData = JSON.parse(response.body);
        expect(response.statusCode).toBe(200);
        expect(responseData.length).toBe(0);
    });
});