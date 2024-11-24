const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS0VmYVA2WDV6UFFrdkplMnRJZEN0Ty9Xc3Z4bGRNQWo2Qm00TUJZYi9uTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRnJuZmRpTHR6VXhjSDdUUXNxQitIcHgxMXBWMkRTSWp3VkozUnNCaCtTND0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJhT1h3RXNGUktzSE5lcExTazA5MVdxNmZ5eHZESE55Yjd6cGFaOTUzdTJRPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJOSTF6cFpVODRwNWhxejdvc21sNEFQdFA5ajFLMk5YWnRWVGZtYWd6bVM0PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IktBc2hmaWtpZTNpam9TTFpEOVhqVTZnUVd4TXovM0VmbTJHSkdmSzN4M0k9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNzdlVuNW1mUCtXd0FnT2ZMRHVnc3hueHdZNUVORjJ1WjllL2kvblRkeXM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS081OHoxSTFVNVRpV3BJNkt0L0had3NxdVJYaDV2VnRNUkVWVCsyWWlrRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieGUvbW1NRGdiMkY4dTlabVIrS3Bta1pSbWEyUEFrbVhIQXR4QWxjRWpCQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InZIVlUzN3J1bU4rTjBia0RmNW1OM2tmOHR0dzFzUkhXOGgwMWJWVjFoQ0d0ZldicXI3QmFmU29QNGxCQ2FOd1dZODYzNnhGb0lkR0htZjVYNUxJbUJnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MzcsImFkdlNlY3JldEtleSI6InhlOHhUYkttZUFNdGkvTW1ub2QwZEs1VndPb1U5K2hJb29MeWxSQTE2RDQ9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6InItdnNnNXNlU2ZPczdoLXRIUm5PSHciLCJwaG9uZUlkIjoiOWY0YTk1ZTMtMWQ3Mi00NWU1LThmMDAtNjkzMzFkZGI0Zjc4IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlkyS1RzelBtSXpMcVNONFVJaWZWVGxSenNNcz0ifSwicmVnaXN0ZXJlZCI6ZmFsc2UsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZHUxNmdHMkc2dEJVcVlRdUJwdWJqa29zaUxzPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTm1iclZVUXVOdU11Z1lZRlNBQUtBQT0iLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiRnVYZjRwY3p3S2YvVHZKaGp0akpJVGQ1UmNhZmZGUUFQYVBGellxclNFVT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiTittQks0NzNhdXJyUk1GYlFueUtsdjFvNXBwamNQbjRLNktZZUIydytCSUxDcmtyN0xIcFhYem4zdm4wSG1OV2FMSmpjdUpSUU1sQithTzhmaVA0RFE9PSIsImRldmljZVNpZ25hdHVyZSI6InNyTFhvQTlpTmh2VXoyYzEvTEN6YTNYTnBEY1dXaHdYTFZLRnRpbHBvQWkwZVhBRnNsK3pNTzZzVi9CSmtWQ2x1bVk0U2w3d0ppakdiQ2hRbTBQUUJnPT0ifSwibWUiOnsiaWQiOiIyNTQ3OTc5OTIwMjc6NzRAcy53aGF0c2FwcC5uZXQifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0Nzk3OTkyMDI3Ojc0QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlJibDMrS1hNOENuLzA3eVlZN1l5U0UzZVVYR24zeFVBRDJqeGMyS3EwaEYifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzI0NTU4NzksIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBSXpVIn0=',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "DEPCMASTER",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "DEPCMASTER",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'BMW_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/17c83719a1b40e02971e4.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
