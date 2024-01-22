import React, { createContext, useState } from "react";
export const AuthUserContext = createContext();
const AuthState = (props) => {
  const [connectWallet, setConnectWallet] = useState("Connect Wallet");
  return (
    <AuthUserContext.Provider
      value={{ connectWallet, setConnectWallet}}
    >
      {props.children}
    </AuthUserContext.Provider>
  );
};
export default AuthState;