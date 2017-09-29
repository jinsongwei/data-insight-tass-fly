/**
 *   author: William Jin
 */
 
 function loopSaveToDDB(records, index, callback) {
        if (index < records.length) {
            const content = records[index].data;
            // console.log(content);
            let params = {
                TableName: HOS_META_DATA_TABLE,
                Item: {
                    log_id: {S: content.log_id},
                    record_create_date: {S: content.record_create_date},
                    record_create_date_mill: {N: String(content.record_create_date_mill)},
                    record_create_date_hash: {N: String(content.record_create_date_hash)},
                    record_create_date_day: {N: String(content.record_create_date_day)},
                    last_update_date: {S: content.last_update_date},
                    last_update_date_mill: {N: String(content.last_update_date_mill)},
                    last_update_date_hash: {N: String(content.last_update_date_hash)},
                    last_update_date_day: {N: String(content.last_update_date_day)},
                    sched_surgery_date: {S: content.sched_surgery_date},
                    sched_surgery_date_mill: {N: String(content.sched_surgery_date_mill)},
                    sched_surgery_date_hash: {N: String(content.sched_surgery_date_hash)},
                    sched_surgery_date_day: {N: String(content.sched_surgery_date_day)},
                    case_class_name: {S: content.case_class_name},
                    surgeon_req_len: {S: content.surgeon_req_len},
                    setup_minutes: {S: content.setup_minutes},
                    cleanup_minutes: {S: content.cleanup_minutes},
                    total_time_needed: {S: content.total_time_needed},
                    add_on_case_yn: {S: content.add_on_case_yn},
                    sched_status_c: {S: content.sched_status_c},
                    sched_status_name: {S: content.sched_status_name},
                    cancel_date: {S: content.cancel_date},
                    cancel_reason_c: {S: content.cancel_reason_c},
                    cancel_reason_name: {S: content.cancel_reason_name},
                    service_c: {S: content.service_c},
                    service_name: {S: content.service_name},
                    procedure_id: {S: content.procedure_id},
                    procedure_name: {S: content.procedure_name},
                    parent_location_id: {S: content.parent_location_id},
                    location_id: {S: content.location_id},
                    location_name: {S: content.location_name},
                    room_id: {S: content.room_id},
                    room_name: {S: content.room_name},
                    sched_setup_start_dttm: {S: content.sched_setup_start_dttm},
                    sched_in_room_dttm: {S: content.sched_in_room_dttm},
                    sched_out_room_dttm: {S: content.sched_out_room_dttm},
                    sched_cleanup_comp_dttm: {S: content.sched_cleanup_comp_dttm},
                    room_setup_start_dttm: {S: content.room_setup_start_dttm},
                    room_ready_dttm: {S: content.room_ready_dttm},
                    patient_in_room_dttm: {S: content.patient_in_room_dttm},
                    patient_out_room_dttm: {S: content.patient_out_room_dttm},
                    room_cleanup_start_dttm: {S: content.room_cleanup_start_dttm},
                    room_cleanup_comp_dttm: {S: content.room_cleanup_comp_dttm},
                    delay_type_c: {S: content.delay_type_c},
                    delay_type_nm: {S: content.delay_type_nm}
                }
            };
            ddb.putItem(params, (err) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    console.log(index);
                    loopSaveToDDB(records, index + 1, callback);
                }
            );
        } else {
            callback();
        }
    }