const VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Verify Your Email – Caritas Manila</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin:0; padding:0;
      font-family:'Open Sans', sans-serif;
      background:#f7f7f7;
      color:#333;
    }
    table, td { border-collapse:collapse; }
    .wrapper { width:100%; padding:30px 0; background:#f7f7f7; }
    .container {
      width:100%;
      max-width:520px;
      margin:auto;
      background:#ffffff;
      border-radius:14px;
      overflow:hidden;
      box-shadow:0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      width:100%;
      background:linear-gradient(135deg, #b71c1c, #d32f2f);
      color:#fff;
      text-align:center;
      padding:30px 20px 20px;
    }
    .header img {
      width:130px;
      height:auto;
      display:block;
      margin:0 auto 12px;
    }
    .header h1 {
      margin:0;
      font-size:24px;
      font-weight:700;
      letter-spacing:0.5px;
    }
    .content {
      padding:35px 28px 30px;
      line-height:1.6;
      text-align:left;
    }
    .content p {
      font-size:15px;
      margin:0 0 16px;
    }
    .otp-box {
      text-align:center;
      font-size:24px;
      font-weight:700;
      color:#d32f2f;
      letter-spacing:6px;
      padding:15px;
      margin:20px auto 25px;
      border:2px dashed #d32f2f;
      border-radius:8px;
      display:inline-block;
    }
    .footer {
      background:#fafafa;
      text-align:center;
      padding:16px;
      font-size:12px;
      color:#777;
    }
    @media only screen and (max-width:480px){
      .container{ width:92%!important; }
      .otp-box{ font-size:20px!important; letter-spacing:4px!important; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="container">
      <tr>
        <td class="header">
          <img src="{{logoUrl}}" alt="Caritas Manila Logo">
          <h1>Welcome to Caritas Manila</h1>
        </td>
      </tr>
      <tr>
        <td class="content">
          <p>Dear Friend,</p>
          <p>Thank you for joining our mission of love and charity. Before you begin making a difference through your purchases and donations, please verify your email address using the code below:</p>
          <div class="otp-box">{{otp}}</div>
          <p>Once verified, you’ll be able to explore our online charity store and continue helping those in need.</p>
          <p>Thank you for being part of our compassionate community.</p>
          <p>With gratitude,<br><strong>The Caritas Manila Team</strong></p>
        </td>
      </tr>
      <tr><td class="footer">&copy; Caritas Manila · Charity Works with Love</td></tr>
    </table>
  </div>
</body>
</html>
`;

const VOUCHER_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Your Donation Confirmation – Caritas Manila</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin:0; padding:0;
      font-family:'Open Sans', sans-serif;
      background:#f7f7f7;
      color:#333;
    }
    table, td { border-collapse:collapse; }
    .wrapper { width:100%; padding:40px 0; background:#f7f7f7; }
    .container {
      width:100%;
      max-width:520px;
      background:#fff;
      border-radius:16px;
      overflow:hidden;
      margin:auto;
      box-shadow:0 4px 25px rgba(0,0,0,0.1);
    }
    .header {
      width:100%;
      background:linear-gradient(135deg, #b71c1c, #d32f2f);
      color:#fff;
      text-align:center;
      padding:30px 20px 20px;
    }
    .header img {
      width:130px;
      height:auto;
      display:block;
      margin:0 auto 12px;
    }
    .header h1 {
      margin:0;
      font-size:24px;
      font-weight:700;
      letter-spacing:0.5px;
    }
    .main {
      padding:30px 24px;
      text-align:center;
      background:#fff;
      border-top:2px dashed #d32f2f;
      border-bottom:2px dashed #d32f2f;
    }
    .main p { font-size:15px; margin-bottom:14px; }
    .voucher-box {
      display:inline-block;
      padding:14px 30px;
      background:#d32f2f;
      color:#fff;
      font-size:20px;
      font-weight:700;
      letter-spacing:3px;
      border-radius:8px;
      margin:20px 0;
      box-shadow:0 2px 8px rgba(0,0,0,0.2);
    }
    .details {
      font-size:14px;
      color:#555;
      margin-top:10px;
    }
    .footer {
      background:#fafafa;
      text-align:center;
      font-size:12px;
      color:#777;
      padding:18px;
    }
    @media only screen and (max-width:480px){
      .container{ width:90%!important; }
      .voucher-box{ font-size:18px!important; padding:12px 20px!important; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="container">
      <tr>
        <td class="header">
          <img src="{{logoUrl}}" alt="Caritas Manila Logo">
          <h1>Donation Confirmation</h1>
        </td>
      </tr>
      <tr>
        <td class="main">
          <p>Thank you for your generous donation to <strong>Caritas Segunda Mana</strong>.</p>
          <p>Your donation reference code:</p>
          <div class="voucher-box">{{otp}}</div>
          <p class="details">Please keep this code as proof of your transaction. Your contribution helps uplift lives and spread hope to our less fortunate brothers and sisters.</p>
        </td>
      </tr>
      <tr><td class="footer">&copy; Caritas Manila · Together, we make charity work.</td></tr>
    </table>
  </div>
</body>
</html>
`;

module.exports = { VERIFY_TEMPLATE, VOUCHER_TEMPLATE };
