/**
 *   author: William Jin
 */

    //todo remove it
const config = require('../../config/config-helper').config;
const AWS = new config().AWS; // remove this when upload to AWS

// const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: 'us-west-2'});

const META_DATA_TABLE = 'meta-data-table';
const ERR = require('error-msg');

//   record(['case_id'].length < 40) ||


function CaseValidation(schema) {

    this.record = schema;           // a schema transformed record.
    this.conditions = [];       // add condition functions
    this.timeDefinition = null; // define a function that input as a hospital time convention
                                // return a TassFly unified Date.toString() format

    // native generalized conditions
    let attributesValidation = () => {
        return !(!this.record['case_id']
            || !this.record['class_name']
            || !this.record['create_date']
            || !this.record['location_id']
            || !this.record['location_name']
            || !this.record['sched_status_class']
            || !this.record['sched_status_name']
            || !this.record['sched_status_name']
            || !this.record['update_date']
            || !this.record['service_class']
            || !this.record['service_name']);
    };

    let validateTime = () => {
        return this.record['create_date'] < this.record['update_date']
            || this.record['patient_in_room_dttm'] < this.record['patient_out_room_dttm']
            || this.record['room_cleanup_start_dttm'] < this.record['room_cleanup_comp']
            || this.record['schedule_in_room_dttm'] < this.record['schedule_out_room_dttm']
            || this.record['total_time_needed'] > 0;
    };

    this.conditions.push(attributesValidation);
    this.conditions.push(validateTime);

    this.validate = (record) => {
        if (this.timeDefinition === null) {
            callback(new Error(ERR.TIME_DEFINITION_NOT_FOUND));
            return;
        }
        this.record = record;

        // check conditions
        for (let i = 0; i < this.conditions.length; i++) {
            if (!this.conditions[i]) {
                return {result: 'Dropped', record: this.record};
            }
        }
        return {result: 'Ok', record: this.record};
    }
}

module.exports = CaseValidation;

