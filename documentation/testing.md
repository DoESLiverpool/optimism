# Testing Optimism

## API tests

These live in the ./api/test folder. To run them, use:

`npm run test-api`

The tests are currently integration tests only. They test the API endpoints against a running instance of the API. This is still a WIP and will eventually test endpoints for correct return values including returning appropriate HTTP response codes on failure.

Unit tests are TODO.


## Website tests

TODO

Still to be finalised but Cypress may be our choice of front-end testing framework. Tests can be run manually or as part of CI/CD.