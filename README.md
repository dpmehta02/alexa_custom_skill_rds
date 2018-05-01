# alexa_custom_skill_rds
A custom Alexa Skill, built on ASK CLI, wired up to access an AWS RDS instance.

Test
--
Before running tests for the first time, run: `chmod +x ./simulate.sh` and `chmod +x ./test.sh`.

To actually run the test suite, which runs a simulation against your skill uploaded to AWS: `./test.sh`

Deploy
--
`ask deploy`

Lint
--
Configured in `./lambda/custom/eslintrc.js`. If you run Atom, you should add a linting package.
