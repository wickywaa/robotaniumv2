import { Injectable } from '@nestjs/common';



const OpenTok = require("opentok")

const opentok = new OpenTok('48001991', '886432f0480e2a325bb8dae17cfa4dfa80843171');

@Injectable()
export class OpenTokService {

  createAccesstoken = (sessionId:string) => opentok.generateToken(sessionId);
  createSessionID = async() => await new Promise(function(Resolve, Reject) {
    // "Producing Code" (May take some time)

    opentok.createSession({mediaMode:'routed'},(error,session) => {
      if(error) return Reject();
      return Resolve(session)
    })

    }); 
}