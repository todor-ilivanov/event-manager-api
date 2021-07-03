import { BatchWriteItemOutput, DocumentClient, GetItemOutput } from 'aws-sdk/clients/dynamodb';
import { DynamoDB } from 'aws-sdk';
import { EventDTO } from '../../models/event';

export const mockDynamoDbQuery = (items: object[]) => {
    const dynamoDbMockQuery = jest.fn().mockImplementation(() =>
        ({ promise: () => Promise.resolve({ Items: items }) })
    );
    DynamoDB.DocumentClient.prototype.query = dynamoDbMockQuery;
};

export const populateDbWithEvents = async (
    dynamoDbClient: DocumentClient,
    userId: string,
    events: EventDTO[]
): Promise<BatchWriteItemOutput> => {

    var params = {
        RequestItems: {
            'event-manager-table-test': 
                events.map((event, index) => {
                    return {
                        PutRequest: {
                            Item: {
                                userId: userId,
                                eventId: `event-${index+1}`,
                                headline: event.headline,
                                description: event.description,
                                startDate: event.startDate,
                                endDate: event.endDate,
                                imageUrl: event.imageUrl,
                                city: event.city
                            }
                        }
                    };
                })
        }
    };

    return await dynamoDbClient.batchWrite(params).promise();
};

export const getNewItemFromDb = async (dynamoDbClient: DocumentClient, userId: string, eventId: string): Promise<GetItemOutput> => {
    return await dynamoDbClient.get({
        TableName: process.env.tableName,
        Key: {
            userId: userId,
            eventId: eventId
        },
    }).promise();
};

export const cleanUp = async (dynamoDbClient: DocumentClient, userId: string, eventId: string) => {
    await dynamoDbClient.delete({
        TableName: process.env.tableName,
        Key: {
            userId: userId,
            eventId: eventId
        },
    }).promise();
};

export const cleanUpMultiple = async (dynamoDbClient: DocumentClient, userId: string, events: EventDTO[]) => {
    return Promise.all(
        events.map(async (event) =>
            await cleanUp(dynamoDbClient, userId, event.eventId)
        )
    );
}