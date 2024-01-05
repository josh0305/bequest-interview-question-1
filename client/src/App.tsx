import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();
  const [reservedData, setReservedData] = useState<any>("hhh") // used to save the newest data client send
  const [verifyRes, setVerifyRes] = useState("It is init status now. If you'd like to verify your data, please press the Verify button")

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    setData(data);
  };

  const updateData = async () => {
    setReservedData(data!)

    await updateWithData(data)

    await getData();
  };

  const updateWithData =async (data:string | undefined) => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  const verifyData = async () => {
    if(reservedData != null) {
      await getData();
      if(data === reservedData){
        setVerifyRes("The data matched, don't worry")
      } else {
        setVerifyRes("Oops, the data doesn't match! The data will be automatically fixed, please verify again!")
        await updateWithData(reservedData)
        await getData();
      }
    } else {
      setVerifyRes("Please update the data before verification")
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
      <div>
        <label>{verifyRes}</label>
      </div>
      <div>
        <label>{reservedData}</label>
      </div>
    </div>
  );
}

export default App;
