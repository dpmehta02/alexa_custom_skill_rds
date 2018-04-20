#!/bin/bash

# NOTE: `chmod +x ./test.sh` before running this file for the first time.

# Validate US phrase formats
ask validate -l en-US

# Run test suite
npm --prefix ./lambda/custom test
