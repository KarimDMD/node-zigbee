var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var C = xbee_api.constants;
var fs = require("./firestore");
 
var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 1
});
 
var serialport = new SerialPort("COM3", {
  baudRate: 9600,
});
 
serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);
 
serialport.on("open", function() {
  var frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.AT_COMMAND,
    command: "NI",
    commandParameter: [],
  };
 
  xbeeAPI.builder.write(frame_obj);

  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: "FFFFFFFFFFFFFFFF",
    command: "NI",
    commandParameter: [],
  };
  
  xbeeAPI.builder.write(frame_obj);
});

const openLightThemeColor = (cmd) => {
  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination16: "db62",
    command: cmd,
    commandParameter: [0x04],
  };
  console.log('fn :', cmd)
  xbeeAPI.builder.write(frame_obj); 
};

const closeLightThemeColor = (cmd) => {
  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination16: "DB62",
    command: cmd,
    commandParameter: [0x00],
  };

  xbeeAPI.builder.write(frame_obj); 
};

fs.watcher(openLightThemeColor);

// All frames parsed by the XBee will be emitted here
xbeeAPI.parser.on("data", function(frame) {
    if (frame.type == C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE) {
        if(frame.digitalSamples.DIO0 ==  1){
            //TODO: ecrire sur FS couleur bleu, active à true, mettre les autres à false
            frame_obj = { // AT Request to be sent
                type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
                destination16: "DB62",
                command: "D0",
                commandParameter: [0x04],
              };

            xbeeAPI.builder.write(frame_obj);
            console.log(frame.digitalSamples);
        }else if(frame.digitalSamples.DIO1 ==  1){
            //TODO: ecrire sur FS couleur vert, active à true, mettre les autres à false
            frame_obj = { // AT Request to be sent
                type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
                destination16: "DB62",
                command: "D1",
                commandParameter: [0x04],
              };

            xbeeAPI.builder.write(frame_obj);
            console.log(frame.digitalSamples);
        }else if(frame.digitalSamples.DIO2 ==  1){
            //TODO: ecrire sur FS couleur green, active à true, mettre les autres à false
            frame_obj = { // AT Request to be sent
                type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
                destination16: "DB62",
                command: "D2",
                commandParameter: [0x04],
              };
            xbeeAPI.builder.write(frame_obj);
            console.log(frame.digitalSamples);
        }
    }
  }
)
//        // 0013A20041A72910 /DB62

      

      

      
      
      

//     }
//     if (frame.type == C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE) {
//         console.log("REMOTE_COMMAND_RESPONSE");
//         let dataReceived = String.fromCharCode.apply(null, frame.commandData)
//         console.log(dataReceived);

//     }
//     else{
//         console.log(frame);
//     }
// });