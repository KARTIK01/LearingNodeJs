# LearingNodeJs

## STEPS

get config.developemnt.json file from requesting and paste that in `src/server/config/env` 


`$ cd {{project}}`

`$ npm install`

`$ subl  /private/etc/hosts`

make this entry at bottom

`127.0.0.1	learnnode.io`

`$ nodemon src/server/index.js` 

###Debug

`node-debug --web-port=8989`

##Set Node ENV
`subl ~/.exports`
`export NODE_ENV=development`





##SET UP Elastic Search

###Install

`brew install elasticsearch`

###Configuration

Update the elasticsearch configuration file in `/usr/local/etc/elasticsearch/elasticsearch.yml`.

Set the value below to false:

```discovery.zen.ping.multicast.enabled: false #(it's true by default)```

###How to start it

If `brew services start elasticsearch` doesn't work for you, check the instructions when you run `brew info elasticsearch`.

###CHECK

Visit `http://localhost:9200/`

