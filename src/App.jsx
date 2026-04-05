import { useState, useRef, useCallback } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --black: #0A0A0A;
    --black2: #111111;
    --gold: #C9A96E;
    --gold-light: #E8D5B0;
    --sand: #F2EDE4;
    --stone: #8A8070;
    --white: #FAFAF8;
    --red: #8B2020;
  }
  body { font-family:'Jost',sans-serif; background:var(--black); color:var(--white); min-height:100vh; }
  .app { max-width:480px; margin:0 auto; min-height:100vh; background:var(--black); }
  .header { padding:56px 32px 40px; background:var(--black); border-bottom:1px solid rgba(201,169,110,0.2); }
  .header-label { font-size:9px; letter-spacing:5px; text-transform:uppercase; color:var(--gold); margin-bottom:16px; font-weight:400; opacity:0.8; }
  .header-title { font-family:'Cormorant Garamond',serif; font-size:52px; color:var(--white); line-height:0.95; font-weight:300; letter-spacing:-1px; }
  .header-title em { font-style:italic; color:var(--gold); }
  .header-sub { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:var(--stone); margin-top:12px; font-weight:300; }
  .tabs { display:flex; padding:0 32px; border-bottom:1px solid rgba(255,255,255,0.06); background:var(--black); }
  .tab { padding:16px 0; font-size:10px; font-weight:500; letter-spacing:3px; text-transform:uppercase; color:var(--stone); cursor:pointer; border:none; background:none; position:relative; margin-right:28px; transition:color 0.3s; }
  .tab.active { color:var(--white); }
  .tab.active::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:1px; background:var(--gold); }
  .content { padding:32px 32px 60px; }
  .section-title { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:300; margin-bottom:6px; color:var(--white); font-style:italic; }
  .section-sub { font-size:11px; color:var(--stone); margin-bottom:32px; line-height:1.8; letter-spacing:0.3px; }
  .divider { width:40px; height:1px; background:var(--gold); margin:0 0 28px; opacity:0.4; }
  .pills { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:24px; }
  .pill { padding:7px 16px; font-size:9px; font-weight:500; letter-spacing:2px; text-transform:uppercase; border:1px solid rgba(255,255,255,0.12); background:none; cursor:pointer; color:var(--stone); transition:all 0.2s; }
  .pill.active { background:var(--gold); border-color:var(--gold); color:var(--black); }
  .pill:hover:not(.active) { border-color:var(--gold); color:var(--gold-light); }
  .input-area { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); padding:18px; width:100%; font-family:'Jost',sans-serif; font-size:13px; color:var(--white); resize:none; outline:none; line-height:1.7; margin-bottom:20px; transition:border-color 0.2s; }
  .input-area:focus { border-color:var(--gold); }
  .input-area::placeholder { color:rgba(255,255,255,0.2); }
  .btn { width:100%; padding:18px; background:var(--gold); color:var(--black); border:none; font-family:'Jost',sans-serif; font-size:10px; font-weight:500; letter-spacing:3px; text-transform:uppercase; cursor:pointer; transition:all 0.3s; }
  .btn:hover:not(:disabled) { background:var(--gold-light); }
  .btn:disabled { opacity:0.3; cursor:not-allowed; }
  .btn-ghost { width:100%; padding:16px; background:none; color:var(--stone); border:1px solid rgba(255,255,255,0.1); font-family:'Jost',sans-serif; font-size:10px; font-weight:500; letter-spacing:3px; text-transform:uppercase; cursor:pointer; transition:all 0.2s; margin-top:10px; }
  .btn-ghost:hover { border-color:var(--gold); color:var(--gold); }
  .upload-zone { border:1px dashed rgba(201,169,110,0.3); padding:48px 24px; text-align:center; cursor:pointer; transition:all 0.3s; margin-bottom:20px; background:rgba(255,255,255,0.02); }
  .upload-zone:hover { border-color:var(--gold); background:rgba(201,169,110,0.05); }
  .upload-zone.has-image { padding:0; overflow:hidden; border-style:solid; border-color:var(--gold); }
  .upload-zone img.preview { width:100%; object-fit:cover; max-height:360px; display:block; }
  .upload-icon { font-size:28px; margin-bottom:14px; display:block; opacity:0.5; }
  .upload-text { font-size:11px; color:var(--stone); line-height:1.8; }
  .upload-text strong { color:var(--gold); display:block; font-size:12px; margin-bottom:4px; letter-spacing:1px; font-weight:400; }
  .result-card { background:rgba(201,169,110,0.06); border:1px solid rgba(201,169,110,0.2); padding:28px; margin-top:24px; animation:up 0.5s ease; }
  @keyframes up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .result-label { font-size:9px; letter-spacing:4px; text-transform:uppercase; color:var(--gold); margin-bottom:20px; font-weight:400; }
  .result-text { font-size:14px; color:rgba(255,255,255,0.8); line-height:2; white-space:pre-wrap; font-family:'Cormorant Garamond',serif; font-weight:300; }
  .score-wrap { margin-bottom:24px; }
  .score-top { display:flex; align-items:baseline; gap:4px; margin-bottom:12px; }
  .score-num { font-family:'Cormorant Garamond',serif; font-size:72px; font-weight:300; color:var(--gold); line-height:1; }
  .score-denom { font-size:20px; color:rgba(255,255,255,0.25); font-weight:300; }
  .score-bar-bg { width:100%; height:2px; background:rgba(255,255,255,0.06); margin-bottom:10px; }
  .score-bar-fill { height:100%; background:linear-gradient(90deg, var(--gold), var(--gold-light)); }
  .score-label { font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--gold); opacity:0.7; }
  .result-divider { width:100%; height:1px; background:rgba(201,169,110,0.15); margin:20px 0; }
  .outfit-card { background:var(--black2); margin-top:16px; overflow:hidden; border:1px solid rgba(255,255,255,0.06); animation:up 0.5s ease; }
  .outfit-img-wrap { width:100%; aspect-ratio:3/4; background:rgba(255,255,255,0.03); display:flex; align-items:center; justify-content:center; overflow:hidden; }
  .outfit-img-wrap img.outfit-img { width:100%; height:100%; object-fit:cover; filter:contrast(1.05) saturate(0.9); }
  .outfit-body { padding:20px 24px 24px; border-top:1px solid rgba(201,169,110,0.15); }
  .outfit-num { font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--gold); opacity:0.7; margin-bottom:6px; }
  .outfit-name { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:300; font-style:italic; color:var(--white); margin-bottom:12px; }
  .outfit-pieces { font-size:12px; color:rgba(255,255,255,0.5); line-height:1.8; margin-bottom:14px; }
  .outfit-tip { font-size:12px; color:var(--gold-light); line-height:1.7; padding:12px 16px; border-left:2px solid var(--gold); background:rgba(201,169,110,0.05); }
  .loading { display:flex; flex-direction:column; align-items:center; gap:16px; padding:40px 0; }
  .dots { display:flex; gap:8px; }
  .dot { width:4px; height:4px; background:var(--gold); border-radius:50%; animation:pulse 1.4s ease-in-out infinite; }
  .dot:nth-child(2){animation-delay:0.2s} .dot:nth-child(3){animation-delay:0.4s}
  @keyframes pulse { 0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.3)} }
  .loading-text { font-size:10px; color:var(--stone); letter-spacing:2px; text-transform:uppercase; }
  .error-msg { background:rgba(139,32,32,0.15); border:1px solid rgba(139,32,32,0.3); padding:14px 18px; font-size:12px; color:#E88; margin-top:12px; }
  input[type="file"]{display:none;}
  .mode-toggle { display:flex; margin-bottom:24px; border:1px solid rgba(255,255,255,0.08); }
  .mode-btn { flex:1; padding:12px 8px; background:none; border:none; font-family:'Jost',sans-serif; font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--stone); cursor:pointer; transition:all 0.2s; }
  .mode-btn.active { background:rgba(201,169,110,0.1); color:var(--gold); }
  .dressing-summary { background:rgba(201,169,110,0.05); border:1px solid rgba(201,169,110,0.15); padding:16px; margin-bottom:20px; }
  .dressing-summary-label { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--stone); margin-bottom:10px; }
  .dressing-cats { display:flex; flex-wrap:wrap; gap:6px; }
  .dressing-cat-tag { font-size:9px; letter-spacing:1px; text-transform:uppercase; color:var(--gold); border:1px solid rgba(201,169,110,0.3); padding:4px 10px; }
  .wardrobe-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:24px; }
  .wardrobe-item { position:relative; aspect-ratio:3/4; overflow:hidden; border:1px solid rgba(255,255,255,0.06); }
  .wardrobe-item img { width:100%; height:100%; object-fit:cover; display:block; filter:contrast(1.05) saturate(0.85); }
  .wardrobe-item-label { position:absolute; bottom:0; left:0; right:0; background:linear-gradient(transparent,rgba(0,0,0,0.8)); padding:20px 8px 8px; font-size:8px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,0.7); }
  .wardrobe-item-delete { position:absolute; top:6px; right:6px; width:22px; height:22px; background:rgba(0,0,0,0.7); border:1px solid rgba(255,255,255,0.15); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; cursor:pointer; color:rgba(255,255,255,0.6); }
  .wardrobe-add { aspect-ratio:3/4; border:1px dashed rgba(201,169,110,0.2); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; cursor:pointer; transition:all 0.2s; background:rgba(255,255,255,0.02); }
  .wardrobe-add:hover { border-color:var(--gold); }
  .wardrobe-add-icon { font-size:20px; opacity:0.35; }
  .wardrobe-add-text { font-size:8px; letter-spacing:2px; text-transform:uppercase; color:var(--stone); }
  .wardrobe-empty { text-align:center; padding:56px 0; }
  .wardrobe-empty-icon { font-size:36px; opacity:0.15; margin-bottom:16px; }
  .wardrobe-empty-text { font-size:11px; color:var(--stone); letter-spacing:0.5px; line-height:1.9; }
  .wardrobe-count { font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--stone); margin-bottom:16px; opacity:0.5; }
  .add-modal { position:fixed; inset:0; background:rgba(0,0,0,0.95); z-index:100; display:flex; flex-direction:column; padding:48px 32px 32px; max-width:480px; margin:0 auto; overflow-y:auto; }
  .add-modal-title { font-family:'Cormorant Garamond',serif; font-size:28px; font-style:italic; font-weight:300; color:var(--white); margin-bottom:4px; }
  .add-modal-sub { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--stone); margin-bottom:28px; }
  .add-preview { width:100%; aspect-ratio:3/4; object-fit:cover; margin-bottom:20px; border:1px solid rgba(201,169,110,0.2); cursor:pointer; }
  .add-preview-empty { width:100%; aspect-ratio:3/4; border:1px dashed rgba(201,169,110,0.2); display:flex; align-items:center; justify-content:center; font-size:36px; opacity:0.25; margin-bottom:20px; cursor:pointer; }
  .cat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:24px; }
  .cat-btn { padding:10px 4px; border:1px solid rgba(255,255,255,0.08); background:none; color:var(--stone); font-family:'Jost',sans-serif; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; transition:all 0.2s; }
  .cat-btn.active { border-color:var(--gold); color:var(--gold); background:rgba(201,169,110,0.06); }
  .modal-close { position:absolute; top:20px; right:24px; background:none; border:none; color:var(--stone); font-size:24px; cursor:pointer; line-height:1; }
  .cats-filter { display:flex; gap:6px; margin-bottom:16px; overflow-x:auto; scrollbar-width:none; padding-bottom:2px; }
  .cats-filter::-webkit-scrollbar { display:none; }

  /* Onboarding swipe */
  .onboarding { position:fixed; inset:0; background:var(--black); z-index:200; display:flex; flex-direction:column; max-width:480px; margin:0 auto; }
  .onboarding-header { padding:48px 32px 24px; }
  .onboarding-step { font-size:9px; letter-spacing:4px; text-transform:uppercase; color:var(--gold); margin-bottom:12px; opacity:0.7; }
  .onboarding-title { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:300; color:var(--white); font-style:italic; line-height:1.1; margin-bottom:8px; }
  .onboarding-sub { font-size:11px; color:var(--stone); letter-spacing:0.3px; line-height:1.7; }
  .swipe-area { flex:1; position:relative; overflow:hidden; }
  .swipe-card { position:absolute; inset:0; margin:0 24px; border:1px solid rgba(255,255,255,0.06); overflow:hidden; cursor:grab; user-select:none; transition:transform 0.15s ease, opacity 0.15s ease; }
  .swipe-card img { width:100%; height:100%; object-fit:cover; display:block; pointer-events:none; }
  .swipe-card-overlay { position:absolute; inset:0; background:linear-gradient(transparent 50%, rgba(0,0,0,0.7)); }
  .swipe-hint { position:absolute; top:20px; padding:8px 16px; border-radius:4px; font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase; opacity:0; transition:opacity 0.2s; }
  .swipe-hint.like { right:20px; background:rgba(201,169,110,0.9); color:var(--black); }
  .swipe-hint.nope { left:20px; background:rgba(139,32,32,0.9); color:var(--white); }
  .swipe-buttons { display:flex; justify-content:center; gap:24px; padding:24px 32px 40px; }
  .swipe-btn { width:64px; height:64px; border-radius:50%; border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center; font-size:24px; cursor:pointer; transition:all 0.2s; }
  .swipe-btn:hover { transform:scale(1.1); }
  .swipe-btn.nope:hover { border-color:var(--red); background:rgba(139,32,32,0.15); }
  .swipe-btn.like:hover { border-color:var(--gold); background:rgba(201,169,110,0.1); }
  .swipe-progress { display:flex; gap:4px; padding:0 32px; margin-bottom:16px; }
  .swipe-progress-dot { flex:1; height:2px; background:rgba(255,255,255,0.08); border-radius:2px; transition:background 0.3s; }
  .swipe-progress-dot.done { background:var(--gold); }
  .swipe-profile-card { margin:0 32px 24px; background:rgba(201,169,110,0.06); border:1px solid rgba(201,169,110,0.2); padding:24px; }
  .swipe-profile-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-style:italic; font-weight:300; color:var(--white); margin-bottom:8px; }
  .swipe-profile-desc { font-size:12px; color:rgba(255,255,255,0.6); line-height:1.7; }
