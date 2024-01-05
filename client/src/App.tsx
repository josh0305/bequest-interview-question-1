import React, { useEffect, useState } from "react";
import { JSEncrypt } from "jsencrypt";

const API_URL = "http://localhost:8080";

// RSA key
const publicKey = `
-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGnKgy8rVTxJXycxHG4eL6e6EfDf
OtYJUDyXtdWGmVkl5DyT64/jqpGDDqURk3IRfOVuzb4zyPEl42Ueki9GQFb+Qqoq
v/1Qe1wszj/DFJd5ywrximwI7uKR8zOZkRNE4VHt8R+NJA88Nki2vJog5dpVenfD
XBD3oZGG48MiIQiXAgMBAAE=
-----END PUBLIC KEY-----`;

    const privateKey = `
    -----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgGnKgy8rVTxJXycxHG4eL6e6EfDfOtYJUDyXtdWGmVkl5DyT64/j
qpGDDqURk3IRfOVuzb4zyPEl42Ueki9GQFb+Qqoqv/1Qe1wszj/DFJd5ywrximwI
7uKR8zOZkRNE4VHt8R+NJA88Nki2vJog5dpVenfDXBD3oZGG48MiIQiXAgMBAAEC
gYAcUKS+CkYdBbJfJgjq/E9bADVvGACCaym7nguAJC+FKdwlzp2c/J2Zps9TpRmm
zUF1kyukPe4JhU+QsBcGajIr/g0Hcm9x0k6U96B4+ffYfef+W3eg8WH6k7HsTwb+
s0lDlM6QMeZEwDniCeeCP8JSOIUIDQHkxPFwb3u3gb+MKQJBALVdNuKzwCw8HixF
eazIleyLXsQFAQELKSs29svdwlcOnMnJ2yXOW4GHesEeBcmr658xA5CmElbfXg/c
zJpyxLsCQQCVU6UsP0HNArNhsn2EdTbAe4Uwg2Ir/0dsiVyITLx4iw0V/qapLYdi
YKmQbbrWN9/9GF1beUzExkRweNuRQPvVAkAdLdIWxzSz6Tgxhzv8QIledU3Z27Q9
pr4I5d7vDc6mkwNGs+M+QeUXAeUODPaBa9eM1SXtr8pjj6xigPOqJazhAkARg9Eg
4n6OVF3D/NKaIcF9TD+wFAkEzhmLkoUG+7EzlmO/i7HysANsN5hL94Lts3oTTrNM
kmq9vd+zLYnbfLrNAkEAokogJLbM1LwD1evVZnuoXcwJYj36nwPZeqHq0qIOc2tg
2JQPQwCCCcpV8hbmccat4XHrx+2+hxVEsTOrK7suaw==
-----END RSA PRIVATE KEY-----`

function App() {
  const [data, setData] = useState<string>();
  const [reservedData, setReservedData] = useState<any>(null) // used to save the newest data client send
  
  const encryptData = (data) => {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(data);
  }

  const decryptMessage = (message) => {
    var decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privateKey);
    return decrypt.decrypt(message)
  }

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    var decryptedData = decryptMessage(data)
    console.log(decryptedData)
    setData(String(decryptedData));
  };

  const updateData = async () => {
    setReservedData(data!)

    await updateWithData(data)

    await getData();
  };

  const updateWithData =async (data:string | undefined) => {
    var encrytedData = encryptData(data)
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data: encrytedData }),
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
        alert("The data matched, don't worry")
      } else {
        alert("Oops, the data doesn't match! The data will be automatically fixed, please verify again!")
        await updateWithData(reservedData)
        await getData();
      }
    } else {
      alert("Please update the data before verification")
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
    </div>
  );
}

export default App;
