import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Edit this source, then run `node scripts/build-site.mjs` and the validation script.
// Change BASE only when the official-domain migration has actually been completed.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://vanlifemum-boop.github.io/Skydancer-/';
const UPDATED = '2026-10-21';
const TITLE = 'Skydancer Diamond – Cabrio-Camper mit Konfigurator';
const DESCRIPTION = 'Skydancer Diamond: der Cabrio-Camper mit öffnendem Panoramadach. Möbel, Polster, Normal-, Autark- oder Winterausführung und 3,5 oder 4,5 t konfigurieren.';
const CONTACT = 'mailto:milakubinsky@gmail.com?subject=Skydancer%20Diamond%20Beratung';
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const icon = name => `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><use href="#icon-${name}"></use></svg>`;
const icons = {
  arrow:'<path d="M7 17 17 7M7 7h10v10"/>',
  next:'<path d="m9 5 7 7-7 7"/>',
  previous:'<path d="m15 5-7 7 7 7"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  roof:'<path d="M3 18V9l5-4m8 0 5 4v9M3 18h18M9 9l3-6 3 6m-3-6v11"/>',
  camera:'<path d="m9 5-2 3H4a2 2 0 0 0-2 2v9h20v-9a2 2 0 0 0-2-2h-3l-2-3z"/><circle cx="12" cy="13" r="3"/>',
  wifi:'<path d="M3 9a15 15 0 0 1 18 0M6 12a10 10 0 0 1 12 0M9 15a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r=".7"/>',
  shield:'<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6zM8 12l3 3 5-6"/>',
  energy:'<rect x="3" y="6" width="16" height="12" rx="2"/><path d="M22 10v4M11 8l-3 5h6l-3 4"/>',
  winter:'<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3M3 10l4-1-1-4M18 19l-1-4 4-1M6 19l1-4-4-1M21 10l-4-1 1-4"/>',
  weight:'<path d="M4 19a9 9 0 1 1 16 0M12 13l5-5"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  play:'<path d="m8 5 11 7-11 7z"/>',
  control:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8v8M12 8v8M17 8v8M5 11h4M10 14h4M15 10h4"/>'
};
const picture = (file, alt, width, height, {hero=false, className=''}={}) => `<picture><source type="image/webp" srcset="assets/${file}-768.webp 768w, assets/${file}.webp ${width}w" sizes="${hero?'(max-width: 920px) 100vw, 68vw':'(max-width: 920px) 100vw, 60vw'}"><img ${className?`class="${className}" `:''}src="${file}.jpg" alt="${escape(alt)}" width="${width}" height="${height}" loading="${hero?'eager':'lazy'}" decoding="async"${hero?' fetchpriority="high" draggable="false"':''}></picture>`;
const faqs = [
  {q:'Was ist der Skydancer Diamond?',a:'Der Skydancer Diamond ist ein Cabrio-Reisemobil mit einer verglasten Panoramakabine und einem öffnenden Cabrio-Dach. Das Modell verbindet den Wohnbereich eines Campers mit dem offenen Raumgefühl eines Cabrios. Auf dieser Seite steht der Diamond, die dritte Skydancer-Entwicklungsstufe, im Mittelpunkt.'},
  {q:'Was macht das Cabrio-Dach besonders?',a:'Das Cabrio-Dach öffnet die Panoramakabine nach oben. Dadurch entsteht ein direkter Blick zum Himmel. In der Kabine befinden sich vier vollwertige Sitzplätze. Bedienung und zulässige Nutzung des Dachs werden bei der Fahrzeugberatung erläutert; maßgeblich sind die fahrzeugspezifischen Vorgaben.'},
  {q:'Was kann ich beim Skydancer Diamond konfigurieren?',a:'Sie können Wünsche für die Möbelfarbe und die Polster auswählen sowie die Ausführung Normal, Autark oder Winter und ein zulässiges Gesamtgewicht von 3,5 t oder 4,5 t anfragen. Die Bildschirmfarben dienen der Orientierung. Materialien, tatsächliche Farbtöne und technische Kombinationen werden in der Beratung abgestimmt.'},
  {q:'Was unterscheidet Normal, Autark und Winter?',a:'Normal bezeichnet die Basisausführung. Autark richtet sich an Reisen mit mehr Unabhängigkeit von externer Versorgung. Winter richtet sich an Reisen bei niedrigen Temperaturen. Welche Energie-, Heizungs- und Dämmkomponenten dafür verbaut werden, wird individuell festgelegt. Eine bestimmte Autarkiedauer oder Winter-Zertifizierung wird hier nicht zugesagt.'},
  {q:'Kann ich 3,5 t oder 4,5 t Gesamtgewicht auswählen?',a:'Im Konfigurator stehen 3,5 t und 4,5 t als gewünschtes zulässiges Gesamtgewicht zur Auswahl. Das ist nicht die Nutzlast. Ob die gewünschte Ausstattung und das Gewicht zusammenpassen, wird fahrzeugbezogen geprüft. Verbindlich sind das individuelle Angebot und die Zulassungsunterlagen.'},
  {q:'Was kostet ein Skydancer Diamond?',a:'Der Preis wird für die gewünschte Ausstattung individuell angeboten. Der Online-Konfigurator erstellt eine unverbindliche Anfrage und zeigt keinen verbindlichen Verkaufspreis. Preis, technische Freigabe und Liefertermin werden im persönlichen Gespräch geklärt.'},
  {q:'Wie frage ich meine Konfiguration an?',a:'Wählen Sie Ihre Optionen und klicken Sie auf „Konfiguration anfragen“. Ihr E-Mail-Programm öffnet sich mit einer Zusammenfassung. Erst wenn Sie die E-Mail selbst absenden, wird die Anfrage übermittelt. Alternativ erreichen Sie Skydancer unter +49 172 258 5752 oder milakubinsky@gmail.com.'},
  {q:'Wo kann ich Skydancer erreichen und eine Besichtigung anfragen?',a:'Die Kontaktadresse lautet Zur Mühle 2–4, 50226 Frechen bei Köln. Beratung, eine mögliche Besichtigung und die Verfügbarkeit eines Vorführfahrzeugs stimmen Sie bitte vorab telefonisch oder per E-Mail ab.'}
];
const facts = [
  ['Modell','Skydancer Diamond'],
  ['Fahrzeugkonzept','Cabrio-Camper / Cabrio-Reisemobil'],
  ['Besonderheit','Öffnendes Cabrio-Dach über der Panoramakabine'],
  ['Panoramakabine','Vier vollwertige Sitzplätze'],
  ['Interieur','Möbel- und Polsterfarben nach individueller Abstimmung'],
  ['Reiseausführung','Normal · Autark · Winter'],
  ['Gewichtswunsch','3,5 t oder 4,5 t zulässiges Gesamtgewicht – technische Prüfung erforderlich'],
  ['Angebot','Individuelle Beratung; Preis und Liefertermin auf Anfrage'],
  ['Kontaktstandort','Frechen bei Köln, Deutschland']
];
const graph = {
  '@context':'https://schema.org',
  '@graph':[
    {'@type':'Organization','@id':BASE+'#organization',name:'Skydancer',url:BASE,logo:BASE+'logo-original.png',email:'milakubinsky@gmail.com',telephone:'+491722585752',address:{'@type':'PostalAddress',streetAddress:'Zur Mühle 2–4',postalCode:'50226',addressLocality:'Frechen',addressCountry:'DE'},contactPoint:{'@type':'ContactPoint',telephone:'+491722585752',email:'milakubinsky@gmail.com',contactType:'Beratung',availableLanguage:'de'}},
    {'@type':'WebSite','@id':BASE+'#website',url:BASE,name:'Skydancer Diamond',inLanguage:'de-DE',publisher:{'@id':BASE+'#organization'}},
    {'@type':'WebPage','@id':BASE+'#webpage',url:BASE,name:TITLE,description:DESCRIPTION,inLanguage:'de-DE',dateModified:UPDATED,isPartOf:{'@id':BASE+'#website'},mainEntity:{'@id':BASE+'#diamond'},primaryImageOfPage:{'@type':'ImageObject',url:BASE+'skydancer-diamond-front.jpg',width:1255,height:750},hasPart:{'@id':BASE+'#faq'}},
    {'@type':'Vehicle','@id':BASE+'#diamond',name:'Skydancer Diamond',model:'Diamond',description:'Cabrio-Reisemobil mit öffnendem Cabrio-Dach und vier vollwertigen Sitzplätzen in der Panoramakabine. Möbel, Polster, Reiseausführung und gewünschtes Gesamtgewicht werden individuell abgestimmt.',url:BASE,category:'Cabrio-Reisemobil',brand:{'@type':'Brand',name:'Skydancer'},manufacturer:{'@id':BASE+'#organization'},image:['skydancer-diamond-front.jpg','skydancer-diamond-side.jpg','skydancer-diamond-panorama.jpg'].map(file=>BASE+file),vehicleSeatingCapacity:4,additionalProperty:[{'@type':'PropertyValue',name:'Cabrio-Dach',value:'Öffnendes Dach über der Panoramakabine'},{'@type':'PropertyValue',name:'Reiseausführungen',value:'Normal, Autark oder Winter – Ausstattung nach individueller Abstimmung'},{'@type':'PropertyValue',name:'Gewünschtes zulässiges Gesamtgewicht',value:'3,5 t oder 4,5 t – vorbehaltlich fahrzeugbezogener technischer Prüfung'}]},
    {'@type':'FAQPage','@id':BASE+'#faq',url:BASE+'#faq',inLanguage:'de-DE',isPartOf:{'@id':BASE+'#webpage'},mainEntity:faqs.map(({q,a})=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}
  ]
};
const option = (name, value, labelClass, content, checked=false) => `<label class="${labelClass}"><input type="radio" name="${name}" value="${escape(value)}"${checked?' checked':''}>${content}<span>${escape(value)}</span></label>`;
const services = [
  {icon:'camera',title:'Digitaler Kameraspiegel',text:'Eine passende Kameralösung für die Sicht nach hinten – fahrzeugbezogen geplant.'},
  {icon:'camera',title:'360° Surround View',text:'Optionales Rundumsicht-System für mehr Überblick beim Rangieren.'},
  {icon:'control',title:'Smartcamper Control',text:'Kompatible Bordtechnik, Energie und Komfort zentral bedienen.'},
  {icon:'wifi',title:'Internet unterwegs',text:'Professionell integrierte Verbindungslösungen. Empfang abhängig von Netz, Tarif und Standort.'}
];
const html = `<!doctype html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${TITLE}</title>
  <meta name="description" content="${DESCRIPTION}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="theme-color" content="#1b2f52">
  <link rel="canonical" href="${BASE}">
  <link rel="icon" type="image/png" href="logo-original.png">
  <link rel="sitemap" type="application/xml" href="${BASE}sitemap.xml">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="de_DE">
  <meta property="og:site_name" content="Skydancer">
  <meta property="og:title" content="${TITLE}">
  <meta property="og:description" content="${DESCRIPTION}">
  <meta property="og:url" content="${BASE}">
  <meta property="og:image" content="${BASE}skydancer-diamond-front.jpg">
  <meta property="og:image:width" content="1255">
  <meta property="og:image:height" content="750">
  <meta property="og:image:alt" content="Skydancer Diamond Cabrio-Camper mit Panoramakabine">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${TITLE}">
  <meta name="twitter:description" content="${DESCRIPTION}">
  <meta name="twitter:image" content="${BASE}skydancer-diamond-front.jpg">
  <meta name="twitter:image:alt" content="Skydancer Diamond Cabrio-Camper mit Panoramakabine">
  <link rel="preload" as="image" type="image/webp" href="assets/skydancer-diamond-front.webp" imagesrcset="assets/skydancer-diamond-front-768.webp 768w, assets/skydancer-diamond-front.webp 1255w" imagesizes="(max-width: 920px) 100vw, 68vw" fetchpriority="high">
  <link rel="stylesheet" href="assets/site-v2.css">
  <link rel="stylesheet" href="assets/seo-v2.css">
  <script type="application/ld+json">${JSON.stringify(graph).replace(/</g,'\\u003c')}</script>
  <script src="assets/site-v2.js" defer></script>
</head>
<body id="top">
<a class="skip-link" href="#konfigurator">Zum Inhalt springen</a>
<svg class="svg-definitions" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><defs>${Object.entries(icons).map(([name,content])=>`<symbol id="icon-${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${content}</symbol>`).join('')}</defs></svg>
<header class="site-header">
  <a class="brand" href="#top" aria-label="Skydancer Startseite"><img src="logo-original.png" alt="Skydancer" width="130" height="101"></a>
  <nav class="nav" id="main-navigation" aria-label="Hauptnavigation">
    <a href="#konfigurator">Konfigurator</a><a href="#cabrio">Cabrio-Dach</a><a href="#diamond">Diamond</a><a href="#faq">Fragen</a><a href="#service">Service</a>
  </nav>
  <a class="header-cta" href="#kontakt">Beratung ${icon('arrow')}</a>
  <button class="menu-button" type="button" aria-label="Menü öffnen" aria-expanded="false" aria-controls="main-navigation">${icon('menu')}</button>
</header>
<noscript><nav class="nojs-nav" aria-label="Navigation ohne JavaScript"><a href="#konfigurator">Konfigurator</a><a href="#cabrio">Cabrio-Dach</a><a href="#diamond">Diamond</a><a href="#faq">Fragen</a><a href="#kontakt">Kontakt</a></nav></noscript>
<main>
<section class="configurator" id="konfigurator" aria-label="Skydancer Diamond und Konfigurator">
  <div class="vehicle-stage" tabindex="0" role="region" aria-label="Fahrzeugansichten. Wechseln mit den Pfeiltasten oder durch Wischen.">
    ${picture('skydancer-diamond-front','Skydancer Diamond Cabrio-Camper in der Frontansicht mit Panoramakabine',1255,750,{hero:true,className:'vehicle-image'})}
    <div class="stage-scrim" aria-hidden="true"></div>
    <div class="hero-copy"><span class="eyebrow">Skydancer Diamond · Cabrio-Reisemobil</span><h1>Der Cabrio-Camper.<br>Dem Himmel ganz nah.</h1><p>Das Cabrio-Panoramadach öffnet den Blick zum Himmel – direkt aus der Panoramakabine.</p></div>
    <div class="hotspots" aria-label="Fahrzeugdetails">
      <button class="hotspot hotspot-roof is-active" type="button" aria-label="Cabrio-Panoramadach" aria-pressed="true" aria-controls="feature-callout" data-title="Cabrio-Panoramadach" data-description="Der Himmel wird Teil der Kabine – offen, geschützt und einzigartig.">${icon('roof')}</button>
      <button class="hotspot hotspot-camera" type="button" aria-label="Optionale 360-Grad-Kamera" aria-pressed="false" aria-controls="feature-callout" data-title="360° Kamera" data-description="Optionales Rundumsicht-System für entspanntes Rangieren und Parken.">${icon('camera')}</button>
      <button class="hotspot hotspot-connect" type="button" aria-label="Optionale Internetlösung" aria-pressed="false" aria-controls="feature-callout" data-title="Internet unterwegs" data-description="Individuell geplante Verbindungslösung. Verfügbarkeit abhängig von Netz, Tarif und Standort.">${icon('wifi')}</button>
    </div>
    <div class="feature-callout" id="feature-callout" aria-live="polite"><div class="feature-icon" id="feature-icon">${icon('roof')}</div><div><strong id="feature-title">Cabrio-Panoramadach</strong><span id="feature-text">Der Himmel wird Teil der Kabine – offen, geschützt und einzigartig.</span></div></div>
    <div class="view-controls"><button type="button" data-view="previous" aria-label="Vorherige Fahrzeugansicht">${icon('previous')}</button><span><span class="view-hint">Ziehen oder wischen · </span><span id="view-label" aria-live="polite">Diamond · Frontansicht</span></span><button type="button" data-view="next" aria-label="Nächste Fahrzeugansicht">${icon('next')}</button></div>
  </div>
  <aside class="config-panel" aria-labelledby="config-title">
    <div class="panel-heading"><div><p>Ihre Konfiguration</p><h2 id="config-title">Konfigurieren Sie Ihren Diamond.</h2></div></div>
    <form id="configuration" aria-label="Unverbindliche Wunschkonfiguration">
      <fieldset class="option-section compact-section"><legend>Möbelfarbe</legend><div class="swatch-options">${option('furniture','Graphit','swatch','<i class="graphite" aria-hidden="true"></i>',true)}${option('furniture','Arktisweiß','swatch','<i class="arctic" aria-hidden="true"></i>')}${option('furniture','Rauchgrau','swatch','<i class="smoke" aria-hidden="true"></i>')}</div></fieldset>
      <fieldset class="option-section compact-section"><legend>Polster</legend><div class="swatch-options">${option('upholstery','Nachtschwarz','swatch','<i class="black" aria-hidden="true"></i>',true)}${option('upholstery','Eisgrau','swatch','<i class="ice" aria-hidden="true"></i>')}${option('upholstery','Ozeanblau','swatch','<i class="ocean" aria-hidden="true"></i>')}</div></fieldset>
      <fieldset class="option-section compact-section"><legend>Reiseausführung</legend><div class="edition-options">${option('edition','Normal','edition',icon('shield'))}${option('edition','Autark','edition',icon('energy'),true)}${option('edition','Winter','edition',icon('winter'))}</div></fieldset>
      <fieldset class="option-section compact-section"><legend>Zulässiges Gesamtgewicht</legend><div class="weight-options">${option('weight','3,5 t','weight',icon('weight'),true)}${option('weight','4,5 t','weight',icon('weight'))}</div></fieldset>
    </form>
    <div class="config-summary"><div><span>Ihre Auswahl</span><strong id="selection-summary" aria-live="polite">Diamond · Autark · 3,5 t</strong></div><a class="request-button" data-configuration-link href="${CONTACT}">Konfiguration anfragen ${icon('arrow')}</a><small>Unverbindlicher Ausstattungswunsch. Farben nach Muster; Preis, Gewicht und technische Freigabe nach Beratung. Öffnet Ihr E-Mail-Programm.</small></div>
    <noscript><p class="nojs-note">Die Produktinformationen sind ohne JavaScript vollständig lesbar. Bitte nennen Sie Ihre gewünschten Optionen in der E-Mail oder telefonisch.</p></noscript>
  </aside>
</section>
<section class="statement-section" id="cabrio" aria-labelledby="roof-title">
  <span class="section-index">Cabrio-Dach</span><div class="statement-copy"><p class="eyebrow dark">Der Himmel wird Teil der Reise.</p><h2 id="roof-title">Geschützt unterwegs.<br>Offen dem Himmel nah.</h2></div>
  <div class="model-comparison">
    <article><div class="model-number" aria-hidden="true">P</div><span>Panoramakabine</span><h3>Rundum geschützt.<br>Panorama inklusive.</h3><p>Die großzügige Glaskabine verbindet vier vollwertige Sitzplätze mit freier Sicht in die Landschaft.</p><ul><li>${icon('check')} Vier Panoramasitzplätze</li><li>${icon('check')} Freie Rundumsicht</li><li>${icon('check')} Gemeinsam die Reise erleben</li></ul></article>
    <article class="featured-model"><div class="model-number" aria-hidden="true">C</div><span>Skydancer Diamond · Cabrio</span><h3>Dach geöffnet.<br>Freiheit spürbar.</h3><p>Das Cabrio-Dach öffnet die Panoramakabine nach oben und macht den Himmel zum Teil jeder Reise.</p><ul><li>${icon('check')} Großzügig öffnendes Cabrio-Dach</li><li>${icon('check')} Direkter Blick in den Himmel</li><li>${icon('check')} Einzigartiges Reisegefühl</li></ul></article>
  </div>
</section>
<section class="facts-section" id="diamond" aria-labelledby="diamond-title">
  <span class="section-index">Skydancer Diamond · Im Detail</span><div class="facts-layout"><div class="facts-intro"><h2 id="diamond-title">Ein Cabrio.<br>Ein Reisemobil.<br>Ihr Diamond.</h2><p>Der Skydancer Diamond ist ein Cabrio-Camper mit öffnendem Dach über der verglasten Panoramakabine. Hier steht die dritte Skydancer-Entwicklungsstufe im Mittelpunkt – mit vier vollwertigen Sitzplätzen und einem individuell abgestimmten Interieur.</p><p>Wählen Sie Ihre Wünsche im Konfigurator. Die konkrete Ausstattung wird gemeinsam mit Skydancer geplant.</p><a class="text-link" href="#configuration">Eigenen Skydancer konfigurieren ${icon('arrow')}</a><span class="updated-at">Informationen aktualisiert am <time datetime="${UPDATED}">21. Oktober 2026</time></span></div><div><table class="facts-table"><caption>Konzept und Konfigurationsmöglichkeiten</caption><tbody>${facts.map(([key,value])=>`<tr><th scope="row">${escape(key)}</th><td>${escape(value)}</td></tr>`).join('')}</tbody></table><p class="facts-note">Die Auswahl ist eine unverbindliche Wunschkonfiguration, kein verbindliches technisches Datenblatt. Fahrzeugmaße, Nutzlast, Energieausstattung, Preis und Liefertermin werden für das konkrete Fahrzeug bestätigt.</p></div></div>
</section>
<section class="film-section" id="erlebnis" aria-labelledby="film-title">
  <div class="film-copy"><span class="section-index light">Das Erlebnis</span><p class="eyebrow">Skydancer in Bewegung</p><h2 id="film-title">Dem Himmel näher.</h2><p>Vier vollwertige Sitze in der Panoramakabine. Ein Cabrio-Dach über Ihnen. Entdecken Sie das Fahrzeugkonzept im Film.</p><a href="https://youtu.be/2TogOYPFyOQ" target="_blank" rel="noopener noreferrer">Film auf YouTube ansehen ${icon('arrow')}</a></div>
  <a class="film-card" href="https://youtu.be/2TogOYPFyOQ" target="_blank" rel="noopener noreferrer" aria-label="Skydancer Fahrzeugfilm auf YouTube ansehen, öffnet neuen Tab">${picture('skydancer-video','Vorschaubild des Skydancer Fahrzeugfilms',1280,720)}<span class="play-button">${icon('play')}</span><span class="film-label">Fahrzeugfilm · YouTube</span></a>
</section>
<section class="editions-section" id="ausfuehrungen" aria-labelledby="editions-title"><div class="section-heading-row"><div><span class="section-index">Reiseausführung</span><h2 id="editions-title">Komfort für jede Route.</h2></div><p>Wählen Sie die gewünschte Ausrichtung passend zu Ihrem Reisestil. Die technische Ausstattung wird gemeinsam präzisiert.</p></div><div class="edition-cards"><article>${icon('shield')}<span>01</span><h3>Normal</h3><p>Die Basis für flexible Reisen. Komfort und Ausstattung werden passend zu Ihren Anforderungen geplant.</p></article><article>${icon('energy')}<span>02</span><h3>Autark</h3><p>Für mehr Unabhängigkeit von externer Versorgung. Energiesystem und gewünschte Standzeiten werden in der Beratung abgestimmt.</p></article><article>${icon('winter')}<span>03</span><h3>Winter</h3><p>Für Reisen bei niedrigen Temperaturen. Heizung, Dämmung und Frostschutz werden fahrzeugbezogen besprochen.</p></article></div></section>
<section class="faq-section" id="faq" aria-labelledby="faq-title"><div class="faq-intro"><span class="section-index">Gut zu wissen</span><h2 id="faq-title">Fragen zum<br>Cabrio-Camper.</h2><p>Klare Antworten zu Dach, Ausstattung, Gewicht und Ihrer persönlichen Konfiguration.</p><a class="text-link" href="#kontakt">Persönlich beraten lassen ${icon('arrow')}</a></div><div class="faq-list">${faqs.map(({q,a},i)=>`<details${i===0?' open':''}><summary>${escape(q)}</summary><p>${escape(a)}</p></details>`).join('')}</div></section>
<section class="service-section" id="service" aria-labelledby="service-title"><div class="service-intro"><span class="section-index light">Manufaktur-Service</span><p class="eyebrow">Technik, die Sie begleitet</p><h2 id="service-title">Exklusive Erweiterungen.<br>Sauber integriert.</h2><p>Kameraspiegel, Rundumsicht, Steuerung und Internet: Jede Erweiterung wird passend zum Fahrzeug geplant. Kompatibilität und Verfügbarkeit klären wir persönlich.</p><a class="service-link" href="https://vanlifemum-boop.github.io/Skydancer-System-Services/#technik-check">Zum Technik-Check in der Werkstatt ${icon('arrow')}</a></div><div class="service-visual">${picture('skydancer-diamond-side','Skydancer Diamond in der Seitenansicht mit auswählbaren Service-Informationen',1263,751)}${services.map((service,i)=>`<button type="button" class="service-pin service-pin-${i+1}" aria-label="${service.title}" aria-pressed="false" aria-controls="service-caption" data-title="${service.title}" data-description="${service.text}">${icon(service.icon)}<span><b>${service.title}</b><small>${service.text}</small></span></button>`).join('')}<p class="service-caption" id="service-caption" aria-live="polite">Individuell geplante Technik für Ihren Camper – wählen Sie ein Symbol für weitere Informationen.</p></div><div class="service-list">${services.map(service=>`<article>${icon(service.icon)}<div><h3>${service.title}</h3><p>${service.text}</p></div></article>`).join('')}</div></section>
<section class="contact-section" id="kontakt" aria-labelledby="contact-title">${picture('skydancer-diamond-panorama','Skydancer Diamond in der Panoramaansicht',1400,750)}<div class="contact-overlay" aria-hidden="true"></div><div class="contact-content"><span class="eyebrow">Ihr Skydancer beginnt mit einem Gespräch</span><h2 id="contact-title">Bereit für eine<br>neue Perspektive?</h2><p>Senden Sie Ihre Wunschkonfiguration oder sprechen Sie direkt mit Skydancer über Ihr persönliches Cabrio-Reisefahrzeug.</p><div class="contact-actions"><a class="contact-primary" data-configuration-link href="${CONTACT}">Konfiguration anfragen ${icon('arrow')}</a><a class="contact-secondary" href="tel:+491722585752">+49 172 258 5752</a></div><p class="manufacturer-note">Skydancer · Zur Mühle 2–4 · 50226 Frechen bei Köln<br>Beratung und Besichtigung nach vorheriger Vereinbarung.</p></div></section>
</main>
<footer><div class="footer-brand"><img src="logo-original.png" alt="Skydancer" width="130" height="101" loading="lazy" decoding="async"><p>Außergewöhnliche Cabrio-Reisemobile für außergewöhnliche Wege.</p></div><div><strong>Kontakt</strong><a href="tel:+491722585752">+49 172 258 5752</a><a href="mailto:milakubinsky@gmail.com">milakubinsky@gmail.com</a><span>Zur Mühle 2–4 · 50226 Frechen</span><span>Deutschland</span></div><div><strong>Informationen</strong><a href="#diamond">Diamond im Detail</a><a href="#faq">Häufige Fragen</a><a href="https://www.skydancer-camper.de/de/impressum" target="_blank" rel="noopener noreferrer">Impressum</a><a href="https://www.skydancer-camper.de/de/datenschutz" target="_blank" rel="noopener noreferrer">Datenschutz</a></div><div class="footer-end"><span>© 2026 Skydancer</span><a href="#top">Nach oben ↑</a></div></footer>
</body>
</html>
`;
fs.writeFileSync(path.join(ROOT,'index.html'),html);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url><loc>${BASE}</loc><lastmod>${UPDATED}</lastmod>${['front','side','panorama'].map(name=>`<image:image><image:loc>${BASE}skydancer-diamond-${name}.jpg</image:loc></image:image>`).join('')}</url>
</urlset>\n`;
fs.writeFileSync(path.join(ROOT,'sitemap.xml'),sitemap);
fs.writeFileSync(path.join(ROOT,'robots.txt'),`# GitHub project pages are hosted in a subdirectory.\n# Crawlers only apply robots.txt at the HOST ROOT, not at /Skydancer-/robots.txt.\n# This file is ready for hosting at the root of the future production domain.\n# Update the Sitemap URL when migrating domains.\nUser-agent: *\nAllow: /\n\nSitemap: ${BASE}sitemap.xml\n`);
console.log('Built static index.html, sitemap.xml and domain-migration robots.txt.');
