import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import 'primereact/resources/primereact.css';
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import { AuthProvider } from './context/AuthContext';
import "./index.css";
import { ILoggedInUser } from "./models";
import { AppRouter } from "./routes/App";
import { store } from './store/store';

const queryClient = new QueryClient();
export const user: ILoggedInUser | null = store.getState().auth.user;

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const renderApp = () => {
  return root.render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PrimeReactProvider>
            <AppRouter />
          </PrimeReactProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}

renderApp()