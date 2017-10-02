/**
 *   author: William Jin
 */

let schemaGate = require('../index');

let schemaDefine = {

    log_id: "case_id",
    record_create_date: "create_time",
    last_update_date: "update_time",
    sched_surgery_date: "scheduled_time",
    case_class_name: "class_name",
    surgeon_req_len: "surgeon_request_length",
    setup_minutes: "setup_time_minutes",
    cleanup_minutes: "cleanup_time_minutes",
    total_time_needed: "total_time_minutes",
    add_on_case_yn: "add_on_case",
    sched_status_c: "scheduled_status_class",
    sched_status_name: "scheduled_status_name",
    cancel_date: "cancel_time",
    cancel_reason_class: null,
    cancel_reason_name: null,
    service_class: "service_class",
    service_name: "service_name",

    parent_location_id: null,
    location_id: "location_id",
    location_name: "location_name",
    room_id: "room_id",
    room_name: "room_name",

    sched_setup_start_dttm: "scheduled_setup_start_time",
    sched_in_room_dttm: "scheduled_in_room_time",
    sched_out_room_dttm: "scheduled_out_room_time",
    sched_cleanup_comp_dttm: "scheduled_cleanup_finished_time",
    room_setup_start_dttm: "room_setup_start_time",
    room_ready_dttm: "room_ready_time",
    patient_in_room_dttm: "patient_in_room_time",
    patient_out_room_dttm: "patient_out_room_time",
    room_cleanup_start_dttm: "room_cleanup_start_time",
    room_cleanup_comp_dttm: "room_cleanup_finished_time",
};

schemaGate.registerSchema('hospital1', '1.0.0', schemaDefine, (err, data) => {
    if (err) console.error(err);
    else console.log(data);
});

