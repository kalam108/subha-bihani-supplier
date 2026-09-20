import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ne';
export type Currency = 'NPR' | 'USD';

export interface CurrencyContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  exchangeRate: number; // 1 USD = X NPR
  setExchangeRate: (rate: number) => void;
  formatMoney: (amountInUSD: number, overrideCurrency?: Currency) => string;
  convertAmount: (amount: number, from: Currency, to: Currency, customRate?: number) => number;
  useDevanagariNumerals: boolean;
  setUseDevanagariNumerals: (val: boolean) => void;
  toDevanagari: (input: string | number) => string;
  numberToNepaliWords: (amountInNpr: number) => string;
  numberToEnglishWords: (amountInNpr: number) => string;
  isConverterOpen: boolean;
  openConverter: () => void;
  closeConverter: () => void;
  t: (key: string, fallback?: string) => string;
}

const DEFAULT_EXCHANGE_RATE = 134.5; // 1 USD = 134.50 NPR (Nepal Rastra Bank benchmark)

// Comprehensive English & Nepali translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Top Bar & Utility
    emergencySupport: 'Emergency Support',
    commercialDistributor: 'Commercial Distributor & Licensed Contractor Services',
    currencyConverter: 'Converter',
    nepaliRupees: 'Nepali Rupees (NPR)',
    usDollars: 'US Dollars (USD)',
    english: 'English',
    nepali: 'नेपाली',

    // Navigation
    home: 'Home',
    products: 'Products',
    services: 'Services',
    about: 'About',
    contact: 'Contact',
    cart: 'Cart',
    orders: 'Orders',
    admin: 'Admin',
    login: 'Login',
    logout: 'Logout',
    profile: 'Profile',
    storefront: 'Storefront',

    // Hero Section
    heroBadge: 'Commercial Distributor & Licensed Field Contractors',
    heroTitle: 'High-Grade Supplies & Certified Field Services',
    heroSubtitle:
      'Subbha Bihani Suppliers delivers certified electrical cables, heavy-duty switchgear, CPVC/PPR pressure pipelines, and hardware to contractors, commercial sites, and residential builders — backed by licensed technician dispatch.',
    searchPlaceholder: 'Search products, electrical cables, pipes, or tools...',
    exploreSupplies: 'Explore Supplies',
    bookTechnician: 'Book Technician',
    verifiedQuality: '100% Certified Supplies',
    fastDispatch: 'Jobsite Delivery',
    emergencyHotline: 'Emergency Dispatch',

    // Product Section
    featuredSupplies: 'Featured Supplies',
    allCategories: 'All Categories',
    inStock: 'In stock',
    outOfStock: 'Out of stock',
    onlyLeft: 'Only {count} left',
    addToCart: 'Add to Cart',
    added: 'Added!',
    viewDetails: 'View Details',
    specs: 'Specifications',
    unit: 'Unit',
    sku: 'SKU',
    rating: 'Rating',
    reviews: 'Reviews',
    price: 'Price',
    sort: 'Sort',
    featuredFirst: 'Featured First',
    priceLowHigh: 'Price: Low to High',
    priceHighLow: 'Price: High to Low',
    inStockOnly: 'In-Stock Only',

    // Services Section
    licensedServices: 'Professional Technical Services',
    servicesSubtitle:
      'Certified master electricians and licensed plumbing technicians dispatched across the valley for residential, commercial, and emergency contractor assignments.',
    standardRate: 'Standard Rate',
    estimatedDuration: 'Est. Duration',
    requestService: 'Book Service Now',
    electrical: 'Electrical',
    plumbing: 'Plumbing',
    hardware: 'Hardware',
    tools: 'Tools',

    // Cart & Checkout
    shoppingCart: 'Shopping Cart',
    emptyCart: 'Your Cart is Empty',
    browseSupplies: 'Browse Products & Supplies',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    vatTax: 'Estimated VAT (13%)',
    shipping: 'Jobsite Dispatch / Shipping',
    freeShipping: 'Free Delivery',
    total: 'Total Amount',
    proceedToCheckout: 'Proceed to Checkout',
    checkoutTitle: 'Delivery & Payment Checkout',
    customerInformation: 'Customer Information',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number (e.g. +977 98XXXXXXXX)',
    deliveryAddress: 'Jobsite / Delivery Address',
    cityArea: 'City / District',
    paymentMethod: 'Payment Method',
    cashOnDelivery: 'Cash on Delivery (COD)',
    bankTransfer: 'Direct Bank Wire (Nabil / NIC Asia)',
    storePickup: 'Warehouse Counter Pickup (Teku / Kuleshwor)',
    digitalWallet: 'Digital Wallet (eSewa / Khalti / Fonepay)',
    placeOrder: 'Confirm & Place Order',
    continueShopping: 'Continue Shopping',
    clearAll: 'Clear All Items',

    // Order & Tracking
    orderTracker: 'Order Tracking & Invoices',
    orderNumber: 'Order #',
    orderStatus: 'Status',
    date: 'Date',
    purchasedItems: 'Purchased Supplies',
    invoice: 'Tax Invoice',

    // Converter Modal
    converterTitle: 'English & Nepali Currency Converter',
    converterSubtitle: 'Instant calculation between Nepali Rupees (रू NPR) and US Dollars ($ USD) with official NRB benchmark rates.',
    usdAmount: 'US Dollars ($ USD)',
    nprAmount: 'Nepali Rupees (रू NPR)',
    currentRate: 'Official Benchmark Rate: $1.00 USD = रू 134.50 NPR',
    applyNprToStore: 'Set Store Currency to Nepali Rupees (रू)',
    applyUsdToStore: 'Set Store Currency to US Dollars ($)',
    nepaliWordsLabel: 'Amount in Nepali Words (अक्षरमा):',
    englishWordsLabel: 'Amount in English Words:',
    quickPresets: 'Quick Construction & Supply Presets',
    glossaryTab: 'Technical Glossary (EN ⇄ NE)',
    converterTab: 'Currency Converter',
    numeralToggle: 'Use Devanagari Numerals (१, २, ३...)',
  },
  ne: {
    // Top Bar & Utility
    emergencySupport: 'आपतकालीन सहयोग',
    commercialDistributor: 'अधिकृत वितरक तथा दक्ष प्राविधिक सेवाहरू',
    currencyConverter: 'मुद्रा क्याल्कुलेटर',
    nepaliRupees: 'नेपाली रुपैयाँ (रू)',
    usDollars: 'अमेरिकी डलर ($ USD)',
    english: 'English',
    nepali: 'नेपाली',

    // Navigation
    home: 'गृहपृष्ठ',
    products: 'सामग्रीहरू',
    services: 'प्राविधिक सेवा',
    about: 'हाम्रोबारे',
    contact: 'सम्पर्क',
    cart: 'झोला',
    orders: 'अर्डरहरू',
    admin: 'प्रशासन',
    login: 'लगइन',
    logout: 'लगआउट',
    profile: 'मेरो प्रोफाइल',
    storefront: 'ग्राहक स्टोर',

    // Hero Section
    heroBadge: 'अधिकृत थोक वितरक तथा दक्ष फिल्ड प्राविधिक',
    heroTitle: 'उच्च गुणस्तरीय निर्माण सामग्री तथा प्राविधिक सेवा',
    heroSubtitle:
      'सुब्बा बिहानी सप्लायर्सले प्रमाणित विद्युतीय तार, उच्च क्षमताका एमसीबी/स्विच, सिपिभिसी/पिपिआर पाइप र हार्डवेयर निर्माण सामग्रीहरू साइटमै पुर्याउँदछ — दक्ष प्राविधिक सेवा सहित।',
    searchPlaceholder: 'तार, पाइप, स्विच, औजार वा सामग्री खोज्नुहोस्...',
    exploreSupplies: 'सामग्रीहरू हेर्नुहोस्',
    bookTechnician: 'प्राविधिक बुक गर्नुहोस्',
    verifiedQuality: '१००% प्रमाणित गुणस्तर',
    fastDispatch: 'साइटमै डेलिभरी',
    emergencyHotline: 'आपतकालीन सेवा',

    // Product Section
    featuredSupplies: 'विशेष सिफारिस सामग्रीहरू',
    allCategories: 'सबै वर्गहरू',
    inStock: 'उपलब्ध छ',
    outOfStock: 'स्टक सकियो',
    onlyLeft: 'बाँकी {count} मात्र',
    addToCart: 'झोलामा थप्नुहोस्',
    added: 'थपियो!',
    viewDetails: 'विवरण हेर्नुहोस्',
    specs: 'विशिष्ट विवरण',
    unit: 'एकाइ',
    sku: 'एसकेयु (SKU)',
    rating: 'मूल्याङ्कन',
    reviews: 'समीक्षाहरू',
    price: 'मूल्य',
    sort: 'क्रमबद्ध',
    featuredFirst: 'विशेष सामग्री पहिले',
    priceLowHigh: 'मूल्य: कम देखि बढी',
    priceHighLow: 'मूल्य: बढी देखि कम',
    inStockOnly: 'स्टक भएको मात्र',

    // Services Section
    licensedServices: 'व्यावसायिक प्राविधिक सेवाहरू',
    servicesSubtitle:
      'विद्युत वाइरिङ, पाइप फिटिङ, चुहावट मर्मत तथा अन्य प्राविधिक कार्यका लागि उपत्यकाभर दक्ष इलेक्ट्रिसियन तथा प्लम्बरहरू उपलब्ध छन्।',
    standardRate: 'मानक दर',
    estimatedDuration: 'लाग्ने समय',
    requestService: 'सेवा बुक गर्नुहोस्',
    electrical: 'विद्युतीय सामग्री',
    plumbing: 'प्लम्बिङ',
    hardware: 'हार्डवेयर',
    tools: 'औजारहरू',

    // Cart & Checkout
    shoppingCart: 'खरिद झोला (कार्ट)',
    emptyCart: 'तपाईंको झोला खाली छ',
    browseSupplies: 'सामग्रीहरू हेर्नुहोस्',
    orderSummary: 'अर्डर सारांश',
    subtotal: 'सामग्री उप-योग',
    vatTax: 'मूल्य अभिवृद्धि कर (१३% भ्याट)',
    shipping: 'साइट ढुवानी / डेलिभरी',
    freeShipping: 'निःशुल्क डेलिभरी',
    total: 'जम्मा कुल रकम',
    proceedToCheckout: 'भुक्तानी अगाडि बढाउनुहोस्',
    checkoutTitle: 'डेलिभरी तथा भुक्तानी विवरण',
    customerInformation: 'ग्राहकको जानकारी',
    fullName: 'पूरा नाम',
    phoneNumber: 'सम्पर्क फोन (उदा. ९८XXXXXXXX)',
    deliveryAddress: 'डेलिभरी ठेगाना / निर्माण साइट',
    cityArea: 'शहर / जिल्ला',
    paymentMethod: 'भुक्तानीको माध्यम',
    cashOnDelivery: 'सामग्री पाएपछि भुक्तानी (Cash on Delivery)',
    bankTransfer: 'बैंक ट्रान्सफर (नबिल / एनआईसी एसिया)',
    storePickup: 'स्टोर काउन्टरमै संकलन (टेकु / कुलेश्वर)',
    digitalWallet: 'डिजिटल वालेट (eSewa / Khalti / Fonepay)',
    placeOrder: 'अर्डर निश्चित गर्नुहोस्',
    continueShopping: 'थप किनमेल गर्नुहोस्',
    clearAll: 'सबै सामग्री हटाउनुहोस्',

    // Order & Tracking
    orderTracker: 'अर्डर ट्र्याकिङ तथा इनभ्वाइस',
    orderNumber: 'अर्डर नं.',
    orderStatus: 'अवस्था',
    date: 'मिति',
    purchasedItems: 'खरिद गरिएका सामग्रीहरू',
    invoice: 'कर बीजक (Tax Invoice)',

    // Converter Modal
    converterTitle: 'अंग्रेजी र नेपाली मुद्रा क्याल्कुलेटर',
    converterSubtitle: 'नेपाली रुपैयाँ (रू) र अमेरिकी डलर ($) बीच तत्काल रूपान्तरण गर्नुहोस्।',
    usdAmount: 'अमेरिकी डलर ($ USD)',
    nprAmount: 'नेपाली रुपैयाँ (रू NPR)',
    currentRate: 'मानक विनिमय दर: $१.०० = रू १३४.५०',
    applyNprToStore: 'स्टोर मुद्रा नेपाली रुपैयाँ (रू) मा बदल्नुहोस्',
    applyUsdToStore: 'स्टोर मुद्रा अमेरिकी डलर ($) मा बदल्नुहोस्',
    nepaliWordsLabel: 'अक्षरमा रकम (नेपाली):',
    englishWordsLabel: 'अक्षरमा रकम (अंग्रेजी):',
    quickPresets: 'निर्माण सामग्री द्रुत रकमहरू',
    glossaryTab: 'प्राविधिक शब्दावली (EN ⇄ NE)',
    converterTab: 'मुद्रा क्याल्कुलेटर',
    numeralToggle: 'नेपाली अंक प्रयोग गर्नुहोस् (१, २, ३...)',
  },
};

