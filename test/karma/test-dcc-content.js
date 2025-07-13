/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

import sinon from 'sinon';
import {expect} from 'chai';
import DccFunctions from '../../content/dcc-functions.js';
import DirectCurrencyContent from '../../content/dcc-content.js';

/**
 * Real values except apiKey.
 *
 */
const convertToEurSettings = {
    alwaysConvertFromCurrency: false,
    apiKey: "",
    conversionQuotes: {
        AED: 0.24005034519071658,
        AFN: 0.011689020704354326,
        ALL: 0.008034944826785092,
        AMD: 0.0018050530688959675,
        AOA: 0.0028107620958644267,
        ARS: 0.02249959368981981,
        AUD: 0.6284927550281417,
        AWG: 0.4898416666666667,
        AZN: 0.5171224621578014,
        BAM: 0.5113021543100699,
        BBD: 0.4406261712600884,
        BDT: 0.010498726760799243,
        BGN: 0.5112428608703216,
        BHD: 2.3391698834016474,
        BIF: 0.000489216556622094,
        BMD: 0.881715,
        BND: 0.6520837185223534,
        BOB: 0.12763402647597402,
        BRL: 0.23521783623546888,
        BSD: 0.881886967958752,
        BTC: 3498.8690476190477,
        BTN: 0.01241082204708361,
        BWP: 0.08333476680177815,
        BYN: 0.41218893518033717,
        BYR: 0.00004498545918367347,
        BZD: 0.43753138640058276,
        CAD: 0.6711947626841244,
        CDF: 0.0005409293277199898,
        CHF: 0.8813184067169774,
        CLF: 35.201014053018206,
        CLP: 0.001354702575008557,
        CNY: 0.13132085352187692,
        COP: 0.00028232497078176783,
        CRC: 0.0014485570378917857,
        CUP: 0.0332722641509434,
        CVE: 0.009068619182482569,
        CZK: 0.03894433109247127,
        DJF: 0.004961248285326219,
        DKK: 0.13392385198362503,
        DOP: 0.017419515974473464,
        DZD: 0.007424318644684849,
        EGP: 0.050281702767140314,
        ERN: 0.05877959712694857,
        ETB: 0.03100644861267053,
        EUR: 1,
        FJD: 0.41474826709014145,
        FKP: 1.145039803644014,
        GBP: 1.1509437656641606,
        GEL: 0.33084494041365237,
        GGP: 1.1502785956846697,
        GHS: 0.16469418060575497,
        GIP: 1.145039803644014,
        GMD: 0.01779264026423952,
        GNF: 0.00009668616319062174,
        GTQ: 0.11424212388004587,
        GYD: 0.004224694334166535,
        HKD: 0.11234322290238881,
        HNL: 0.036107684822990586,
        HTG: 0.010770348368485498,
        HUF: 0.003143476702666902,
        IDR: 0.00006290999250829439,
        ILS: 0.24416189677087055,
        IMP: 1.1502785956846697,
        INR: 0.012412314270340083,
        IQD: 0.0007391667015970156,
        IRR: 0.000020940861955321615,
        ISK: 0.007374024869335121,
        JEP: 1.1502785956846697,
        JMD: 0.006690790843487134,
        JOD: 1.2430706720954625,
        JPY: 0.007964542535732791,
        KES: 0.008814637475733918,
        KGS: 0.012649453650310978,
        KHR: 0.0002197995526796973,
        KMF: 0.0020301802750073133,
        KPW: 0.0009785562311789768,
        KRW: 0.0007852097448433944,
        KWD: 2.9037213897579455,
        KYD: 1.0584242147783134,
        KZT: 0.0023457663013371844,
        LAK: 0.00010273759775423613,
        LBP: 0.0005847496611901909,
        LKR: 0.004913967134060942,
        LRD: 0.005467987046381075,
        LSL: 0.06311316326210693,
        LTL: 0.29860908850762347,
        LVL: 1.4576451916877449,
        LYD: 0.6352235059677718,
        MAD: 0.09226772568163624,
        MDL: 0.05162113483302366,
        MGA: 0.0002505510097551378,
        MKD: 0.016236338583607315,
        MMK: 0.0005769994336241905,
        MNT: 0.00033633988174709136,
        MOP: 0.1090941148085596,
        MRO: 0.00246978752227876,
        MRU: 0.0246978752227876,
        MUR: 0.025795939828519746,
        MVR: 0.057030623701438604,
        MWK: 0.0012084163570938774,
        MXN: 0.04605385216134463,
        MYR: 0.2163609478200355,
        MZN: 0.014096078109968867,
        NAD: 0.06311318585031743,
        NGN: 0.00243735751517959,
        NIO: 0.02683570591086771,
        NOK: 0.10244395015850251,
        NPR: 0.007753041966422188,
        NZD: 0.6037473192349514,
        OMR: 2.2899368635384985,
        PAB: 0.8820016505364244,
        PEN: 0.2661054915126559,
        PGK: 0.2617724337564017,
        PHP: 0.01694290250598694,
        PKR: 0.006311923781434477,
        PLN: 0.23051071227827089,
        PYG: 0.00014493539309344636,
        QAR: 0.2421462409886715,
        RON: 0.20974766479196633,
        RSD: 0.008460913962950694,
        RUB: 0.013487283071366016,
        RWF: 0.0009807730812013348,
        SAR: 0.23509867203639928,
        SBD: 0.10745349184393489,
        SCR: 0.06446209609887033,
        SDG: 0.018527691188042088,
        SEK: 0.09434542700503895,
        SGD: 0.6525402529891859,
        SHP: 0.6675087667233954,
        SLE: 0.0378023,
        SOS: 0.001517580872732642,
        SRD: 0.11822345233424662,
        STD: 0.00004188550522718341,
        STN: 0.04188550522718341,
        SVC: 0.10079618140214627,
        SYP: 0.0017120668375172987,
        SZL: 0.06295249234651512,
        THB: 0.028149569395856732,
        TJS: 0.09347524819233374,
        TMT: 0.25120085470085474,
        TND: 0.2876861836631483,
        TOP: 0.39072650761941397,
        TRY: 0.16576587721313515,
        TTD: 0.12997457158651188,
        TWD: 0.02866336955209379,
        TZS: 0.00037689733691467054,
        UAH: 0.0326422031146433,
        UGX: 0.00024031477773086657,
        USD: 0.881715,
        UYU: 0.026983534539897405,
        UZS: 0.00010512187246815493,
        VED: 7756,
        VEF: 0.08828181695847132,
        VES: 0.007756,
        VND: 0.000037998159811930194,
        VUV: 0.007843044081890127,
        WST: 0.3337291181555847,
        XAF: 0.0015244816355692776,
        XAG: 14.036918521348746,
        XAU: 1170.9362549800796,
        XCD: 0.3262529832935561,
        XCG: 0.48861903326343414,
        XDR: 1.2269763208870483,
        XOF: 0.0015244816382051002,
        XPF: 0.008385277677212796,
        YER: 0.003521924178228876,
        ZAR: 0.06298952321378411,
        ZMK: 0.00009795523352962338,
        ZMW: 0.0739567407817976,
        ZWG: 0.00273522969990375,
        hp: 0.73549875,
        inch: 25.4,
        kcal: 4.184,
        knots: 1.852,
        mil: 10,
        mile: 1.602,
        nmi: 1.852
    },
    convertFromCurrency: "GBP",
    convertFroms: [
        {enabled: true, isoName: "SEK"},
        {enabled: true, isoName: "USD"},
        {enabled: true, isoName: "AFN"},
        {enabled: true, isoName: "AED"},
        {enabled: true, isoName: "ALL"},
        {enabled: true, isoName: "AMD"},
        {enabled: true, isoName: "AOA"},
        {enabled: true, isoName: "ARS"},
        {enabled: true, isoName: "AUD"},
        {enabled: true, isoName: "AWG"},
        {enabled: true, isoName: "AZN"},
        {enabled: true, isoName: "BAM"},
        {enabled: true, isoName: "BBD"},
        {enabled: true, isoName: "BDT"},
        {enabled: true, isoName: "BGN"},
        {enabled: true, isoName: "BHD"},
        {enabled: true, isoName: "BIF"},
        {enabled: true, isoName: "BMD"},
        {enabled: true, isoName: "BND"},
        {enabled: true, isoName: "BOB"},
        {enabled: true, isoName: "BOV"},
        {enabled: true, isoName: "BRL"},
        {enabled: true, isoName: "BSD"},
        {enabled: true, isoName: "BTN"},
        {enabled: true, isoName: "BWP"},
        {enabled: true, isoName: "BYN"},
        {enabled: true, isoName: "BZD"},
        {enabled: true, isoName: "CAD"},
        {enabled: true, isoName: "CDF"},
        {enabled: true, isoName: "CHE"},
        {enabled: true, isoName: "CHF"},
        {enabled: true, isoName: "CHW"},
        {enabled: true, isoName: "CLF"},
        {enabled: true, isoName: "CLP"},
        {enabled: true, isoName: "CNY"},
        {enabled: true, isoName: "COP"},
        {enabled: true, isoName: "COU"},
        {enabled: true, isoName: "CRC"},
        {enabled: true, isoName: "CUP"},
        {enabled: true, isoName: "CVE"},
        {enabled: true, isoName: "CZK"},
        {enabled: true, isoName: "DJF"},
        {enabled: true, isoName: "DKK"},
        {enabled: true, isoName: "DOP"},
        {enabled: true, isoName: "DZD"},
        {enabled: true, isoName: "EGP"},
        {enabled: true, isoName: "ERN"},
        {enabled: true, isoName: "ETB"},
        {enabled: true, isoName: "EUR"},
        {enabled: true, isoName: "FJD"},
        {enabled: true, isoName: "FKP"},
        {enabled: true, isoName: "GBP"},
        {enabled: true, isoName: "GEL"},
        {enabled: true, isoName: "GHS"},
        {enabled: true, isoName: "GIP"},
        {enabled: true, isoName: "GMD"},
        {enabled: true, isoName: "GNF"},
        {enabled: true, isoName: "GTQ"},
        {enabled: true, isoName: "GYD"},
        {enabled: true, isoName: "HKD"},
        {enabled: true, isoName: "HNL"},
        {enabled: true, isoName: "HTG"},
        {enabled: true, isoName: "HUF"},
        {enabled: true, isoName: "IDR"},
        {enabled: true, isoName: "ILS"},
        {enabled: true, isoName: "INR"},
        {enabled: true, isoName: "IQD"},
        {enabled: true, isoName: "IRR"},
        {enabled: true, isoName: "ISK"},
        {enabled: true, isoName: "JMD"},
        {enabled: true, isoName: "JOD"},
        {enabled: true, isoName: "JPY"},
        {enabled: true, isoName: "KES"},
        {enabled: true, isoName: "KGS"},
        {enabled: true, isoName: "KHR"},
        {enabled: true, isoName: "KMF"},
        {enabled: true, isoName: "KPW"},
        {enabled: true, isoName: "KRW"},
        {enabled: true, isoName: "KWD"},
        {enabled: true, isoName: "KYD"},
        {enabled: true, isoName: "KZT"},
        {enabled: true, isoName: "LAK"},
        {enabled: true, isoName: "LBP"},
        {enabled: true, isoName: "LKR"},
        {enabled: true, isoName: "LRD"},
        {enabled: true, isoName: "LSL"},
        {enabled: true, isoName: "LYD"},
        {enabled: true, isoName: "MAD"},
        {enabled: true, isoName: "MDL"},
        {enabled: true, isoName: "MGA"},
        {enabled: true, isoName: "MKD"},
        {enabled: true, isoName: "MMK"},
        {enabled: true, isoName: "MNT"},
        {enabled: true, isoName: "MOP"},
        {enabled: true, isoName: "MRU"},
        {enabled: true, isoName: "MUR"},
        {enabled: true, isoName: "MVR"},
        {enabled: true, isoName: "MWK"},
        {enabled: true, isoName: "MXN"},
        {enabled: true, isoName: "MXV"},
        {enabled: true, isoName: "MYR"},
        {enabled: true, isoName: "MZN"},
        {enabled: true, isoName: "NAD"},
        {enabled: true, isoName: "NGN"},
        {enabled: true, isoName: "NIO"},
        {enabled: true, isoName: "NOK"},
        {enabled: true, isoName: "NPR"},
        {enabled: true, isoName: "NZD"},
        {enabled: true, isoName: "OMR"},
        {enabled: true, isoName: "PAB"},
        {enabled: true, isoName: "PEN"},
        {enabled: true, isoName: "PGK"},
        {enabled: true, isoName: "PHP"},
        {enabled: true, isoName: "PKR"},
        {enabled: true, isoName: "PLN"},
        {enabled: true, isoName: "PYG"},
        {enabled: true, isoName: "QAR"},
        {enabled: true, isoName: "RON"},
        {enabled: true, isoName: "RSD"},
        {enabled: true, isoName: "RUB"},
        {enabled: true, isoName: "RWF"},
        {enabled: true, isoName: "SAR"},
        {enabled: true, isoName: "SBD"},
        {enabled: true, isoName: "SCR"},
        {enabled: true, isoName: "SDG"},
        {enabled: true, isoName: "SGD"},
        {enabled: true, isoName: "SHP"},
        {enabled: true, isoName: "SLE"},
        {enabled: true, isoName: "SOS"},
        {enabled: true, isoName: "SRD"},
        {enabled: true, isoName: "SSP"},
        {enabled: true, isoName: "STN"},
        {enabled: true, isoName: "SVC"},
        {enabled: true, isoName: "SYP"},
        {enabled: true, isoName: "SZL"},
        {enabled: true, isoName: "THB"},
        {enabled: true, isoName: "TJS"},
        {enabled: true, isoName: "TMT"},
        {enabled: true, isoName: "TND"},
        {enabled: true, isoName: "TOP"},
        {enabled: true, isoName: "TRY"},
        {enabled: true, isoName: "TTD"},
        {enabled: true, isoName: "TWD"},
        {enabled: true, isoName: "TZS"},
        {enabled: true, isoName: "UAH"},
        {enabled: true, isoName: "UGX"},
        {enabled: true, isoName: "USN"},
        {enabled: true, isoName: "UYI"},
        {enabled: true, isoName: "UYU"},
        {enabled: true, isoName: "UZS"},
        {enabled: true, isoName: "VED"},
        {enabled: true, isoName: "VES"},
        {enabled: true, isoName: "VND"},
        {enabled: true, isoName: "VUV"},
        {enabled: true, isoName: "WST"},
        {enabled: true, isoName: "XAD"},
        {enabled: true, isoName: "XAF"},
        {enabled: true, isoName: "XAG"},
        {enabled: true, isoName: "XAU"},
        {enabled: true, isoName: "XBA"},
        {enabled: true, isoName: "XBB"},
        {enabled: true, isoName: "XBC"},
        {enabled: true, isoName: "XBD"},
        {enabled: true, isoName: "XCD"},
        {enabled: true, isoName: "XCG"},
        {enabled: true, isoName: "XDR"},
        {enabled: true, isoName: "XOF"},
        {enabled: true, isoName: "XPD"},
        {enabled: true, isoName: "XPF"},
        {enabled: true, isoName: "XPT"},
        {enabled: true, isoName: "XSU"},
        {enabled: true, isoName: "XTS"},
        {enabled: true, isoName: "XUA"},
        {enabled: true, isoName: "XXX"},
        {enabled: true, isoName: "YER"},
        {enabled: true, isoName: "ZAR"},
        {enabled: true, isoName: "ZMW"},
        {enabled: true, isoName: "ZWG"},
        {enabled: true, isoName: "UYW"},
        {enabled: true, isoName: "VED"},
        {enabled: true, isoName: "VES"}
    ],
    convertToCountry: "__",
    convertToCurrency: "EUR",
    currencyNames: {
        AED: "Emiratisk dirham (AED)",
        AFN: "Afghani (AFN)",
        ALL: "Lek (ALL)",
        AMD: "Dram (AMD)",
        AOA: "Kwanza (AOA)",
        ARS: "Argentinsk peso (ARS)",
        AUD: "Australisk dollar (AUD)",
        AWG: "Arubansk florin (AWG)",
        AZN: "Azerbajdzjansk manat (AZN)",
        BAM: "Konvertibilna marka (BAM)",
        BBD: "Barbadisk dollar (BBD)",
        BDT: "Taka (BDT)",
        BGN: "Lev (BGN)",
        BHD: "Bahrainsk dinar (BHD)",
        BIF: "Burundisk franc (BIF)",
        BMD: "Bermudisk dollar (BMD)",
        BND: "Bruneisk dollar (BND)",
        BOB: "Boliviano (BOB)",
        BOV: "Bolivian Mvdol (fonder) (BOV)",
        BRL: "Real (BRL)",
        BSD: "Bahamansk dollar (BSD)",
        BTN: "Ngultrum (BTN)",
        BWP: "Pula (BWP)",
        BYN: "Vitrysk rubel (BYN)",
        BZD: "Belizisk dollar (BZD)",
        CAD: "Kanadensisk dollar (CAD)",
        CDF: "Kongolesisk franc (CDF)",
        CHE: "WIR euro (alternativ valuta) (CHE)",
        CHF: "Schweizisk franc (CHF)",
        CHW: "WIR franc (alternativ valuta) (CHW)",
        CLF: "Unidad de Fomento (fonder) (CLF)",
        CLP: "Chilensk peso (CLP)",
        CNY: "Renminbi (CNY)",
        COP: "Colombiansk peso (COP)",
        COU: "Unidad de Valor Real (COU)",
        CRC: "Costaricansk colón (CRC)",
        CUP: "Kubansk peso (CUP)",
        CVE: "Kapverdisk escudo (CVE)",
        CZK: "Tjeckisk krona (CZK)",
        DJF: "Djiboutisk franc (DJF)",
        DKK: "Dansk krona (DKK)",
        DOP: "Dominikansk peso (DOP)",
        DZD: "Algerisk dinar (DZD)",
        EGP: "Egyptiskt pund (EGP)",
        ERN: "Nakfa (ERN)",
        ETB: "Birr (ETB)",
        EUR: "Euro (EUR)",
        FJD: "Fijidollar (FJD)",
        FKP: "Falklandspund (FKP)",
        GBP: "Brittiskt pund (GBP)",
        GEL: "Georgiska lari (GEL)",
        GHS: "Ghana Cedi (GHS)",
        GIP: "Gibraltarpund (GIP)",
        GMD: "Dalasi (GMD)",
        GNF: "Guinesisk franc (GNF)",
        GTQ: "Quetzal (GTQ)",
        GYD: "Guyansk dollar (GYD)",
        HKD: "Hongkongdollar (HKD)",
        HNL: "Lempira (HNL)",
        HTG: "Gourde (HTG)",
        HUF: "Forint (HUF)",
        IDR: "Rupiah (IDR)",
        ILS: "Shekel (ILS)",
        INR: "Indisk rupie (INR)",
        IQD: "Irakisk dinar (IQD)",
        IRR: "Iransk rial (IRR)",
        ISK: "Isländsk krona (ISK)",
        JMD: "Jamaicansk dollar (JMD)",
        JOD: "Jordansk dinar (JOD)",
        JPY: "Yen (JPY)",
        KES: "Kenyansk shilling (KES)",
        KGS: "Kirgizistansk som (KGS)",
        KHR: "Riel (KHR)",
        KMF: "Komoransk franc (KMF)",
        KPW: "Nordkoreansk won (KPW)",
        KRW: "Sydkoreansk won (KRW)",
        KWD: "Kuwaitisk dinar (KWD)",
        KYD: "Caymansk dollar (KYD)",
        KZT: "Tenge (KZT)",
        LAK: "Lao Kip (LAK)",
        LBP: "Libanesiskt pund (LBP)",
        LKR: "Lankesisk rupie (LKR)",
        LRD: "Liberiansk dollar (LRD)",
        LSL: "Loti (LSL)",
        LYD: "Libysk dinar (LYD)",
        MAD: "Marockansk dirham (MAD)",
        MDL: "Moldavisk leu (MDL)",
        MGA: "Ariary (MGA)",
        MKD: "Makedonisk denar (MKD)",
        MMK: "Kyat (MMK)",
        MNT: "Tögrög (MNT)",
        MOP: "Pataca (MOP)",
        MRU: "Ouguiya (MRU)",
        MUR: "Mauritisk rupie (MUR)",
        MVR: "Rufiyah (MVR)",
        MWK: "malawisk kwacha (MWK)",
        MXN: "Mexikansk peso (MXN)",
        MXV: "Mexican Unidad de Inversion (UDI) (fonder) (MXV)",
        MYR: "Ringgit (MYR)",
        MZN: "Metical (MZN)",
        NAD: "Namibisk dollar (NAD)",
        NGN: "Naira (NGN)",
        NIO: "Córdoba (NIO)",
        NOK: "Norsk krona (NOK)",
        NPR: "Nepalesisk rupie (NPR)",
        NZD: "Nyzeeländsk dollar (NZD)",
        OMR: "Omansk rial (OMR)",
        PAB: "Balboa (PAB)",
        PEN: "Nuevo sol (PEN)",
        PGK: "Kina (PGK)",
        PHP: "Filippinsk piso (PHP)",
        PKR: "Pakistansk rupie (PKR)",
        PLN: "Złoty (PLN)",
        PYG: "Guarani (PYG)",
        QAR: "Qatarisk rial (QAR)",
        RON: "Rumänsk leu (RON)",
        RSD: "Serbisk dinar (RSD)",
        RUB: "Rysk rubel (RUB)",
        RWF: "Rwandisk franc (RWF)",
        SAR: "Saudiarabisk rial (SAR)",
        SBD: "Salomondollar (SBD)",
        SCR: "Seychellisk rupie (SCR)",
        SDG: "Sudanesiskt pund (SDG)",
        SEK: "Svensk krona (SEK)",
        SGD: "Singaporiansk dollar (SGD)",
        SHP: "Sankthelenskt pund (SHP)",
        SLE: "Leone (SLE)",
        SOS: "Somalisk shilling (SOS)",
        SRD: "Surinamesisk dollar (SRD)",
        SSP: "Sydsudanesiskt pund (SSP)",
        STN: "Dobra (STN)",
        SVC: "El Salvador Colon (SVC)",
        SYP: "Syriskt pund (SYP)",
        SZL: "Lilangeni (SZL)",
        THB: "Baht (THB)",
        TJS: "Somoni (TJS)",
        TMT: "Turkmenistansk ny manat (TMT)",
        TND: "Tunisisk dinar (TND)",
        TOP: "Pa'anga (TOP)",
        TRY: "Turkisk lira (TRY)",
        TTD: "Trinidaddollar (TTD)",
        TWD: "Taiwanesisk dollar (TWD)",
        TZS: "Tanzanisk shilling (TZS)",
        UAH: "Hryvnja (UAH)",
        UGX: "Ugandisk shilling (UGX)",
        USD: "Amerikansk dollar (USD)",
        USN: "United States dollar (nästa dag) (fonder) (USN)",
        UYI: "Uruguay Peso en Unidades Indexadas (URUIURUI) (UYI)",
        UYU: "Uruguayansk peso (UYU)",
        UYW: "Unidad Previsional (UYW)",
        UZS: "Uzbekistansk som (UZS)",
        VED: "Bolívar Soberano (VED)",
        VEF: "",
        VES: "Bolívar Soberano (VES)",
        VND: "Dong (VND)",
        VUV: "Vatu (VUV)",
        WST: "Tala (WST)",
        XAD: "Arab Accounting Dinar (XAD)",
        XAF: "CFA-franc (BEAC) (XAF)",
        XAG: "Silver (en troy ounce) (XAG)",
        XAU: "Guld (en troy ounce) (XAU)",
        XBA: "European Composite Unit (EURCO) (enhet använd på obligationsmarknaden) (XBA)",
        XBB: "European Monetary Unit (E.M.U.-6) (enhet använd på obligationsmarknaden) (XBB)",
        XBC: "European Unit of Account 9 (E.U.A.-9) (enhet använd på obligationsmarknaden) (XBC)",
        XBD: "European Unit of Account 17 (E.U.A.-17) (enhet använd på obligationsmarknaden) (XBD)",
        XCD: "Östkaribisk dollar (XCD)",
        XCG: "Karibisk gulden (XCG)",
        XDR: "Särskilda dragningsrätter (XDR)",
        XOF: "CFA-franc (BCEAO) (XOF)",
        XPD: "Palladium (en troy ounce) (XPD)",
        XPF: "CFP-franc (XPF)",
        XPT: "Platina (en troy ounce) (XPT)",
        XSU: "Sucre (XSU)",
        XTS: "Kod reserverad i testningssyfte (XTS)",
        XUA: "ADB Unit of Account (XUA)",
        XXX: "Ingen valuta (XXX)",
        YER: "Jemenitisk rial (YER)",
        ZAR: "Rand (ZAR)",
        ZMW: "Zambisk kwacha (ZMW)",
        ZWG: "Zimbabwisk gold (ZWG)"
    },
    enableOnStart: true,
    excludedDomains: ["images.google.com", "docs.google.com", "drive.google.com", "twitter.com", "\.km", "\.dk"],
    includedDomains: [],
    isEnabled: true,
    quoteAdjustmentPercent: 0,
    quotesProvider: "Currencylayer",
    regexes1: {
        AED: {name: "AED", regex: "(AED|Dhs?)", mult: "()"},
        AFN: {name: "AFN", regex: "(AFN|؋|افغانۍ|[aA]fs?)", mult: "()"},
        ALL: {name: "ALL", regex: "(ALL|Lekë?)", mult: "()"},
        AMD: {name: "AMD", regex: "(AMD|\\u058F|Դրամ|drams?|драм)", mult: "()"},
        AOA: {name: "AOA", regex: "(AOA|[kK]z)", mult: "()"},
        ARS: {name: "ARS", regex: "(ARS|AR\\$|\\$)", mult: "()"},
        AUD: {name: "AUD", regex: "(AUD|AUD\\s?\\$|AU?\\$|\\$)", mult: "()"},
        AWG: {name: "AWG", regex: "(AWG|AWG\\.?Afl\\.?)", mult: "()"},
        AZN: {name: "AZN", regex: "(AZN|₼)", mult: "()"},
        BAM: {name: "BAM", regex: "(BAM|KM)", mult: "()"},
        BBD: {name: "BBD", regex: "(BBD|Bds\\$?|\\$)", mult: "()"},
        BDT: {name: "BDT", regex: "(BDT|৳|Tk\\.?|Taka)", mult: "()"},
        BGN: {name: "BGN", regex: "(BGN)", mult: "()"},
        BHD: {name: "BHD", regex: "(BHD|دينار|BD\\.?|\\.د\\.ب)", mult: "()"},
        BIF: {name: "BIF", regex: "(BIF)", mult: "()"},
        BMD: {name: "BMD", regex: "(BMD\\$|BMD|BD\\$?|Bd\\$?|\\$)", mult: "()"},
        BND: {name: "BND", regex: "(BND\\$|BND|B\\$|\\$)", mult: "()"},
        BOB: {name: "BOB", regex: "(BOB|Bs\\.?)", mult: "()"},
        BOV: {name: "BOV", regex: "(BOV)", mult: "()"},
        BRL: {name: "BRL", regex: "(BRL|R\\$)", mult: "()"},
        BSD: {name: "BSD", regex: "(BSD|BSD\\$|B\\$|\\$)", mult: "()"},
        BTN: {name: "BTN", regex: "(BTN|Nu\\.?)", mult: "()"},
        BWP: {name: "BWP", regex: "(BWP|\\sP)", mult: "()"},
        BYN: {name: "BYN", regex: "(BYN|Br\\.?|бр\\.?)", mult: "()"},
        BZD: {name: "BZD", regex: "(BZD|BZ\\s?\\$|\\$)", mult: "()"},
        CAD: {name: "CAD", regex: "(CAD|CAD\\$|C\\$|\\$)", mult: "()"},
        CDF: {name: "CDF", regex: "(CDF|F[Cc])", mult: "()"},
        CHE: {name: "CHE", regex: "(CHE)", mult: "()"},
        CHF: {name: "CHF", regex: "(CHF|Fr\\.)", mult: "()"},
        CHW: {name: "CHW", regex: "(CHW)", mult: "()"},
        CLF: {name: "CLF", regex: "(CLF|UF)", mult: "()"},
        CLP: {name: "CLP", regex: "(CLP|\\$)", mult: "()"},
        CNY: {name: "CNY", regex: "(CNY|¥|[yY]u[áa]n|[rR]enminbi|RMB)", mult: "()"},
        COP: {name: "COP", regex: "(COP|COP\\s?\\$|COL\\$|Col\\$|CO\\$|\\$)", mult: "()"},
        COU: {name: "COU", regex: "(COU)", mult: "()"},
        CRC: {name: "CRC", regex: "(CRC|₡)", mult: "()"},
        CUP: {name: "CUP", regex: "(CUP|CUP\\s?\\$|MN\\$|\\$)", mult: "()"},
        CVE: {name: "CVE", regex: "(CVE)", mult: "()"},
        CZK: {name: "CZK", regex: "(CZK)", mult: "()"},
        DJF: {name: "DJF", regex: "(DJF)", mult: "()"},
        DKK: {name: "DKK", regex: "(DKK|kr|kr\\.|dkr)", mult: "()"},
        DOP: {name: "DOP", regex: "(DOP|DOP\\s?\\$|RD\\$|\\$)", mult: "()"},
        DZD: {name: "DZD", regex: "(DZD|دج|DA)", mult: "()"},
        EGP: {name: "EGP", regex: "(EGP|L\\.?E\\.?\\s?|E£|ج\\.م)", mult: "()"},
        ERN: {name: "ERN", regex: "(ERN|Nkf|Nfk|NFA|ናቕፋ)", mult: "()"},
        ETB: {name: "ETB", regex: "(ETB|Br\\.?|ብር|Birr)", mult: "()"},
        EUR: {name: "EUR", regex: "(EUR|€|euro)", mult: "()"},
        FJD: {name: "FJD", regex: "(FJD|FJ\\$?|\\$)", mult: "()"},
        FKP: {name: "FKP", regex: "(FKP|FK£|£)", mult: "()"},
        GBP: {name: "GBP", regex: "(GBP|£)", mult: "([mM]illions?|[bB]illions?)"},
        GEL: {name: "GEL", regex: "(GEL)", mult: "()"},
        GHS: {name: "GHS", regex: "(GHS|GH₵|GH¢|GH[cC])", mult: "()"},
        GIP: {name: "GIP", regex: "(GIP|£)", mult: "()"},
        GMD: {name: "GMD", regex: "(GMD|D)", mult: "()"},
        GNF: {name: "GNF", regex: "(GNF)", mult: "()"},
        GTQ: {name: "GTQ", regex: "(GTQ|Q\\.?)", mult: "()"},
        GYD: {name: "GYD", regex: "(GYD|GYD\\$|G\\$|\\$)", mult: "()"},
        HKD: {name: "HKD", regex: "(HKD|HK\\$|\\$)", mult: "()"},
        HNL: {name: "HNL", regex: "(HNL|L\\.?)", mult: "()"},
        HTG: {name: "HTG", regex: "(HTG)", mult: "()"},
        HUF: {name: "HUF", regex: "(HUF)", mult: "()"},
        IDR: {name: "IDR", regex: "(IDR|Rp\\.?)", mult: "()"},
        ILS: {name: "ILS", regex: "(ILS|NIS|₪|שֶׁקֶל)", mult: "()"},
        INR: {name: "INR", regex: "(INR|₹|₨|Rs\\.?|रु\\.?|ரூ\\.?)", mult: "()"},
        IQD: {name: "IQD", regex: "(IQD|دينار|د\\.ع)", mult: "()"},
        IRR: {name: "IRR", regex: "(IRR|ریال|﷼)", mult: "()"},
        ISK: {name: "ISK", regex: "(ISK|kr|iskr)", mult: "()"},
        JMD: {name: "JMD", regex: "(JMD|JMD\\$|J\\$|\\$)", mult: "()"},
        JOD: {name: "JOD", regex: "(JOD|دينار|JD\\.?)", mult: "()"},
        JPY: {name: "JPY", regex: "(JPY|¥|￥|yen|円|圓)", mult: "()"},
        KES: {name: "KES", regex: "(KES|Kshs?\\.?|KSh|KSH)", mult: "()"},
        KGS: {name: "KGS", regex: "(KGS)", mult: "()"},
        KHR: {name: "KHR", regex: "(KHR|៛|រៀល)", mult: "()"},
        KMF: {name: "KMF", regex: "(KMF)", mult: "()"},
        KPW: {name: "KPW", regex: "(KPW|₩|￦|원)", mult: "()"},
        KRW: {name: "KRW", regex: "(KRW|₩|￦|원)", mult: "()"},
        KWD: {name: "KWD", regex: "(KWD|دينار|K\\.?D\\.?\\.?|\\.د\\.ب)", mult: "()"},
        KYD: {name: "KYD", regex: "(KYD|KYD\\$?|CI\\$|\\$)", mult: "()"},
        KZT: {name: "KZT", regex: "(KZT|₸)", mult: "()"},
        LAK: {name: "LAK", regex: "(LAK|ກີ|₭N?|KIP)", mult: "()"},
        LBP: {name: "LBP", regex: "(LBP|L\\.L\\.?|ل\\.ل\\.|ليرات)", mult: "()"},
        LKR: {name: "LKR", regex: "(LKR|රු|₨\\.?|SLRs\\.?|Rs\\.?|ரூபாய்\\.?|රුපියල්\\.?)", mult: "()"},
        LRD: {name: "LRD", regex: "(LRD|LD\\$?|L\\$|\\$)", mult: "()"},
        LSL: {name: "LSL", regex: "(LSL|Maloti|M|Loti)", mult: "()"},
        LYD: {name: "LYD", regex: "(LYD|L\\.?D\\.?|ل\\.د|دينار)", mult: "()"},
        MAD: {name: "MAD", regex: "(MAD|د\\.م\\.|دراهم)", mult: "()"},
        MDL: {name: "MDL", regex: "(MDL)", mult: "()"},
        MGA: {name: "MGA", regex: "(MGA|Ar)", mult: "()"},
        MKD: {name: "MKD", regex: "(MKD)", mult: "()"},
        MMK: {name: "MMK", regex: "(MMK|[kK][sS]|[kK]yat)", mult: "()"},
        MNT: {name: "MNT", regex: "(MNT|₮)", mult: "()"},
        MOP: {name: "MOP", regex: "(MOP|MOP\\s?\\$|\\$)", mult: "()"},
        MRU: {name: "MRU", regex: "(MRU|أوقية)", mult: "()"},
        MUR: {name: "MUR", regex: "(MUR|₨\\.?|[rR]s)", mult: "()"},
        MVR: {name: "MVR", regex: "(MVR|MRF\\.?|MRf\\.?|Mrf\\.?|Rf\\.?|RF\\.?|Rufiyaa)", mult: "()"},
        MWK: {name: "MWK", regex: "(MWK|MwK|Mwk|M?K)", mult: "()"},
        MXN: {name: "MXN", regex: "(MXN|MEX\\$|Mex\\$|\\$)", mult: "()"},
        MXV: {name: "MXV", regex: "(MXV)", mult: "()"},
        MYR: {name: "MYR", regex: "(MYR|RM)", mult: "()"},
        MZN: {name: "MZN", regex: "(MZN)", mult: "()"},
        NAD: {name: "NAD", regex: "(NAD|N?\\$)", mult: "()"},
        NGN: {name: "NGN", regex: "(NGN|₦|N)", mult: "()"},
        NIO: {name: "NIO", regex: "(NIO|C?\\$)", mult: "()"},
        NOK: {name: "NOK", regex: "(NOK|kr\\.?|NKR\\.?|NKr\\.?|Nkr\\.?|nkr\\.?)", mult: "()"},
        NPR: {name: "NPR", regex: "(NPR|N?Rs\\.?|रू)", mult: "()"},
        NZD: {name: "NZD", regex: "(NZD|NZ\\s?\\$|\\$)", mult: "()"},
        OMR: {name: "OMR", regex: "(OMR|ر\\.ع\\.|ر\\.ع|ريال‎|[rR]ials?|R\\.?O\\.?)", mult: "()"},
        PAB: {name: "PAB", regex: "(PAB|B\\/\\.?)", mult: "()"},
        PEN: {name: "PEN", regex: "(PEN|S\\/\\.?)", mult: "()"},
        PGK: {name: "PGK", regex: "(PGK|K)", mult: "()"},
        PHP: {name: "PHP", regex: "(PHP|₱|PhP|Php|P)", mult: "()"},
        PKR: {name: "PKR", regex: "(PKR|₨\\.?|Rs\\.?|روپیہ)", mult: "()"},
        PLN: {name: "PLN", regex: "(PLN|zł)", mult: "()"},
        PYG: {name: "PYG", regex: "(PYG|₲|Gs?\\.?)", mult: "()"},
        QAR: {name: "QAR", regex: "(QAR|QR\\.?|ريال|ر\\.ق)", mult: "()"},
        RON: {name: "RON", regex: "(RON)", mult: "()"},
        RSD: {name: "RSD", regex: "(RSD)", mult: "()"},
        RUB: {name: "RUB", regex: "(RUB|₽)", mult: "()"},
        RWF: {name: "RWF", regex: "(RWF|RwF|Rwf)", mult: "()"},
        SAR: {name: "SAR", regex: "(SAR|SR|﷼|ريال|ر\\.س)", mult: "()"},
        SBD: {name: "SBD", regex: "(SBD\\.?\\$?|SI\\$|\\$)", mult: "()"},
        SCR: {name: "SCR", regex: "(SCR|SR|Sr\\.?)", mult: "()"},
        SDG: {name: "SDG", regex: "(SDG|جنيه)", mult: "()"},
        SEK: {name: "SEK", regex: "(SEK|kr|skr)", mult: "()"},
        SGD: {name: "SGD", regex: "(SGD|SGD\\s?\\$?|S?\\$)", mult: "()"},
        SHP: {name: "SHP", regex: "(SHP|£)", mult: "()"},
        SLE: {name: "SLE", regex: "(SLE|L[eE]\\.?)", mult: "()"},
        SOS: {name: "SOS", regex: "(SOS)", mult: "()"},
        SRD: {name: "SRD", regex: "(SRD|\\$)", mult: "()"},
        SSP: {name: "SSP", regex: "(SSP)", mult: "()"},
        STN: {name: "STN", regex: "(STN|Dbs?\\.?)", mult: "()"},
        SVC: {name: "SVC", regex: "(SVC|₡|¢)", mult: "()"},
        SYP: {name: "SYP", regex: "(SYP|S\\.?P\\.?|ليرة)", mult: "()"},
        SZL: {name: "SZL", regex: "(SZL|[eE]malangeni|E)", mult: "()"},
        THB: {name: "THB", regex: "(THB|฿)", mult: "()"},
        TJS: {name: "TJS", regex: "(TJS|سامانی)", mult: "()"},
        TMT: {name: "TMT", regex: "(TMT)", mult: "()"},
        TND: {name: "TND", regex: "(TND)", mult: "()"},
        TOP: {name: "TOP", regex: "(TOP|TOP\\$|T?\\$)", mult: "()"},
        TRY: {name: "TRY", regex: "(TRY|₺|TL)", mult: "()"},
        TTD: {name: "TTD", regex: "(TTD|TTD\\$?|TT\\$|\\$)", mult: "()"},
        TWD: {name: "TWD", regex: "(TWD|NT\\$|\\$)", mult: "()"},
        TZS: {name: "TZS", regex: "(TZS|TZs|Tsh\\.?)", mult: "()"},
        UAH: {name: "UAH", regex: "(UAH|₴)", mult: "()"},
        UGX: {name: "UGX", regex: "(UGX|USH\\.?|USh\\.?|Ush\\.?|[sS]hillings)", mult: "()"},
        USD: {
            name: "USD",
            regex: "(USD|USD\\s?\\$?|US\\s?\\$|Us\\s?\\$|\\$|\\$USD|U\\$S|долла…долларов|доллара? США|долларов США|бакса?|баксов)",
            mult: "(|[mM]illions?|[mM]illiards?|[bB]illions?)"
        },
        USN: {name: "USN", regex: "(USN)", mult: "()"},
        UYI: {name: "UYI", regex: "(UYI)", mult: "()"},
        UYU: {name: "UYU", regex: "(UYU|\\$U|\\$)", mult: "()"},
        UYW: {name: "UYW", regex: "(UYW)", mult: "()"},
        UZS: {name: "UZS", regex: "(UZS)", mult: "()"},
        VED: {name: "VED", regex: "(VED)", mult: "()"},
        VES: {name: "VES", regex: "(VES|[bB]s\\.?[fF]?\\.?)", mult: "()"},
        VND: {name: "VND", regex: "(VND|₫)", mult: "()"},
        VUV: {name: "VUV", regex: "(VUV|VT|Vt)", mult: "()"},
        WST: {name: "WST", regex: "(WST|WST\\$?|WS\\$|\\$|SAT\\$?|ST\\$)", mult: "()"},
        XAD: {name: "XAD", regex: "(XAD)", mult: "()"},
        XAF: {name: "XAF", regex: "(XAF|FCFA|CFA)", mult: "()"},
        XAG: {name: "XAG", regex: "(XAG)", mult: "()"},
        XAU: {name: "XAU", regex: "(XAU)", mult: "()"},
        XBA: {name: "XBA", regex: "(XBA)", mult: "()"},
        XBB: {name: "XBB", regex: "(XBB)", mult: "()"},
        XBC: {name: "XBC", regex: "(XBC)", mult: "()"},
        XBD: {name: "XBD", regex: "(XBD)", mult: "()"},
        XCD: {name: "XCD", regex: "(XCD|ECD?\\s?\\$|\\$)", mult: "()"},
        XCG: {name: "XCG", regex: "(XCG)", mult: "()"},
        XDR: {name: "XDR", regex: "(XDR|SDR)", mult: "()"},
        XOF: {name: "XOF", regex: "(XOF|FCFA|CFA)", mult: "()"},
        XPD: {name: "XPD", regex: "(XPD)", mult: "()"},
        XPF: {name: "XPF", regex: "(XPF)", mult: "()"},
        XPT: {name: "XPT", regex: "(XPT)", mult: "()"},
        XSU: {name: "XSU", regex: "(XSU)", mult: "()"},
        XTS: {name: "XTS", regex: "(XTS)", mult: "()"},
        XUA: {name: "XUA", regex: "(XUA)", mult: "()"},
        XXX: {name: "XXX", regex: "(XXX)", mult: "()"},
        YER: {name: "YER", regex: "(YER|Y\\.?R\\.?|﷼|ريال)", mult: "()"},
        ZAR: {name: "ZAR", regex: "(ZAR|R)", mult: "()"},
        ZMW: {name: "ZMW", regex: "(ZMW|Zmk|K)", mult: "()"},
        ZWG: {name: "ZWG", regex: "(ZWG|Z\\$)", mult: "()"},
    },
    regexes2: {
        AED: {name: "AED", regex: "(AED|Dhs?|dirhams?|fils|fulus)", mult: "()"},
        AFN: {name: "AFN", regex: "(AFN|\\s؋\\s?afs?|afs?|افغانۍ|afghanis?|pul)", mult: "()"},
        ALL: {name: "ALL", regex: "(ALL|[lL]ekë?|L|qindarkë|qindarka)", mult: "()"},
        AMD: {name: "AMD", regex: "(AMD|\\u058F|Դրամ|drams?|драм|luma)", mult: "()"},
        AOA: {name: "AOA", regex: "(AOA|Kz|kwanzas?|cêntimos?|centimos?)", mult: "()"},
        ARS: {name: "ARS", regex: "(ARS|AR\\$|\\$|pesos?|centavos?)", mult: "()"},
        AUD: {name: "AUD", regex: "(AUD|AUD\\$|AU?\\$|\\$|dollars?|[cC]ents?)", mult: "()"},
        AWG: {name: "AWG", regex: "(AWG|[aA]fl\\.?|\\sflorin|[cC]ents?)", mult: "()"},
        AZN: {name: "AZN", regex: "(AZN|₼|manat|man\\.?|qapik)", mult: "()"},
        BAM: {name: "BAM", regex: "(BAM|KM|pf)", mult: "()"},
        BBD: {name: "BBD", regex: "(BBD|\\$|dollars?|[cC]ents?)", mult: "()"},
        BDT: {name: "BDT", regex: "(BDT|টাকা|Tk|taka|poisha)", mult: "()"},
        BGN: {name: "BGN", regex: "(BGN|лв\\.?|лева?|lv\\.?|leva?|stotinka|stotinki)", mult: "()"},
        BHD: {name: "BHD", regex: "(BHD|\\.د\\.ب|dinars?|دينار|fils)", mult: "()"},
        BIF: {name: "BIF", regex: "(BIF|Fbu?|francs|Fr)", mult: "()"},
        BMD: {name: "BMD", regex: "(BMD|\\$|dollars?|[cC]ents?)", mult: "()"},
        BND: {name: "BND", regex: "(BND|\\$|dollars?|[cC]ents?)", mult: "()"},
        BOB: {name: "BOB", regex: "(BOB|Bs\\.?|Bolivianos?|centavos?)", mult: "()"},
        BOV: {name: "BOV", regex: "(BOV|MVDOL|centavos?)", mult: "()"},
        BRL: {name: "BRL", regex: "(BRL|R\\$|real|reais|centavos?)", mult: "()"},
        BSD: {name: "BSD", regex: "(BSD|\\$|dollars?|[cC]ents?)", mult: "()"},
        BTN: {name: "BTN", regex: "(BTN|[nN]gultrum|དངུལ་ཀྲམ|chhertum)", mult: "()"},
        BWP: {name: "BWP", regex: "(BWP|pula|thebe)", mult: "()"},
        BYN: {name: "BYN", regex: "(BYN|Br\\.?|бр\\.?|рубель|рублёў|рублей|rubles?|kopek|капейка|капейкі)", mult: "()"},
        BZD: {name: "BZD", regex: "(BZD|\\$|dollars?|[cC]ents?)", mult: "()"},
        CAD: {name: "CAD", regex: "(CAD|\\$|dollars?|[cC]ents?)", mult: "()"},
        CDF: {name: "CDF", regex: "(CDF|F[Cc]|francs|centimes?)", mult: "()"},
        CHE: {name: "CHE", regex: "(CHE)", mult: "()"},
        CHF: {name: "CHF", regex: "(CHF|Fr\\.|Franken|Rappen|centimes?|centesimo|centesimi|rap)", mult: "()"},
        CHW: {name: "CHW", regex: "(CHW)", mult: "()"},
        CLF: {name: "CLF", regex: "(CLF|U\\.?F\\.?|Unidades de Fomentos)", mult: "()"},
        CLP: {name: "CLP", regex: "(CLP|[Pp]esos?)", mult: "()"},
        CNY: {name: "CNY", regex: "(CNY|¥|[yY]u[áa]n|[rR]enminbi|RMB|fen|fēn)", mult: "()"},
        COP: {name: "COP", regex: "(COP|pesos?|centavos?)", mult: "()"},
        COU: {name: "COU", regex: "(COU|UVR|Unidades de Valor Real|centavos?)", mult: "()"},
        CRC: {name: "CRC", regex: "(CRC|[cC]ol[oó]n(es)|céntimos?|centimo?)", mult: "()"},
        CUP: {name: "CUP", regex: "(CUP|[pP]esos?|centavos?)", mult: "()"},
        CVE: {name: "CVE", regex: "(CVE|\\$|ESC(UDOS)?|Esc(udos)?|esc(udos)?)", mult: "()"},
        CZK: {name: "CZK", regex: "(CZK|Kč|koruna?y?|haléř|haléře|haléřů)", mult: "()"},
        DJF: {name: "DJF", regex: "(DJF|[Ff][Dd][Jj]|francs?)", mult: "()"},
        DKK: {
            name: "DKK",
            regex: "(DKK|kroner|kr(ónur)?|krónur?|kr|dkr|øre|:-|,-)",
            mult: "(|mio\\.|million(er)?|mia\\.|.milliard(ir)?|millión(ir)?|mill?jón(ir)?)"
        },
        DOP: {name: "DOP", regex: "(DOP|pesos?|centavos?)", mult: "()"},
        DZD: {name: "DZD", regex: "(DZD|دج|DA|dinars?|centimes?)", mult: "()"},
        EGP: {name: "EGP", regex: "(EGP|L\\.?E|EGL|E£|ج\\.م|pounds|piastres?)", mult: "()"},
        ERN: {name: "ERN", regex: "(ERN|Nkf|Nfk|ናቕፋ|[nN]akfa|[cC]ents?)", mult: "()"},
        ETB: {name: "ETB", regex: "(ETB|Br|ብር|[bB]irr|santim)", mult: "()"},
        EUR: {
            name: "EUR",
            regex: "(EUR|€|euros?t?a?|евро|evro|euri|eura|ευρώ|evrō|eu…athan|eurá|eúr|evro|evra|evri|evrov|欧元|[cC]ents?)",
            mult: "()"
        },
        FJD: {name: "FJD", regex: "(FJD|\\$|dollars?|[cC]ents?)", mult: "()"},
        FKP: {name: "FKP", regex: "(FKP|£|pounds|penny|pence)", mult: "()"},
        GBP: {name: "GBP", regex: "(GBP|£|pounds|penny|pence)", mult: "(|[mM]illions?|[bB]illions?)"},
        GEL: {name: "GEL", regex: "(GEL|ლარი|lari|tetri)", mult: "()"},
        GHS: {name: "GHS", regex: "(GHS|GH₵|cedi|pesewa)", mult: "()"},
        GIP: {name: "GIP", regex: "(GIP|£|pounds|penny|pence)", mult: "()"},
        GMD: {name: "GMD", regex: "(GMD|Dalasis?|butut)", mult: "()"},
        GNF: {name: "GNF", regex: "(GNF|FG|fg|francs?)", mult: "()"},
        GTQ: {name: "GTQ", regex: "(GTQ|Q|quetzal(es)?|q|centavos?)", mult: "()"},
        GYD: {name: "GYD", regex: "(GYD|\\$|dollars?|[cC]ents?)", mult: "()"},
        HKD: {name: "HKD", regex: "(HKD|\\$|dollars?|[cC]ents?)", mult: "()"},
        HNL: {name: "HNL", regex: "(HNL|lempiras?|centavos?)", mult: "()"},
        HTG: {name: "HTG", regex: "(HTG|[gG]ourdes?|G|centimes?)", mult: "()"},
        HUF: {name: "HUF", regex: "(HUF|Ft|forint|fillér)", mult: "()"},
        IDR: {name: "IDR", regex: "(IDR|[rR]upiah|sen)", mult: "()"},
        ILS: {name: "ILS", regex: "(ILS|NIS|₪|שֶׁקֶל|shekel|agora)", mult: "()"},
        INR: {name: "INR", regex: "(INR|Rs\\.?|rupees|paisa)", mult: "()"},
        IQD: {name: "IQD", regex: "(IQD|دينار|د\\.ع|dinars?|fils)", mult: "()"},
        IRR: {name: "IRR", regex: "(IRR|ریال|﷼|[rR]ials?)", mult: "()"},
        ISK: {
            name: "ISK",
            regex: "(ISK|króna?(ur)?|kr|iskr|:-|,-)",
            mult: "(|milljarð(ar?)?(ur)?|milljón(a)?(ir)?(um)?|þúsund)"
        },
        JMD: {name: "JMD", regex: "(JMD|\\$|dollars?|[cC]ents?)", mult: "()"},
        JOD: {name: "JOD", regex: "(JOD|JD|dinars?|دينار|fils)", mult: "()"},
        JPY: {name: "JPY", regex: "(JPY|¥|￥|yen|円|圓)", mult: "()"},
        KES: {name: "KES", regex: "(KES|ksh|Shillings?|[cC]ents?)", mult: "()"},
        KGS: {name: "KGS", regex: "(KGS|soms?|сом|tyiyn)", mult: "()"},
        KHR: {name: "KHR", regex: "(KHR|៛|រៀល|[rR]iels?|sen)", mult: "()"},
        KMF: {name: "KMF", regex: "(KMF|[fF][cC]|francs?)", mult: "()"},
        KPW: {name: "KPW", regex: "(KPW|₩|￦|원|wons?|chon)", mult: "()"},
        KRW: {name: "KRW", regex: "(KRW|₩|￦|원|wons?)", mult: "()"},
        KWD: {name: "KWD", regex: "(KWD|K\\.?D\\.?|\\.د\\.ب|dinars?|دينار|fils)", mult: "()"},
        KYD: {name: "KYD", regex: "(KYD|[cC]ents?)", mult: "()"},
        KZT: {name: "KZT", regex: "(KZT|₸|tenge|теңге|tïın)", mult: "()"},
        LAK: {name: "LAK", regex: "(LAK|ກີ|₭N?|[kK]ip|KIP|att|ອັ)", mult: "()"},
        LBP: {name: "LBP", regex: "(LBP|Lebanese [pP]ounds?|L\\.L\\.?|ل\\.ل\\.|ليرات|piastres?)", mult: "()"},
        LKR: {name: "LKR", regex: "(LKR|Rs\\.?|rupees|ரூபாய்|[cC]ents?)", mult: "()"},
        LRD: {name: "LRD", regex: "(LRD|\\$|dollars?|[cC]ents?)", mult: "()"},
        LSL: {name: "LSL", regex: "(LSL|Maloti|LOTI|sente|lisente)", mult: "()"},
        LYD: {name: "LYD", regex: "(LYD|L\\.?D\\.?|ل\\.د|دينار|dinars?|dirham)", mult: "()"},
        MAD: {name: "MAD", regex: "(MAD|د\\.م\\.|دراهم|dhs|Dh\\.?|dirhams?|santim)", mult: "()"},
        MDL: {name: "MDL", regex: "(MDL|leu|lei|лей|леев|bani?)", mult: "()"},
        MGA: {
            name: "MGA",
            regex: "(MGA|mga|Mga|[aA]riary|[aA][rR])",
            mult: "(|millions?( d['’])?|milliards?( d['’])?)"
        },
        MKD: {name: "MKD", regex: "(MKD|денари?|ден|den(ari?)?|deni|дени)", mult: "()"},
        MMK: {name: "MMK", regex: "(MMK|[kK][sS]|[kK]yat|ကျပ်|pya)", mult: "()"},
        MNT: {name: "MNT", regex: "(MNT|₮|ᠲᠥᠭᠦᠷᠢᠭ|төгрөг|tögrögs?|tugrik|möngö|мөнгө)", mult: "()"},
        MOP: {name: "MOP", regex: "(MOP|MOP\\$|澳門圓|澳门圆|[pP]atacas?|sin|仙)", mult: "()"},
        MRU: {name: "MRU", regex: "(MRU|أوقية|ouguiya|um|UM)", mult: "()"},
        MUR: {name: "MUR", regex: "(MUR|[rR]upees?|[rR]oupies?|[rR]s|[cC]ents?)", mult: "()"},
        MVR: {name: "MVR", regex: "(MVR|mrf|Rufiyaa|laari)", mult: "()"},
        MWK: {name: "MWK", regex: "(MWK|MK|[kK]wacha|tambala)", mult: "()"},
        MXN: {name: "MXN", regex: "(MXN|MEX\\$|Mex\\$|[pP]esos?|centavos?)", mult: "()"},
        MXV: {name: "MXV", regex: "(MXV|UDIS?|[uU]nidades de Inversión|UNIDADES DE INVERSIÓN)", mult: "()"},
        MYR: {name: "MYR", regex: "(MYR|[rR]inggit|sen)", mult: "()"},
        MZN: {name: "MZN", regex: "(MZN|MTn|[mM]etical|[mM]eticais|centavos?)", mult: "()"},
        NAD: {name: "NAD", regex: "(NAD|dollars?|[cC]ents?)", mult: "()"},
        NGN: {name: "NGN", regex: "(NGN|[nN]aira|kobo)", mult: "()"},
        NIO: {name: "NIO", regex: "(NIO|córdoba|centavos?)", mult: "()"},
        NOK: {name: "NOK", regex: "(NOK|kroner|kr\\.?|NKR|NKr|Nkr|nkr|:-|,-)", mult: "(|milliard(er)?|million(er)?)"},
        NPR: {name: "NPR", regex: "(NPR|rupees?|रूपैयाँ|paisa)", mult: "()"},
        NZD: {name: "NZD", regex: "(NZD|[dD]ollars?|[cC]ents?)", mult: "()"},
        OMR: {name: "OMR", regex: "(OMR|ريال عماني|ر\\.ع\\.|ر\\.ع|ريال‎|Omani [rR]ials?|[rR]ials?|baisa)", mult: "()"},
        PAB: {name: "PAB", regex: "(PAB|[bB]alboa|centésimos?|centesimos?)", mult: "()"},
        PEN: {name: "PEN", regex: "(PEN|SOL|Sol(es)?|sol(es)?|céntimos?|centimos?)", mult: "()"},
        PGK: {name: "PGK", regex: "(PGK|[kK]ina|toea)", mult: "()"},
        PHP: {name: "PHP", regex: "(PHP|[pP]isos?|[pP]esos?|sentimos?|centavos?)", mult: "()"},
        PKR: {name: "PKR", regex: "(PKR|[rR]upees?|روپیہ|paisa)", mult: "()"},
        PLN: {name: "PLN", regex: "(PLN|zł|złoty|zlotys?|grosz)", mult: "()"},
        PYG: {name: "PYG", regex: "(PYG|[gG]s\\.?|guaraní(es)?)", mult: "()"},
        QAR: {name: "QAR", regex: "(QAR|[rR]iyals?|ريال|ر\\.ق|dirham)", mult: "()"},
        RON: {name: "RON", regex: "(RON|[lL]eu|[lL]ei|bani?)", mult: "()"},
        RSD: {name: "RSD", regex: "(RSD|РСД|dinars?|din\\.?|динара?|дин\\.?|para)", mult: "()"},
        RUB: {
            name: "RUB",
            regex: "(RUB|₽|рублей|рубль|руб\\.?|[рP]\\.|[rR]o?ubles?|rub\\.?|коп.?|kopek|копеек)",
            mult: "()"
        },
        RWF: {name: "RWF", regex: "(RWF|Rwf|Rwandan [fF]rancs?|[fF]rancs?)", mult: "()"},
        SAR: {name: "SAR", regex: "(SAR|SR|﷼|ريال|ر\\.س|Saudi [rR]iyals?|[rR]iyals?|halalah|هللة)", mult: "()"},
        SBD: {name: "SBD", regex: "(SBD|\\$|dollars?|[cC]ents?)", mult: "()"},
        SCR: {name: "SCR", regex: "(SCR|[rR]upees?|[rR]oupies?|[cC]ents?)", mult: "()"},
        SDG: {name: "SDG", regex: "(SDG|جنيه|Sudanese [pP]ounds?|pounds|qirsh|piastre)", mult: "()"},
        SEK: {
            name: "SEK",
            regex: "(SEK|öre|(svenska\\s)?kr(onor)?|mnkr|mdkr|mkr|s?[kK][rR]|kSEK|MSEK|GSEK|:-|,-)",
            mult: "(|miljon(?:er)?|miljard(?:er)?)"
        },
        SGD: {name: "SGD", regex: "(SGD|(Singapore)?\\s?[dD]ollars?|[cC]ents?)", mult: "()"},
        SHP: {name: "SHP", regex: "(SHP|£|pounds|penny|pence)", mult: "()"},
        SLE: {name: "SLE", regex: "(SLE|[lL]eone|[cC]ents?)", mult: "()"},
        SOS: {name: "SOS", regex: "(SOS|Sh\\.?\\s?So\\.?|[sS]hillings?|senti)", mult: "()"},
        SRD: {name: "SRD", regex: "(SRD|[dD]ollars?|[cC]ents?)", mult: "()"},
        SSP: {name: "SSP", regex: "(SSP|pounds|piasters?)", mult: "()"},
        STN: {name: "STN", regex: "(STN|dbs|[dD]obra|cêntimos?|centimos?)", mult: "()"},
        SVC: {name: "SVC", regex: "(SVC|svc|[cC]ol[oó]n(es)?|centavos?)", mult: "()"},
        SYP: {
            name: "SYP",
            regex: "(SYP|S\\.?P\\.?|(de )?L\\.?S\\.?|Syrian [pP]ounds?|[lL]ivres? [sS]yriennes?|[lL]ivres?|ليرة|piastre)",
            mult: "()"
        },
        SZL: {name: "SZL", regex: "(SZL|Lilangeni|[cC]ents?)", mult: "()"},
        THB: {name: "THB", regex: "(THB|(Thai )?[bB]aht|บาท|satang)", mult: "()"},
        TJS: {name: "TJS", regex: "(TJS|[sS]omoni|cомонӣ|diram)", mult: "()"},
        TMT: {name: "TMT", regex: "(TMT|[mM]anat|манат|tenge|teňňe)", mult: "()"},
        TND: {name: "TND", regex: "(TND|DT|[dD][tT]|[dD]inars?|د\\.ت|دينار|milli(me)?)", mult: "()"},
        TOP: {name: "TOP", regex: "(TOP|[pP]a'anga|seniti)", mult: "()"},
        TRY: {name: "TRY", regex: "(TRY|[lL]ira|TL|kuruş)", mult: "()"},
        TTD: {name: "TTD", regex: "(TTD|dollars?|[cC]ents?)", mult: "()"},
        TWD: {name: "TWD", regex: "(TWD|NTD|dollars?|[cC]ents?|分|fēn)", mult: "()"},
        TZS: {name: "TZS", regex: "(TZS|TSH|Tsh|(Tanzanian )?[sS]hillings?|senti|[cC]ents?)", mult: "()"},
        UAH: {
            name: "UAH",
            regex: "(UAH|[hH]rn\\.?|грн\\.?|[hH]ryvnia?|[hH]ryven|гривна|гривня|гривні|гривень|kopiyka|копійка)",
            mult: "()"
        },
        UGX: {name: "UGX", regex: "(UGX|USh|(Ugandan? )?[sS]hillings?)", mult: "()"},
        USD: {
            name: "USD",
            regex: "(USD|US\\s?\\$|Us\\s?\\$|\\$|[dD]ollars?|доллара?|долла…ра? США|долларов США|бакса?|баксов|¢|￠|[cC]ents?)",
            mult: "(|[mM]illions?|[mM]illiards?|[bB]illions?)"
        },
        USN: {name: "USN", regex: "(USN)", mult: "()"},
        UYI: {name: "UYI", regex: "(UYI|U\\.?I\\.?|[uU]nidades [iI]ndexadas)", mult: "()"},
        UYU: {name: "UYU", regex: "(UYU|\\$U|[pP]esos?|centésimos?|centesimos?)", mult: "()"},
        UYW: {name: "UYW", regex: "(UYW)", mult: "()"},
        UZS: {name: "UZS", regex: "(UZS|uzs|som|сўм|сум|tiyin)", mult: "()"},
        VED: {name: "VED", regex: "(VED)", mult: "()"},
        VES: {name: "VES", regex: "(VES|[bB]s\\.?[fF]?|[bB]olívar(es)?|céntimos?|centimos?)", mult: "()"},
        VND: {name: "VND", regex: "(VND|vnd|vnđ|₫|[dD]ong|đồng|đ|ĐỒNG|VNĐ|Đ)", mult: "(|[nN]gàn|[tT]riệu|[tT]ỷ)"},
        VUV: {name: "VUV", regex: "(VUV|VT|vt|[vV]atu)", mult: "()"},
        WST: {name: "WST", regex: "(WST|WST\\$?|[tT]ālā|[tT]ala|sene)", mult: "()"},
        XAD: {name: "XAD", regex: "(XAD)", mult: "()"},
        XAF: {name: "XAF", regex: "(XAF|FCFA|Fcfa|cfa|CFA [fF]rancs?|[fF]rancs?|[fF])", mult: "()"},
        XAG: {name: "XAG", regex: "(XAG)", mult: "()"},
        XAU: {name: "XAU", regex: "(XAU)", mult: "()"},
        XBA: {name: "XBA", regex: "(XBA)", mult: "()"},
        XBB: {name: "XBB", regex: "(XBB)", mult: "()"},
        XBC: {name: "XBC", regex: "(XBC)", mult: "()"},
        XBD: {name: "XBD", regex: "(XBD)", mult: "()"},
        XCD: {name: "XCD", regex: "(XCD|ECD|[dD]ollars?|[cC]ents?)", mult: "()"},
        XCG: {name: "XCG", regex: "(XCG)", mult: "()"},
        XDR: {name: "XDR", regex: "(XDR|SDRs?|[sS]pecial [dD]rawing [rR]ights)", mult: "()"},
        XOF: {
            name: "XOF",
            regex: "(XOF|xof|FCFA|Fcfa|CFA [fF]rancs?|Frs CFA|CFA|cfa|[fF]rancos?|[fF]rancs?|[fF]rancos?|[fF])",
            mult: "()"
        },
        XPD: {name: "XPD", regex: "(XPD)", mult: "()"},
        XPF: {name: "XPF", regex: "(XPF|CFP|cfp|[fF]\\s?(cfp)|(CFP)|[fF]rcs CFP|[fF]rcs|[fF]rancs?|[fF])", mult: "()"},
        XPT: {name: "XPT", regex: "(XPT)", mult: "()"},
        XSU: {name: "XSU", regex: "(XSU)", mult: "()"},
        XTS: {name: "XTS", regex: "(XTS)", mult: "()"},
        XUA: {name: "XUA", regex: "(XUA)", mult: "()"},
        XXX: {name: "XXX", regex: "(XXX)", mult: "()"},
        YER: {name: "YER", regex: "(YER|Y\\.?R\\.?|[rR]iy?als?|﷼|ريال|fils)", mult: "()"},
        ZAR: {name: "ZAR", regex: "(ZAR|[rR]ands?|[cC]ents?)", mult: "()"},
        ZMW: {name: "ZMW", regex: "(ZMW|[kK]wacha|ngwee)", mult: "()"},
        ZWG: {name: "ZWG", regex: "(ZWG|[cC]ents?)", mult: "()"}
    },
    roundAmounts: false,
    showAsSymbol: false,
    showOriginalCurrencies: false,
    showOriginalPrices: true,
    showTooltip: true,
    tempConvertUnits: false
};

