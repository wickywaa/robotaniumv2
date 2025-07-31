#!/bin/bash
cd /usr/app
node ./node_modules/typeorm/cli.js -d ./src/Providers/DatabaseProvider migration:run -t each
node index.js