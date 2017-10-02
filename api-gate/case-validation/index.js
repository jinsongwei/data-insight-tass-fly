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


function CaseValidation(timeFunc) {

    this.data = {};           // a schema transformed data.
    this.conditions = [];           // add condition functions
    this.timeConverter = timeFunc;     // define a function that input as a hospital time convention
    // return a TaasFly unified Date.toString() format
    this.validate = (data) => {
    };   // @params data: a Taas schema data,

    // native generalized conditions
    // condition 1
    let attributesValidation = () => {

        return !(this.data['case_id'] === undefined
            || this.data['class_name'] === undefined
            || this.data['create_time'] === undefined
            || this.data['location_id'] === undefined
            || this.data['location_name'] === undefined
            || this.data['update_time'] === undefined
            || this.data['service_name'] === undefined);
    };

    // condition 2
    let validateTime = () => {
        if (this.data['create_time'] > this.data['update_time']){
            console.log('false assertion 1');
            return false;
        }

        if (this.data['scheduled_in_room_time'] > this.data['scheduled_out_room_time']){
            console.log('false assertion 2');
            return false;
        }

        if ((typeof this.data['patient_in_room_time'] === 'number' &&
                typeof this.data['patient_out_room_time'] === 'number')
            && this.data['patient_in_room_time'] > this.data['patient_out_room_time']){
            console.log('false assertion 3');
            return false;
        }

        if ((typeof this.data['room_cleanup_start_time'] === 'number' &&
                typeof this.data['room_cleanup_finished_time'] === 'number') &&
            this.data['room_cleanup_start_time'] > this.data['room_cleanup_comp']){

            console.log('false assertion 4');
            return false;
        }

        if (typeof this.data['total_time_minutes'] === 'number' &&
            this.data['total_time_minutes'] < 0){

            console.log('false assertion 5');
            return false;
        }

        return true;
    };

    this.conditions.push(attributesValidation);
    this.conditions.push(validateTime);


    // validate data
    this.validate = (data) => {
        if (this.timeConverter === null) {
            callback(new Error(ERR.TIME_DEFINITION_NOT_FOUND));
            return;
        }

        this.data = data;

        let create_time = this.timeConverter(data['create_time']);
        this.data['create_time'] = create_time !== null ? create_time.getTime() : null;

        let update_time = this.timeConverter(data['update_time']);
        this.data['update_time'] = update_time ? update_time.getTime() : null;

        let scheduled_time = this.timeConverter(data['scheduled_time']);
        this.data['scheduled_time'] = scheduled_time ? scheduled_time.getTime() : null;

        let cancel_time = this.timeConverter(data['cancel_time']);
        this.data['cancel_time'] = cancel_time ? cancel_time.getTime() : null;

        let scheduled_setup_start_time = this.timeConverter(data['scheduled_setup_start_time']);
        this.data['scheduled_setup_start_time'] = scheduled_setup_start_time ? scheduled_setup_start_time.getTime() : null;

        let scheduled_in_room_time = this.timeConverter(data['scheduled_in_room_time']);
        this.data['scheduled_in_room_time'] = scheduled_in_room_time ? scheduled_in_room_time.getTime() : null;

        let scheduled_out_room_time = this.timeConverter(data['scheduled_out_room_time']);
        this.data['scheduled_out_room_time'] = scheduled_out_room_time ? scheduled_out_room_time.getTime() : null;

        let scheduled_cleanup_finished_time = this.timeConverter(data['scheduled_cleanup_finished_time']);
        this.data['scheduled_cleanup_finished_time'] = scheduled_cleanup_finished_time ? scheduled_cleanup_finished_time.getTime() : null;

        let room_setup_start_time = this.timeConverter(data['room_setup_start_time']);
        this.data['room_setup_start_time'] = room_setup_start_time ? room_setup_start_time.getTime() : null;

        let room_read_time = this.timeConverter(data['room_ready_time']);
        this.data['room_ready_time'] = room_read_time ? room_read_time.getTime() : null;

        let patient_in_room_time = this.timeConverter(data['patient_in_room_time']);
        this.data['patient_in_room_time'] = patient_in_room_time ? patient_in_room_time.getTime() : null;

        let patient_out_room_time = this.timeConverter(data['patient_out_room_time']);
        this.data['patient_out_room_time'] = patient_out_room_time ? patient_out_room_time.getTime() : null;

        let room_cleanup_start_time = this.timeConverter(data['room_cleanup_start_time']);
        this.data['room_cleanup_start_time'] = room_cleanup_start_time ? room_cleanup_start_time.getTime() : null;

        let room_cleanup_finished_time = this.timeConverter(data['room_cleanup_finished_time']);
        this.data['room_cleanup_finished_time'] = room_cleanup_finished_time ? room_cleanup_finished_time.getTime() : null;

        // check conditions
        for (let i = 0; i < this.conditions.length; i++) {
            if (!this.conditions[i]()) {
                console.log(i + " th condition fails");
                return {result: 'Dropped', data: this.data};
            }
        }
        return {result: 'Ok', data: this.data};
    }
}

module.exports = CaseValidation;

