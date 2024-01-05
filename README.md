# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal database is breached.
Only the user is able to update their own data. There are 2 parties that read the data, the user and our server.

**How does the client insure that the data has not been tampered with?**
<br />
**If the data has been tampered with, how can the client recover the lost data?**

Edit this repo to answer these two questions using any technology you'd like. Feel free to add comments.

### To run the apps:

`npm run start` in both the frontend and backend

### Intuition

I suppose that there might be interception between two parties, and the data might be changed or lost when transmission or in storage. Hence, I use RSA to encrypt the data and the backend will store the encrypted data, so the client end can detect even the data is modified. Besides, the client end also automatically fix the lost data when it find out that the data returned from server doesn't match to the data in client end. I also considered JWT to avoid the tamper, but it wouldn't work well in my assumption. RSA is better in this situation because it can secure the integrity of data and verify if the data is changed or not. But the token might be stole during transmission. Therefore, I choose RSA to implement tamper proof.
