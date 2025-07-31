import { AxiosResponse } from "axios";
import { adminBaseAxios } from "./Base.service";
import { ICreateBotDTo, IBot } from "../models";

export class BotsService {
  createBot = async (createBotDto: ICreateBotDTo): Promise<AxiosResponse> => {

    console.log('create bots dto', createBotDto)
    const bodyData =  {
      name: createBotDto.name,
      cockpits: createBotDto.cockpits,
      imageUrl: createBotDto.botImageUrl,
      password: createBotDto.password
    }
    try {
      return await adminBaseAxios.post("/bot",{...bodyData})
      .then((response)=>{
        return response.data
      })
    } catch (e:any) {
      throw new Error("bot could not be created", e);
    }
  };

  getBots = async (): Promise<AxiosResponse> => {

    try {
      return await adminBaseAxios.get("/bots").then((response)=>{
        return response.data
      })
    } 
    catch(e:any) {
      throw new Error("bots could not be loaded", e);
    }
  }

  deleteBotById = async (id: string): Promise<IBot[]> => {
    try {
      return await adminBaseAxios.delete<{ bots: IBot[] }>(`/bot/${id}`).then((response) => {
        return response.data.bots;
      })
    }
    catch (e: any) {
      if (e.response.data.message) throw new Error(e.response.data.message);
      if (e.message) throw new Error(e.message);
      throw new Error('Bot could not be Deleted');
    }
  }

}
