"use client";
import React, { useState } from "react";
import { WidgetCard } from "@/components/common/WidgetCard";

type SupportedLocale = "en" | "de" | "ja" | "ar";

interface LocaleData {
  dir: "ltr" | "rtl";
  name: string;
  flag: string;
  translations: {
    greeting: string;
    subheading: string;
    accountBalance: string;
    transferFunds: string;
    recipientName: string;
    amountLabel: string;
    submitPayment: string;
    successMessage: string;
    recentTransactions: string;
    colDescription: string;
    colDate: string;
    colAmount: string;
    colStatus: string;
  };
}

const LOCALES: Record<SupportedLocale, LocaleData> = {
  en: {
    dir: "ltr",
    name: "English",
    flag: "🇺🇸",
    translations: {
      greeting: "Welcome to Global Banking Portal",
      subheading: "Manage cross-border transfers and currency accounts effortlessly.",
      accountBalance: "Available Balance",
      transferFunds: "Transfer Funds",
      recipientName: "Recipient Name",
      amountLabel: "Transfer Amount (USD)",
      submitPayment: "Confirm & Authorize Transfer",
      successMessage: "Transfer submitted successfully! Reference #TRX-9482",
      recentTransactions: "Recent Activity",
      colDescription: "Description",
      colDate: "Date",
      colAmount: "Amount",
      colStatus: "Status",
    },
  },
  de: {
    dir: "ltr",
    name: "Deutsch",
    flag: "🇩🇪",
    translations: {
      greeting: "Willkommen beim globalen Bankportal",
      subheading: "Verwalten Sie grenzüberschreitende Überweisungen mühelos.",
      accountBalance: "Verfügbares Guthaben",
      transferFunds: "Geld überweisen",
      recipientName: "Name des Empfängers",
      amountLabel: "Überweisungsbetrag (EUR)",
      submitPayment: "Überweisung bestätigen & autorisieren",
      successMessage: "Überweisung erfolgreich übermittelt! Referenz #TRX-9482",
      recentTransactions: "Letzte Aktivitäten",
      colDescription: "Beschreibung",
      colDate: "Datum",
      colAmount: "Betrag",
      colStatus: "Status",
    },
  },
  ja: {
    dir: "ltr",
    name: "日本語",
    flag: "🇯🇵",
    translations: {
      greeting: "グローバルバンキングポータルへようこそ",
      subheading: "国境を越えた送金と口座管理をスムーズに行えます。",
      accountBalance: "利用可能残高",
      transferFunds: "資金移動・送金",
      recipientName: "受取人名",
      amountLabel: "送金額 (JPY)",
      submitPayment: "送金を承認して送信",
      successMessage: "送金が正常に完了しました！照会番号 #TRX-9482",
      recentTransactions: "最近の取引履歴",
      colDescription: "概要",
      colDate: "日付",
      colAmount: "金額",
      colStatus: "ステータス",
    },
  },
  ar: {
    dir: "rtl",
    name: "العربية (RTL)",
    flag: "🇸🇦",
    translations: {
      greeting: "مرحباً بكم في البوابة المصرفية العالمية",
      subheading: "قم بإدارة التحويلات الدولية وحسابات العملات الأجنبية بكل سهولة.",
      accountBalance: "الرصيد المتاح",
      transferFunds: "تحويل الأموال",
      recipientName: "اسم المستلم",
      amountLabel: "مبلغ التحويل",
      submitPayment: "تأكيد وتفويض عملية التحويل",
      successMessage: "تم إرسال التحويل بنجاح! رقم المرجع #TRX-9482",
      recentTransactions: "النشاطات الأخيرة",
      colDescription: "الوصف",
      colDate: "التاريخ",
      colAmount: "المبلغ",
      colStatus: "الحالة",
    },
  },
};

