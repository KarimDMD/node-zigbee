var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var C = xbee_api.constants;
 
var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 1
});
 
var serialport = new SerialPort("COM3", {
  baudRate: 9600,
});

const lights =[]
 
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

// const colortest = {
//     id: 0,
//     color: 
// }

// All frames parsed by the XBee will be emitted here
xbeeAPI.parser.on("data", function(frame) {

  

    if (frame.type == C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX) {
      
        if(frame.digitalSamples.DIO0 ==  1){
            //TODO: ecrire sur FS couleur bleu, active à true, mettre les autres à false
            lights.map((lampe, index)=>{
                console.log(lampe);
                if (lampe)
            
                frame_obj = { // AT Request to be sent
                    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
                    destination16: frame.remote16,
                    command: "D0",
                    commandParameter: [0x04],
                  };
                  else
                  frame_obj = { // AT Request to be sent
                    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
                    destination16: "DB62",
                    command: "D0",
                    commandParameter: [0x00],
                  };
                  lights[index]=!lights[index]
                xbeeAPI.builder.write(frame_obj);
            })
           


        }else if(frame.digitalSamples.DIO1 ==  1){
            //TODO: ecrire sur FS couleur vert, active à true, mettre les autres à false
            frame_obj = { // AT Request to be sent
                type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
                destination16: "DB62",
                command: "D1",
                commandParameter: [0x04],
              };

            xbeeAPI.builder.write(frame_obj);
            //console.log(frame.digitalSamples);
        }else if(frame.digitalSamples.DIO2 ==  1){
            //TODO: ecrire sur FS couleur green, active à true, mettre les autres à false
            frame_obj = { // AT Request to be sent
                type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
                destination16: "DB62",
                command: "D2",
                commandParameter: [0x04],
              };
            xbeeAPI.builder.write(frame_obj);
           // console.log(frame.digitalSamples);
        }

       // 0013A20041A72910 /DB62

      

      

      
      
      

    }
    if (frame.type == C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE) {
       // console.log("REMOTE_COMMAND_RESPONSE");

        let dataReceived = String.fromCharCode.apply(null, frame.commandData)
    console.log(dataReceived);

    }
    if (frame.type == C.FRAME_TYPE.NODE_IDENTIFICATION) {
        //console.log("NODE_IDENTIFICATION");
       // console.log(frame);
       if (frame.nodeIdentifier === "lampe")
        lights[frame.remote64]=0
        console.log("lampes enregistrées: ");
        console.log(lights);
    }
    else{
        //console.log(frame);
    }
    // console.log(">>", frame);
});