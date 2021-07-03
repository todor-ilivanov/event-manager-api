import { APIGatewayEvent } from 'aws-lambda';

export const buildMockCreationRequest = (mockRequest: object): APIGatewayEvent => {
    return {
        body: JSON.stringify(mockRequest), requestContext: {
            identity: {
                cognitoIdentityId: "TEST-USER-1234"
            }
        }
    } as APIGatewayEvent;
}