`;

const OCCASIONS = ["Quotidien","Travail","Soirée","Week-end","Premier date","Brunch","Voyage","Festival","Plage","Mariage","Dîner","Afterwork","Sport","Shopping","Galerie","Soirée privée"];
const CATEGORIES = ["Haut","Bas","Veste","Robe","Chaussures","Accessoire"];

const PHOTO_POOLS = {
  casual: [
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
    "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  ],
  street: [
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
  ],
  business: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80",
    "https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&q=80",
  ],
  minimal: [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80",
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
  ],
  evening: [
    "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?w=600&q=80",
    "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=80",
    "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&q=80",
  ],
  default: [
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
    "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80",
  ],
};

function getOutfitImage(q) {
  const s = q.toLowerCase();
  let pool = PHOTO_POOLS.default;
  if (s.includes("street") || s.includes("urban") || s.includes("hoodie")) pool = PHOTO_POOLS.street;
  else if (s.includes("business") || s.includes("suit") || s.includes("formal")) pool = PHOTO_POOLS.business;
  else if (s.includes("minimal") || s.includes("clean")) pool = PHOTO_POOLS.minimal;
  else if (s.includes("evening") || s.includes("night") || s.includes("party")) pool = PHOTO_POOLS.evening;
  else if (s.includes("casual") || s.includes("smart") || s.includes("weekend")) pool = PHOTO_POOLS.casual;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_OUTFITS = [
  [
    {"name":"Le Parisien Discret","pieces":"Jean slim bleu + Chemise oxford bleu ciel + Blazer marine + Loafers marron","tip":"Retrousse légèrement les manches du blazer, col ouvert — l'élégance sans effort.","imageQuery":"smart casual blazer editorial men"},
    {"name":"Weekend Arty","pieces":"Chino beige + T-shirt blanc + Pull col V gris + Sneakers blanches","tip":"Rentre le t-shirt d'un seul côté dans le chino pour casser la symétrie.","imageQuery":"minimal casual weekend style"},
    {"name":"La Signature","pieces":"Jean slim bleu + T-shirt noir + Blazer marine + Loafers marron","tip":"Le jean + blazer modernisé par le t-shirt noir. Une montre fine pour finir.","imageQuery":"business casual navy blazer men"}
  ],
  [
    {"name":"L'Urbain Assumé","pieces":"Jean baggy noir + Hoodie gris + Sneakers chunky blanches","tip":"Proportions oversized en haut, garde le jean pas trop large pour équilibrer.","imageQuery":"street style urban hoodie sneakers"},
    {"name":"Le Cargo Élevé","pieces":"Cargo kaki + T-shirt blanc + Veste bomber noir + Boots noires","tip":"Kaki et noir se marient parfaitement — laisse le bomber ouvert.","imageQuery":"streetwear cargo bomber outfit"},
    {"name":"Crème de la Rue","pieces":"Jean baggy noir + Sweat crème + Sneakers chunky blanches","tip":"Contraste noir/crème fort — garde tout neutre, pas d'accessoires qui chargent.","imageQuery":"minimal streetwear cream black"}
  ]
];

const MOCK_ANALYSES = [
  "SCORE:8\n✦ CE QUI FONCTIONNE\nLes proportions sont parfaitement maîtrisées — le volume du haut trouve son équilibre dans un bas plus ajusté. La palette, cohérente et sobre, offre une lecture immédiate. Le choix des chaussures ancre l'ensemble avec justesse.\n\n✦ POUR SUBLIMER\nUn accessoire subtil suffirait à élever l'ensemble — une montre fine, une ceinture en cuir souple ou des lunettes au caractère affirmé. Relevez légèrement les manches pour alléger la silhouette.\n\n✦ L'ESSENTIEL\nVous maîtrisez déjà l'essentiel — c'est dans les détails que tout se joue.",
  "SCORE:9\n✦ CE QUI FONCTIONNE\nLa tenue révèle une cohérence stylistique rare — une direction claire, pleinement assumée. Les couleurs s'accordent avec naturel, et la coupe met la silhouette en valeur.\n\n✦ POUR SUBLIMER\nJouez avec les textures pour donner plus de profondeur à l'ensemble. Une ceinture bien choisie affinerait la silhouette. Quelques centimètres de cheville visibles apporteraient une légèreté bienvenue.\n\n✦ L'ESSENTIEL\nIl y a une vraie identité ici — continuez de l'affirmer, c'est votre force."
];

let mockOutfitIdx = 0;
let mockAnalysisIdx = 0;

async function callClaude(messages) {
  await new Promise(r => setTimeout(r, 1500));
  const content = messages[0]?.content;
  const isImage = Array.isArray(content) && content.some(b => b.type === "image");
  if (isImage) {
    const r = MOCK_ANALYSES[mockAnalysisIdx % MOCK_ANALYSES.length];
    mockAnalysisIdx++;
    return r;
  }
  const outfits = MOCK_OUTFITS[mockOutfitIdx % MOCK_OUTFITS.length];
  mockOutfitIdx++;
  return JSON.stringify(outfits);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Loader({text}) {
  return (
    <div className="loading">
      <div className="dots"><div className="dot"/><div className="dot"/><div className="dot"/></div>
      <p className="loading-text">{text}</p>
    </div>
  );
}

function getDressing() {
  try { return JSON.parse(localStorage.getItem('allure_dressing') || '[]'); } catch { return []; }
}
function saveDressing(items) {
  localStorage.setItem('allure_dressing', JSON.stringify(items));
}

// ─── Swipe looks data ────────────────────────────────────────────────────────
const SWIPE_LOOKS = [
  { id:1, img:"https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80", tags:["minimal","monochrome","casual"] },
  { id:2, img:"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80", tags:["streetwear","bold","oversized"] },
  { id:3, img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", tags:["business","classic","tailored"] },
  { id:4, img:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80", tags:["minimal","feminine","elegant"] },
  { id:5, img:"https://images.unsplash.com/photo-1511485977113-f34c92461ad9?w=600&q=80", tags:["evening","dark","sophisticated"] },
  { id:6, img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", tags:["streetwear","sneakers","casual"] },
  { id:7, img:"https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?w=600&q=80", tags:["minimal","neutral","relaxed"] },
  { id:8, img:"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80", tags:["smart-casual","layered","classic"] },
  { id:9, img:"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80", tags:["feminine","colorful","editorial"] },
  { id:10, img:"https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&q=80", tags:["casual","sporty","modern"] },
  { id:11, img:"https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80", tags:["minimal","monochrome","chic"] },
  { id:12, img:"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80", tags:["bohemian","relaxed","natural"] },
];

function buildStyleProfile(liked, disliked) {
  const likedTags = liked.flatMap(i => i.tags);
  const freq = {};
  likedTags.forEach(t => freq[t] = (freq[t]||0) + 1);
  const top = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,3).map(e => e[0]);

  const profiles = {
    minimal: "Vous êtes attiré par l'épure — les silhouettes nettes, les palettes sobres, le soin du détail plutôt que l'accumulation.",
    streetwear: "Votre style porte une énergie urbaine assumée — volumes, textures et références culturelles fortes.",
    business: "Vous appréciez la coupe et la rigueur — un vestiaire structuré qui inspire confiance et distinction.",
    elegant: "L'élégance est votre langage naturel — des pièces intemporelles, des matières nobles, une allure posée.",
    bold: "Vous n'avez pas peur de l'affirmation — couleurs, contrastes et pièces à fort caractère vous définissent.",
    default: "Votre style est pluriel et instinctif — vous puisez dans plusieurs univers pour composer un vestiaire qui vous ressemble."
  };

  const dominant = top[0] || "default";
  const desc = profiles[dominant] || profiles.default;
  const name = top.length ? top.slice(0,2).join(" · ") : "Personnel";

  return { name, desc, tags: top };
}

function OnboardingSwipe({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState([]);
  const [disliked, setDisliked] = useState([]);
  const [animDir, setAnimDir] = useState(null);
  const [done, setDone] = useState(false);
  const [profile, setProfile] = useState(null);

  const swipe = (dir) => {
    const look = SWIPE_LOOKS[current];
    setAnimDir(dir);
    setTimeout(() => {
      if (dir === "like") setLiked(p => [...p, look]);
      else setDisliked(p => [...p, look]);
      setAnimDir(null);
      if (current + 1 >= SWIPE_LOOKS.length) {
        const p = buildStyleProfile(
          dir === "like" ? [...liked, look] : liked,
          dir === "nope" ? [...disliked, look] : disliked
        );
        setProfile(p);
        setDone(true);
      } else {
        setCurrent(c => c + 1);
      }
    }, 300);
  };

  const finish = () => {
    localStorage.setItem('allure_profile', JSON.stringify(profile));
    localStorage.setItem('allure_onboarded', '1');
    onComplete(profile);
  };

  if (done && profile) return (
    <div className="onboarding">
      <div className="onboarding-header">
        <div className="onboarding-step">Votre profil</div>
        <div className="onboarding-title">Votre style,<br/>révélé.</div>
        <div className="onboarding-sub">Nous avons analysé vos préférences pour personnaliser chaque suggestion.</div>
      </div>
      <div className="swipe-profile-card">
        <div className="swipe-profile-title">{profile.name}</div>
        <div className="swipe-profile-desc">{profile.desc}</div>
      </div>
      <div style={{padding:"0 32px"}}>
        <button className="btn" onClick={finish}>Découvrir Allure</button>
      </div>
    </div>
  );

  const cardStyle = animDir === "like"
    ? { transform:"translateX(120%) rotate(15deg)", opacity:0 }
    : animDir === "nope"
    ? { transform:"translateX(-120%) rotate(-15deg)", opacity:0 }
    : {};

  return (
    <div className="onboarding">
      <div className="onboarding-header">
        <div className="onboarding-step">{current + 1} / {SWIPE_LOOKS.length}</div>
        <div className="onboarding-title">Définissez<br/>votre style.</div>
        <div className="onboarding-sub">Swipez les looks qui vous inspirent.</div>
      </div>
      <div className="swipe-progress">
        {SWIPE_LOOKS.map((_, i) => (
          <div key={i} className={`swipe-progress-dot ${i < current ? "done" : ""}`}/>
        ))}
      </div>
      <div className="swipe-area">
        <div className="swipe-card" style={cardStyle}>
          <img src={SWIPE_LOOKS[current].img} alt="look"/>
          <div className="swipe-card-overlay"/>
          {animDir === "like" && <div className="swipe-hint like">✓ J'aime</div>}
          {animDir === "nope" && <div className="swipe-hint nope">✕ Non</div>}
        </div>
      </div>
      <div className="swipe-buttons">
        <div className="swipe-btn nope" onClick={() => swipe("nope")}>✕</div>
        <div className="swipe-btn like" onClick={() => swipe("like")}>♡</div>
      </div>
    </div>
  );
}

// ─── Mon Dressing ─────────────────────────────────────────────────────────────
function DressingTab() {
  const [items, setItems] = useState(() => getDressing());
  const [showAdd, setShowAdd] = useState(false);
  const [addPreview, setAddPreview] = useState(null);
  const [addB64, setAddB64] = useState(null);
  const [addCat, setAddCat] = useState("Haut");
  const [filter, setFilter] = useState("Tout");
  const fileRef = useRef();

  const save = (next) => { setItems(next); saveDressing(next); };
  const deleteItem = (id) => save(items.filter(i => i.id !== id));

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => { setAddPreview(e.target.result); setAddB64(e.target.result); };
    reader.readAsDataURL(file);
  };

  const addItem = () => {
    if (!addB64) return;
    save([...items, { id: Date.now(), cat: addCat, img: addB64 }]);
    setShowAdd(false); setAddPreview(null); setAddB64(null); setAddCat("Haut");
  };

  const filters = ["Tout", ...CATEGORIES];
  const filtered = filter === "Tout" ? items : items.filter(i => i.cat === filter);

  return (
    <div>
      <h2 className="section-title">Mon Dressing</h2>
      <div className="divider"/>
      <p className="section-sub">Chaque pièce ajoutée affine vos suggestions. Commencez par vos essentiels.</p>

      {items.length > 0 && (
        <>
          <div className="cats-filter">
            {filters.map(f => (
              <button key={f} className={`pill ${filter===f?"active":""}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <div className="wardrobe-count">{filtered.length} pièce{filtered.length > 1 ? "s" : ""}</div>
          <div className="wardrobe-grid">
            {filtered.map(item => (
              <div key={item.id} className="wardrobe-item">
                <img src={item.img} alt={item.cat}/>
                <div className="wardrobe-item-label">{item.cat}</div>
                <div className="wardrobe-item-delete" onClick={() => deleteItem(item.id)}>×</div>
              </div>
            ))}
            <div className="wardrobe-add" onClick={() => setShowAdd(true)}>
              <div className="wardrobe-add-icon">+</div>
              <div className="wardrobe-add-text">Ajouter</div>
            </div>
          </div>
        </>
      )}

      {items.length === 0 && (
        <>
          <div className="wardrobe-empty">
            <div className="wardrobe-empty-icon">🧥</div>
            <div className="wardrobe-empty-text">Ton dressing est vide.<br/>Ajoute ta première pièce.</div>
          </div>
          <button className="btn" onClick={() => setShowAdd(true)}>Ajouter une pièce</button>
        </>
      )}

      {showAdd && (
        <div className="add-modal">
          <button className="modal-close" onClick={() => { setShowAdd(false); setAddPreview(null); setAddB64(null); }}>×</button>
          <div className="add-modal-title">Nouvelle pièce</div>
          <div className="add-modal-sub">Ajoutez un vêtement à votre dressing</div>
          {addPreview
            ? <img className="add-preview" src={addPreview} alt="preview" onClick={() => fileRef.current.click()}/>
            : <div className="add-preview-empty" onClick={() => fileRef.current.click()}>📷</div>
          }
          <input type="file" ref={fileRef} accept="image/*" onChange={e => handleFile(e.target.files[0])}/>
          <div className="cat-grid">
            {CATEGORIES.map(c => (
              <button key={c} className={`cat-btn ${addCat===c?"active":""}`} onClick={() => setAddCat(c)}>{c}</button>
            ))}
          </div>
          <button className="btn" onClick={addItem} disabled={!addB64}>Ajouter au dressing</button>
        </div>
      )}
    </div>
  );
}

