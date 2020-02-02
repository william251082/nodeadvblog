// create a fake session object
const Buffer = require('safe-buffer').Buffer;

// generate the session.sig
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = user => {
    const sessionObject = {
        passport: {
            user: user._id.toString()
        }
    };

    //turn it into a string
    const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
    const sig = keygrip.sign('session=' + session);

    // Factory - create a resource and return it
    return { session, sig }
};