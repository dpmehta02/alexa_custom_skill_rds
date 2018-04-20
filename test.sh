#!/bin/bash

# You'll need to `chmod +x ./test.sh` this file to be able to run it.

# Validate US phrase formats
ask validate -l en-US
# TODO: if REQUIRED in response, fail

# Run test suite
npm --prefix ./lambda/custom test
