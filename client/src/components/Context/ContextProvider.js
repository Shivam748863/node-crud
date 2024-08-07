import React, { createContext, useState } from "react";

export const addData = createContext();
export const updateData = createContext();
export const deleteData = createContext();

const ContextProvider = ({ children }) => {
  const [userAdd, setUserAdd] = useState("");
  const [userUpdate, setUserUpdate] = useState("");
  const [userDelete, setDeletedUser] = useState("");

  return (
    <div>
      <addData.Provider value={{ userAdd, setUserAdd }}>
        <updateData.Provider value={{ userUpdate, setUserUpdate }}>
          <deleteData.Provider value={{ userDelete, setDeletedUser }}>
            {children}
          </deleteData.Provider>
        </updateData.Provider>
      </addData.Provider>
    </div>
  );
};

export default ContextProvider;