export default function I18nPage() {
  const [selectedLocale, setSelectedLocale] = useState<SupportedLocale>("en");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transferSuccess, setTransferSuccess] = useState(false);

  const current = LOCALES[selectedLocale];
  const t = current.translations;

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipient && amount) {
      setTransferSuccess(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🌐</span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="page-title">
              Multi-Language (i18n) & RTL Layout Studio
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
              Advanced
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Test bi-directional UI layouts, Right-to-Left (RTL Arabic) mirroring, locale emulation, and multi-language visual assertions.
          </p>
        </div>

        {/* Language Switcher Dropdown & Pills */}
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-900 p-1.5 rounded-xl border border-gray-200 dark:border-slate-800">
          {(Object.keys(LOCALES) as SupportedLocale[]).map((key) => {
            const loc = LOCALES[key];
            const isActive = selectedLocale === key;
            return (
              <button
                key={key}
                type="button"
                data-testid={`btn-locale-${key}`}
                onClick={() => {
                  setSelectedLocale(key);
                  setTransferSuccess(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  isActive
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span>{loc.flag}</span>
                <span>{loc.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Internationalized Showcase Card (RTL or LTR directed) */}
      <div
        dir={current.dir}
        data-testid="i18n-viewport"
        className={`bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-xs space-y-6 transition-all ${
          current.dir === "rtl" ? "border-r-4 border-r-indigo-600" : "border-l-4 border-l-indigo-600"
        }`}
      >
        {/* Banner with Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-5">
          <div>
            <h2 data-testid="i18n-heading" className="text-xl font-bold text-gray-900 dark:text-white">
              {t.greeting}
            </h2>
            <p data-testid="i18n-subheading" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t.subheading}
            </p>
          </div>
          <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60 min-w-[200px]">
            <span className="text-[11px] text-gray-500 block">{t.accountBalance}</span>
            <span data-testid="account-balance-val" className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
              $148,250.00
            </span>
          </div>
        </div>

        {/* Transfer Form and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={handleTransfer} className="space-y-4" data-testid="transfer-form">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t.transferFunds}
            </h3>

            <div>
              <label htmlFor="recipient-input" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.recipientName}
              </label>
              <input
                id="recipient-input"
                type="text"
                data-testid="input-recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Satoshi Nakamoto"
                required
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="amount-input" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.amountLabel}
              </label>
              <input
                id="amount-input"
                type="number"
                data-testid="input-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="2500"
                required
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <button
              type="submit"
              data-testid="btn-submit-transfer"
              className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
            >
              {t.submitPayment}
            </button>

            {transferSuccess && (
              <div
                data-testid="transfer-success-banner"
                className="p-3 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              >
                ✅ {t.successMessage}
              </div>
            )}
          </form>

          {/* Activity Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t.recentTransactions}
            </h3>
            <div className="border border-gray-100 dark:border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left" data-testid="i18n-table">
                <thead className="bg-gray-50 dark:bg-slate-800/60 text-gray-500 uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">{t.colDescription}</th>
                    <th className="p-2.5">{t.colDate}</th>
                    <th className="p-2.5">{t.colAmount}</th>
                    <th className="p-2.5">{t.colStatus}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800 font-mono">
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-gray-800 dark:text-gray-200">Global Cloud AWS</td>
                    <td className="p-2.5 text-gray-400">Nov 18</td>
                    <td className="p-2.5 text-rose-600">-$380.00</td>
                    <td className="p-2.5"><span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">Settled</span></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-gray-800 dark:text-gray-200">Stripe Wire Inflow</td>
                    <td className="p-2.5 text-gray-400">Nov 17</td>
                    <td className="p-2.5 text-emerald-600">+$12,400.00</td>
                    <td className="p-2.5"><span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">Settled</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-lg border border-gray-200 dark:border-slate-700 text-[11px] text-gray-500">
              <span>Text Direction: </span>
              <strong data-testid="dir-indicator" className="font-mono text-indigo-600 dark:text-indigo-400 uppercase">
                {current.dir}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Code Snippets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WidgetCard
          title="Testing RTL Direction & Mirrored Attributes"
          testId="widget-i18n-hint-1"
          docUrl="https://playwright.dev/docs/emulation#locale--timezone"
          docTitle="Playwright Locale & Direction Emulation"
          hint={`// 1. Switch to Arabic (RTL)
await page.getByTestId('btn-locale-ar').click();

// 2. Assert dir attribute reflects Right-to-Left mirroring
const viewport = page.getByTestId('i18n-viewport');
await expect(viewport).toHaveAttribute('dir', 'rtl');

// 3. Verify translated text
await expect(page.getByTestId('i18n-heading')).toContainText('مرحباً');`}
        >
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Verify bi-directional mirroring across Arabic and Hebrew layouts without regression issues or text overlap.
          </p>
        </WidgetCard>

        <WidgetCard
          title="Browser Context Locale Emulation in Playwright"
          testId="widget-i18n-hint-2"
          docUrl="https://playwright.dev/docs/emulation"
          docTitle="Playwright Context Locale Configuration"
          hint={`// In playwright.config.ts or test fixture:
test.use({
  locale: 'de-DE',
  timezoneId: 'Europe/Berlin',
});

// Or dynamically in a test:
const context = await browser.newContext({
  locale: 'ja-JP',
});
const page = await context.newPage();`}
        >
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Configure default browser contexts with specific locales, number formatting conventions, and timezone offsets.
          </p>
        </WidgetCard>
      </div>
    </div>
  );
}
