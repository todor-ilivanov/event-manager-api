# Event Manager API

A Serverless API for the Event Manager App, built using the [serverless-bundle](https://github.com/AnomalyInnovations/serverless-bundle).
Consumed by the [event-manager-app UI](https://github.com/todor-ilivanov/event-manager-app).

## Endpoints

* `/create` - given an event as JSON, creates an event with the ID of the currently authenticated user
* `/getAllEvents` - gets all events from a DynamoDB belonging to the currently authenticated user
* `/weather` - given a city as a query parameter, it calls the OpenWeatherMap API to fetch and parse weather data

## Deployment
The lambdas are bundled by Webpack and the builds are uploaded to an S3 bucket. 
To deploy, run `serverless deploy --stage=ENV`, where ENV is replaced by the target environment

## Local development

### Running the lambdas locally
Assuming the correct AWS credentials have been supplied, running the following commands invokes the lambdas locally:

* createEvent: `serverless invoke local --function createEvent --path mockRequests/create-event.json`
* getAllEvents: `serverless invoke local --function getAllEvents --path mockRequests/get-all-events.json`
* weather: `serverless invoke local --function weather --path mockRequests/weather.json`

Note: a cognito user id needs to be supplied as part of the request:
```json
"requestContext": {
    "identity": {
      "cognitoIdentityId": "TEST-USER-1234"
    }
  }
 ```
#### Weather Lambda
The API key needs to be set as an environment variable (e.g. in the .env file) - `OPEN_WEATHER_MAP_API_KEY` - so that the weather lambda is able to make requests to the endpoint.

### Unit Tests

* Run `npm test` to run the unit tests under `/tests/unittests`

### Integration Tests
Currently, they are set up to use a test instance of a real DynamoDB. Ideally should test against a local DB instance instead.
* Run `npm run test-int` to run the integration tests under `/tests/integration`
