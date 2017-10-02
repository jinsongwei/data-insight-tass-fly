/**
 *   author: William Jin
 */
 
const index = require('../index');

// const event = require('./mock-data');
const event = require('./event.json');

index.handler(event, null, (err, data)=>{
    if(err) console.error(err, err.stack);
    console.log("\n\n start here \n\n");
    console.log(data);
});


