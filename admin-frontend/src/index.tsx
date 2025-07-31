import React from "react";
import ReactDOM from "react-dom/client";
import { AppRouter } from "./routes";

import { PrimeReactProvider } from "primereact/api";
import "./index.css";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AuthService } from "./services";
import { loginSuccess } from "./store/slices";
import { webSocketServer} from  './sockets';
import { Socket } from "socket.io-client";
import { ILoggedInUser } from "./models";
export const user:ILoggedInUser | null = store.getState().auth.user;
const authToken = localStorage.getItem("authToken");



// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';


const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const renderApp = () => {
  return root.render(
    <Provider store={store}>
      <PrimeReactProvider>
        <AppRouter />
      </PrimeReactProvider>
    </Provider>
  );
};


if (user) {
  renderApp();
  webSocketServer.connectsocket(user._id,localStorage.getItem('authtoken') ?? '')
} else {
  if (authToken?.length) {
    new AuthService().loginWithToken().then((response) => {
      if (response) {
        localStorage.setItem("authToken", response.token);
        store.dispatch(loginSuccess(response.user));
        webSocketServer.connectsocket(response.user._id, response.token)
        return renderApp();
      }
      return renderApp();
    });
  } else {
    renderApp();
  }
}
