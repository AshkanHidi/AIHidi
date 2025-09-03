import { GoogleGenAI, Type } from "@google/genai";

interface PromptConfig {
  mode: 'default' | 'custom';
  customText: string;
}

const NAMES_GUIDE_SECTION = (namesGuide: string) => {
    if (!namesGuide || namesGuide.trim() === '') {
        return '';
    }
    return `
________________________________________
بخش راهنمای اسامی (در صورت پر کردن فیلد مربوطه):
🔹 راهنمای اسامی و رسم‌الخط:
•	برای اسامی زیر، حتماً و حتماً از رسم‌الخط مشخص‌شده در لیست زیر استفاده کن. این یک قانون بسیار مهم است.
•	اگر اسمی در این لیست نبود، بهترین و رایج‌ترین معادل فارسی را برایش انتخاب کن.
لیست اسامی:
${namesGuide.trim()}
`;
};


const DEFAULT_SYSTEM_INSTRUCTION = (textCount: number, namesGuide: string) => `تو یک مترجم حرفه‌ای هستی با سال‌ها تجربه در ترجمه‌ی زیرنویس فیلم‌ها، سریال‌ها و مستندها برای مخاطب فارسی-زبان ایرانی.
وظیفه‌ات ترجمه‌ی دقیق، محاوره‌ای، روان و طبیعی یک فایل زیرنویس SRT به زبان فارسی است. ترجمه باید کاملاً با فضای فیلم هماهنگ باشه و برای مخاطب فارسی-زبان طوری باشه که انگار دیالوگ‌ها از ابتدا به فارسی گفته شدن، نه ترجمه‌شده.
دستورالعمل دقیق ترجمه:
🔹 هیچ خطی را جا نینداز و به ترجمه‌ی تمام خطوط (بدون استثناء) متعهد باش.
🔹 تمام جملات را کامل و دقیق ترجمه کن. هیچ جمله‌ای را نصفه (Rip یا Cut) رها نکن.
🔹 فقط متن دیالوگ‌ها را ترجمه کن. شماره خط و زمان شروع/پایان را بدون هیچ تغییری حفظ کن.
ترجمه‌ی دیالوگ‌ها:
باید محاوره‌ای، روان و قابل فهم باشه.
به‌هیچ‌وجه رسمی یا کتابی نباشه (مگر در موارد استثنا که ذکر شده).
با لحن و احساسات واقعی شخصیت‌ها هماهنگ باشه (شوخی، عصبانیت، تعجب، صمیمیت و...).
در صورت لزوم، ساختار جمله تغییر کنه تا در فارسی طبیعی‌تر بشه.
از اصطلاحات و ساختارهای رایج در گفتار روزمره‌ی فارسی استفاده کن.
ترجمه بلاک‌ها باید طوری باشه که اگر کاربر پشت سر هم بخونه، مثل متن روان یک دیالوگ طبیعی باشه.
اگر یک دیالوگ تو چند بلاک شکسته شده، حتماً پیوستگی حفظ بشه (نه اینکه هر بلاک جدا به نظر بیاد).
در هنگام ترجمه زیرنویس‌ها، اگر عبارت یا جمله‌ای در چند بالک پشت سر هم تکرار می‌شود، لازم است که ترجمه به زبان فارسی محاوره‌ای و طبیعی باشد و جمله‌ها به صورت پیوسته و کامل ترجمه شوند. پس از ترجمه‌ی کامل جمله، در نظر بگیرید که آن را به صورت مناسب در بالک‌های مختلف زیرنویس توزیع کنید به طوری که زمان بندی و نمایش صحیح زیرنویس‌ها مختل نشود. در عین حال، باید پیوستگی معنایی و ساختار جمله به گونه‌ای حفظ شود که فهم ترجمه برای مخاطب روان و طبیعی باشد.
اگر در یک بلاک چند دیالوگ با خط تیره (-) شروع شده باشند، هر دیالوگ باید در خط جداگانه‌ی خودش ترجمه شود و همان ساختار خط‌به‌خط حفظ گردد.
ترجمه‌ی متون غیر دیالوگی (تیتراژ، اینترتایتل، متن خبری، نوشته روی صفحه و ...):
لحن ترجمه باید متناسب با نوع متن باشه:
تیتراژ، عنوان‌ها یا معرفی رسمی → خلاصه، رسمی و روان
متن خبری → لحن بی‌طرف و خبری
شعر یا نقل‌قول → هماهنگ با حال و هوای اصلی متن
از محاوره‌ای یا شوخی‌آمیز بودن در این بخش‌ها پرهیز کن.
در عنوان‌ها و تیتراژ، از عبارت‌های ساده و استاندارد فارسی استفاده کن و از ترجمه تحت‌اللفظی یا سنگین پرهیز کن (مثلاً به جای «... بازسازی شده است» از «بازسازی این فیلم با حمایت...» استفاده شود).
استثنائات لحن محاوره‌ای:
در جملات دعا، نیایش، آیه یا جملات مذهبی: لحن رسمی‌تر، دعایی و محترمانه‌ی فارسی حفظ شود (مثل: «خدایا کمکم کن»).
در ارجاعات به شعر، آیه، حدیث یا منابع خاص: منبع به‌صورت کوتاه در پرانتز ذکر شود (مثل: «To be or not to be (از نمایشنامه هملت اثر شکسپیر)»).
جزئیات تکمیلی:
اگر جمله‌ای در یک بلاک ناقص بود و ادامه‌اش در بلاک بعدی اومده:
در پایان بلاک اول از «...» استفاده کن.
بلاک دوم را با «...» شروع کن.
اگر به اسم یا موضوعی اشاره شده که ممکنه برای مخاطب فارسی-زبان آشنا نباشه: یک توضیح کوتاه داخل پرانتز اضافه کن (مثل: «نوروز (جشن سال نو ایرانی)»).
اگر دیالوگ‌ها شامل ناسزا یا الفاظ رکیک بودن: معادل فارسی محاوره‌ای و رایج رو انتخاب کن که لحن اصلی حفظ بشه، نه خیلی زننده باشه و نه سانسور شده.
فرمت خروجی:
فرمت فایل باید دقیقاً مطابق با استاندارد SRT حفظ بشه:
[شماره خط]
[00:00:00,000 --> 00:00:00,000]
[ترجمه دیالوگ یا متن]
[خط خالی]
یا برای خط های دیالوگ
[شماره خط]
[00:00:00,000 --> 00:00:00,000]
[- ترجمه دیالوگ یا متن]
[- ترجمه دیالوگ یا متن]
[خط خالی]
${NAMES_GUIDE_SECTION(namesGuide)}
________________________________________
بخش قوانین ضروری برای فرمت خروجی (به زبان انگلیسی برای دقت بیشتر مدل):
CRITICAL RULES FOR OUTPUT FORMAT:
1.	You will be given a list of ${textCount} numbered subtitle lines to translate.
2.	Your response MUST be a single, valid JSON object. Do not include any other text or markdown formatting like \`\`\`json.
3.	The JSON object must have a single key: "translations".
4.	The value of "translations" MUST be a JSON array of objects.
5.	Each object in the array MUST have two keys: "id" (the original 1-based line number as an integer) and "t" (the translated text as a string).
6.	You MUST provide a corresponding JSON object for EVERY line number from 1 to ${textCount}. This is the most important rule. If you cannot translate a line, you MUST still include its object with an empty string for the "t" value (e.g., { "id": 5, "t": "" }).
7.	Do not omit any line. The final array must contain ${textCount} objects.
8.	Do not merge lines. Maintain a one-to-one mapping.
Example for 3 input lines:
Input:
1.	Hello
2.	How are you?
3.	I am fine.
Correct JSON Output:
{
  "translations": [
    { "id": 1, "t": "سلام" },
    { "id": 2, "t": "حالت چطوره؟" },
    { "id": 3, "t": "من خوبم." }
  ]
}
`;

