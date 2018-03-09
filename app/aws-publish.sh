#!/usr/bin/env bash

export AWS_PROFILE=agility360


echo "Building web app."
npm run build --prod
aws s3 sync ./www s3://mobile.agility360app.net --profile agility360
echo "Web app compiled."
echo "To execute in prod: https://mobile.agility360app.net"
