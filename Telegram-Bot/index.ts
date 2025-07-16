import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { translateWithFeedback } from './translator';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

type UserState = {
  step: 'idle' | 'awaitingText' | 'awaitingTargetLanguage';
  sourceText?: string;
};

const userStates = new Map<number, UserState>();

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `سلام ${msg.from?.first_name || ''} 👋\nبه ربات مترجم خوش اومدی!\nاز منو یکی از دستورات رو انتخاب کن.`,
    {
      reply_markup: {
        keyboard: [
          [{ text: '/translate' }, { text: '/help' }],
        ],
        resize_keyboard: true,
      },
    }
  );
  userStates.set(chatId, { step: 'idle' });
});

bot.onText(/\/translate/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '📝 لطفاً متنی که می‌خوای ترجمه بشه رو وارد کن');
  userStates.set(chatId, { step: 'awaitingText' });
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  const helpMessage = `
🤖 راهنمای ربات:

✅ /start - شروع و نمایش منوی اصلی
🌐 /translate - ترجمه متن به زبان دلخواه
ℹ️ /help - نمایش این راهنما
  `.trim();

  bot.sendMessage(chatId, helpMessage);
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();

  if (!text || text.startsWith('/')) return;

  const state = userStates.get(chatId) || { step: 'idle' };

  if (state.step === 'awaitingText') {
    userStates.set(chatId, { step: 'awaitingTargetLanguage', sourceText: text });
    bot.sendMessage(chatId, '🌐 حالا زبان مقصد رو وارد کن (مثلاً: فارسی، انگلیسی و...)');
    return;
  }

  if (state.step === 'awaitingTargetLanguage' && state.sourceText) {
    bot.sendMessage(chatId, '⏳ در حال ترجمه...');

    try {
      const result = await translateWithFeedback(state.sourceText, text);
      const t = result.currentObjectTranslation.translation;

      const message = `
✅ ترجمه نهایی:

📝 ${t.translated_text}

------------------------
🌐 زبان متن اصلی: ${t.text_language}
🔁 زبان مقصد: ${t.target_language}
🔤 متن اصلی:
${t.text_to_translate}

💡 توضیحات (به زبان مقصد):
${t.explanations_related_to_translation_in_target_language}
      `.trim();

      bot.sendMessage(chatId, message);
    } catch (err) {
      bot.sendMessage(chatId, '❌ خطایی در ترجمه رخ داد.');
      console.error(err);
    }

    userStates.set(chatId, { step: 'idle' });
  }
});
