#!/bin/bash

# NOTE: `chmod +x ./simulate.sh` before running this file for the first time.

ORANGE='\033[0;33m'
CLEAR='\033[0m'

RESP=$(ask simulate -l en-US -t 'ask daisy chains to start my dinner party chain' | jq '.')

printf "\n\nSimulated ${ORANGE}'ask daisy chains to start my dinner party chain'${CLEAR}"

STATUS=$(echo $RESP | jq '.status')
printf "\n\n Status: ${ORANGE}$STATUS${CLEAR}"

INTENT=$(echo $RESP | jq '.result.skillExecutionInfo.invocationRequest.body.request.intent.name')
printf "\n\n Intent: ${ORANGE}$INTENT${CLEAR}"

# Customized solely for the daisy_chains skill.
# CHAIN_NAME=$(echo $RESP | jq '.result.skillExecutionInfo.invocationRequest.body.request.intent.slots.ChainName.value')
# printf "\n\n Chain Name: ${ORANGE}$CHAIN_NAME${CLEAR}"

OUTPUT_SPEECH=$(echo $RESP | jq '.result.skillExecutionInfo.invocationResponse.body.response.outputSpeech.ssml')
printf "\n\n Spoken Response: ${ORANGE}$OUTPUT_SPEECH${CLEAR}"

printf "\n\n"
