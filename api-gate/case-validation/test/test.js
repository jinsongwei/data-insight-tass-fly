/**
 *   author: William Jin
 */


let event = require('./event');
let CaseValidation = require('../index');
let schemaGate = require('../../schema-gate/index');

//convert time format return Date object.
let timeConverter = (inputTime) => {
    let splits = inputTime.split(' ');
    if (splits.length !== 2)
        return null;
    let date = splits[0];
    let time = splits[1];
    let timeSplit = time.split(':');
    if (timeSplit.length !== 2)
        return null;
    let dateSplits = date.split('-');
    if (dateSplits.length !== 3)
        return null;
    let year = parseInt(dateSplits[0]);
    let month = parseInt(dateSplits[1]);
    let day = parseInt(dateSplits[2]);
    let hour = parseInt(timeSplit[0]);
    let min = parseInt(timeSplit[1]);
    return new Date(year, month - 1, day, hour, min);
};

let caseValidation = new CaseValidation(timeConverter);

//define specialized validation conditions, and push to conditions list
let cancelAttrIsInvalid = () => {
    return caseValidation.data['scheduled_status_class'] !== '2';
};

let caseIdAttrInvalid = () => {
    return caseValidation.data['case_id'].length > 38;
};

caseValidation.conditions.push(cancelAttrIsInvalid);
caseValidation.conditions.push(caseIdAttrInvalid);

// validate all records
for (let i = 0; i < event.length; i++) {
    let result = caseValidation.validate(event[i].data);
    console.log(result);
}
