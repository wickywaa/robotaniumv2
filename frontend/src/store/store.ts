import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices";
import createSagaMiddleware from "redux-saga";
import { authSagas, botSagas } from "./sagas";
import { toastSlice } from "./slices/toastslice";
import { BotSlice } from './slices/botSlice';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    toastSlice: toastSlice.reducer,
    botSlice: BotSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(authSagas)
sagaMiddleware.run(botSagas)

/* sagaMiddleware.run(signInUserSaga);
sagaMiddleware.run(gamesSagas);
sagaMiddleware.run(botzSagas);
sagaMiddleware.run(sessionSaga); */

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
