import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRightLeft,
  DollarSign,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
  SlidersHorizontal,
  Info,
  ExternalLink,
  Search,
} from 'lucide-react';
import { useCurrency, formatNepaliCurrencyNumber } from '../context/LanguageCurrencyContext';

interface GlossaryItem {
  en: string;
  ne: string;
  siteSlang?: string;
  category: 'Electrical' | 'Plumbing' | 'Hardware' | 'General';
}

const GLOSSARY_TERMS: GlossaryItem[] = [
  { en: 'Circuit Breaker (MCB)', ne: 'सर्किट ब्रेकर', siteSlang: 'कटआउट / एमसीबी', category: 'Electrical' },
  { en: 'Copper Wire / Cable', ne: 'तामाको विद्युतीय तार', siteSlang: 'वाइरिङ तार', category: 'Electrical' },
  { en: 'Switch & Socket Plate', ne: 'स्विच तथा सकेट प्लेट', siteSlang: 'मोड्युलर बोर्ड', category: 'Electrical' },
  { en: 'Conduit Pipe', ne: 'कन्डुइट पाइप', siteSlang: 'तार हाल्ने पाइप', category: 'Electrical' },
  { en: 'Distribution Board (DB)', ne: 'मुख्य वितरण बोर्ड', siteSlang: 'डीबी बक्स', category: 'Electrical' },
  { en: 'LED Panel Light', ne: 'एलईडी प्यानल बत्ती', siteSlang: 'सिलिङ लाइट', category: 'Electrical' },
  { en: 'CPVC Pressure Pipe', ne: 'सिपिभिसी उच्च चाप पाइप', siteSlang: 'तातो-चिसो पानी पाइप', category: 'Plumbing' },
  { en: 'PPR Hot Water Pipe', ne: 'पिपिआर तातोपानी पाइप', siteSlang: 'पिपिआर फिटिङ', category: 'Plumbing' },
  { en: 'Ball Valve / Stop Cock', ne: 'बल भल्भ / पानी नियन्त्रक', siteSlang: 'स्टप कक / भल्भ', category: 'Plumbing' },
  { en: 'Brass Bib Cock / Tap', ne: 'पित्तलको धारा', siteSlang: 'टुटी / धारा', category: 'Plumbing' },
  { en: 'Teflon Tape', ne: 'टेफलन सिल टेप', siteSlang: 'धागो टेप', category: 'Plumbing' },
  { en: 'Water Storage Tank', ne: 'पानी ट्याङ्की', siteSlang: 'रिजर्भ ट्याङ्की', category: 'Plumbing' },
  { en: 'Pipe Wrench', ne: 'पाइप रेन्च', siteSlang: 'सन्नासो / रेन्च', category: 'Hardware' },
  { en: 'Hammer Drill', ne: 'ह्यामर ड्रिल मेसिन', siteSlang: 'प्वाल पार्ने मेसिन', category: 'Hardware' },
  { en: 'Hex Bolt & Nut', ne: 'हेक्स नट-बोल्ट', siteSlang: 'नट-बोल्टु', category: 'Hardware' },
  { en: 'Wall Anchor / Rawlplug', ne: 'वाल एन्कर / गिट्टी', siteSlang: 'प्लास्टिक गिट्टी', category: 'Hardware' },
  { en: 'Tax Invoice / VAT Bill', ne: 'कर बीजक / भ्याट बिल', siteSlang: 'पक्का बिल', category: 'General' },
  { en: 'Cash on Delivery (COD)', ne: 'सामग्री बुझेर भुक्तानी', siteSlang: 'हातहातै पैसा', category: 'General' },
];

