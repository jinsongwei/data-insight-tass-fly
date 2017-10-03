/**
 *   author: William Jin
 */

/**
 * configurable sending records rates.
 */

let hos1 = require('./hospitals/hospital1');
let numRecordsPerSec = 500;
let seconds = 100;
let recordLimit = 50000;

hos1.send(numRecordsPerSec, seconds, recordLimit);