// ─── Mes Tenues ───────────────────────────────────────────────────────────────
function TenuesTab() {
  const [occasion, setOccasion] = useState("Quotidien");
  const [extraText, setExtraText] = useState("");
  const [loading, setLoading] = useState(false);
  const [outfits, setOutfits] = useState([]);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("dressing");

  const dressing = getDressing();
  const hasDressing = dressing.length >= 3;

  const generate = async () => {
    setLoading(true); setOutfits([]); setError(null);
    try {
      let wardrobeDesc = "";
      if (mode === "dressing" && hasDressing) {
        const cats = dressing.map(i => i.cat).join(", ");
        wardrobeDesc = "Mon dressing : " + cats;
        if (extraText.trim()) wardrobeDesc += ". Pièces supplémentaires : " + extraText;
      } else {
        wardrobeDesc = extraText;
      }

      const raw = await callClaude([{
        role:"user",
        content: wardrobeDesc + ". Occasion : " + occasion + ". Propose 3 tenues en JSON."
      }]);

      let parsed;
      try { parsed = JSON.parse(raw.replace(/```json|```/g,"").trim()); }
      catch { throw new Error("Format inattendu, réessaie."); }

      setOutfits(parsed.map(o => ({...o, imageUrl: getOutfitImage(o.imageQuery || "")})));
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const canGenerate = mode === "dressing" ? (hasDressing || extraText.trim()) : extraText.trim();

  return (
    <div>
      <h2 className="section-title">Mes tenues</h2>
      <div className="divider"/>

      {hasDressing && (
        <div className="mode-toggle">
          <button className={`mode-btn ${mode==="dressing"?"active":""}`} onClick={() => setMode("dressing")}>
            Depuis mon dressing
          </button>
          <button className={`mode-btn ${mode==="text"?"active":""}`} onClick={() => setMode("text")}>
            Décrire librement
          </button>
        </div>
      )}

      {mode === "dressing" && hasDressing && (
        <>
          <div className="dressing-summary">
            <div className="dressing-summary-label">{dressing.length} pièces dans votre dressing</div>
            <div className="dressing-cats">
              {[...new Set(dressing.map(i => i.cat))].map(c => (
                <span key={c} className="dressing-cat-tag">{c}</span>
              ))}
            </div>
          </div>
          <textarea className="input-area" rows={3}
            placeholder="Des pièces à imaginer, à acquérir bientôt ? Ajoutez-les ici…"
            value={extraText} onChange={e => setExtraText(e.target.value)}
          />
        </>
      )}

      {(!hasDressing || mode === "text") && (
        <>
          {!hasDressing && <p className="section-sub" style={{marginBottom:"16px"}}>Ajoute 3+ pièces dans votre dressing pour des suggestions personnalisées, ou décris ta garde-robe ici.</p>}
          <textarea className="input-area" rows={5}
            placeholder="Ex : jean slim bleu, chemise oxford, blazer marine, sneakers blanches…"
            value={extraText} onChange={e => setExtraText(e.target.value)}
          />
        </>
      )}

      <div className="pills">
        {OCCASIONS.map(o => <button key={o} className={`pill ${occasion===o?"active":""}`} onClick={() => setOccasion(o)}>{o}</button>)}
      </div>

      <button className="btn" onClick={generate} disabled={loading || !canGenerate}>
        {loading ? "Composition en cours…" : "Composer mes tenues"}
      </button>

      {loading && <Loader text="Composition de vos tenues en cours…"/>}
      {error && <div className="error-msg">⚠ {error}</div>}

      {outfits.map((o,i) => (
        <div key={i} className="outfit-card">
          <div className="outfit-img-wrap">
            {o.imageUrl
              ? <img className="outfit-img" src={o.imageUrl} alt={o.name}/>
              : <span style={{fontSize:"40px",opacity:0.2}}>🧥</span>
            }
          </div>
          <div className="outfit-body">
            <div className="outfit-num">Tenue {i+1}</div>
            <div className="outfit-name">{o.name}</div>
            <div className="outfit-pieces">{o.pieces}</div>
            <div className="outfit-tip">💡 {o.tip}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Analyser ─────────────────────────────────────────────────────────────────
function AnalyserTab() {
  const [preview, setPreview] = useState(null);
  const [b64, setB64] = useState(null);
  const [mediaType, setMediaType] = useState("image/jpeg");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [text, setText] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => {
      setPreview(e.target.result);
      setB64(e.target.result.split(",")[1]);
      setMediaType(file.type || "image/jpeg");
      setScore(null); setText(null); setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const analyze = async () => {
    if (!b64) return;
    setLoading(true); setScore(null); setText(null); setError(null);
    try {
      const raw = await callClaude([{
        role:"user",
        content:[
          { type:"image", source:{ type:"base64", media_type:mediaType, data:b64 } },
          { type:"text", text:"Analyse cette tenue." }
        ]
      }]);

      // Parse SCORE
      const m = raw.match(/SCORE:(\d+)/);
      const s = m ? parseInt(m[1]) : null;
      const t = raw.replace(/SCORE:\d+\n?/, "").trim();
      setScore(s);
      setText(t);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const scoreLabel = score >= 9 ? "Impeccable" : score >= 7 ? "Élégant" : score >= 5 ? "Prometteur" : "À affiner";

  return (
    <div>
      <h2 className="section-title">Analyser</h2>
      <div className="divider"/>
      <p className="section-sub">Un regard expert et bienveillant — pour révéler le meilleur de votre style.</p>

      <div className={`upload-zone ${preview?"has-image":""}`}
        onClick={() => fileRef.current.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
      >
        {preview
          ? <img className="preview" src={preview} alt="Ta tenue"/>
          : <><span className="upload-icon">📸</span><div className="upload-text"><strong>Déposez votre photo</strong>Glissez ou cliquez pour sélectionner</div></>
        }
      </div>
      <input type="file" ref={fileRef} accept="image/*" onChange={e => handleFile(e.target.files[0])}/>

      {preview && (
        <button className="btn" onClick={analyze} disabled={loading}>
          {loading ? "Analyse en cours…" : "Analyser ma tenue"}
        </button>
      )}

      {loading && <Loader text="Votre tenue est entre de bonnes mains…"/>}
      {error && <div className="error-msg">⚠ {error}</div>}

      {text && (
        <div className="result-card">
          <div className="result-label">Analyse Stylistique</div>

          {score !== null && (
            <div className="score-wrap">
              <div className="score-top">
                <span className="score-num">{score}</span>
                <span className="score-denom">/10</span>
              </div>
              <div className="score-bar-bg">
                <div className="score-bar-fill" style={{width: score * 10 + "%"}}/>
              </div>
              <div className="score-label">{scoreLabel}</div>
            </div>
          )}

          <div className="result-divider"/>
          <div className="result-text">{text}</div>
        </div>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dressing");
  const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem('allure_onboarded'));
  const [styleProfile, setStyleProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('allure_profile') || 'null'); } catch { return null; }
  });

  const handleOnboardingComplete = (profile) => {
    setStyleProfile(profile);
    setOnboarded(true);
  };

  if (!onboarded) return (
    <>
      <style>{styles}</style>
      <div className="app">
        <OnboardingSwipe onComplete={handleOnboardingComplete}/>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="header-label">Paris · Intelligence Stylistique</div>
          <h1 className="header-title">Allure<br/><em>.</em></h1>
          <div className="header-sub">L'élégance à portée de main</div>
        </div>
        <div className="tabs">
          <button className={`tab ${tab==="dressing"?"active":""}`} onClick={() => setTab("dressing")}>Dressing</button>
          <button className={`tab ${tab==="tenues"?"active":""}`} onClick={() => setTab("tenues")}>Tenues</button>
          <button className={`tab ${tab==="analyser"?"active":""}`} onClick={() => setTab("analyser")}>Analyser</button>
        </div>
        <div className="content">
          {tab==="dressing" ? <DressingTab/> : tab==="tenues" ? <TenuesTab/> : <AnalyserTab/>}
        </div>
      </div>
    </>
  );
}
