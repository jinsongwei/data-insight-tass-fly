/**
 *   author: William Jin
 */
 
const index = require('../index');

// const event = require('./mock-data');
const event = require('./event.json');

index.handler(event, null, (err, data)=>{
    if(err) console.error(err, err.stack);
    else console.log(data);
});