const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export const toDevanagari = (input: string | number): string => {
  return String(input).replace(/[0-9]/g, (w) => DEVANAGARI_DIGITS[parseInt(w, 10)]);
};

// Convert number to South Asian / Nepali format (e.g., 1,25,000)
export const formatNepaliCurrencyNumber = (num: number, useDevanagari = false): string => {
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const fixed = absNum.toFixed(2);
  const parts = fixed.split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  // South Asian grouping: last 3 digits, then groups of 2 digits
  let result = '';
  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    const groupedOthers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = `${groupedOthers},${lastThree}`;
  } else {
    result = integerPart;
  }

  // If integer has no decimals or decimal is .00, we can omit or keep .00
  const finalStr = decimalPart === '00' ? result : `${result}.${decimalPart}`;
  const signedStr = (isNegative ? '-' : '') + finalStr;

  return useDevanagari ? toDevanagari(signedStr) : signedStr;
};

// Nepali words dictionary helper
const onesNe = [
  '', 'एक', 'दुई', 'तीन', 'चार', 'पाँच', 'छ', 'सात', 'आठ', 'नौ',
  'दश', 'एघार', 'बाह्र', 'तेह्र', 'चौध', 'पन्ध्र', 'सोह्र', 'सत्र', 'अठार', 'उन्नाइस',
  'बीस', 'एक्काइस', 'बाइस', 'तेइस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताइस', 'अठ्ठाइस', 'उनन्तीस',
  'तीस', 'एकतीस', 'बत्तीस', 'तेत्तीस', 'चौतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अठतीस', 'उनन्चालीस',
  'चालीस', 'एकचालीस', 'बयालीस', 'त्रियालीस', 'चवालीस', 'पैंतालीस', 'छयालीस', 'सत्तालीस', 'अठचालीस', 'उनन्चास',
  'पचास', 'एकाउन्न', 'बाउन्न', 'त्रिपन्न', 'चौवन्न', 'पचपन्न', 'छपन्न', 'सन्ताउन्न', 'अन्ठाउन्न', 'उनन्सठ्ठी',
  'साठी', 'एकसट्ठी', 'बासट्ठी', 'त्रिसट्ठी', 'चौंसट्ठी', 'पैंसट्ठी', 'छयसट्ठी', 'सत्सट्ठी', 'अठसट्ठी', 'उनन्सत्तरी',
  'सत्तरी', 'एकहत्तर', 'बहत्तर', 'त्रिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छयहत्तर', 'सतहत्तर', 'अठहत्तर', 'उनासी',
  'असी', 'एकासी', 'बयासी', 'त्रियासी', 'चौरासी', 'पचासी', 'छयासी', 'सतासी', 'अठासी', 'उनान्नब्बे',
  'नब्बे', 'एकान्नब्बे', 'बयानब्बे', 'त्रियान्नब्बे', 'चौरान्नब्बे', 'पञ्चानब्बे', 'छयान्नब्बे', 'सन्तानब्बे', 'अन्ठानब्बे', 'उनान्सय'
];

