const moment = require("moment");
const qs = require("qs");
const crypto = require("crypto");
const config = require("config");

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (let key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      sorted[key] = obj[key];
    }
  }
  return sorted;
}

const createVNPayUrl = (req, res) => {
  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    "127.0.0.1";
  if (ipAddr.includes(",")) ipAddr = ipAddr.split(",")[0];
  if (ipAddr.includes("::ffff:")) ipAddr = ipAddr.replace("::ffff:", "");
  if (ipAddr === "::1") ipAddr = "127.0.0.1";

  const tmnCode = config.get("vnp_TmnCode");
  const secretKey = config.get("vnp_HashSecret");
  const vnpUrl = config.get("vnp_Url");
  const returnUrl = config.get("vnp_ReturnUrl");

  const date = moment();
  const createDate = date.format("YYYYMMDDHHmmss");
  const orderId = date.format("HHmmss");
  const amount = parseInt(req.body.amount);

  const bankCode = req.body.bankCode || "";

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };
  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  vnp_Params["vnp_SecureHash"] = signed;
  const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: true })}`;

  res.json({ url: paymentUrl });
};

const vnpayReturn = (req, res) => {
  let vnp_Params = { ...req.query };
  const secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  const secretKey = config.get("vnp_HashSecret");
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    res.status(200).json("Thanh toán thành công!");
  } else {
    res.status(400).json("Chữ ký không hợp lệ!");
  }
};

module.exports = { createVNPayUrl, vnpayReturn };
