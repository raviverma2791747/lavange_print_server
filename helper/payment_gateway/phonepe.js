const sha256 = require("crypto-js/sha256");
const { Buffer } = require("buffer");

const PAY_API_RESPONSE_CODE = {
  PAYMENT_INITIATED: "PAYMENT_INITIATED",
  PAYMENT_ERROR: "PAYMENT_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
  AUTHORIZATION_FAILED: "AUTHORIZATION_FAILED",
  INTERNAL_SECURITY_BLOCK_1: "INTERNAL_SECURITY_BLOCK_1",
  INTERNAL_SECURITY_BLOCK_2: "INTERNAL_SECURITY_BLOCK_2",
  INTERNAL_SECURITY_BLOCK_3: "INTERNAL_SECURITY_BLOCK_3",
  INTERNAL_SECURITY_BLOCK_4: "INTERNAL_SECURITY_BLOCK_4",
  INTERNAL_SECURITY_BLOCK_5: "INTERNAL_SECURITY_BLOCK_5",
  INTERNAL_SECURITY_BLOCK_6: "INTERNAL_SECURITY_BLOCK_6",
};

const STATUS_API_RESPONSE_CODE = {
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  BAD_REQUEST: "BAD_REQUEST",
  AUTHORIZATION_FAILED: "AUTHORIZATION_FAILED",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  TRANSACTION_NOT_FOUND: "TRANSACTION_NOT_FOUND",
  PAYMENT_ERROR: "PAYMENT_ERROR",
  PAYMENT_PENDING: "PAYMENT_PENDING",
  PAYMENT_DECLINED: "PAYMENT_DECLINED",
  TIMED_OUT: "TIMED_OUT",
};

const CALLBACK_API_RESPONSE_CODE = {
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  PAYMENT_ERROR: "PAYMENT_ERROR",
};

const REDIRECT_MODE = {
  REDIRECT: "REDIRECT",
  POST: "POST",
};

const decodeBase64 = (dataBase64) => {
  const dataBuffer = Buffer.from(dataBase64, "base64");
  const data = dataBuffer.toString("ascii");
  return data;
};

const generateChecksum = ({ payload, endpoint }) => {
  const dataPayload = JSON.stringify(payload);
  const dataBase64 = Buffer.from(dataPayload).toString("base64");
  const fullURL = dataBase64 + endpoint + process.env.PHONEPE_SALT_KEY;
  const dataSha256 = sha256(fullURL);
  const checksum = dataSha256 + "###" + process.env.PHONEPE_SALT_INDEX;
  return { checksum, dataBase64 };
};

const initiatePayment = async ({
  transactionId,
  userId,
  amount,
  mobile,
  redirectMode,
  redirectUrl,
  callbackUrl,
}) => {
  const payload = {
    merchantId: process.env.PHONEPE_MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: userId,
    amount: amount * 100,
    redirectUrl: redirectUrl ?? process.env.PHONEPE_REDIRECT_URL,
    redirectMode: redirectMode ?? "POST",
    callbackUrl: callbackUrl ?? process.env.PHONEPE_CALLBACK_URL,
    mobileNumber: mobile,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const { checksum, dataBase64 } = generateChecksum({
    payload,
    endpoint: "/pg/v1/pay",
  });

  const response = await fetch(`${process.env.PHONEPE_HOST_URL}/pg/v1/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    },
    body: JSON.stringify({
      request: dataBase64,
    }),
  });
  const data = await response.json();
  return data;
};

const checkStatus = async ({ merchantTransactionId }) => {
  const st =
    `/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}` +
    process.env.PHONEPE_SALT_KEY;

  const dataSha256 = sha256(st);
  const checksum = dataSha256 + "###" + process.env.PHONEPE_SALT_INDEX;

  const response = await fetch(
    `${process.env.PHONEPE_HOST_URL}/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": process.env.PHONEPE_MERCHANT_ID,
      },
    }
  );

  const dataStatus = await response.json();
  return dataStatus;
};

module.exports = {
  initiatePayment,
  PAY_API_RESPONSE_CODE,
  REDIRECT_MODE,
  CALLBACK_API_RESPONSE_CODE,
  STATUS_API_RESPONSE_CODE,
  decodeBase64,
  checkStatus,
};