export const numberToNepaliWords = (amount: number): string => {
  const n = Math.floor(Math.abs(amount));
  if (n === 0) return 'शून्य रुपैयाँ मात्र';

  let remaining = n;
  const parts: string[] = [];

  // Crores (करोड) - 1,00,00,000
  const crore = Math.floor(remaining / 10000000);
  if (crore > 0) {
    parts.push(`${crore < 100 ? onesNe[crore] : crore} करोड`);
    remaining %= 10000000;
  }

  // Lakhs (लाख) - 1,00,000
  const lakh = Math.floor(remaining / 100000);
  if (lakh > 0) {
    parts.push(`${lakh < 100 ? onesNe[lakh] : lakh} लाख`);
    remaining %= 100000;
  }

  // Thousands (हजार) - 1,000
  const thousand = Math.floor(remaining / 1000);
  if (thousand > 0) {
    parts.push(`${thousand < 100 ? onesNe[thousand] : thousand} हजार`);
    remaining %= 1000;
  }

  // Hundreds (सय) - 100
  const hundred = Math.floor(remaining / 100);
  if (hundred > 0) {
    parts.push(`${onesNe[hundred]} सय`);
    remaining %= 100;
  }

  // Tens and units
  if (remaining > 0) {
    parts.push(onesNe[remaining]);
  }

  return `${parts.join(' ')} रुपैयाँ मात्र`;
};

