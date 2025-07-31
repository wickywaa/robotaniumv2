import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { delay, put, takeEvery } from "redux-saga/effects";
import { IBot, ICreateBotDTo } from "../../../models/Bots/bots";
import { BotService } from "../../../services/botServices";
import { addMessage } from "../../slices";
import { createBotFailure, deleteBotFailure, deleteBotSuccess, fetchBotsFailure, fetchBotsSuccess, fetchBotsttempt, updateBotFailed } from "../../slices/botSlice";

const newBotService = new BotService();

export function* createBot(action: PayloadAction<ICreateBotDTo>) {

  try {
    const botResponse:AxiosResponse = yield newBotService.createBot(action.payload);
    if (botResponse.status !== 201) {
      yield put(createBotFailure())
      yield (addMessage({
        message:'failed to create bot',
        severity: 'error'
      }))
    }

    yield put (addMessage ({
      message:'bot created', 
      severity: 'success'
    }))

    yield put(fetchBotsttempt())

  } catch (e) {
    yield put(createBotFailure())
    yield put (addMessage({
      message: `${e}`,
      severity: 'error'
    }))
  }

}

export function* fetchBots() {
  try {
    const botsResponse: { data: IBot[] } = yield newBotService.fetchBots();

    if (botsResponse?.data.length === 0) {
      yield put(fetchBotsFailure());
      yield put(addMessage({ severity: "warn", message: "no bots to display" }));
      return
    }

    yield put(fetchBotsSuccess(botsResponse?.data));
  } catch (e) {
    yield put(fetchBotsFailure());
    yield put(addMessage({ message: "error fetching bots", severity: "error" }));
  }
}

export function* deleteBots(action: PayloadAction<string>) {
  try {
    const botDeleteResponse:AxiosResponse = yield newBotService.deleteBots(action.payload);

    if (botDeleteResponse.status !== 200) return 

    yield put(deleteBotSuccess());
    yield put(fetchBotsttempt())
    yield put(addMessage({
      message:'Bot Deleted Successfully',
      severity:'success'
    }))
  }
  catch (e) {
       yield put(deleteBotFailure())
       yield put(addMessage({
        message: 'Bot could not be deleted ',
        severity: 'error'
       }))
  }
}


export  function* updateBot(action: PayloadAction<{id: string, bot:ICreateBotDTo}>) {


  try {
    const updateBotResponse:AxiosResponse = yield newBotService.updatebots(action.payload.id, action.payload.bot); 

    if (updateBotResponse.status !== 200 ) {
        yield fetchBotsFailure()
        return
    }

    yield delay(3000)

    yield put(fetchBotsttempt())
    yield put(addMessage({
      message:'Bot updated',
      severity:'success'
    }))

  } catch (e){
    yield put(updateBotFailed())
    yield put(addMessage({
      message:'updated bot failed',
      severity: 'error'
    }))

  }

 
}

export function* botSagas() {
  yield takeEvery("botSlice/createBotAttempt", createBot);
  yield takeEvery("botSlice/fetchBotsttempt", fetchBots);
  yield takeEvery("botSlice/deleteBotByIdAttempt", deleteBots)
  yield takeEvery("botSlice/updateBotAttempt", updateBot)
}