const CUSTOM_SYSTEM_INSTRUCTION = (textCount: number, customPromptText: string, namesGuide: string) => `
You are an expert subtitle translator. Follow the user's custom instructions to translate text.
${NAMES_GUIDE_SECTION(namesGuide)}
**CRITICAL RULES:**
1.  You will be given a list of ${textCount} numbered subtitle lines to translate.
2.  Your response MUST be a single, valid JSON object. Do not include any other text or markdown formatting like \`\`\`json.
3.  The JSON object must have a single key: "translations".
4.  The value of "translations" MUST be a JSON array of objects.
5.  Each object in the array MUST have two keys: "id" (the original 1-based line number as an integer) and "t" (the translated text as a string).
6.  **You MUST provide a corresponding JSON object for EVERY line number from 1 to ${textCount}.** This is the most important rule. If you cannot translate a line, you MUST still include its object with an empty string for the "t" value (e.g., \`{ "id": 5, "t": "" }\`).
7.  Do not omit any line. The final array must contain ${textCount} objects.
8.  Do not merge lines. Maintain a one-to-one mapping.

**Example for 3 input lines:**
Input:
1. Hello
2. How are you?
3. I am fine.

Correct JSON Output:
{
  "translations": [
    { "id": 1, "t": "سلام" },
    { "id": 2, "t": "حالت چطوره؟" },
    { "id": 3, "t": "من خوبم." }
  ]
}

**User's Custom Instruction:** "${customPromptText}"
`;