export const numberToEnglishWords = (amount: number): string => {
  const n = Math.floor(Math.abs(amount));
  if (n === 0) return 'Zero Rupees Only';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertTwoDigits = (num: number): string => {
    if (num < 20) return ones[num];
    const t = Math.floor(num / 10);
    const o = num % 10;
    return tens[t] + (o > 0 ? ` ${ones[o]}` : '');
  };

  const parts: string[] = [];
  let remaining = n;

  // Crore (10 Million)
  const crore = Math.floor(remaining / 10000000);
  if (crore > 0) {
    parts.push(`${convertTwoDigits(crore)} Crore`);
    remaining %= 10000000;
  }

  // Lakh (100 Thousand)
  const lakh = Math.floor(remaining / 100000);
  if (lakh > 0) {
    parts.push(`${convertTwoDigits(lakh)} Lakh`);
    remaining %= 100000;
  }

  // Thousand
  const thousand = Math.floor(remaining / 1000);
  if (thousand > 0) {
    parts.push(`${convertTwoDigits(thousand)} Thousand`);
    remaining %= 1000;
  }

  // Hundred
  const hundred = Math.floor(remaining / 100);
  if (hundred > 0) {
    parts.push(`${ones[hundred]} Hundred`);
    remaining %= 100;
  }

  if (remaining > 0) {
    parts.push(convertTwoDigits(remaining));
  }

  return `${parts.join(' ')} Nepali Rupees Only`;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const LanguageCurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Stored language
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('sbs_language');
      return saved === 'ne' || saved === 'en' ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  // Stored currency - Default to Nepali Rupees (NPR) as requested
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('sbs_currency');
      return saved === 'USD' || saved === 'NPR' ? saved : 'NPR';
    } catch {
      return 'NPR';
    }
  });

  // Exchange rate
  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sbs_exchange_rate');
      return saved ? parseFloat(saved) : DEFAULT_EXCHANGE_RATE;
    } catch {
      return DEFAULT_EXCHANGE_RATE;
    }
  });

  const [useDevanagariNumerals, setUseDevanagariNumeralsState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sbs_devanagari_nums') === 'true';
    } catch {
      return false;
    }
  });

  const [isConverterOpen, setIsConverterOpen] = useState(false);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('sbs_language', lang);
    } catch {}
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    try {
      localStorage.setItem('sbs_currency', curr);
    } catch {}
  };

  const setExchangeRateSafe = (rate: number) => {
    if (rate <= 0 || isNaN(rate)) return;
    setExchangeRate(rate);
    try {
      localStorage.setItem('sbs_exchange_rate', String(rate));
    } catch {}
  };

  const setUseDevanagariNumerals = (val: boolean) => {
    setUseDevanagariNumeralsState(val);
    try {
      localStorage.setItem('sbs_devanagari_nums', String(val));
    } catch {}
  };

  const convertAmount = (amount: number, from: Currency, to: Currency, customRate?: number): number => {
    const rate = customRate || exchangeRate;
    if (from === to) return amount;
    if (from === 'USD' && to === 'NPR') {
      return amount * rate;
    }
    if (from === 'NPR' && to === 'USD') {
      return amount / rate;
    }
    return amount;
  };

  /**
   * Format money nicely. All product prices in database are in USD base ($).
   * If target is NPR, converts using exchangeRate and displays with रू symbol.
   */
  const formatMoney = (amountInUSD: number, overrideCurrency?: Currency): string => {
    const target = overrideCurrency || currency;

    if (target === 'USD') {
      const formatted = amountInUSD.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `$${formatted}`;
    }

    // Target is NPR
    const nprAmount = amountInUSD * exchangeRate;
    const formattedNumber = formatNepaliCurrencyNumber(nprAmount, language === 'ne' && useDevanagariNumerals);
    return `रू ${formattedNumber}`;
  };

  // Translation helper
  const t = (key: string, fallback?: string): string => {
    const currentDict = translations[language] || translations.en;
    if (currentDict[key]) {
      return currentDict[key];
    }
    const enDict = translations.en;
    if (enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  const openConverter = () => setIsConverterOpen(true);
  const closeConverter = () => setIsConverterOpen(false);

  return (
    <CurrencyContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        exchangeRate,
        setExchangeRate: setExchangeRateSafe,
        formatMoney,
        convertAmount,
        useDevanagariNumerals,
        setUseDevanagariNumerals,
        toDevanagari,
        numberToNepaliWords,
        numberToEnglishWords,
        isConverterOpen,
        openConverter,
        closeConverter,
        t,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a LanguageCurrencyProvider');
  }
  return context;
};
