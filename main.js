
// *****************************************************************************
// *** Retrieve data infinitely at a given interval from AVM FritzBox via    ***
// *** TR-064 and forward it to an MQTT server.                              ***
// *****************************************************************************

// 2023jan08, Marcel Timm, RhinoDevel

const conf = {
        fritzBoxUsername: '********',
        fritzBoxPassword: '********',
        mqttHostname: '********',
        mqttTopic: '********',
        interval: 3 * 1000 // ms
    },

    fb = require('./nodejs-fritzbox/nodejs-fritzbox.js'),
    mqtt = require('mqtt'),

    setExecTimer = function()
    {
        setTimeout(exec, conf.interval);
    },

    /** To be called on retrieval of data from FritzBox.
     * 
     * - Maybe improvable: Each time reconnecting to MQTT server instead of
     *                     keeping the connection.
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

                    setExecTimer(); // *** "RECURSION" ***
                });

            c.on(
                'error',
                () => 
                {
                    console.log('Error: Some MQTT-related error happened!');
                    c.end();

                    setExecTimer(); // *** "RECURSION" ***
                });
        }
    },

    exec = function()
    {
        fb.exec(onReceived, conf.fritzBoxUsername, conf.fritzBoxPassword);
    };

exec();