export const CurrencyConverterModal: React.FC = () => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    exchangeRate,
    setExchangeRate,
    toDevanagari,
    numberToNepaliWords,
    numberToEnglishWords,
    isConverterOpen,
    closeConverter,
    useDevanagariNumerals,
    setUseDevanagariNumerals,
    t,
  } = useCurrency();

  const [activeTab, setActiveTab] = useState<'converter' | 'glossary' | 'settings'>('converter');

  // Input states
  const [usdInput, setUsdInput] = useState<string>('100');
  const [nprInput, setNprInput] = useState<string>('13450');
  const [customRateInput, setCustomRateInput] = useState<string>(String(exchangeRate));
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [glossaryFilter, setGlossaryFilter] = useState('');
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  // Sync inputs when modal opens or exchangeRate changes
  useEffect(() => {
    if (isConverterOpen) {
      const parsedUsd = parseFloat(usdInput) || 100;
      setNprInput((parsedUsd * exchangeRate).toFixed(2));
      setCustomRateInput(String(exchangeRate));
    }
  }, [isConverterOpen, exchangeRate]);

  if (!isConverterOpen) return null;

  const handleUsdChange = (val: string) => {
    setUsdInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setNprInput((num * exchangeRate).toFixed(2));
    } else {
      setNprInput('');
    }
  };

  const handleNprChange = (val: string) => {
    setNprInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && exchangeRate > 0) {
      setUsdInput((num / exchangeRate).toFixed(2));
    } else {
      setUsdInput('');
    }
  };

  const handleResetDefaultRate = () => {
    setExchangeRate(134.5);
    setCustomRateInput('134.5');
    setIsEditingRate(false);
    const num = parseFloat(usdInput) || 100;
    setNprInput((num * 134.5).toFixed(2));
  };

  const handleApplyCustomRate = () => {
    const rate = parseFloat(customRateInput);
    if (!isNaN(rate) && rate > 0) {
      setExchangeRate(rate);
      setIsEditingRate(false);
      const num = parseFloat(usdInput) || 100;
      setNprInput((num * rate).toFixed(2));
    }
  };

  const handlePresetSelect = (nprValue: number) => {
    setNprInput(String(nprValue));
    setUsdInput((nprValue / exchangeRate).toFixed(2));
  };

  const currentNprNumber = parseFloat(nprInput) || 0;
  const currentUsdNumber = parseFloat(usdInput) || 0;

  const handleSetStoreCurrency = (curr: 'NPR' | 'USD') => {
    setCurrency(curr);
    setAppliedNotification(`Store currency updated to ${curr === 'NPR' ? 'Nepali Rupees (रू)' : 'US Dollars ($)'}`);
    setTimeout(() => setAppliedNotification(null), 2500);
  };

  const filteredGlossary = GLOSSARY_TERMS.filter(
    (item) =>
      item.en.toLowerCase().includes(glossaryFilter.toLowerCase()) ||
      item.ne.toLowerCase().includes(glossaryFilter.toLowerCase()) ||
      (item.siteSlang && item.siteSlang.toLowerCase().includes(glossaryFilter.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-amber-200/80 overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="relative bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 px-6 py-4 text-slate-950 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-md font-bold text-sm">
              रू
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-none text-slate-950">
                {language === 'ne' ? 'नेपाली मुद्रा र भाषा क्याल्कुलेटर' : 'English & Nepali Currency Converter'}
              </h2>
              <p className="text-xs text-slate-900/80 font-medium mt-0.5">
                {language === 'ne' ? 'नेपाली रुपैयाँ (रू) र अमेरिकी डलर ($) तत्काल रूपान्तरण' : 'Instant conversion between Nepali Rupees (रू) & US Dollars ($)'}
              </p>
            </div>
          </div>

          <button
            onClick={closeConverter}
            className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-slate-950 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-amber-50/40 border-b border-amber-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('converter')}
              className={`px-3.5 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 ${
                activeTab === 'converter'
                  ? 'border-amber-600 text-amber-950 bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'ne' ? 'मुद्रा क्याल्कुलेटर' : 'Currency Converter'}
            </button>
            <button
              onClick={() => setActiveTab('glossary')}
              className={`px-3.5 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 ${
                activeTab === 'glossary'
                  ? 'border-amber-600 text-amber-950 bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'ne' ? 'प्राविधिक शब्दावली (EN ⇄ NE)' : 'Technical Terms (EN ⇄ NE)'}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 ${
                activeTab === 'settings'
                  ? 'border-amber-600 text-amber-950 bg-white shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'ne' ? 'भाषा तथा प्राथमिकता' : 'Language & Preferences'}
            </button>
          </div>

          {/* Quick Language Switcher inside header */}
          <div className="flex items-center gap-1.5 pb-1">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                language === 'en'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ne')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                language === 'ne'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              नेपाली
            </button>
          </div>
        </div>

        {/* Applied Notification Pill */}
        {appliedNotification && (
          <div className="bg-emerald-50 text-emerald-800 border-b border-emerald-200 px-6 py-2 text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{appliedNotification}</span>
          </div>
        )}

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          {/* ========================================================================= */}
          {/* TAB 1: CURRENCY CONVERTER */}
          {/* ========================================================================= */}
          {activeTab === 'converter' && (
            <div className="space-y-6">
              {/* Benchmark Exchange Rate Header */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center font-bold shrink-0">
                    NRB
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {language === 'ne' ? 'मानक विनिमय दर' : 'Standard Benchmark Rate'}
                    </span>
                    <span className="text-slate-600 font-mono text-[11px]">
                      $1.00 USD = रू {formatNepaliCurrencyNumber(exchangeRate)} NPR
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isEditingRate ? (
                    <button
                      onClick={() => setIsEditingRate(true)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/50 font-semibold text-[11px] transition-colors"
                    >
                      {language === 'ne' ? 'दर परिवर्तन गर्नुहोस्' : 'Custom Rate'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.1"
                        value={customRateInput}
                        onChange={(e) => setCustomRateInput(e.target.value)}
                        className="w-20 px-2 py-1 text-xs border border-amber-400 rounded bg-white font-mono"
                      />
                      <button
                        onClick={handleApplyCustomRate}
                        className="px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[11px]"
                      >
                        OK
                      </button>
                      <button
                        onClick={handleResetDefaultRate}
                        className="px-2 py-1 bg-slate-200 text-slate-700 font-semibold rounded text-[11px]"
                        title="Reset to 134.50"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Converter Interactive Inputs Box */}
              <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
                {/* USD Input */}
                <div className="md:col-span-5 p-4 rounded-xl bg-white border-2 border-slate-200 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all shadow-xs">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {language === 'ne' ? 'अमेरिकी डलर ($ USD)' : 'US Dollars ($ USD)'}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      step="any"
                      value={usdInput}
                      onChange={(e) => handleUsdChange(e.target.value)}
                      placeholder="0.00"
                      className="w-full text-xl font-extrabold text-slate-900 bg-transparent focus:outline-none font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Standard international quotation
                  </span>
                </div>

                {/* Swap / Arrow Center */}
                <div className="md:col-span-1 flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-bold">
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* NPR Input */}
                <div className="md:col-span-5 p-4 rounded-xl bg-white border-2 border-amber-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all shadow-xs">
                  <label className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                    {language === 'ne' ? 'नेपाली रुपैयाँ (रू NPR)' : 'Nepali Rupees (रू NPR)'}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-amber-700">रू</span>
                    <input
                      type="number"
                      step="any"
                      value={nprInput}
                      onChange={(e) => handleNprChange(e.target.value)}
                      placeholder="0.00"
                      className="w-full text-xl font-extrabold text-slate-900 bg-transparent focus:outline-none font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-amber-800/80 block mt-1 font-medium">
                    {language === 'ne' ? 'नेपाली बजार स्थानीय मूल्य' : 'Local Nepal domestic currency'}
                  </span>
                </div>
              </div>

              {/* Amount In Words & Devanagari Display */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {language === 'ne' ? 'अक्षरमा रकम (नेपाली):' : 'Nepali Words (अक्षरमा):'}
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {numberToNepaliWords(currentNprNumber)}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      English Words:
                    </span>
                    <p className="font-semibold text-slate-700 mt-0.5">
                      {numberToEnglishWords(currentNprNumber)}
                    </p>
                  </div>

                  <div className="sm:text-right font-mono text-xs bg-amber-100/70 border border-amber-200 px-2.5 py-1 rounded-lg shrink-0">
                    <span className="text-amber-900 text-[10px] block font-sans font-semibold">Devanagari Digits:</span>
                    <span className="font-bold text-amber-950">
                      रू {toDevanagari(formatNepaliCurrencyNumber(currentNprNumber))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Construction Procurement Quick Presets */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  {language === 'ne' ? 'निर्माण सामग्री द्रुत रकमहरू:' : 'Quick Procurement Presets:'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { label: 'Minor Hardware', npr: 500 },
                    { label: 'Switchboard', npr: 2500 },
                    { label: 'Wire Coil / Pipe', npr: 10000 },
                    { label: 'Distribution DB', npr: 35000 },
                    { label: '1 Lakh Batch', npr: 100000 },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePresetSelect(p.npr)}
                      className="p-2 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-all shadow-2xs group"
                    >
                      <div className="text-[10px] text-slate-400 group-hover:text-amber-700 font-medium truncate">
                        {p.label}
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">
                        रू {formatNepaliCurrencyNumber(p.npr)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        ${(p.npr / exchangeRate).toFixed(1)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply as Global Storefront Currency Buttons */}
              <div className="p-4 rounded-xl bg-linear-to-r from-amber-500/10 via-amber-400/10 to-yellow-400/10 border border-amber-300/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    {language === 'ne' ? 'स्टोरमा सक्रिय मुद्रा' : 'Active Storefront Currency'}
                  </span>
                  <span className="text-[11px] text-slate-600">
                    Currently set to:{' '}
                    <strong className="text-amber-950 font-bold">
                      {currency === 'NPR' ? 'Nepali Rupees (रू NPR)' : 'US Dollars ($ USD)'}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleSetStoreCurrency('NPR')}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      currency === 'NPR'
                        ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50'
                        : 'bg-white border border-amber-300 text-slate-800 hover:bg-amber-50'
                    }`}
                  >
                    <span>Use रू NPR (Default)</span>
                    {currency === 'NPR' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleSetStoreCurrency('USD')}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      currency === 'USD'
                        ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-700'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Use $ USD</span>
                    {currency === 'USD' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: TECHNICAL GLOSSARY (EN ⇄ NE) */}
          {/* ========================================================================= */}
          {activeTab === 'glossary' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={glossaryFilter}
                  onChange={(e) => setGlossaryFilter(e.target.value)}
                  placeholder="Search technical term in English or Nepali..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                <div className="bg-slate-50 px-4 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider grid grid-cols-12 gap-2">
                  <div className="col-span-5">English Name</div>
                  <div className="col-span-4">नेपाली नाम (Official)</div>
                  <div className="col-span-3">साइट बोलीचाली (Slang)</div>
                </div>

                {filteredGlossary.map((item, idx) => (
                  <div key={idx} className="px-4 py-2.5 hover:bg-amber-50/40 grid grid-cols-12 gap-2 items-center transition-colors">
                    <div className="col-span-5 font-semibold text-slate-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>{item.en}</span>
                    </div>
                    <div className="col-span-4 font-bold text-amber-900">
                      {item.ne}
                    </div>
                    <div className="col-span-3 text-slate-500 font-medium">
                      {item.siteSlang || '-'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: LANGUAGE & PREFERENCES */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  Interface Language (वेबसाइटको भाषा)
                </h4>
                <p className="text-slate-500 text-xs">
                  Choose your preferred browsing language. All navigation labels, service descriptions, buttons, and checkout headings will adapt instantly.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      language === 'en'
                        ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-400/30'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">English (Global)</div>
                      <div className="text-[11px] text-slate-500">Commercial Standard</div>
                    </div>
                    {language === 'en' && <Check className="w-4 h-4 text-amber-600" />}
                  </button>

                  <button
                    onClick={() => setLanguage('ne')}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      language === 'ne'
                        ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-400/30'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">नेपाली (Nepal)</div>
                      <div className="text-[11px] text-slate-500">स्थानीय नेपाली भाषा</div>
                    </div>
                    {language === 'ne' && <Check className="w-4 h-4 text-amber-600" />}
                  </button>
                </div>
              </div>

              {/* Devanagari Numeral Option */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-slate-900 block">
                    {language === 'ne' ? 'नेपाली देवनागरी अंक (१, २, ३...)' : 'Use Devanagari Numerals (१, २, ३...)'}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Display prices and counts with Nepali Devanagari numerals when viewing in Nepali.
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useDevanagariNumerals}
                    onChange={(e) => setUseDevanagariNumerals(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span>Subbha Bihani Commercial Desk • Kathmandu</span>
          </span>

          <button
            onClick={closeConverter}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
          >
            {language === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
