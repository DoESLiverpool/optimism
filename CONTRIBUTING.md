# WorkFlow
The `master` branch is used purely for deploying to production. All work should be done on the `development` branch but branching off of it following the naming scheme `<feature>/<issue_number>-<name>`, for example, `feature/58-fix-test-environment`

# LocalHosting/Testing
To run the project through docker, 'email_user' and 'email_pass' files need to exist in the root directory, populated only be a valid email address that can recieve emails and dummy password. You should copy the '.test.env' file into a proper '.env' file and populate it for the docker compose file to inherit the values.

Ensure that the file permissions for the project matches the permissiond defined in the 'docker-compose.yml' file and ensure that the database is populated and migrated properly by running
'docker-compose exec api npx knex seed:run --env production'