/**
 *   author: William Jin
 *
 *   ------ hospital lambda function -----
 *
 *   1. mapping schema from hospital to TaasFly formatted data.
 *   2. clean invalid cases.
 *   3. save meta data into DynamoDb (optional).
 *   4. callback clean data and redirect to S3 as backup and trigger redshift to copy
 */

//todo remove below when uploading to AWS
let config = require('../../config/config-helper').config;
let AWS = new config().AWS; // remove this when upload to AWS

// const AWS = require('aws-sdk');

const ERR = require('error-msg');
const schemaGate = require('schema-gate');
const CaseValidation = require('case-validation');

let ddb = new AWS.DynamoDB({apiVersion: "2012-8-10", region: 'us-west-2'});

const HOSPITAL_NAME = 'hospital1';
const SCHEMA_VERSION = '1.0.0';
const HOS_META_DATA_TABLE = 'hos1_table';
const META_DATA_TABLE = 'meta-data-table';

function serverError(err, func, callback) {
    ERR.Log(HOSPITAL_NAME, func, err);
    callback(err);
}

function DataTransform(event) {
    let totalRecordsNum = event.records.length;
    let schemaValidNum = 0;
    let caseValidNum = 0;
    let validIds = [];
    let curTime = Date.now();

    this.transform = (callback) => {

        displayInfo(err => {
            if (err) {
                serverError(new Error(err), "displayInfo", callback);
                return;
            }
            schemaTransformation((err, intermediateData) => {
                if (err) {
                    serverError(new Error(err), "schemaValidation", callback);
                    return;
                }
                caseValidationCheck(intermediateData, (err, cleanData) => {
                    if (err) {
                        serverError(new Error(err), "caseValidationCheck", callback);
                        return;
                    }
                    serializeData(cleanData, (err, records) => {
                        if (err) {
                            serverError(new Error(err), "saveToDDB", callback);
                            return;
                        }
                        console.log(records);
                        callback(null, records);
                    });
                });
            });
        });
    };

    // add log info here for particular interest
    function displayInfo(callback) {
        console.log(new Date().toLocaleString());
        callback();
    }

    /**
     * @param callback(err, data) data => taasFly format data record.
     */
    function schemaTransformation(callback) {
        schemaGate.getSchema(HOSPITAL_NAME, SCHEMA_VERSION, (err, hosToTaasMapper) => {
            if (err) {
                callback(new Error(err));
                return;
            }
            hosToTaasMapper = schemaGate.documentToJson(hosToTaasMapper);
            const output = event.records.map((record) => {
                const entry = (new Buffer(record.data, 'base64')).toString('utf8');
                let entryJson = JSON.parse(entry);
                let taasFlyRecord = schemaGate.getTaasFormatRecord(hosToTaasMapper, entryJson);
                return {
                    recordId: record.recordId,
                    result: 'Ok',
                    data: taasFlyRecord,
                }
            });
            callback(null, output);
        });
    }

    function caseValidationCheck(intermediateData, callback) {

        let caseValidation = new CaseValidation(timeConverter);

        // define customized conditions, and push to conditions list
        let cancelAttrIsInvalid = () => {
            return caseValidation.data['scheduled_status_class'] !== '2';
        };
        let caseIdAttrInvalid = () => {
            return caseValidation.data['case_id'].length > 38;
        };
        caseValidation.conditions.push(cancelAttrIsInvalid);
        caseValidation.conditions.push(caseIdAttrInvalid);

        // validate all records
        let cleanData = intermediateData.map((record)=>{
            let res = caseValidation.validate(record.data);
            return {
                recordId: record.recordId,
                result: res.result,
                data: res.data,
            }
        });
        callback(null, cleanData);
    }

    function serializeData(cleanData, callback) {
        const output = cleanData.map((record) => {
            const payload = (new Buffer(JSON.stringify(record.data), 'utf8')).toString('base64');
            return {
                recordId: record.recordId,
                result: record.result,
                data: payload
            }
        });
        callback(null, {records: output});
    }

    // save filter information to database
    function saveMetaData() {
        let hashHour = (parseInt(curTime / (1000 * 60 * 60))).toString();
        let hashMin = (parseInt(curTime / (1000 * 60))).toString();
        console.log(hashHour, hashMin);

        let params = {
            TableName: META_DATA_TABLE,
            Item: {
                hashKey: {S: hashHour},
                rangeKey: {S: hashMin},
                totalRecordsNum: {N: totalRecordsNum.toString()},
                schemaValidNum: {N: schemaValidNum.toString()},
                caseValidNum: {N: caseValidNum.toString()},
                validIds: {SS: validIds}
            },
            ReturnConsumedCapacity: "TOTAL"
        };
        ddb.putItem(params, (err) => {
            if (err) console.error(new Error(err));
            console.log((Date.now() - curTime) / 1000);
        });
    }

    // define timeConverter for Hospital 1
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
}


exports.handler = function (event, context, callback) {
    if (!event || !event.records) {
        callback('not a valid stream event'); // 'Invalid request'
        return;
    }
    const dataClean = new DataTransform(event);
    dataClean.transform(callback);
};
