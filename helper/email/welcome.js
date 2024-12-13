const welcomeEmail = ({
  name,
  companyName,
  companyAddress,
  brandName,
  website,
  linkedin,
  twitter,
}) => {
  return `<!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
      <meta charset="utf-8">
      <meta name="x-apple-disable-message-reformatting">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office">
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <style>
        td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
      </style>
      <![endif]-->
      <title>Welcome to ${brandName} - Your One-Stop Solution for On-Demand Printing!</title>
      <style>
        img {
          max-width: 100%;
          vertical-align: middle
        }
        .my-12 {
          margin-top: 48px;
          margin-bottom: 48px
        }
        .hover-important-text-decoration-underline:hover {
          text-decoration: underline !important
        }
        @media (max-width: 600px) {
          .sm-px-4 {
            padding-left: 16px !important;
            padding-right: 16px !important
          }
          .sm-px-6 {
            padding-left: 24px !important;
            padding-right: 24px !important
          }
          .sm-leading-8 {
            line-height: 32px !important
          }
        }
      </style>
    </head>
    <body style="margin: 0; width: 100%; background-color: #f8fafc; padding: 0; -webkit-font-smoothing: antialiased; word-break: break-word">
      <div role="article" aria-roledescription="email" aria-label="Confirm your email address" lang="en">
        <div class="sm-px-4" style="background-color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
          <table align="center" cellpadding="0" cellspacing="0" role="none">
            <tr>
              <td style="width: 552px; max-width: 100%">
                <table style="margin-top: 96px; width: 100%" cellpadding="0" cellspacing="0" role="none">
                  <tr>
                    <td class="sm-px-6" style="border-radius: 4px; background-color: #fff; padding: 48px; font-size: 16px; color: #334155; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)">
                      <h1 class="sm-leading-8" style="margin: 0 0 24px; font-size: 24px; font-weight: 600; color: #000">
                        Hello, ${name}
                      </h1>
                      <p style="margin: 0 0 16px; font-size: 18px; font-weight: 600; line-height: 24px">
                        Welcome to <span style="font-weight: 600;">${brandName}</span>
                      </p>
                      <p style="margin: 0; line-height: 24px;">
                        We are thrilled to have you join our community. At ${brandName}, we provide high-quality,
                        custom-made products to bring your ideas to life, including t-shirts, mugs, mousepads, and more.
                        <br>
                        Here's what you can expect from us:
                      </p>
                      <ul>
                        <li> <span style="font-weight: 600;">Premium Quality:</span> Top-notch materials and printing techniques.
                        </li>
                        <li> <span style="font-weight: 600;">Fast Turnaround:</span> Timely delivery for all your needs.</li>
                      </ul>
                      <p></p>
                      <p>
                        Thank you for choosing ${brandName}. We look forward to serving you!
                      </p>
                      <div role="separator" style="line-height: 24px">&zwj;</div>
                      <div>
                        <a href="${website}" style="display: inline-block; border-radius: 4px; padding: 16px 24px; font-size: 16px; line-height: 1; font-weight: 600; text-decoration: none; color: #f8fafc; background-color: #E41E1E">
                          <!--[if mso]>
          <i style="mso-font-width: 150%; mso-text-raise: 30px" hidden>&emsp;</i>
        <![endif]-->
                          <span style="mso-text-raise: 16px">
                      Continue Shopping &rarr;
                    </span>
                          <!--[if mso]>
          <i hidden style="mso-font-width: 150%;">&emsp;&#8203;</i>
        <![endif]-->
                        </a>
                      </div>
                      <div role="separator" style="background-color: #e2e8f0; height: 1px; line-height: 1px; margin: 32px 0">&zwj;</div>
                      <p style="margin: 0;">
                        Thanks <br>Team ${brandName}
                      </p>
                    </td>
                  </tr>
                  <tr role="separator">
                    <td style="line-height: 48px">&zwj;</td>
                  </tr>
                  <tr>
                    <td style="padding-left: 24px; padding-right: 24px; text-align: center; font-size: 12px; color: #475569">
                      <p style="margin: 0 0 8px">
                        ⓒ 2024 ${brandName} Powered by ${companyName}
                      </p>
                      <p style="margin: 0 0 16px;">
                        ${companyAddress}
                      </p>
                      <p style="cursor: default">
                        <a href="${website}
                        <a href="${linkedin}" class="hover-important-text-decoration-underline" style="color: #4338ca; text-decoration: none;">LinkedIn</a>
                        &bull;
                        <a href="${twitter}" class="hover-important-text-decoration-underline" style="color: #4338ca; text-decoration: none;">Twitter</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </body>
    </html>`;
};


module.exports = { welcomeEmail };