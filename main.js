
// *****************************************************************************
// *** Retrieve data from AVM FritzBox via TR-064 and forward it to an MQTT  ***
// *** server.                                                               ***
// *****************************************************************************

// 2023jan08, Marcel Timm, RhinoDevel

const conf = {
        fritzBoxUsername: '********',
        fritzBoxPassword: '********',
        mqttHostname: '********',
        mqttTopic: '********'
    },

    fb = require('./nodejs-fritzbox/nodejs-fritzbox.js'),
    mqtt = require('mqtt'),

    /** To be called on retrieval of data from FritzBox.
     */
    onReceived = function(o)
    {
        if(o !== null)
        {
            let c = mqtt.connect(
                        'mqtt://' + conf.mqttHostname,
                        {
                            connectTimeout: 5000 // ms
                        });

            c.on(
                'connect',
                () => 
                {
                    c.publish(conf.mqttTopic, JSON.stringify(o));
                    c.end();
                });

            c.on(
                'error',
                () => 
                {
                    console.log('Error: Some MQTT-related error happened!');
                    c.end();
                });
        }
    };

fb.exec(onReceived, conf.fritzBoxUsername, conf.fritzBoxPassword);
