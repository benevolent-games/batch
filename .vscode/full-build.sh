#!/usr/bin/env bash

npm install \
	&& npm run build -s \
	&& npm test