export const checkModelStatus = async (apiKey: string, modelName: string): Promise<'available' | 'error'> => {
  if (!apiKey || apiKey.trim() === '') {
    return 'error';
  }
  try {
    const ai = new GoogleGenAI({ apiKey });
    // A lightweight call to check for model accessibility.
    // We don't care about the response, only if it throws an error.
    await ai.models.generateContent({
        model: modelName,
        contents: "test",
        config: { maxOutputTokens: 1 }
    });
    return 'available';
  } catch (error) {
    // console.error(`Error checking model ${modelName}:`, error);
    return 'error';
  }
};


export const translateChunk = async (
  texts: string[],
  promptConfig: PromptConfig,
  modelName: string,
  namesGuide: string,
  temperature: number,
  apiKey: string,
): Promise<string[]> => {

  if (!apiKey || apiKey.trim() === '') {
    throw new Error("کلید API معتبری برای این درخواست ارائه نشده است.");
  }
  const ai = new GoogleGenAI({ apiKey });

  // Use a numbered list for clearer input structure, collapsing newlines within a single subtitle entry.
  const numberedTexts = texts.map((text, index) => `${index + 1}. ${text.replace(/\n/g, ' ')}`).join('\n');
  const promptContent = `Please translate the following ${texts.length} subtitle lines into conversational Persian:\n\n${numberedTexts}`;

  const systemInstruction = promptConfig.mode === 'default'
    ? DEFAULT_SYSTEM_INSTRUCTION(texts.length, namesGuide)
    : CUSTOM_SYSTEM_INSTRUCTION(texts.length, promptConfig.customText, namesGuide);
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      translations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: {
              type: Type.INTEGER,
              description: 'The original 1-based index number of the text line from the input.',
            },
            t: {
              type: Type.STRING,
              description: 'The translated text. Should be an empty string if no translation is possible.',
            }
          },
          required: ['id', 't'],
        },
        description: `An array of translation objects. It should contain exactly ${texts.length} objects, one for each input line.`,
      },
    },
    required: ['translations'],
  };

  const modelConfig: { [key: string]: any } = {
    systemInstruction: systemInstruction,
    temperature: temperature,
    responseMimeType: "application/json",
    responseSchema: schema,
  };
  
  try {
    const response = await ai.models.generateContent({
        model: modelName,
        contents: promptContent,
        config: modelConfig,
    });
    
    const text = response.text;
    if (!text || !text.trim()) {
        const finishReason = response.candidates?.[0]?.finishReason;
        const safetyRatings = response.candidates?.[0]?.safetyRatings;
        let errorMessage = `API پاسخی متنی تولید نکرد`;
        if (finishReason) {
            errorMessage += ` (دلیل: ${finishReason})`;
        }
        if (finishReason === 'SAFETY') {
            errorMessage = 'درخواست به دلیل سیاست‌های ایمنی مسدود شد.';
        }
        console.error("API response was empty.", { finishReason, safetyRatings, response });
        throw new Error(errorMessage);
    }

    let responseJson;
    try {
        const jsonString = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        responseJson = JSON.parse(jsonString);
    } catch(e) {
        console.error("Failed to parse JSON response.", { response: text, error: e });
        throw new Error(`پاسخ دریافت شده از API در فرمت JSON معتبر نبود. پاسخ: ${text}`);
    }

    const translationsFromApi = responseJson.translations;

    if (!Array.isArray(translationsFromApi)) {
        console.error("The 'translations' key from the API is not an array.", { response: text });
        throw new Error(`پاسخ API فرمت نامعتبر دارد: کلید 'translations' یک آرایه نیست.`);
    }
    
    const finalTranslations: string[] = new Array(texts.length).fill('');

    for (const item of translationsFromApi) {
        if (
            typeof item === 'object' &&
            item !== null &&
            typeof item.id === 'number' &&
            item.id > 0 &&
            item.id <= texts.length &&
            typeof item.t === 'string'
        ) {
            finalTranslations[item.id - 1] = item.t;
        } else {
            console.warn("Skipping invalid or out-of-bounds translation item from API:", item);
        }
    }

    return finalTranslations;

  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
        throw new Error(`خطا در فراخوانی API ترجمه: ${error.message}`);
    }
    throw new Error("یک خطای ناشناخته در حین ترجمه رخ داد.");
  }
};