const convertToSekSettings = JSON.parse(JSON.stringify(convertToEurSettings));

convertToSekSettings.convertToCurrency = "SEK";


describe("#DirectCurrencyContent", function () {

    context("", function () {

        it("should update settings and convert value to 9,43 EUR", function () {

            const p = document.createElement("p");
            const text = document.createTextNode("100 SEK");
            p.append(text);
            document.body.append(p);

            DirectCurrencyContent.onUpdateSettings(convertToEurSettings);

            expect(p.textContent).to.equal("9,43 EUR (100 SEK)");

        });

        // TODO won't work since "SEK 100" is found first.
        xit("should update settings and convert values", function () {

            const p = document.createElement("p");
            const text = document.createTextNode("100 SEK 100 SEK");
            p.append(text);
            document.body.append(p);

            DirectCurrencyContent.onUpdateSettings(convertToEurSettings);

            expect(p.textContent).to.equal("9,43 EUR (100 SEK) 9,43 EUR (100 SEK)");

        });

        it("should update settings and convert value", function () {

            const p = document.createElement("p");
            const text = document.createTextNode("100 SEK, 100 SEK");
            p.append(text);
            document.body.append(p);

            DirectCurrencyContent.onUpdateSettings(convertToEurSettings);

            expect(p.textContent).to.equal("9,43 EUR (100 SEK), 9,43 EUR (100 SEK)");

        });

        // FIXME becomes '9,34 EUR (99 SEK),9,43 EUR ( 100 SEK)'
        xit("should update settings and convert value", function () {

            const p = document.createElement("p");
            const text = document.createTextNode("99 SEK, 100 SEK");
            p.append(text);
            document.body.append(p);

            DirectCurrencyContent.onUpdateSettings(convertToEurSettings);

            expect(p.textContent).to.equal("9,34 EUR (99 SEK), 9,43 EUR (100 SEK)");

        });

        // FIXME MSEK won't be converted because the multiplier must be separate from the currency.
        xit("should update settings and convert value", function () {

            const p = document.createElement("p");
            const text = document.createTextNode("100 MSEK");
            p.append(text);
            document.body.append(p);

            DirectCurrencyContent.onUpdateSettings(convertToEurSettings);

            expect(p.textContent).to.equal("9 434 542,70 EUR (100 miljoner kronor)");

        });

        it("should update settings and convert value", function () {

            const p = document.createElement("p");
            const text = document.createTextNode("100 miljoner kronor");
            p.append(text);
            document.body.append(p);

            DirectCurrencyContent.onUpdateSettings(convertToEurSettings);

            expect(p.textContent).to.equal("9 434 542,70 EUR (100 miljoner kronor)");
        });

        it("should convert 100 USD to 88,17 EUR with mocked findPrices", function () {
            // Mock DccFunctions.findPrices
            const findPricesStub = sinon.stub(DccFunctions, 'findPrices').callsFake((enabledCurrencies, toCurrency, text) => {
                if (text === "100 USD") {
                    return [{
                        originalCurrency: "USD",
                        currency: toCurrency,
                        amount: "100",
                        iso4217Currency: true
                    }];
                }
                return [];
            });

            // Mock other DccFunctions methods to control output
            sinon.stub(DccFunctions, 'convertContent').callsFake((price, quote, from, to, round, showOriginal, showCurrencies, content) => {
                const amount = parseFloat(price.amount) * quote;
                return `${amount.toFixed(2).replace('.', ',')} ${to} (${price.amount} ${from})`;
            });
            sinon.stub(DccFunctions, 'checkMinorUnit').returns(2);
            sinon.stub(DccFunctions, 'parseAmount').callsFake(amount => parseFloat(amount));
            sinon.stub(DccFunctions, 'formatDefaultIso4217Price').callsFake(amount => `${amount.toFixed(2).replace('.', ',')} EUR`);
            sinon.stub(DccFunctions, 'formatIso4217Price').callsFake((lang, amount, currency) => `${amount} ${currency}`);
            sinon.stub(DccFunctions, 'formatOther').callsFake((amount, currency) => `${amount} ${currency}`);

            const p = document.createElement("p");
            const text = document.createTextNode("100 USD");
            p.append(text);
            document.body.append(p);

            DirectCurrencyContent.onUpdateSettings(convertToEurSettings);

            expect(p.textContent).to.equal("88,17 EUR (100 USD)");

            findPricesStub.restore();
            DccFunctions.convertContent.restore();
            DccFunctions.checkMinorUnit.restore();
            DccFunctions.parseAmount.restore();
            DccFunctions.formatDefaultIso4217Price.restore();
            DccFunctions.formatIso4217Price.restore();
            DccFunctions.formatOther.restore();
        });

        it("should convert US$100 to 88,17 EUR with mocked findPrices", function () {
            // Mock DccFunctions.findPrices
            const findPricesStub = sinon.stub(DccFunctions, 'findPrices').callsFake((enabledCurrencies, toCurrency, text) => {
                if (text === "US$100") {
                    return [{
                        originalCurrency: "USD",
                        currency: toCurrency,
                        amount: "100",
                        iso4217Currency: true
                    }];
                }
                return [];
            });

            // Mock other DccFunctions methods to control output
            sinon.stub(DccFunctions, 'convertContent').callsFake((price, quote, from, to, round, showOriginal, showCurrencies, content) => {
                const amount = parseFloat(price.amount) * quote;
                return `${amount.toFixed(2).replace('.', ',')} ${to} (${price.amount} ${from})`;
            });
            sinon.stub(DccFunctions, 'checkMinorUnit').returns(2);
            sinon.stub(DccFunctions, 'parseAmount').callsFake(amount => parseFloat(amount));
            sinon.stub(DccFunctions, 'formatDefaultIso4217Price').callsFake(amount => `${amount.toFixed(2).replace('.', ',')} EUR`);
            sinon.stub(DccFunctions, 'formatIso4217Price').callsFake((lang, amount, currency) => `${amount} ${currency}`);
            sinon.stub(DccFunctions, 'formatOther').callsFake((amount, currency) => `${amount} ${currency}`);

            const p = document.createElement("p");
            const text = document.createTextNode("US$100");
            p.append(text);
            document.body.append(p);

            DirectCurrencyContent.onUpdateSettings(convertToEurSettings);

            expect(p.textContent).to.equal("88,17 EUR (100 USD)");

            findPricesStub.restore();
            DccFunctions.convertContent.restore();
            DccFunctions.checkMinorUnit.restore();
            DccFunctions.parseAmount.restore();
            DccFunctions.formatDefaultIso4217Price.restore();
            DccFunctions.formatIso4217Price.restore();
            DccFunctions.formatOther.restore();
        });

        it("should convert 50 GBP to 57,55 EUR with mocked convertContent", function () {
            // Mock DccFunctions.findPrices to return a price object
            const findPricesStub = sinon.stub(DccFunctions, 'findPrices').callsFake((enabledCurrencies, toCurrency, text) => {
                if (text === "50 GBP") {
                    return [{
                        originalCurrency: "GBP",
                        currency: toCurrency,
                        amount: "50",
                        iso4217Currency: true
                    }];
                }
                return [];
            });

            // Mock DccFunctions.convertContent to control output
            const convertContentStub = sinon.stub(DccFunctions, 'convertContent').callsFake((price, quote, from, to, round, showOriginal, showCurrencies, content) => {
                const amount = parseFloat(price.amount) * quote;
                return `${amount.toFixed(2).replace('.', ',')} ${to} (${price.amount} ${from})`;
            });

            // Mock other DccFunctions methods
            sinon.stub(DccFunctions, 'checkMinorUnit').returns(2);
            sinon.stub(DccFunctions, 'parseAmount').callsFake(amount => parseFloat(amount));
            sinon.stub(DccFunctions, 'formatDefaultIso4217Price').callsFake(amount => `${amount.toFixed(2).replace('.', ',')} EUR`);
            sinon.stub(DccFunctions, 'formatIso4217Price').callsFake((lang, amount, currency) => `${amount} ${currency}`);
            sinon.stub(DccFunctions, 'formatOther').callsFake((amount, currency) => `${amount} ${currency}`);

            const p = document.createElement("p");
            const text = document.createTextNode("50 GBP");
            p.append(text);
            document.body.append(p);

            DirectCurrencyContent.onUpdateSettings(convertToEurSettings);

            expect(p.textContent).to.equal("57,55 EUR (50 GBP)");

            // Restore stubs
            findPricesStub.restore();
            convertContentStub.restore();
            DccFunctions.checkMinorUnit.restore();
            DccFunctions.parseAmount.restore();
            DccFunctions.formatDefaultIso4217Price.restore();
            DccFunctions.formatIso4217Price.restore();
            DccFunctions.formatOther.restore();
        });
    });

    context("", function () {
        it("should update settings and leave the value alone", function () {

            const p = document.createElement("p");
            const text = document.createTextNode("99 SEK 100 SEK");
            p.append(text);
            document.body.append(p);

            DirectCurrencyContent.onUpdateSettings(convertToSekSettings);

            expect(p.textContent).to.equal("99 SEK 100 SEK");

        });

        // TODO false positive, DKK
        xit("should update settings and leave the value alone", function () {

            const p = document.createElement("p");
            const text = document.createTextNode("99 kr");
            p.append(text);
            document.body.append(p);

            DirectCurrencyContent.onUpdateSettings(convertToSekSettings);

            expect(p.textContent).to.equal("99 kr");

        });
    });

});

