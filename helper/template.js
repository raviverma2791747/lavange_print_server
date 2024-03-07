const dotenv = require("dotenv");
dotenv.config();

const mailTemplate = (order) => {
  let items_slot = "";

  order.items.forEach((item) => {
    items_slot += `   <tr>
    <td align="left" valign="top" style="padding: 20px 10px 20px 0px;border-bottom: 1px solid #E5E5E5;">
     <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
       <td>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
         <tr>
          <td valign="top">
           <table class="pc-w620-view-vertical" border="0" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
             <th valign="top" style="font-weight: normal; text-align: left;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
               <tr>
                <td class="pc-w620-spacing-0-0-20-0" valign="top" style="padding: 0px 20px 0px 0px;">
                 <img src="https://cloudfilesdm.com/postcards/transactional-5-image-1.jpg" class="" width="100" height="104" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:100px;height:104px;" />
                </td>
               </tr>
              </table>
             </th>
             <th valign="top" style="font-weight: normal; text-align: left;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
               <tr>
                <td>
                 <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                   <td valign="top">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <th valign="top" style="font-weight: normal; text-align: left;   padding: 0px 0px 4px 0px;">
                       <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                         <td valign="top" class="pc-font-alt pc-w620-fontSize-16 pc-w620-lineHeight-26" style="mso-line-height: exactly;line-height: 28px;letter-spacing: -0.3px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 18px;font-weight: 500;color: #151515;">
                          ${item.product.title}</td>
                        </tr>
                       </table>
                      </th>
                     </tr>
                     <!--tr>
                      <th valign="top" style="font-weight: normal; text-align: left;   padding: 0px 0px 2px 0px;">
                       <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                         <td valign="top" class="pc-font-alt" style="mso-line-height: exactly;line-height: 24px;letter-spacing: -0.2px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 16px;font-weight: normal;color: #9b9b9b;">
                          Pink</td>
                        </tr>
                       </table>
                      </th>
                     </tr-->
                     <!--tr>
                      <th valign="top" style="font-weight: normal; text-align: left;">
                       <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                         <td valign="top" class="pc-font-alt" style="mso-line-height: exactly;line-height: 24px;letter-spacing: -0.2px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 16px;font-weight: normal;color: #9b9b9b;">
                          Medium</td>
                        </tr>
                       </table>
                      </th>
                     </tr-->
                    </table>
                   </td>
                  </tr>
                 </table>
                </td>
               </tr>
              </table>
             </th>
            </tr>
           </table>
          </td>
         </tr>
        </table>
       </td>
      </tr>
     </table>
    </td>
    <td align="left" valign="top" style="padding: 20px 10px 20px 0px;border-bottom: 1px solid #E5E5E5;">
     <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="right">
      <tr>
       <td valign="top" class="pc-font-alt pc-w620-fontSize-16 pc-w620-lineHeight-20" align="right" style="mso-line-height: exactly;line-height: 22px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 18px;font-weight: normal;color: #9b9b9b;text-align: right;text-align-last: right;">
        ${item.quantity}</td>
      </tr>
     </table>
    </td>
    <td align="left" valign="top" style="padding: 20px 0px 20px 0px;border-bottom: 1px solid #E5E5E5;">
     <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="right">
      <tr>
       <td valign="top" class="pc-font-alt pc-w620-fontSize-16 pc-w620-lineHeight-20" align="right" style="mso-line-height: exactly;line-height: 22px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 18px;font-weight: normal;color: #151515;text-align: right;text-align-last: right;">
        ${item.price}</td>
      </tr>
     </table>
    </td>
   </tr>`;
  });

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="https://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
   <meta charset="UTF-8" />
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   <!--[if !mso]><!-->
   <meta http-equiv="X-UA-Compatible" content="IE=edge" />
   <!--<![endif]-->
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   <meta name="format-detection" content="telephone=no" />
   <meta name="format-detection" content="date=no" />
   <meta name="format-detection" content="address=no" />
   <meta name="format-detection" content="email=no" />
   <meta name="x-apple-disable-message-reformatting" />
   <title>Untitled</title>
   <!-- Made with Postcards by Designmodo https://designmodo.com/postcards -->
   <!--[if !mso]><!-- -->
   <style>
   @media  all {
                                                   /* cyrillic-ext */
               @font-face {
                   font-family: 'Fira Sans';
                   font-style: normal;
                   font-weight: 400;
                   src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5VvmojLazX3dGTP.woff2) format('woff2');
                   unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
               }
               /* cyrillic */
               @font-face {
                   font-family: 'Fira Sans';
                   font-style: normal;
                   font-weight: 400;
                   src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5Vvk4jLazX3dGTP.woff2) format('woff2');
                   unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
               }
               /* latin-ext */
               @font-face {
                   font-family: 'Fira Sans';
                   font-style: normal;
                   font-weight: 400;
                   src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5VvmYjLazX3dGTP.woff2) format('woff2');
                   unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
               }
               /* latin */
               @font-face {
                   font-family: 'Fira Sans';
                   font-style: normal;
                   font-weight: 400;
                   src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5Vvl4jLazX3dA.woff2) format('woff2');
                   unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
               }
                                       /* cyrillic-ext */
               @font-face {
                   font-family: 'Fira Sans';
                   font-style: normal;
                   font-weight: 500;
                   src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveSxf6Xl7Gl3LX.woff2) format('woff2');
                   unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
               }
               /* cyrillic */
               @font-face {
                   font-family: 'Fira Sans';
                   font-style: normal;
                   font-weight: 500;
                   src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveQhf6Xl7Gl3LX.woff2) format('woff2');
                   unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
               }
               /* latin-ext */
               @font-face {
                   font-family: 'Fira Sans';
                   font-style: normal;
                   font-weight: 500;
                   src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveSBf6Xl7Gl3LX.woff2) format('woff2');
                   unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
               }
               /* latin */
               @font-face {
                   font-family: 'Fira Sans';
                   font-style: normal;
                   font-weight: 500;
                   src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveRhf6Xl7Glw.woff2) format('woff2');
                   unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
               }
                                       /* cyrillic-ext */
               @font-face {
                   font-family: 'Fira Sans';
                   font-style: normal;
                   font-weight: 700;
                   src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eSxf6Xl7Gl3LX.woff2) format('woff2');
                   unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
               }
               /* cyrillic */
               @font-face {
                   font-family: 'Fira Sans';
                   font-style: normal;
                   font-weight: 700;
                   src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eQhf6Xl7Gl3LX.woff2) format('woff2');
                   unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
               }
               /* latin-ext */
               @font-face {
                   font-family: 'Fira Sans';
                   font-style: normal;
                   font-weight: 700;
                   src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eSBf6Xl7Gl3LX.woff2) format('woff2');
                   unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
               }
               /* latin */
               @font-face {
                   font-family: 'Fira Sans';
                   font-style: normal;
                   font-weight: 700;
                   src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eRhf6Xl7Glw.woff2) format('woff2');
                   unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
               }
                                       /* cyrillic-ext */
               @font-face {
                   font-family: 'Fira Sans';
                   font-style: normal;
                   font-weight: 800;
                   font-display: swap;
                   src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eSxf6Xl7Gl3LX.woff2) format('woff2');
                   unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
               }
               /* cyrillic */
               @font-face {
                   font-family: 'Fira Sans';
                   font-style: normal;
                   font-weight: 800;
                   font-display: swap;
                   src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eQhf6Xl7Gl3LX.woff2) format('woff2');
                   unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
               }
               /* latin-ext */
               @font-face {
                   font-family: 'Fira Sans';
                   font-style: normal;
                   font-weight: 800;
                   font-display: swap;
                   src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eSBf6Xl7Gl3LX.woff2) format('woff2');
                   unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
               }
               /* latin */
               @font-face {
                   font-family: 'Fira Sans';
                   font-style: normal;
                   font-weight: 800;
                   font-display: swap;
                   src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eRhf6Xl7Glw.woff2) format('woff2');
                   unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
               }
                       }
   </style>
   <!--<![endif]-->
   <style>
   html,
           body {
               margin: 0 !important;
               padding: 0 !important;
               min-height: 100% !important;
               width: 100% !important;
               -webkit-font-smoothing: antialiased;
           }
   
           * {
               -ms-text-size-adjust: 100%;
           }
   
           #outlook a {
               padding: 0;
           }
   
           .ReadMsgBody,
           .ExternalClass {
               width: 100%;
           }
   
           .ExternalClass,
           .ExternalClass p,
           .ExternalClass td,
           .ExternalClass div,
           .ExternalClass span,
           .ExternalClass font {
               line-height: 100%;
           }
   
           div[style*="margin: 14px 0"],
           div[style*="margin: 16px 0"] {
               margin: 0 !important;
           }
   
           table,
           td,
           th {
               mso-table-lspace: 0 !important;
               mso-table-rspace: 0 !important;
               border-collapse: collapse;
           }
   
           body, td, th, p, div, li, a, span {
               -webkit-text-size-adjust: 100%;
               -ms-text-size-adjust: 100%;
               mso-line-height-rule: exactly;
           }
   
           img {
               border: 0;
               outline: none;
               line-height: 100%;
               text-decoration: none;
               -ms-interpolation-mode: bicubic;
           }
   
           a[x-apple-data-detectors] {
               color: inherit !important;
               text-decoration: none !important;
           }
   
           .pc-gmail-fix {
               display: none;
               display: none !important;
           }
   
           @media (min-width: 621px) {
               .pc-lg-hide {
                   display: none;
               } 
   
               .pc-lg-bg-img-hide {
                   background-image: none !important;
               }
           }
   </style>
   <style>
   @media (max-width: 620px) {
   .pc-project-body {min-width: 0px !important;}
   .pc-project-container {width: 100% !important;}
   .pc-sm-hide {display: none !important;}
   .pc-sm-bg-img-hide {background-image: none !important;}
   .pc-w620-fontSize-30 {font-size: 30px !important;}
   .pc-w620-lineHeight-40 {line-height: 40px !important;}
   .pc-w620-fontSize-18 {font-size: 18px !important;}
   .pc-w620-lineHeight-28 {line-height: 28px !important;}
   .pc-w620-padding-30-0 {padding-top: 15px !important;padding-bottom: 15px !important;}
   .pc-w620-fontSize-16 {font-size: 16px !important;}
   .pc-w620-lineHeight-26 {line-height: 26px !important;}
   .pc-w620-view-vertical,.pc-w620-view-vertical > tbody,.pc-w620-view-vertical > tbody > tr,.pc-w620-view-vertical > tbody > tr > th,.pc-w620-view-vertical > tr,.pc-w620-view-vertical > tr > th {display: inline-block;width: 100% !important;}
   table.pc-w620-spacing-0-0-20-0 {margin: 0px 0px 20px 0px !important;}
   td.pc-w620-spacing-0-0-20-0,th.pc-w620-spacing-0-0-20-0{margin: 0 !important;padding: 0px 0px 20px 0px !important;}
   .pc-w620-lineHeight-20 {line-height: 20px !important;}
   .pc-w620-padding-35-35-35-35 {padding: 35px 35px 35px 35px !important;}
   
   .pc-w620-gridCollapsed-1 > tbody,.pc-w620-gridCollapsed-1 > tbody > tr,.pc-w620-gridCollapsed-1 > tr {display: inline-block !important;}
   .pc-w620-gridCollapsed-1.pc-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-width-fill > tr {width: 100% !important;}
   .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
   .pc-w620-gridCollapsed-1 > tbody > tr > td,.pc-w620-gridCollapsed-1 > tr > td {display: block !important;width: auto !important;padding-left: 0 !important;padding-right: 0 !important;}
   .pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-width-fill > tr > td {width: 100% !important;}
   .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;}
   .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-first > .pc-grid-td-first,pc-w620-gridCollapsed-1 > .pc-grid-tr-first > .pc-grid-td-first {padding-top: 0 !important;}
   .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-last > .pc-grid-td-last,pc-w620-gridCollapsed-1 > .pc-grid-tr-last > .pc-grid-td-last {padding-bottom: 0 !important;}
   
   .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-first > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-first > td {padding-top: 0 !important;}
   .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-last > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-last > td {padding-bottom: 0 !important;}
   .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-first,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-first {padding-left: 0 !important;}
   .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-last,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-last {padding-right: 0 !important;}
   
   .pc-w620-tableCollapsed-1 > tbody,.pc-w620-tableCollapsed-1 > tbody > tr,.pc-w620-tableCollapsed-1 > tr {display: block !important;}
   .pc-w620-tableCollapsed-1.pc-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-width-fill > tr {width: 100% !important;}
   .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
   .pc-w620-tableCollapsed-1 > tbody > tr > td,.pc-w620-tableCollapsed-1 > tr > td {display: block !important;width: auto !important;}
   .pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-width-fill > tr > td {width: 100% !important;}
   .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;}
   }
   @media (max-width: 520px) {
   .pc-w520-padding-30-30-30-30 {padding: 30px 30px 30px 30px !important;}
   }
   </style>
   <!--[if mso]>
      <style type="text/css">
          .pc-font-alt {
              font-family: Arial, Helvetica, sans-serif !important;
          }
      </style>
      <![endif]-->
   <!--[if gte mso 9]>
      <xml>
          <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
  </head>
  
  <body class="pc-font-alt" style="width: 100% !important;min-height: 100% !important;margin: 0 !important;padding: 0 !important;line-height: 1.5;color: #2D3A41;mso-line-height-rule: exactly;-webkit-font-smoothing: antialiased;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;font-variant-ligatures: none;text-rendering: optimizeLegibility;-moz-osx-font-smoothing: grayscale;background-color: #f4f4f4;" bgcolor="#f4f4f4">
   <table class="pc-project-body" style="table-layout: fixed;min-width: 600px;background-color:#f4f4f4;" bgcolor="#f4f4f4" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
    <tr>
     <td align="center" valign="top">
      <table class="pc-project-container" style="width: 600px; max-width: 600px;" width="600" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
       <tr>
        <td style="padding: 20px 0px 20px 0px;" align="left" valign="top">
         <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width: 100%;">
          <tr>
           <td valign="top">
            <!-- BEGIN MODULE: Transactional 5 -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
             <tr>
              <td style="padding: 0px 0px 0px 0px;">
               <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tr>
                 <td valign="top" class="pc-w520-padding-30-30-30-30 pc-w620-padding-35-35-35-35" style="padding: 40px 40px 40px 40px;border-radius: 0px;background-color: #ffffff;" bgcolor="#ffffff">
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                   <tr>
                    <td valign="top" style="padding: 0px 0px 18px 0px;">
                     <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                       <td valign="top" class="pc-font-alt" style="mso-line-height: exactly;line-height: 121%;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 14px;font-weight: 500;color: #40be65;">
                        Order ${order._id}</td>
                      </tr>
                     </table>
                    </td>
                   </tr>
                  </table>
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                   <tr>
                    <td valign="top" style="padding: 0px 0px 15px 0px;">
                     <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                       <td valign="top" class="pc-font-alt pc-w620-fontSize-30 pc-w620-lineHeight-40" style="mso-line-height: exactly;line-height: 128%;letter-spacing: -0.6px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 36px;font-weight: 800;color: #151515;">
                        Hello shop owner!</td>
                      </tr>
                     </table>
                    </td>
                   </tr>
                  </table>
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                   <tr>
                    <td valign="top" style="padding: 0px 0px 20px 0px;">
                     <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                       <td valign="top" class="pc-font-alt pc-w620-fontSize-18 pc-w620-lineHeight-28" style="mso-line-height: exactly;line-height: 155%;letter-spacing: -0.4px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 22px;font-weight: normal;color: #9b9b9b;">
                        Save these items hours of therapy and give them a loving home!</td>
                      </tr>
                     </table>
                    </td>
                   </tr>
                  </table>
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                   <tr>
                    <td align="left" style="padding: 0px 0px 40px 0px;">
                     <table class="pc-width-hug pc-w620-gridCollapsed-0" align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr class="pc-grid-tr-first pc-grid-tr-last">
                       <td class="pc-grid-td-first pc-grid-td-last" valign="top" style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                         <tr>
                          <td align="left" valign="top">
                           <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                             <td align="left" valign="top">
                              <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                               <tr>
                                <th valign="top" style="text-align: left;font-weight: normal;line-height: 1;">
                                 <!--[if mso]>
          <table  border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" style="border-collapse: separate;">
              <tr>
                  <td valign="middle" align="center" style="text-align: center;color: #ffffff;border-radius: 8px;background-color: #1595e7;padding: 14px 19px 14px 19px;" bgcolor="#1595e7">
                                      <a class="pc-font-alt" style="display: inline-block;text-decoration: none;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-weight: 500;font-size: 16px;line-height: 150%;letter-spacing: -0.2px;color: #ffffff;" href="https://designmodo.com/postcards" target="_blank">View my order</a>
                                  </td>
              </tr>
          </table>
          <![endif]-->
                                 <!--[if !mso]><!-- --><a style="border-radius: 8px;background-color: #1595e7;padding: 14px 19px 14px 19px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-weight: 500;font-size: 16px;line-height: 150%;letter-spacing: -0.2px;color: #ffffff;text-align: center;text-align-last: center;text-decoration: none;display: inline-block;vertical-align: top;-webkit-text-size-adjust: none;" href="${`${process.env.BASE_URL}/order/${order._id}`  }" target="_blank">View my order</a>
                                 <!--<![endif]-->
                                </th>
                               </tr>
                              </table>
                             </td>
                            </tr>
                           </table>
                          </td>
                         </tr>
                        </table>
                       </td>
                      </tr>
                     </table>
                    </td>
                   </tr>
                  </table>
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                   <tr>
                    <td style="padding: 0px 0px 40px 0px;">
                     <table class="pc-width-fill pc-w620-gridCollapsed-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr class="pc-grid-tr-first">
                       <td class="pc-grid-td-first pc-w620-padding-30-0" align="left" valign="top" style="width: 50%; padding-top: 0px; padding-right: 20px; padding-bottom: 20px; padding-left: 0px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                         <tr>
                          <td align="left" valign="top">
                           <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                            <tr>
                             <td align="left" valign="top">
                              <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                               <tr>
                                <td valign="top" style="padding: 0px 0px 10px 0px;">
                                 <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                   <td valign="top" class="pc-font-alt" style="mso-line-height: exactly;line-height: 156%;letter-spacing: -0.2px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 18px;font-weight: bold;color: #151515;">
                                    Order number</td>
                                  </tr>
                                 </table>
                                </td>
                               </tr>
                              </table>
                             </td>
                            </tr>
                            <tr>
                             <td align="left" valign="top">
                              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                               <tr>
                                <td valign="top" style="padding: 0px 0px 10px 0px;">
                                 <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                   <!--[if gte mso 9]>
                      <td height="1" valign="top" style="line-height: 1px; font-size: 1px; border-bottom: 1px solid #e5e5e5;">&nbsp;</td>
                  <![endif]-->
                                   <!--[if !gte mso 9]><!-- -->
                                   <td height="1" valign="top" style="line-height: 1px; font-size: 1px; border-bottom: 1px solid #e5e5e5;">&nbsp;</td>
                                   <!--<![endif]-->
                                  </tr>
                                 </table>
                                </td>
                               </tr>
                              </table>
                             </td>
                            </tr>
                            <tr>
                             <td align="left" valign="top">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="left">
                               <tr>
                                <td valign="top" class="pc-font-alt" style="mso-line-height: exactly;line-height: 156%;letter-spacing: -0.2px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 18px;font-weight: normal;color: #151515;">
                                ${order._id}</td>
                               </tr>
                              </table>
                             </td>
                            </tr>
                           </table>
                          </td>
                         </tr>
                        </table>
                       </td>
                       <td class="pc-grid-td-last pc-w620-padding-30-0" align="left" valign="top" style="width: 50%; padding-top: 0px; padding-right: 0px; padding-bottom: 20px; padding-left: 20px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                         <tr>
                          <td align="left" valign="top">
                           <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                            <tr>
                             <td align="left" valign="top">
                              <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                               <tr>
                                <td valign="top" style="padding: 0px 0px 10px 0px;">
                                 <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                   <td valign="top" class="pc-font-alt" style="mso-line-height: exactly;line-height: 156%;letter-spacing: -0.2px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 18px;font-weight: bold;color: #151515;">
                                    Order date</td>
                                  </tr>
                                 </table>
                                </td>
                               </tr>
                              </table>
                             </td>
                            </tr>
                            <tr>
                             <td align="left" valign="top">
                              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                               <tr>
                                <td valign="top" style="padding: 0px 0px 10px 0px;">
                                 <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                   <!--[if gte mso 9]>
                      <td height="1" valign="top" style="line-height: 1px; font-size: 1px; border-bottom: 1px solid #e5e5e5;">&nbsp;</td>
                  <![endif]-->
                                   <!--[if !gte mso 9]><!-- -->
                                   <td height="1" valign="top" style="line-height: 1px; font-size: 1px; border-bottom: 1px solid #e5e5e5;">&nbsp;</td>
                                   <!--<![endif]-->
                                  </tr>
                                 </table>
                                </td>
                               </tr>
                              </table>
                             </td>
                            </tr>
                            <tr>
                             <td align="left" valign="top">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="left">
                               <tr>
                                <td valign="top" class="pc-font-alt" style="mso-line-height: exactly;line-height: 156%;letter-spacing: -0.2px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 18px;font-weight: normal;color: #151515;">
                                 ${order.createdAt}</td>
                               </tr>
                              </table>
                             </td>
                            </tr>
                           </table>
                          </td>
                         </tr>
                        </table>
                       </td>
                      </tr>
                      <tr class="pc-grid-tr-last">
                       <td class="pc-grid-td-first pc-w620-padding-30-0" align="left" valign="top" style="width: 50%; padding-top: 20px; padding-right: 20px; padding-bottom: 0px; padding-left: 0px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                         <tr>
                          <td align="left" valign="top">
                           <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                            <tr>
                             <td align="left" valign="top">
                              <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                               <tr>
                                <td valign="top" style="padding: 0px 0px 10px 0px;">
                                 <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                   <td valign="top" class="pc-font-alt" style="mso-line-height: exactly;line-height: 156%;letter-spacing: -0.2px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 18px;font-weight: bold;color: #151515;">
                                    Shipping address</td>
                                  </tr>
                                 </table>
                                </td>
                               </tr>
                              </table>
                             </td>
                            </tr>
                            <tr>
                             <td align="left" valign="top">
                              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                               <tr>
                                <td valign="top" style="padding: 0px 0px 10px 0px;">
                                 <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                   <!--[if gte mso 9]>
                      <td height="1" valign="top" style="line-height: 1px; font-size: 1px; border-bottom: 1px solid #e5e5e5;">&nbsp;</td>
                  <![endif]-->
                                   <!--[if !gte mso 9]><!-- -->
                                   <td height="1" valign="top" style="line-height: 1px; font-size: 1px; border-bottom: 1px solid #e5e5e5;">&nbsp;</td>
                                   <!--<![endif]-->
                                  </tr>
                                 </table>
                                </td>
                               </tr>
                              </table>
                             </td>
                            </tr>
                            <tr>
                             <td align="left" valign="top">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="left">
                               <tr>
                                <td valign="top" class="pc-font-alt" style="mso-line-height: exactly;line-height: 156%;letter-spacing: -0.2px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 18px;font-weight: normal;color: #151515;">
                                 ${JSON.stringify(order.address)}</td>
                               </tr>
                              </table>
                             </td>
                            </tr>
                           </table>
                          </td>
                         </tr>
                        </table>
                       </td>
                       <td class="pc-grid-td-last pc-w620-padding-30-0" align="left" valign="top" style="width: 50%; padding-top: 20px; padding-right: 0px; padding-bottom: 0px; padding-left: 20px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                         <tr>
                          <td align="left" valign="top">
                           <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                            <tr>
                             <td align="left" valign="top">
                              <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                               <tr>
                                <td valign="top" style="padding: 0px 0px 10px 0px;">
                                 <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                   <td valign="top" class="pc-font-alt" style="mso-line-height: exactly;line-height: 156%;letter-spacing: -0.2px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 18px;font-weight: bold;color: #151515;">
                                    Billing address</td>
                                  </tr>
                                 </table>
                                </td>
                               </tr>
                              </table>
                             </td>
                            </tr>
                            <tr>
                             <td align="left" valign="top">
                              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                               <tr>
                                <td valign="top" style="padding: 0px 0px 10px 0px;">
                                 <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                   <!--[if gte mso 9]>
                      <td height="1" valign="top" style="line-height: 1px; font-size: 1px; border-bottom: 1px solid #e5e5e5;">&nbsp;</td>
                  <![endif]-->
                                   <!--[if !gte mso 9]><!-- -->
                                   <td height="1" valign="top" style="line-height: 1px; font-size: 1px; border-bottom: 1px solid #e5e5e5;">&nbsp;</td>
                                   <!--<![endif]-->
                                  </tr>
                                 </table>
                                </td>
                               </tr>
                              </table>
                             </td>
                            </tr>
                            <tr>
                             <td align="left" valign="top">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="left">
                               <tr>
                                <td valign="top" class="pc-font-alt" style="mso-line-height: exactly;line-height: 156%;letter-spacing: -0.2px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 18px;font-weight: normal;color: #151515;">
                                 ${JSON.stringify(order.address)}</td>
                               </tr>
                              </table>
                             </td>
                            </tr>
                           </table>
                          </td>
                         </tr>
                        </table>
                       </td>
                      </tr>
                     </table>
                    </td>
                   </tr>
                  </table>
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                   <tr>
                    <td>
                     <table class="pc-w620-tableCollapsed-0" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separateborder-spacing: 0width: 100%;">
                      <tbody>
                       <tr>
                        <td align="left" valign="top" style="padding: 20px 10px 20px 0px;border-bottom: 1px solid #E5E5E5;">
                         <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                           <td valign="top" class="pc-font-alt pc-w620-fontSize-16 pc-w620-lineHeight-26" style="mso-line-height: exactly;line-height: 28px;letter-spacing: -0.2px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 18px;font-weight: bold;color: #151515;">
                            Item</td>
                          </tr>
                         </table>
                        </td>
                        <td align="left" valign="top" style="padding: 20px 10px 20px 0px;border-bottom: 1px solid #E5E5E5;">
                         <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="right">
                          <tr>
                           <td valign="top" class="pc-font-alt pc-w620-fontSize-16 pc-w620-lineHeight-26" align="right" style="mso-line-height: exactly;line-height: 28px;letter-spacing: -0.2px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 18px;font-weight: bold;color: #151515;text-align: right;text-align-last: right;">
                            Qty</td>
                          </tr>
                         </table>
                        </td>
                        <td align="left" valign="top" style="padding: 20px 0px 20px 0px;border-bottom: 1px solid #E5E5E5;">
                         <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="right">
                          <tr>
                           <td valign="top" class="pc-font-alt pc-w620-fontSize-16 pc-w620-lineHeight-26" align="right" style="mso-line-height: exactly;line-height: 28px;letter-spacing: -0.2px;font-family: Fira Sans, Arial, Helvetica, sans-serif;font-size: 18px;font-weight: bold;color: #151515;text-align: right;text-align-last: right;">
                            Price</td>
                          </tr>
                         </table>
                        </td>
                       </tr>
                      ${items_slot}
                       
                      </tbody>
                     </table>
                    </td>
                   </tr>
                  </table>
                 </td>
                </tr>
               </table>
              </td>
             </tr>
            </table>
            <!-- END MODULE: Transactional 5 -->
           </td>
          </tr>
          <tr>
           <td>
            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
             <tr>
              <td align="center" valign="top" style="padding-top: 20px; padding-bottom: 20px; vertical-align: top;">
               <a href="https://designmodo.com/postcards?uid=MjMxNjYy&type=footer" target="_blank" style="text-decoration: none; overflow: hidden; border-radius: 2px; display: inline-block;">
                <img src="https://cloudfilesdm.com/postcards/promo-footer-dark.jpg" width="198" height="46" alt="Made with (o -) postcards" style="width: 198px; height: auto; margin: 0 auto; border: 0; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; vertical-align: top;">
               </a>
               <img src="https://api-postcards.designmodo.com/tracking/mail/promo?uid=MjMxNjYy" width="1" height="1" alt="" style="display:none; width: 1px; height: 1px;">
              </td>
             </tr>
            </table>
           </td>
          </tr>
         </table>
        </td>
       </tr>
      </table>
     </td>
    </tr>
   </table>
   <!-- Fix for Gmail on iOS -->
   <div class="pc-gmail-fix" style="white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
   </div>
  </body>
  
  </html>
  `
};

module.exports = { mailTemplate };
