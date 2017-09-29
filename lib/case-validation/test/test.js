/**
 *   author: William Jin
 */


let event = require('./event');
let CaseValidation = require('../index');
let schemaGate = require('../../schema-gate/index');

schemaGate.getSchema('hospital1', '1.0.0', (err, result) => {
    if (err) console.error(err);
    else {
        let caseValidation = new CaseValidation(schemaGate.documentToJson(result));

        caseValidation.timeDefinition = (inputTime) => {
            let splits = inputTime.split(' ');
            let date = splits[0];
            let time = splits[1];
            let timeSplit = time.split(':');
            let dateSplits = date.split('-');
            let year = parseInt(dateSplits[0]);
            let month = parseInt(dateSplits[1]);
            let day = parseInt(dateSplits[2]);
            let hour = parseInt(timeSplit[0]);
            let min = parseInt(timeSplit[1]);
            return new Date(year, month - 1, day, hour, min);
        };

        let cancelIsInvalid = () => {
            return caseValidation.record['sched_status_class'] !== '2';
        };
        caseValidation.conditions.push(cancelIsInvalid);
        for (let i = 0; i < event.length; i++) {
            caseValidation.validate(event[i], (err, data) => {
                if (err) console.log(err.stack);
                else console.log(data);
            });
        }
    }
});
