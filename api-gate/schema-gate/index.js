/**
 *   author: William Jin
 */

//todo remove it
const config = require('../../config/config-helper').config;
const AWS = new config().AWS; // remove this when upload to AWS

// const AWS = require('aws-sdk');
const Protocol = require('./protocol');
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: 'us-west-2'});

const META_DATA_TABLE = 'meta-data-table';
const INVALID_PARAMS = 'invalid params';


Protocol.registerSchema = (hospitalName, version, schemaJson, callback) => {
    if (!hospitalName || !version || typeof schemaJson !== 'object' || typeof callback !== 'function') {
        callback(new Error(INVALID_PARAMS));
        return;
    }
    let attributes = Object.keys(schemaJson);
    // console.log(attributes);

    let schemaDocument = jsonToDocumentWithReverse(schemaJson);
    let params = {
        TableName: META_DATA_TABLE,
        Item: {
            hashKey: {
                S: hospitalName,
            },
            rangeKey: {
                S: version
            },
            schema: {M: schemaDocument.taasToHos},
            schemaReverse: {M: schemaDocument.hosToTaas},
            attributes: {SS: attributes}
        }
    };
    console.log(params);
    ddb.putItem(params, callback);
};

Protocol.updateSchema = (hospitalName, version, schemaJson, callback) => {
    if (!hospitalName || !version || typeof schemaJson !== 'object' || typeof callback !== 'function') {
        callback(new Error(INVALID_PARAMS));
        return;
    }
    let schemaDocument = jsonToDocumentWithReverse(schemaJson);
    let params = {
        TableName: META_DATA_TABLE,
        Key: {
            hashKey: {
                S: hospitalName,
            },
            rangeKey: {
                S: version
            }
        },
        ExpressionAttributeNames: {
            '#schema': 'schema'
        },
        ExpressionAttributeValues: {
            ':v1': {M: schemaDocument.keyValue},
            ':v2': {M: schemaDocument.valueKey}
        },
        UpdateExpression: 'SET #schema = :v1, #schemaReverse = :v2'
    };
    ddb.updateItem(params, callback);
};

Protocol.getSchema = (hospitalName, version, callback) => {
    if (!hospitalName || !version || typeof callback !== 'function') {
        callback(new Error(INVALID_PARAMS));
        return;
    }
    let params = {
        TableName: META_DATA_TABLE,
        Key: {
            hashKey: {
                S: hospitalName
            },
            rangeKey: {
                S: version
            }
        }
    };
    ddb.getItem(params, (err, data) => {
        if (err) {
            callback(new Error(err));
            return;
        }
        if (!data || !data.Item || !data.Item.schema) {
            calblack(new Error('empty data'));
            return;
        }
        callback(null, data.Item.schemaReverse.M);
    });
};

Protocol.getTaasFormatRecord = (hosTaasMapper, record) => {
    let taasFlyRecord = {};
    for (let key in hosTaasMapper) {
        if (hosTaasMapper.hasOwnProperty(key) && record.hasOwnProperty(key)) {
            if(typeof hosTaasMapper[key] === 'string')
                taasFlyRecord[hosTaasMapper[key]] = record[key];
        }
    }
    return taasFlyRecord;
};

function jsonToDocumentWithReverse(schemaJson) {
    //key is hospital attribute name, value is Taas attribute name
    let schemaKeyValue = {};
    let schemaValueKey = {};
    for (let key in schemaJson) {
        if (schemaJson.hasOwnProperty(key)) {
            switch (typeof schemaJson[key]) {
                case 'string':
                    schemaKeyValue[key] = {S: schemaJson[key]};
                    schemaValueKey[schemaJson[key]] = {S: key};
                    break;
                default:
                    schemaKeyValue[key] = {NULL: true};
            }
        }
    }
    return {taasToHos: schemaValueKey, hosToTaas: schemaKeyValue};
}

Protocol.jsonToDocument = (json) => {
    let documentFormat = {};
    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            switch (typeof json[key]) {
                case 'string':
                    documentFormat[key] = {S: json[key]};
                    break;
                case 'number':
                    documentFormat[key] = {N: json[key]};
                    break;
                default:
                    documentFormat[key] = {NULL: true};
            }
        }
    }
    return documentFormat;
};

Protocol.documentToJson = (document) => {
    let jsonFormat = {};
    for (let key in document) {
        if (document.hasOwnProperty(key)) {
            let type = Object.keys(document[key])[0];
            if (type === 'S')
                jsonFormat[key] = document[key][type];
            else if (type === 'N')
                jsonFormat[key] = Number(document[key][type]);
            else if (type === 'NULL')
                jsonFormat[key] = null;
        }
    }
    return jsonFormat;
};

module.exports = Protocol;
