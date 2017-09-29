
exports.INVALID_PARAMS = 'invalid params';
exports.TIME_DEFINITION_NOT_FOUND = 'you have to define time transformation function';

exports.Log = (...args) => {
    console.error('[Error]');
    for (i = 0; i < args.length; i++) {
        console.error('[' + args[i] + ']\n');
        if (args[i].stack !== undefined) console.error(args[i].stack);
    }
};
