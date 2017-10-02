/**
 *   author: William Jin
 */

/**
 *  ----- API for schema factory -----
 */


/**
 *
 * @param hospitalName: hospital name
 * @param version:  schema version
 * @param schemaJson: json object that map TaasFly to hospital attributes
 * @param callback: (err, null) if succeed err is null
 */
exports.registerSchema = (hospitalName, version, schemaJson, callback) => {
};

/**
 * @param hospitalName : hospital name
 * @param version: schema version
 * @param schemaJson: json object that map TaasFly to hospital attributes
 * @param callback: if succeed err is null.
 */
exports.updateSchema = (hospitalName, version, schemaJson, callback) => {
};

/**
 * @param hospitalName
 * @param version
 * @param callback: (err, schema), schema is dynamoDB document type (hospital -> TaasFly) mapping
 */
exports.getSchema = (hospitalName, version, callback) =>{
};

/**
 * @param taasHosMapper. a json format taasFly attribute (key) ==> hospital attribute (value)
 * @param record. hospital record prepared to be transformed
 * @return taasFly format record
 */
exports.getTaasFormatRecord = (taasHosMapper, record)=>{

};
/**
 * @param jsonFormat: json object
 * @return dynamoDB document type object
 */
exports.jsonToDocument = (jsonFormat) =>{

};

/**
 * @param documentFormat
 * @return json type object
 */
exports.documentToJson = (documentFormat) =>{

};

