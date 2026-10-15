/* =================================================================
   НАСТРОЙКИ САЙТА konkos.design - правится только этот файл.
   ================================================================= */
window.KD = {

  /* Цена (показывается на сайте, в чеке и в FAQ) */
  price: 350,
  currency: "€",

  /* РАБОЧИЕ контакты - не личные!
     Пустая строка "" = кнопка этого канала не показывается.
     phone:    номер как показывать, с кодом страны, напр. "+380 67 123 45 67"
     whatsapp: номер цифрами с кодом страны, без "+" и пробелов, напр. "380671234567"
     telegram: имя пользователя без "@"
     instagram: имя пользователя без "@"
     facebook: полная ссылка на профиль/страницу
     email: рабочая почта                                              */
  contacts: {
    phone:     "+380 97 297 4001",
    email:     "konkos.design@gmail.com",
    whatsapp:  "380972974001",
    telegram:  "konkosdesign",
    instagram: "konkos.design",
    facebook:  "https://www.facebook.com/profile.php?id=61595298959880"
  },

  /* Портфолио. Ссылки на сайты на странице НЕ показываются -
     они нужны только для живого просмотра внутри телефона.
     trade: auto | dental | clinic      country: au | ie | ua
     url: "" = без живого просмотра (только скриншоты)            */
  base: "https://konkos-design.github.io/",
  works: [
    { id: "tow-m8",        repo: "tow-m8",                         name: "TOW M8 24/7",                    trade: "auto",   country: "au", lang: "en",
      idea: { en: "Night-shift hero, one tap to the dispatcher", ua: "Нічний герой і дзвінок диспетчеру в один дотик" } },
    { id: "yasnovsky",     repo: "ydc-dental",                     name: "Yasnovsky Dental Clinic",        trade: "dental", country: "ua", lang: "uk",
      idea: { en: "Price list you can search in a second", ua: "Прайс, у якому шукаєш за секунду" } },
    { id: "newcastle-vw",  repo: "newcastle-vw-centre",            name: "Newcastle VW Centre",            trade: "auto",   country: "au", lang: "en",
      idea: { en: "Dealer-grade look for a VW & Audi specialist", ua: "Дилерський рівень для спеціаліста VW та Audi" } },
    { id: "as-aesthetic",  repo: "as-aesthetic-clinic",            name: "AS Aesthetic Clinic",            trade: "clinic", country: "ie", lang: "en",
      idea: { en: "Quiet serif luxury for a skin clinic", ua: "Тиха розкіш із засічками для естетичної клініки" } },
    { id: "brothers",      repo: "brothers-auto-smash-repairs",    name: "Brothers Auto Smash Repairs",    trade: "auto",   country: "au", lang: "en",
      idea: { en: "Drag the slider: dent before, shine after", ua: "Тягни повзунок: вм'ятина до, блиск після" } },
    { id: "dental-lviv",   repo: "dental-lviv",                    name: "Dental Lviv",                    trade: "dental", country: "ua", lang: "uk",
      idea: { en: "Transparent prices, bold condensed type", ua: "Прозорі ціни і щільна виразна типографіка" } },
    { id: "car-station",   repo: "car-station-site",               name: "Car Station – GBC",              trade: "auto",   country: "au", lang: "en",
      idea: { en: "Departure board for pink & blue slips", ua: "Табло вильотів для техоглядів" } },
    { id: "nursehub",      repo: "nursehub-health-aesthetics",     name: "NurseHub Health & Aesthetics",   trade: "clinic", country: "ie", lang: "en",
      idea: { en: "Health or aesthetics: pick your path", ua: "Здоров'я чи естетика: обираєш свій шлях" } },
    { id: "davids",        repo: "davids-auto-electrics",          name: "David's Auto Electrics",         trade: "auto",   country: "au", lang: "en",
      idea: { en: "Wired right since 1987, 12V/24V styling", ua: "Стиль 12V/24V для автоелектрика з 1987 року" } },
    { id: "sobko",         repo: "viktoria-sobko-dentist",         name: "Dentist Viktoria Sobko",         trade: "dental", country: "ua", lang: "uk",
      idea: { en: "A calm page for a doctor people trust", ua: "Спокійна сторінка для лікаря, якому довіряють" } },
    { id: "eddies",        repo: "eddies-workshop",                name: "Eddie's Workshop",               trade: "auto",   country: "au", lang: "en",
      idea: { en: "Diagnostics screen that finds the fault", ua: "Екран діагностики, що знаходить несправність" } },
    { id: "wollongong",    repo: "wollongong-tyres-auto-repairs",  name: "Wollongong Tyres & Auto Repairs", trade: "auto",  country: "au", lang: "en",
      idea: { en: "A tyre that spins as you scroll", ua: "Шина, що крутиться під час прокрутки" } },
    { id: "dv-mobile",     repo: "dv-mobile-auto-electrics",       name: "DV Mobile Auto Electrics",       trade: "auto",   country: "au", lang: "en",
      idea: { en: "24/7 call-out board for trucks & plant", ua: "Цілодобові виклики для вантажівок і техніки" } },
    { id: "ploshchynskyh", repo: "ploshchynskyh-dental",           name: "Dental Clinic Ploshchynskyh",    trade: "dental", country: "ua", lang: "uk",
      idea: { en: "Family dentistry, soft and friendly", ua: "Сімейна стоматологія, м'яко і дружньо" } },
    { id: "jm-auto",       repo: "jm-auto-repairs",                name: "JM Auto Repairs",                trade: "auto",   country: "au", lang: "en",
      idea: { en: "Drag to look around the workshop", ua: "Тягни, щоб оглянути майстерню" } },
    { id: "penrith-ae",    repo: "penrith-auto-electrical",        name: "Penrith Auto Electrical",        trade: "auto",   country: "au", lang: "en",
      idea: { en: "Every wire, every fault, found", ua: "Кожен дріт, кожна несправність знайдена" } },
    { id: "ryde",          repo: "ryde-automotives",               name: "Ryde Automotives",               trade: "auto",   country: "au", lang: "en",
      idea: { en: "The red street sign, rebuilt as a website", ua: "Червона вивіска, перетворена на сайт" } },
    { id: "a2z",           repo: "a2z-mobile-mechanics",           name: "A2Z Mobile Mechanics",           trade: "auto",   country: "au", lang: "en",
      idea: { en: "The workshop comes to your driveway", ua: "Майстерня приїжджає до вашого двору" } },
    { id: "dantyst-lk",    repo: "dantyst-lk",                     name: "Dantyst-LK",                     trade: "dental", country: "ua", lang: "uk",
      idea: { en: "More care, more reasons to smile", ua: "Більше турботи, більше приводів усміхатися" } },
    { id: "mm-auto",       repo: "mm-auto-site",                   name: "M&M Auto Repair Centre",         trade: "auto",   country: "au", lang: "en",
      idea: { en: "Euro & all-makes, in English and Farsi", ua: "Європейські й усі марки, англійською та фарсі" } },
    { id: "mr-auto",       repo: "mr.autoosbornepark",             name: "Mr Auto Osborne Park",           trade: "auto",   country: "au", lang: "en",
      idea: { en: "A rating gauge instead of a hero photo", ua: "Шкала рейтингу замість фото в шапці" } },
    { id: "blacktown",     repo: "Reliable-Auto-Repair-in-Kings-Park", name: "Blacktown Automotive Services", trade: "auto", country: "au", lang: "en",
      idea: { en: "Family-owned since 1999, call in one tap", ua: "Сімейний сервіс з 1999 року, дзвінок в один дотик" } },
    { id: "sg-automotive", repo: "",                               name: "SG Automotive",                  trade: "auto",   country: "au", lang: "en",
      idea: { en: "Two trades, one crew, one call", ua: "Два напрямки, одна команда, один дзвінок" } }
  ]
};
