import { useEffect, useState } from "react";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectErrors, selectUser } from "../store/selectors";
import { addError, confirmEmailAttempt, removeErrorByType, requestLogin } from "../store/slices";
import { ConfirmEmailModal } from "./Auth";

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const errors = useAppSelector(selectErrors);
  const getBorderClass = (field: ErrorType) => (errors.find((error) => error.type === field) ? "inputError" : "border-secondary");

  const footer = (
    <>
      <div className="w-full flex flex-column justify-center items-center">
        <Button onClick={() => handleLogin()} className="bg-secondary text-white w-32 h-8 " label="login" title="login" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <a style={{ color: "#4ddfc0" }} href="/register">
          Register account
        </a>
        <a style={{ color: "#4ddfc0" }} href="/forgotpassword">
          Forgot password?
        </a>
      </div>
    </>
  );

  const isfieldValid = (field: ErrorType) => {
    if (field === "email") return validator.isEmail(email);
    if (field === "password") return password.length > 1;
  };
  const clearErrorOnChange = (field: ErrorType) => {
    if (isfieldValid(field)) {
      dispatch(removeErrorByType(field));
    }
  };

  const checkforErrors = (field?: ErrorType): boolean => {
    const fields: ErrorType[] = ["email", "password"];
    let error: boolean = false;
    if (!field) {
      fields.forEach((field) => {
        if (!isfieldValid(field)) {
          dispatch(addError({ type: field, message: "" }));
          error = true;
        }
      });
      return error;
    }

    if (!isfieldValid(field)) {
      dispatch(addError({ type: field, message: "" }));
      return true;
    }
    return false;
  };
  useEffect(() => {
    clearErrorOnChange("email");
    clearErrorOnChange("password");
  }, [email, password]);

  const handleConfirmEmail = (code: string) => {
    return dispatch(
      confirmEmailAttempt({
        email,
        registrationToken: code,
      })
    );
  };

  const handleLogin = () => {
    if (checkforErrors()) return;
    dispatch(requestLogin({ email, password }));
  };

  const onFormEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter" && email.length > 1 && password.length > 1) {
      return handleLogin();
    }
  };

  useEffect(() => {
    if (user?.isEmailVerified) {
      navigate("/");
    }
  }, [user]);

  // eslint-disable-next-line no-lone-blocks
  {
    return !user ? (
      <Card
        footer={footer}
        className="loginform  m-auto m-2 p-2 min-h-72 relative flex-column justify-center items-center border border-secondary md:w-4/5 lg:w-2/4 p-8 xl:w-1/5"
      >

        <InputText
          style={{ color: "#4ddfc0" }}
          placeholder="email"
          className={`w-full   border border-secondary ${getBorderClass("email")} mb-5`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => checkforErrors("email")}
          onKeyUp={onFormEnter}
        />


        <div className="w-full mb-5  relative">
          <InputText
            type={showPassword ? 'text' : 'password'}
            style={{ color: "#4ddfc0" }}
            placeholder="password"
            className={`w-full  border border-secondary ${getBorderClass("password")} mb-5`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => checkforErrors("password")}
            onKeyUp={onFormEnter}

          />
          <i style={{ color: '#4ddfc0' }} onClick={() => setShowPassword(!showPassword)} className={`absolute hoverIcon  right-2 top-5 ${!showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'}`}></i>
        </div>
      </Card>
    ) : !user.isEmailVerified ? (
      <ConfirmEmailModal email={email} onEnter={handleConfirmEmail} />
    ) : null;
  }
};
