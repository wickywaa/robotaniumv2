import { PayloadAction } from '@reduxjs/toolkit';
import { put, takeEvery } from 'redux-saga/effects';
import { IBot, ICreateBotDTo } from '../../../models/Bots';
import { BotsService } from '../../../services/Bots.service';
import { addMessage, addUsersFailed, createBotFailed, createBotSuccess, setBotsListSuccess, deleteBotAttempt,deleteBotFailed,deleteBotSuccess } from '../../slices';
const botsService = new BotsService()

export function * CreateBot( action: PayloadAction<ICreateBotDTo>) {
  try {
    const response:{bots:IBot[]} = yield botsService.createBot(action.payload);
    console.log(response.bots)
    if(!response.bots)throw new Error('bot created but bot list could not be returned')
    yield  put(createBotSuccess(response.bots));
    yield put(addMessage({ message: 'bot successfully created', severity: 'success' }));
  }
  catch(e) {
    yield put(createBotFailed());
    yield put(addMessage({ message: `${e}`, severity: 'error' }));
  }
}


export function*  getBots() {
  try {
    const bots:{bots:IBot[ ]} = yield botsService.getBots();
    if(!bots.bots) throw new Error('bots could not be loaded')
    yield put(setBotsListSuccess({bots: bots.bots}))
  }
  catch(e){
    yield put(addMessage({ message: `${e}`, severity: 'error' }));
  }
}

function* deleteBot(action: PayloadAction<string>) {
  try {

    console.log('bot Id', action.payload)
    const bots: IBot[] = yield botsService.deleteBotById(action.payload);
    yield put(deleteBotSuccess(bots));
    yield put(addMessage({ message: `bot ${action.payload} deleted successfully`, severity: 'success' }));
  }
  catch (e) {
    yield put(deleteBotFailed());
    yield put(addMessage({ message: `${e}`, severity: 'error' }));
  }
}

export function* BotManagementagas() {

  yield takeEvery("botSlice/createBotAttempt", CreateBot);
  yield takeEvery("botSlice/setBotsListAttempt", getBots );
  yield takeEvery("botSlice/deleteBotAttempt",deleteBot);

}