
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from 'react';

export interface IConfirmEmailmodal {
  email: string;
  onEnter: (confirmCode: string) => void
}

export const ConfirmEmailModal: React.FC<IConfirmEmailmodal> = ({ email, onEnter }) => {

  const [confirmCode, setConfirmCode] = useState<string>('');

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      return onEnter(confirmCode)
    }
  }

  useEffect(() => {
    if (confirmCode.length === 6) {
      onEnter(confirmCode);
    }
  }, [confirmCode])

  return (
    <Card style={{ color: '#4ddfc0', textAlign: 'center' }} className="flex flex-column justify-content-center align-content-center">
      <h3>Your Account is unverified</h3><br />
      <p>A confirmation code has been sent to the email  {email}</p><br />

      <div style={{ display: "flex", flexDirection: 'column', alignContent: 'center' }} className="">
        <InputText
          className="border border-secondary mb-5"
          style={{ width: '60%', margin: '5px auto 10px auto' }}
          onKeyUp={handleKeyPress}
          value={confirmCode}
          placeholder="Enter The code to verify email"
          onChange={(event) => setConfirmCode(event.target.value)} />
      </div>
      <div>
        <div className="w-full flex flex-column justify-center items-center">
          <Button style={{ color: 'white' }} className=" bg-secondary text-white w-32 h-8 " label="Send Again" title="Send Again" />
        </div>
      </div>
    </Card>
  )
}