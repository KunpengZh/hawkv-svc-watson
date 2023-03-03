#!/bin/sh
## testing
echo 'fix security on March 20'
echo 'npm audit 2022-12-29'
pwd
ls -li
ls -li ./dist
whoami
chown -R 1004610000:0 "/app/.npm"
npm start --loglevel=verbose