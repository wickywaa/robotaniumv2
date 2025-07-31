import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';
import { IBot, IBotMethods, IBotModel, IBotCockpits } from './interfaces';

export interface Bot {
  name: string;
  token: string;
  cockpits: IBotCockpits,
  adminId: string,
  mainPhotoUrl: string,
  otherPhotosUrls: string[],
  userId: mongoose.Schema.Types.ObjectId;
}

const connectedCockpitSchema = new Schema({
    id: { type: String, default: null },
});

const connectedBotSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  cockpits: [connectedCockpitSchema],
  adminId: { type: String, required: true },
});

export const BotsSChema = new mongoose.Schema<IBot, IBotModel, IBotMethods>({

  name: {
    type:String,
    required: true,
    unique:true,
    validate(value:string){
      if(value.length < 2 || value.length > 20) {
        throw new Error(`The Bot Name must be between 2 and 20 characters`)
      }
    }
  },

  token:{
    type: String,
  },

  cockpits: {
    unique:true,
    type: [{
      name: String,
      sessionId: String,
    }],
    validate(cameras: IBotCockpits[]) {
      const duplicates = cameras.filter((camera, index) => cameras.indexOf(camera) !== index);
      if( duplicates.length) {
        throw new Error(`Each camera name needs to be unique`);
      }
    }
  },


  imageUrl: {
    type: String
  },
})