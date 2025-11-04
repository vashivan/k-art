// src/telegrambot.cjs
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const baseUrl = process.env.BASE_URL; 

if (!token) {
  console.error("❌ TELEGRAM_BOT_TOKEN is missing in .env");
  process.exit(1);
}
if (!baseUrl) {
  console.error("❌ BASE_URL is missing in .env");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from?.username || "";
  const firstName = msg.from?.first_name || "";

  // Формуємо URL на форму з переданим chat_id та username
  const url = new URL("/form", baseUrl);
  url.searchParams.set("tg_chat_id", String(chatId));
  if (username) url.searchParams.set("tg_username", username);

  try {
    await bot.sendMessage(
      chatId,
      `👋 Hi ${firstName || ""}! Welcome to K-Art.\n\nPlease fill out the application form below 👇`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📝 Open Application Form",
                url: url.toString(),
              },
            ],
          ],
        },
      }
    );
    console.log("➡️ Sent form link to", chatId, username);
  } catch (err) {
    console.error("Failed to send /start message:", err);
  }
});

console.log("🤖 Telegram bot is running...");
