import { IBot, ICreateBotDTo } from "../models/Bots/bots";
import { baseAxios } from "./baseService";


export class BotService {

  createBot = async (bot: ICreateBotDTo): Promise<void> => {
    let  formData = new FormData()

    const payload = {
      botName: bot.name,
      password: bot.password,
      cockpits: bot.cockpits
    }

    if (bot.image )formData.append("image", bot.image);
    formData.append("payload",JSON.stringify(payload))

    try {
      return baseAxios.post('bots',formData,{ headers: {
        'Content-Type': 'multipart/form-data'
      }}
    )
    } catch (e) {
      throw new Error("Invalid");
    }
  }


  fetchBots = async(): Promise<IBot[]> =>{

    try {
      console.log('trying to return bots')
        return baseAxios.get('bots')
    } 
    catch (e:any) {
      throw new Error("invalid request", e)
    }
    
  }

  deleteBots = async(id:string): Promise<void> =>baseAxios.delete(`bots/${id}`)

  updatebots = async (id:string, bot: ICreateBotDTo): Promise<void> =>{

    let  formData = new FormData()

    const payload = {
      botName: bot.name,
      password: bot.password,
      cockpits: bot.cockpits
    }

    if (bot.image )formData.append("image", bot.image);
    formData.append("payload",JSON.stringify(payload))

    try {
      return baseAxios.put(`bots/${id}`,formData,{ headers: {
        'Content-Type': 'multipart/form-data'
      }}
    )
    } catch (e) {
      throw new Error("Invalid");
    }


  } 
    
    


}