const sib = require("sib-api-v3-sdk");
require("dotenv").config();

exports.passwordResetUtil = async (uuid, name, email) => {
  try {
    const client = sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];

    apiKey.apiKey = process.env.PASSWORD_RESET_API_KEY;
    const tranEmailApi = new sib.TransactionalEmailsApi();

    const sender = {
      email: "harshavardhan9143@gmail.com",
    };

    const reciever = [
      {
        email: email,
      },
    ];

    const trans = await tranEmailApi.sendTransacEmail({
      sender,
      to: reciever,
      subject: "Password reset link",
      textContent: "Click on the link to reset your password",
      htmlContent: `<h2>Hello ${name},</h2>
        <p>Click the button below to reset your password:</p>
        <a href="http://localhost:4000/home/password-reset/${uuid}" 
           style="display:inline-block;padding:10px 15px;background:#007bff;color:white;text-decoration:none;border-radius:5px;">
          Reset Password
        </a>`,
    });

    return trans;
  } catch (error) {
    console.log("error occured>>>>>>>", error.message);
  }
};
