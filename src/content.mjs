// All site wording and page structure lives here.
// To change a phone number, link or sentence, edit it in this file and rebuild.

export const SITE = {
  name: "Bureyko Mortgage Partners",
  url: "https://www.bureykomortgages.ca",
  email: "robin@bureykomortgages.ca",
  sherri: { name: "Sherri Bureyko", phone: "403-510-8083", tel: "+14035108083" },
  robin: { name: "Robin Bureyko", phone: "403-540-0629", tel: "+14035400629" },
  applyUrl: "https://velocity.newton.ca/sso/public.php?sc=17dj8b6xmn74w",
  reviewsUrl: "https://share.google/j3kKjlHhIyBQU943E",
  guideForm: "https://form.jotform.com/262367662550259",
  renewalForm: "https://form.jotform.com/260465756960063",
  photos: {
    sherri: "https://images.squarespace-cdn.com/content/68d822c1dd071007730b2263/ca5fe2fb-0475-4ac6-91d9-af79b9a8672e/Sherri+white+background+%283%29.png?content-type=image%2Fpng",
    robin: "https://images.squarespace-cdn.com/content/68d822c1dd071007730b2263/b8e80d95-2346-49a7-ae64-d4bcedf5eaa0/Robin+-+White+Background.png?content-type=image%2Fpng",
  },
  brokerageStatement:
    "Bureyko Mortgage Partners is part of Mortgage Architects, which operates under the publicly traded DLCG group of companies.",
  disclaimer:
    "Mortgage approvals, rates, fees and terms depend on borrower qualification, the property and lender requirements. Information on this website is general and should be discussed in the context of your circumstances.",
};

// ---------- small building blocks ----------
const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>`;
const ext = `target="_blank" rel="noopener"`;

const ICON = {
  buy: `<path d="M5 19 20 7l15 12M10 15v19h20V15"/><path d="M17 34v-9h6v9" stroke="#F38F26"/>`,
  renew: `<rect x="6" y="9" width="28" height="25" rx="3"/><path d="M6 16h28M14 5v7m12-7v7"/><path d="m15 25 4 4 7-8" stroke="#F38F26"/>`,
  refi: `<path d="M5 19 20 7l15 12M10 15v19h20V15"/><path d="M20 20v9m-4-4 4 4 4-4" stroke="#F38F26"/>`,
  self: `<rect x="6" y="13" width="28" height="20" rx="3"/><path d="M15 13V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4M6 21h28"/><path d="M18 21v3h4v-3" stroke="#F38F26"/>`,
  rental: `<path d="M3 21 13 13l10 8M6 19v14h14V19"/><path d="M21 15l8-6 8 6v18h-9"/><path d="M11 33v-6h4v6" stroke="#F38F26"/>`,
  second: `<rect x="8" y="6" width="24" height="28" rx="3"/><path d="M14 14h12M14 20h12"/><path d="M14 27h6" stroke="#F38F26"/>`,
  divorce: `<path d="M8 33V20m24 13V20"/><path d="M4 22 20 9l16 13"/><path d="M14 33c0-4 2.7-6 6-6s6 2 6 6" stroke="#F38F26"/>`,
  reno: `<path d="M5 19 20 7l15 12M10 15v19h20V15"/><path d="m16 30 9-9m-2-2 4 4" stroke="#F38F26"/>`,
};
const icon = (k) =>
  `<svg class="ico" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;

// The two illustrations from the brand files
const ART_GUIDE = `<svg viewBox="0 0 400 530" fill="none" aria-hidden="true"><rect x="40" y="16" width="314" height="488" rx="16" fill="#fff" stroke="#306AB4" stroke-width="9"/><path d="M58 20h20v480H58c-10 0-18-8-18-18V38c0-10 8-18 18-18Z" fill="#306AB4"/><path d="M120 75h130" stroke="#F38F26" stroke-width="14"/><path d="M126 188 205 125l80 63M145 172v104h126V172" stroke="#306AB4" stroke-width="9"/><path d="M120 345h175M120 380h175M120 414h115" stroke="#9AB6D9" stroke-width="9"/></svg>`;
const ART_CAL = `<svg viewBox="0 0 400 530" fill="none" aria-hidden="true"><rect x="22" y="92" width="356" height="386" rx="18" fill="#fff" stroke="#306AB4" stroke-width="8"/><path d="M22 194h356M115 50v90m170-90v90" stroke="#306AB4" stroke-width="8"/><path d="m122 324 52 52 112-118" stroke="#F38F26" stroke-width="22"/><path d="M80 430h240" stroke="#9AB6D9" stroke-width="7"/></svg>`;
const ART_HOUSE = `<svg viewBox="0 0 540 470" fill="none" aria-hidden="true"><circle cx="430" cy="118" r="64" fill="#FFEBD1"/><path d="m168 92 12-5 12 5m40-26 12-5 12 5" stroke="#9AB6D9" stroke-width="2" stroke-linecap="round"/><path d="M12 236v118h98V236l-49-36-49 36Zm418-14v132h96V222l-48-38-48 38Z" fill="#E4EEFB" stroke="#B7CDEB" stroke-width="1.5"/><path d="M0 354h540" stroke="#D6E4F5" stroke-width="1.5"/><path d="m110 238 150-124 170 124H110Z" fill="#306AB4"/><path d="M138 220v134h244V220L260 132 138 220Z" fill="#fff" stroke="#306AB4" stroke-width="2.5"/><path d="m106 240 154-128 174 128" stroke="#193C66" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M322 152V96h28v76" fill="#fff" stroke="#306AB4" stroke-width="2.5"/><path d="M316 96h40" stroke="#193C66" stroke-width="4" stroke-linecap="round"/><path d="M166 244h56v64h-56zm132 0h56v64h-56z" fill="#EDF5FF" stroke="#306AB4" stroke-width="2.5"/><path d="M194 244v64m-28-32h56m104-32v64m-28-32h56" stroke="#306AB4" stroke-width="2"/><path d="M236 354v-98h52v98" fill="#F38F26" stroke="#306AB4" stroke-width="2.5"/><rect x="246" y="266" width="32" height="42" rx="3" fill="#FFF5E9" stroke="#306AB4" stroke-width="1.5"/><circle cx="278" cy="326" r="3" fill="#193C66"/><path d="M228 354h68v12h-68zm-10 12h88v12h-88z" fill="#fff" stroke="#306AB4" stroke-width="2"/><path d="M240 378c-2 28 4 46 22 70m42-70c16 24 22 42 24 70" stroke="#BFD4EE" stroke-width="2.5" stroke-linecap="round"/><path d="M70 354v-58m-22 36c-28-18-16-70 16-54 8-44 48-44 48-6 34-4 34 46 2 60H48Z" fill="#D2E3F8" stroke="#9AB6D9" stroke-width="2"/><path d="M458 354v-64m-22 46c-28-12-28-50-6-62-14-40 26-56 42-22 40-14 56 42 26 62 16 20-16 38-36 22h-26Z" fill="#D2E3F8" stroke="#9AB6D9" stroke-width="2"/><path d="M20 356h160m180 0h160M60 408h90m240 0h100" stroke="#306AB4" stroke-width="2.5" stroke-linecap="round"/></svg>`;

// ---------- services (each becomes its own page) ----------
export const SERVICES = [
  {
    slug: "first-time-home-buyer", icon: "buy", name: "First-time home buyers", short: "Buying your first home",
    card: "Budget, down payment and pre-approval, before you start house hunting.",
    title: "First-Time Home Buyers in Calgary",
    description: "A clear starting point for your first home, from preparation to possession. Talk to Sherri and Robin Bureyko.",
    h1: "Your first home.<br><em>A clear place to start.</em>",
    lead: "There's a lot to learn before buying your first home. We help you understand the mortgage side, organize your next steps, and move forward with a plan.",
    extraButton: ["Get the buyer guide", "/first-time-home-buyer-guide"],
    listTitle: "Before you start house hunting",
    list: [
      "Get a picture of your income, monthly commitments, and a comfortable budget.",
      "Gather your down payment information and talk through where the funds are coming from.",
      "Ask about mortgage features, closing costs, and the documents a lender may need.",
      "Talk through your timeline with your mortgage broker and realtor.",
    ],
    approach: "We look beyond a purchase price. We review your file, explain what needs attention, and help you understand the financing questions before you make decisions.",
    faq: [
      ["Can I talk to you before I've found a home?", "Yes. Starting with your goals and finances helps us identify the information to gather and the questions to resolve."],
      ["Does a pre-approval guarantee financing on a home?", "A pre-approval is a starting point. Final financing depends on the lender's review of your application, your documents, and the property you choose."],
      ["What should I bring to the first conversation?", "Your approximate income, down payment, current debts, and purchase timeline are useful. We'll explain the specific documents needed for your situation."],
    ],
  },
  {
    slug: "mortgage-renewal", icon: "renew", name: "Mortgage renewals", short: "Renewing",
    card: "Before you sign your lender's offer, let's see how it compares.",
    title: "Mortgage Renewals in Calgary",
    description: "Review your options before signing your next mortgage term. Talk to Sherri and Robin Bureyko.",
    h1: "A renewal deserves<br><em>a fresh look.</em>",
    lead: "Your life may have changed since you first arranged your mortgage. Let's review the renewal in the context of where you are now and what comes next.",
    extraButton: ["Get my renewal checkup", "/mortgage-renewal-checkup"],
    listTitle: "What's worth reviewing",
    list: [
      "Your renewal date and the offer from your current lender.",
      "Changes to your income, debts, property, or household plans.",
      "Rate options alongside payment flexibility and mortgage features.",
      "The cost and qualification requirements of switching or restructuring.",
    ],
    approach: "We compare the practical options and explain the trade-offs. Sometimes staying with your current lender makes sense; sometimes another structure deserves a closer look.",
    faq: [
      ["Should I send you my renewal offer?", "Yes. The offer and renewal date give us a useful starting point. We'll also ask what has changed and what you want your next mortgage term to do."],
      ["Do I have to switch lenders?", "No. We can review staying with your current lender alongside other options, taking the costs and requirements into account."],
      ["What if my renewal is still a while away?", "Use the Renewal Checkup to put the date on our radar. If you need advice sooner, call or text us directly."],
    ],
  },
  {
    slug: "refinance-home-equity", icon: "refi", name: "Refinance & home equity", short: "Refinancing",
    card: "Put your home's equity toward a goal, with the costs laid out first.",
    title: "Refinancing & Home Equity in Calgary",
    description: "Explore how your mortgage and home equity could fit your next goal. Talk to Sherri and Robin Bureyko.",
    h1: "Make a plan for<br><em>the equity in your home.</em>",
    lead: "A refinance starts with a purpose. We help you explore the options, costs, and longer-term effects before you decide how to use your equity.",
    listTitle: "What we look at together",
    list: [
      "Your current mortgage balance, terms, and any cost to break it early.",
      "Your property value and what the funds are for.",
      "Your income, debts, credit, and a payment you're comfortable with.",
      "The differences between a refinance, a home equity line of credit, and other options.",
    ],
    approach: "We connect the financing structure to your goal, whether that means improving cash flow, funding a renovation, or planning another purchase. We discuss costs and repayment alongside the amount available.",
    faq: [
      ["Is refinancing the same as renewing?", "Renewing arranges a new mortgage term. Refinancing changes the mortgage arrangement and may involve additional borrowing, qualification, and costs."],
      ["Should I choose a refinance or a HELOC?", "That depends on how you'll use the funds, your repayment plan, qualification, and lender options. We can help compare the structures."],
      ["Could there be a penalty?", "Breaking an existing mortgage before the end of its term may involve a prepayment charge. We review this and other costs as part of the comparison."],
    ],
  },
  {
    slug: "self-employed-mortgages", icon: "self", name: "Self-employed mortgages", short: "Self-employed",
    card: "Business income rarely fits on one pay stub. We know how lenders read it.",
    title: "Self-Employed Mortgages in Calgary",
    description: "A thoughtful review of your business income and financing needs. Talk to Sherri and Robin Bureyko.",
    h1: "Your income has a story.<br><em>We look closely.</em>",
    lead: "Business income doesn't always fit neatly on one pay stub. We help you organize the details and find a lender approach suited to your situation.",
    listTitle: "Details that help shape the plan",
    list: [
      "Your business structure and how long it has been operating.",
      "Tax returns, notices of assessment, and other income documents.",
      "Your down payment or equity and existing financial commitments.",
      "Your credit profile and the property you want to finance.",
    ],
    approach: "We ask questions early, explain the documents, and work through the income story before choosing a lending approach. Requirements vary by lender and by the details of the file.",
    faq: [
      ["Can I speak to you before gathering all my documents?", "Yes. A first conversation helps us explain which documents are likely to be useful for your particular business."],
      ["Does being incorporated change the review?", "Your business structure and the way you pay yourself can affect the documents and income analysis. We review those details with you."],
      ["Are the requirements the same at every lender?", "No. We explore options based on the full file rather than assuming one approach works for every business owner."],
    ],
  },
  {
    slug: "rental-investor-mortgages", icon: "rental", name: "Rental & investment properties", short: "Rental & investment",
    card: "Financing that accounts for rental income and the properties you already own.",
    title: "Rental & Investment Property Mortgages in Calgary",
    description: "Financing conversations that consider the property and the bigger picture. Talk to Sherri and Robin Bureyko.",
    h1: "Property financing<br><em>with a wider view.</em>",
    lead: "An investment property is part of a larger financial picture. We help you think through the financing, rental income, and existing commitments together.",
    listTitle: "The full picture matters",
    list: [
      "How you'll use the property and its rental income.",
      "Your down payment, equity, and other property holdings.",
      "Existing mortgage payments, debts, and cash flow.",
      "Your plans for holding, renovating, or adding properties.",
    ],
    approach: "We discuss the financing in the context of your other commitments and longer-term goals. Lenders assess rental income and portfolios differently, so the details matter.",
    faq: [
      ["Do you review my existing properties too?", "Yes. The mortgages, rental income, and obligations on other properties may be part of the overall financing review."],
      ["Can rental income help me qualify?", "A lender may consider rental income, but how it's treated varies. We review your documents and the lender's approach."],
      ["Can we plan before I choose a property?", "Yes. A conversation about your goals and financial picture can help you prepare for the next property."],
    ],
  },
  {
    slug: "second-mortgages", icon: "second", name: "Second mortgages", short: "Second mortgages",
    card: "Short-term borrowing with a clear repayment plan, and the alternatives compared.",
    title: "Second Mortgages in Calgary",
    description: "Understand the costs, alternatives, and repayment plan before deciding. Talk to Sherri and Robin Bureyko.",
    h1: "A second mortgage<br><em>needs a clear plan.</em>",
    lead: "Secondary financing can be an option in some situations. We review the purpose, costs, and repayment plan alongside other possible routes.",
    listTitle: "Questions to answer before going ahead",
    list: [
      "Why the funds are needed and for how long.",
      "The property value, available equity, and existing financing.",
      "Interest, fees, payments, and the overall cost of borrowing.",
      "A realistic repayment or exit plan, and possible alternatives.",
    ],
    approach: "We explain the structure and explore alternatives, including refinancing or adjusting timing where it makes sense. The repayment plan deserves as much attention as access to the funds.",
    faq: [
      ["Is a second mortgage the first option to consider?", "Not always. We review alternatives and the purpose of the financing before recommending a direction."],
      ["What is an exit plan?", "It's a realistic plan for repaying or replacing the loan, including the timing and the steps needed to make that possible."],
      ["What costs should I ask about?", "Ask about the interest rate, lender and broker fees, legal costs, payments, and any charges related to repayment or renewal."],
    ],
  },
  {
    slug: "divorce-separation", icon: "divorce", name: "Separation & divorce", short: "Separation & divorce",
    card: "Keeping the home, buying out a partner, or starting fresh. Calm, practical help.",
    title: "Mortgages During Separation & Divorce in Calgary",
    description: "Steady mortgage guidance when home and life plans are changing. Talk to Sherri and Robin Bureyko.",
    h1: "Steady support through<br><em>a change in plans.</em>",
    lead: "When a relationship changes, decisions about the home can feel especially heavy. We explain the financing side and work around your next steps.",
    listTitle: "We start with the practical questions",
    list: [
      "Your goals for the property and the timing involved.",
      "Income, credit, debts, and your ability to qualify on your own.",
      "The current mortgage, property value, and relevant agreement documents.",
      "The legal and professional advice needed alongside the financing.",
    ],
    approach: "We keep the financing conversation clear and respectful. We work with the information you and your legal advisers provide, and help you understand what a mortgage option would require.",
    faq: [
      ["Can you help me explore keeping the home?", "We can review the financing requirements and possible options based on your income, credit, equity, and circumstances."],
      ["Will you tell me how assets should be divided?", "No. Property division and agreement terms require legal advice. Our role is to help with the mortgage and financing questions."],
      ["What should I bring?", "Start with your goals and timing. We'll explain the mortgage, income, property, and agreement documents relevant to your situation."],
    ],
  },
  {
    slug: "renovation-financing", icon: "reno", name: "Renovation financing", short: "Renovation financing",
    card: "Plan the money before the work starts, so funds arrive when they're needed.",
    title: "Renovation Financing in Calgary",
    description: "Connect your renovation plans with a practical funding conversation. Talk to Sherri and Robin Bureyko.",
    h1: "Start the financing plan<br><em>before the renovation.</em>",
    lead: "The right time to talk about renovation financing is while you're planning. We help connect the project, budget, and property to possible funding options.",
    listTitle: "Bring the project into focus",
    list: [
      "The scope, budget, and timing of the work.",
      "Your property value, mortgage, and available equity.",
      "Contractor estimates and any lender documentation requirements.",
      "Whether funds are needed upfront or in stages.",
    ],
    approach: "We review the project before choosing a financing route and discuss the timing of funds and lender conditions. Starting early helps identify what needs to be arranged before work begins.",
    faq: [
      ["Should I talk to you before work starts?", "Yes. Some financing approaches have requirements about the property, estimates, inspections, or release of funds. Discuss the plan first."],
      ["Could a HELOC be an option?", "It may be, depending on your equity, qualification, repayment plan, and lender requirements. We can compare it with other structures."],
      ["Do you need contractor estimates?", "They may be important for certain programs. We'll explain what the lender needs once the financing route is clearer."],
    ],
  },
];

// ---------- shared sections ----------
const servicesGrid = (u) => `<div class="services">
${SERVICES.map(
  (s) => `  <a class="service" href="${u("/" + s.slug)}">
    ${icon(s.icon)}
    <h3>${s.name}</h3>
    <p>${s.card}</p>
    <span class="more">Learn more ${arrow}</span>
  </a>`
).join("\n")}
</div>`;

const resourceCards = (u) => `<div class="cards-2">
  <article class="card res">
    ${ART_GUIDE}
    <h3>First-Time Homebuyer Guide</h3>
    <p>A useful starting point before your first mortgage conversation.</p>
    <a class="btn btn-orange" href="${u("/first-time-home-buyer-guide")}">Get the guide</a>
  </article>
  <article class="card res">
    ${ART_CAL}
    <h3>Mortgage Renewal Checkup</h3>
    <p>Tell us when your mortgage renews, and we'll connect when it makes sense to review your options.</p>
    <a class="btn btn-orange" href="${u("/mortgage-renewal-checkup")}">Get my renewal checkup</a>
  </article>
</div>`;

const reviewsStrip = () => `<div class="wrap"><div class="reviews">
  <p>Hear from the people we've helped on our Google Business Profile.</p>
  <a class="btn btn-line" href="${SITE.reviewsUrl}" ${ext}>Read our Google reviews ↗</a>
</div></div>`;

const contactCard = (p, role = "Mortgage Broker") => `<article class="card">
  <h3>${p.name}</h3>
  <span class="role">${role}</span>
  <a class="num" href="tel:${p.tel}">${p.phone}</a>
  <div class="actions"><a class="btn btn-orange" href="tel:${p.tel}">Call ${p.name.split(" ")[0]}</a><a class="btn btn-line" href="sms:${p.tel}">Text ${p.name.split(" ")[0]}</a></div>
</article>`;

const contactBand = ({ id = "contact", eyebrow = "Let's start here", title = "Tell us what you have in mind.", text = "Reach out to either of us directly. You don't need to have it all figured out." } = {}) => `<section class="contact" id="${id}">
  <div class="wrap">
    <span class="eyebrow">${eyebrow}</span>
    <div class="contact-head">
      <h2>${title}</h2>
      <p>${text}</p>
    </div>
    <div class="contact-grid">
      ${contactCard(SITE.sherri)}
      ${contactCard(SITE.robin)}
    </div>
    <p class="contact-more"><span>Prefer email? <a href="mailto:${SITE.email}">${SITE.email}</a></span><span>Ready to apply? <a href="${SITE.applyUrl}" ${ext}>Start your secure application ↗</a></span></p>
  </div>
</section>`;

const crumbs = (u, items) =>
  `<nav class="crumbs" aria-label="Breadcrumb"><a href="${u("/")}">Home</a>${items
    .map(([label, href]) => `<span aria-hidden="true">/</span>${href ? `<a href="${u(href)}">${label}</a>` : `<span aria-current="page">${label}</span>`}`)
    .join("")}</nav>`;

const pageHero = (u, { trail, eyebrow, h1, lead, actions = "", art = "" }) => `<section class="page-hero">
  <div class="wrap">
    <div class="stack">
      ${crumbs(u, trail)}
      ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ""}
      <h1>${h1}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ""}
      ${actions}
    </div>
    ${art ? `<div class="art">${art}</div>` : ""}
  </div>
</section>`;

const portraits = () => `<div class="people" aria-label="Meet your mortgage partners">
  <div class="people-grid">
    <figure class="person">
      <div class="portrait"><img src="${SITE.photos.sherri}" alt="Sherri Bureyko" width="260" height="300"></div>
      <figcaption><span class="person-name">Sherri Bureyko</span><span class="person-role">Underwriting &amp; operations experience</span></figcaption>
    </figure>
    <figure class="person">
      <div class="portrait"><img src="${SITE.photos.robin}" alt="Robin Bureyko" width="260" height="300"></div>
      <figcaption><span class="person-name">Robin Bureyko</span><span class="person-role">Credit &amp; risk experience</span></figcaption>
    </figure>
  </div>
  <p class="people-caption">Two perspectives. One steady path.</p>
</div>`;

const postCards = (u, posts, fmtDate) =>
  posts.length
    ? `<div class="post-grid">${posts
        .map(
          (p) => `<a class="post-card" href="${u(p.route)}">
  <div class="meta">${p.category ? `<span class="tag">${p.category}</span>` : ""}${p.draft ? '<span class="tag tag-draft">Draft</span>' : ""}<span>${fmtDate(p.date)}</span></div>
  <h3>${p.title}</h3>
  <p>${p.description}</p>
  <span class="more">Read the article ${arrow}</span>
</a>`
        )
        .join("\n")}</div>`
    : `<div class="empty"><p>New articles are on the way. In the meantime, <a class="text-link" href="${u("/contact")}">ask us your question directly</a>.</p></div>`;

const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;

// ---------- pages ----------
export function pages({ posts }) {
  const fmtDate = (iso) =>
    new Date(iso + "T12:00:00").toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
  const list = [];

  // Home
  list.push({
    route: "/",
    title: "Calgary Mortgage Brokers | Bureyko Mortgage Partners",
    description: "Buying, renewing or refinancing in Calgary? Talk to Sherri and Robin Bureyko about a mortgage plan that fits where you are and where you want to go.",
    jsonld: jsonLd({
      "@context": "https://schema.org",
      "@type": "FinancialService",
      name: SITE.name,
      url: SITE.url,
      email: SITE.email,
      telephone: SITE.robin.tel,
      areaServed: ["Calgary", "Alberta"],
      parentOrganization: { "@type": "Organization", name: "Mortgage Architects" },
      employee: [
        { "@type": "Person", name: SITE.sherri.name, jobTitle: "Mortgage Broker", telephone: SITE.sherri.tel },
        { "@type": "Person", name: SITE.robin.name, jobTitle: "Mortgage Broker", telephone: SITE.robin.tel },
      ],
    }),
    body: ({ u }) => `
<section class="hero">
  <div class="wrap">
    <div class="hero-copy">
      <span class="eyebrow">Your steady path to home</span>
      <h1>Your mortgage.<br><em>Let's make it clear.</em></h1>
      <p class="lead">Buying a home, renewing, or refinancing? Talk to Sherri and Robin about a mortgage plan that fits where you are and where you want to go.</p>
      <div class="actions">
        <a class="btn btn-orange" href="${u("/contact")}">Start a conversation ${arrow}</a>
        <a class="btn btn-line" href="${u("/mortgage-services")}">Explore your options</a>
      </div>
      <p class="hero-note">Call, text, or email. A clear conversation is a good place to start.</p>
    </div>
    ${portraits()}
  </div>
</section>

<section class="band band-mist">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">How we can help</span>
      <h2>Start with what you're planning.</h2>
      <p>Pick the situation closest to yours. Each page explains what lenders look at and what to have ready.</p>
    </div>
    ${servicesGrid(u)}
  </div>
</section>

<section class="band">
  <div class="wrap approach">
    <div class="stack">
      <span class="eyebrow">A personal partnership</span>
      <h2>You bring the questions. We'll help with the next step.</h2>
      <p>We're Sherri and Robin Bureyko. We bring underwriting, operations, credit, and risk experience to a practical conversation about your mortgage.</p>
      <p class="local">Based in Calgary. Supporting clients across Alberta.</p>
      <a class="text-link" href="${u("/about")}">Meet Sherri &amp; Robin</a>
    </div>
    <ol class="steps">
      <li class="step"><div><h3>Tell us what you're working toward.</h3><p>Share your plans, your timing, and the questions on your mind.</p></div></li>
      <li class="step"><div><h3>Get a clearer picture.</h3><p>We'll talk through your situation and explain what matters for your next mortgage decision.</p></div></li>
      <li class="step"><div><h3>Make a plan for what comes next.</h3><p>Whether you're ready to move forward or still exploring, we'll help you understand your next step.</p></div></li>
    </ol>
  </div>
</section>

<section class="band band-mist">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">Free resources</span>
      <h2>Not ready to talk yet? Start here.</h2>
      <p>Two quick forms you can fill out on your own time.</p>
    </div>
    ${resourceCards(u)}
  </div>
</section>
${posts.length ? `
<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">From the blog</span>
      <h2>Mortgage insights.</h2>
      <p>Plain-language articles on buying, renewing, refinancing, and credit in Alberta. <a class="text-link" href="${u("/blog/")}">See all articles</a></p>
    </div>
    ${postCards(u, posts.slice(0, 3), fmtDate)}
  </div>
</section>` : ""}
${reviewsStrip()}
${contactBand()}`,
  });

  // About
  list.push({
    route: "/about",
    title: "Meet Sherri & Robin Bureyko",
    description: "Meet your Calgary mortgage partners. Sherri and Robin combine mortgage, underwriting, and credit experience with direct, personal guidance.",
    body: ({ u }) => `
${pageHero(u, {
  trail: [["Our team"]],
  eyebrow: "Our team",
  h1: "Two perspectives.<br><em>One steady path.</em>",
  lead: "We're Sherri and Robin Bureyko: mortgage partners, neighbours, and people who believe the financing conversation should feel clear and personal.",
  actions: `<div class="actions"><a class="btn btn-orange" href="${u("/contact")}">Talk to Sherri &amp; Robin ${arrow}</a></div>`,
})}
<section class="band">
  <div class="wrap split">
    <div class="stack">
      <h2>Good guidance starts with understanding you.</h2>
    </div>
    <div class="stack">
      <p>We bring different strengths to the same goal: helping you understand your mortgage options and move through the process with a plan. Sherri's underwriting and operations experience complements Robin's background in credit and risk.</p>
      <p>We're based in Calgary and live in McKenzie Towne. That local connection matters to us, whether we're working with a first-time buyer, supporting a homeowner's next decision, or stopping by a realtor's open house.</p>
    </div>
  </div>
</section>
<section class="band band-mist">
  <div class="wrap" style="display:grid;gap:56px">
    <article class="bio">
      <div class="portrait"><img src="${SITE.photos.sherri}" alt="Sherri Bureyko" width="260" height="300" loading="lazy"></div>
      <div class="stack">
        <span class="eyebrow">Mortgage Broker</span>
        <h2>Sherri Bureyko</h2>
        <p class="lead">Sherri brings a practical eye for mortgage details and a clear, direct approach to client communication. She helps make the paperwork, conditions, and next steps easier to understand.</p>
        <div class="actions"><a class="btn btn-orange btn-sm" href="tel:${SITE.sherri.tel}">Call ${SITE.sherri.phone}</a><a class="btn btn-line btn-sm" href="sms:${SITE.sherri.tel}">Text Sherri</a></div>
      </div>
    </article>
    <article class="bio">
      <div class="portrait"><img src="${SITE.photos.robin}" alt="Robin Bureyko" width="260" height="300" loading="lazy"></div>
      <div class="stack">
        <span class="eyebrow">Mortgage Broker</span>
        <h2>Robin Bureyko</h2>
        <p class="lead">Robin brings more than 20 years of experience in credit adjudication and risk management. He looks closely at the income and credit story behind a file, helping clients understand the path forward.</p>
        <div class="actions"><a class="btn btn-orange btn-sm" href="tel:${SITE.robin.tel}">Call ${SITE.robin.phone}</a><a class="btn btn-line btn-sm" href="sms:${SITE.robin.tel}">Text Robin</a></div>
      </div>
    </article>
  </div>
</section>
<section class="band">
  <div class="wrap split">
    <h2>Clear words. A careful review. Steady support.</h2>
    <div class="stack">
      <p>We ask questions, explain the documents, and look closely at the details behind an application. Credit expertise helps us understand the story; clear communication helps you understand the plan.</p>
      <p>${SITE.brokerageStatement}</p>
    </div>
  </div>
</section>
${reviewsStrip()}
${contactBand({ title: "Let's find your next step.", text: "A clear conversation is a good place to start." })}`,
  });

  // Mortgage services hub
  list.push({
    route: "/mortgage-services",
    title: "Mortgage Services in Calgary & Alberta",
    description: "Mortgages for first-time buyers, renewals, refinancing, self-employed clients, rental properties, renovations, and changing life plans.",
    body: ({ u }) => `
${pageHero(u, {
  trail: [["Mortgages"]],
  eyebrow: "Mortgages",
  h1: "Your mortgage should fit<br><em>what comes next.</em>",
  lead: "Start with your goal. We'll help you explore the financing options, requirements, and trade-offs that matter to your situation.",
  actions: `<div class="actions"><a class="btn btn-orange" href="${u("/contact")}">Talk through your plans ${arrow}</a><a class="btn btn-line" href="${SITE.applyUrl}" ${ext}>Apply online</a></div>`,
  art: ART_HOUSE,
})}
<section class="band">
  <div class="wrap">${servicesGrid(u)}</div>
</section>
<section class="band band-mist">
  <div class="wrap approach">
    <div class="stack">
      <span class="eyebrow">How we work</span>
      <h2>A closer look. A clearer plan.</h2>
    </div>
    <ol class="steps">
      <li class="step"><div><h3>We listen.</h3><p>We start with your goals, timing, and the questions that matter to you.</p></div></li>
      <li class="step"><div><h3>We look closely.</h3><p>We review the income, credit, documents, and details behind your application.</p></div></li>
      <li class="step"><div><h3>We build a plan.</h3><p>We explain the lending options, trade-offs, and next steps in plain language.</p></div></li>
      <li class="step"><div><h3>We stay involved.</h3><p>We guide you through conditions, paperwork, and the path to closing.</p></div></li>
    </ol>
  </div>
</section>
${contactBand({ title: "Not sure where to start?", text: "Tell us what you're thinking about. We'll help you find the right next step." })}`,
  });

  // Service pages
  for (const s of SERVICES) {
    const related = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3);
    list.push({
      route: "/" + s.slug,
      title: s.title,
      description: s.description,
      jsonld: jsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: s.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      }),
      body: ({ u }) => `
${pageHero(u, {
  trail: [["Mortgages", "/mortgage-services"], [s.name]],
  eyebrow: s.name,
  h1: s.h1,
  lead: s.lead,
  actions: `<div class="actions"><a class="btn btn-orange" href="${u("/contact")}">Talk to us ${arrow}</a>${
    s.extraButton ? `<a class="btn btn-line" href="${u(s.extraButton[1])}">${s.extraButton[0]}</a>` : `<a class="btn btn-line" href="${SITE.applyUrl}" ${ext}>Apply online</a>`
  }</div>`,
  art: `<svg viewBox="0 0 40 40" fill="none" stroke="#306AB4" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[s.icon].replace(/stroke="#F38F26"/g, 'stroke="#F38F26" stroke-width="1.6"')}</svg>`,
})}
<section class="band">
  <div class="wrap split">
    <div class="stack">
      <h2>${s.listTitle}</h2>
      <ul class="checklist">${s.list.map((li) => `<li>${li}</li>`).join("")}</ul>
    </div>
    <div class="panel">
      <span class="eyebrow">How we approach it</span>
      <p class="lead">${s.approach}</p>
    </div>
  </div>
</section>
<section class="band band-mist">
  <div class="wrap narrow">
    <h2 style="margin-bottom:24px">Questions you may be asking</h2>
    <div class="faq">${s.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
  </div>
</section>
<section class="band-tight">
  <div class="wrap">
    <h2 style="font-size:1.4rem;margin-bottom:20px">Other paths to explore</h2>
    <div class="cards">${related
      .map((r) => `<a class="card" href="${u("/" + r.slug)}">${icon(r.icon)}<h3>${r.name}</h3><p>${r.card}</p><span class="more">Learn more ${arrow}</span></a>`)
      .join("")}</div>
  </div>
</section>
${contactBand({ title: "Let's look at your situation.", text: "Every file has its own details. A conversation helps identify the information and options worth reviewing." })}`,
    });
  }

  // Partnerships
  list.push({
    route: "/partnerships",
    title: "Realtor & Professional Partnerships",
    description: "Partner with Sherri and Robin Bureyko for mortgage readiness conversations, open house feature sheets, and clear financing support for your clients.",
    body: ({ u }) => `
${pageHero(u, {
  trail: [["For realtors"]],
  eyebrow: "For realtors",
  h1: "A local mortgage partner.<br><em>In your corner.</em>",
  lead: "You work hard for your clients. We're here to support the financing side with thoughtful file preparation, clear conversations, and practical tools for your business.",
  actions: `<div class="actions"><a class="btn btn-orange" href="${u("/contact")}">Start a partner conversation ${arrow}</a></div>`,
  art: ART_HOUSE,
})}
<section class="band">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">How we help</span>
      <h2>Useful tools. Real relationships.</h2>
      <p>We're active in our community and enjoy meeting the people helping our neighbours buy and sell homes. Let's talk about what would make your work easier.</p>
    </div>
    <div class="cards">
      <div class="card"><h3>Open house feature sheets</h3><p>Mortgage information sheets prepared for your actual listing, giving visitors another useful way to think about the home.</p></div>
      <div class="card"><h3>Buyer education resources</h3><p>First-time buyer guides, mortgage education materials, and resources to support your client conversations.</p></div>
      <div class="card"><h3>Scenario &amp; readiness conversations</h3><p>A place to talk through financing questions and identify what needs attention before a client moves forward.</p></div>
      <div class="card"><h3>Clear file communication</h3><p>A careful review of the mortgage details, with updates that help everyone understand the next steps.</p></div>
    </div>
  </div>
</section>
<section class="band band-mist">
  <div class="wrap split">
    <h2>A coffee is a good starting point.</h2>
    <div class="stack">
      <p class="lead">We'd like to learn about your business, the clients you work with, and the support that would be useful to you. Call, text, or send us a note to start the conversation.</p>
      <a class="btn btn-orange" href="mailto:${SITE.email}?subject=Realtor%20partnership">Email us about a partnership</a>
    </div>
  </div>
</section>
${reviewsStrip()}
${contactBand({ eyebrow: "Let's connect", title: "Connect with Sherri &amp; Robin.", text: "Call or text either of us directly." })}`,
  });

  // Resources
  list.push({
    route: "/resources",
    title: "Mortgage Resources & Next Steps",
    description: "Start with our First-Time Homebuyer Guide, register for a Mortgage Renewal Checkup, or explore official Canadian mortgage education resources.",
    body: ({ u }) => `
${pageHero(u, {
  trail: [["Resources"]],
  eyebrow: "Resources",
  h1: "A little clarity.<br><em>A useful head start.</em>",
  lead: "Practical places to begin, whether you're buying your first home or thinking about your next mortgage term.",
})}
<section class="band">
  <div class="wrap">${resourceCards(u)}</div>
</section>
<section class="band band-mist">
  <div class="wrap split">
    <div class="stack">
      <span class="eyebrow">Keep learning</span>
      <h2>Official mortgage information.</h2>
      <p>The Financial Consumer Agency of Canada offers mortgage information and calculators to help you understand the basics.</p>
      <a class="btn btn-line" href="https://www.canada.ca/en/financial-consumer-agency/services/mortgages.html" ${ext}>Visit the FCAC mortgage pages ↗</a>
    </div>
    <div class="panel">
      <h3>Make it personal.</h3>
      <p>General information is useful. A conversation about your income, credit, goals, and timing turns it into a next step for you.</p>
      <a class="text-link" href="${u("/contact")}">Talk to Sherri &amp; Robin</a>
    </div>
  </div>
</section>
${posts.length ? `<section class="band"><div class="wrap"><div class="sec-head"><span class="eyebrow">From the blog</span><h2>Recent articles.</h2><p><a class="text-link" href="${u("/blog/")}">See all articles</a></p></div>${postCards(u, posts.slice(0, 3), fmtDate)}</div></section>` : ""}
${contactBand({ title: "Let's find your next step.", text: "A clear conversation is a good place to start." })}`,
  });

  // Form pages
  const formPage = ({ route, title, description, eyebrow, h1, lead, steps, form, source, help, art }) => ({
    route, title, description,
    body: ({ u }) => `
${pageHero(u, { trail: [["Resources", "/resources"], [title]], eyebrow, h1, lead, art })}
<section class="band">
  <div class="wrap split">
    <div class="stack">
      <h2>How it works</h2>
      <ol class="steps" style="width:100%">${steps.map((s) => `<li class="step"><div><p>${s}</p></div></li>`).join("")}</ol>
      <div class="panel" style="width:100%">
        <h3>${help[0]}</h3>
        <p>${help[1]}</p>
        <div class="actions"><a class="btn btn-line btn-sm" href="tel:${SITE.sherri.tel}">Call Sherri</a><a class="btn btn-line btn-sm" href="tel:${SITE.robin.tel}">Call Robin</a></div>
      </div>
    </div>
    <div class="stack">
      <div class="form-frame" style="width:100%"><iframe src="${form}?source=${source}" title="${title} form" loading="lazy" allow="geolocation; microphone; camera"></iframe></div>
      <p class="fine">Form not showing? <a class="text-link" href="${form}?source=${source}" ${ext}>Open it in a new tab ↗</a>. The form is hosted by Jotform. Please share only the information requested; sensitive mortgage documents belong in your secure application.</p>
    </div>
  </div>
</section>
${contactBand({ title: "Prefer to talk first?", text: "We're happy to start with your questions." })}`,
  });
  list.push(formPage({
    route: "/first-time-home-buyer-guide",
    title: "First-Time Homebuyer Guide",
    description: "Buying your first home comes with questions. Request our guide and use it as a starting point for your mortgage conversation.",
    eyebrow: "Free guide",
    h1: "Your first home.<br><em>Your starting point.</em>",
    lead: "You don't need every answer before you begin. Use the guide to get oriented, then bring your questions to us.",
    steps: ["Request the guide using the form.", "Use it to prepare for your mortgage conversation.", "Call or text us when you want to talk through your own situation."],
    form: SITE.guideForm, source: "website_ftb_guide",
    help: ["Prefer to talk first?", "We're happy to start with your questions."],
    art: ART_GUIDE,
  }));
  list.push(formPage({
    route: "/mortgage-renewal-checkup",
    title: "Mortgage Renewal Checkup",
    description: "Tell us when your mortgage renews. We'll put your timing on our radar so we can connect when it makes sense to review your options.",
    eyebrow: "Renewal checkup",
    h1: "A renewal coming up?<br><em>Let's plan ahead.</em>",
    lead: "Tell us when your mortgage renews. We'll put your timing on our radar so we can connect when it makes sense to review your options.",
    steps: ["Share the timing and details of your renewal.", "We'll review the information you provide.", "We'll connect when it's time to explore your next term."],
    form: SITE.renewalForm, source: "website_renewal_checkup",
    help: ["Need help sooner?", "If you're considering a move, refinancing, renovations, or accessing equity, reach out now rather than waiting for renewal."],
    art: ART_CAL,
  }));

  // Contact
  list.push({
    route: "/contact",
    title: "Contact Sherri & Robin Bureyko",
    description: "Call, text, or email your Calgary mortgage partners. Talk through a home purchase, renewal, refinance, or realtor partnership.",
    body: ({ u }) => `
${pageHero(u, {
  trail: [["Contact"]],
  eyebrow: "Contact",
  h1: "Let's talk about<br><em>what comes next.</em>",
  lead: "A question, a plan, or a “where do I start?” You're welcome to reach out. We'll help you find the next step.",
})}
<section class="band">
  <div class="wrap" style="display:grid;gap:28px">
    <div class="cards-2">
      ${contactCard(SITE.sherri).replace('<span class="role">Mortgage Broker</span>', '<span class="role">Mortgage Broker · Underwriting and operations experience</span>')}
      ${contactCard(SITE.robin).replace('<span class="role">Mortgage Broker</span>', '<span class="role">Mortgage Broker · 20+ years in credit and risk</span>')}
    </div>
    <div class="cards-2">
      <div class="card">
        <span class="eyebrow">Prefer email?</span>
        <h3>Tell us what you're planning and the best way to reach you.</h3>
        <a class="num" style="font-size:1.35rem;overflow-wrap:anywhere" href="mailto:${SITE.email}?subject=Mortgage%20question">${SITE.email}</a>
      </div>
      <div class="card">
        <span class="eyebrow">Ready to apply?</span>
        <h3>Start your secure mortgage application online.</h3>
        <p>Please keep banking information, SINs, and documents out of general email or text.</p>
        <a class="btn btn-orange" href="${SITE.applyUrl}" ${ext}>Start my application ↗</a>
      </div>
    </div>
  </div>
</section>
<section class="band band-mist">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">A useful first step</span>
      <h2>Not ready to talk yet?</h2>
      <p>Request the buyer guide or share your renewal timing.</p>
    </div>
    ${resourceCards(u)}
  </div>
</section>
${reviewsStrip()}`,
  });

  // Blog index
  list.push({
    route: "/blog/",
    title: "Mortgage Insights Blog",
    description: "Clear mortgage information for Alberta homebuyers and homeowners. Articles on buying, renewals, refinancing, and credit from Sherri and Robin Bureyko.",
    body: ({ u }) => `
${pageHero(u, {
  trail: [["Blog"]],
  eyebrow: "Mortgage insights",
  h1: "Clear answers to<br><em>common mortgage questions.</em>",
  lead: "Plain-language articles on buying, renewing, refinancing, and credit in Alberta, from Sherri and Robin Bureyko.",
  art: ART_GUIDE,
})}
<section class="band">
  <div class="wrap">${postCards(u, posts, fmtDate)}</div>
</section>
${contactBand({ title: "Have a question we haven't covered?", text: "Ask us directly. You don't need to have it all figured out." })}`,
  });

  // Blog posts
  for (const p of posts) {
    list.push({
      route: p.route,
      title: p.title,
      description: p.description,
      noindex: p.draft,
      jsonld: jsonLd({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: p.title,
        description: p.description,
        datePublished: p.date,
        author: { "@type": "Organization", name: SITE.name },
        publisher: { "@type": "Organization", name: SITE.name },
      }),
      body: ({ u }) => `
<section class="page-hero">
  <div class="wrap narrow">
    <div class="stack">
      ${crumbs(u, [["Blog", "/blog/"], [p.title]])}
      <div class="meta">${p.category ? `<span class="tag">${p.category}</span>` : ""}${p.draft ? '<span class="tag tag-draft">Draft: not published yet</span>' : ""}<span>${fmtDate(p.date)}</span><span>By ${p.author}</span></div>
      <h1 style="font-size:clamp(2.1rem,4.4vw,3.2rem)">${p.title}</h1>
      ${p.description ? `<p class="lead">${p.description}</p>` : ""}
    </div>
  </div>
</section>
<section class="band">
  <div class="wrap narrow">
    <article class="prose">${p.html.replace(/href="(\/[^"]*)"/g, (m, x) => `href="${u(x)}"`)}</article>
    <div class="panel" style="margin-top:56px">
      <h3>Want to talk about your situation?</h3>
      <p>Every file has its own details. Call, text, or email Sherri or Robin.</p>
      <div class="actions"><a class="btn btn-orange btn-sm" href="${u("/contact")}">Contact us</a><a class="btn btn-line btn-sm" href="${u("/blog/")}">More articles</a></div>
    </div>
  </div>
</section>`,
    });
  }

  // Privacy
  list.push({
    route: "/privacy",
    title: "Privacy Information",
    description: "How information is handled when you contact Bureyko Mortgage Partners or use our forms.",
    body: ({ u }) => `
${pageHero(u, { trail: [["Privacy"]], h1: "Privacy information.", lead: "How this website connects you with us and with our forms. Updated October 2026." })}
<section class="band"><div class="wrap narrow"><div class="prose">
<h2>Contacting us</h2>
<p>This website provides phone, text, and email links. Information you choose to share through those channels is handled by the relevant service and by our team to respond to your inquiry. Opening an email link prepares a message in your email app; it does not send anything automatically.</p>
<h2>Guide and renewal forms</h2>
<p>The First-Time Homebuyer Guide and Mortgage Renewal Checkup use Jotform. Information submitted through those forms goes through Jotform under the form's terms and settings. Jotform may use cookies or similar technologies as part of its service. See Jotform's privacy policy for its practices.</p>
<h2>Mortgage applications</h2>
<p>The "Apply" links open a secure application hosted by Velocity, the application platform used by our brokerage. Information you submit there is handled under that platform's and Mortgage Architects' privacy practices.</p>
<h2>Share information through the right channel</h2>
<p>General inquiries should be limited to your question and contact information. Use the secure application, or ask us for the right process, before sending identity documents, banking information, a SIN, or other sensitive financial records.</p>
<h2>Website data</h2>
<p>This website is hosted on GitHub Pages. Like most web hosts, it may log technical information such as IP addresses to deliver and secure the site. Our fonts are served from this website, not from a third party. We do not currently use analytics or advertising cookies. If that changes, we'll update this page.</p>
<h2>External links</h2>
<p>Google reviews, government education resources, and other linked sites have their own privacy practices. Their operators control the information collected when you visit them.</p>
<h2>Questions or requests</h2>
<p>To ask about information you have shared with us, contact Robin at <a href="mailto:${SITE.email}">${SITE.email}</a> or call <a href="tel:${SITE.robin.tel}">${SITE.robin.phone}</a>. We can direct you to the relevant brokerage or service process where applicable.</p>
</div></div></section>`,
  });

  // Terms
  list.push({
    route: "/terms",
    title: "Website Disclaimer",
    description: "General information about the mortgage content and external services linked from the Bureyko Mortgage Partners website.",
    body: ({ u }) => `
${pageHero(u, { trail: [["Website disclaimer"]], h1: "Website disclaimer.", lead: "A few important details about the information and links on this site." })}
<section class="band"><div class="wrap narrow"><div class="prose">
<h2>General mortgage information</h2>
<p>This website introduces our services and provides general educational information. It is not a mortgage approval, a rate commitment, or a personalized recommendation. Speak with us about your circumstances before making a financing decision.</p>
<h2>Qualification and lender requirements</h2>
<p>${SITE.disclaimer} Lender programs and rules may change.</p>
<h2>Professional advice</h2>
<p>Our role is mortgage guidance. Legal, tax, and investment decisions should be discussed with the appropriate professional. In a separation or divorce, get independent legal advice about agreements, ownership, and property division.</p>
<h2>External services</h2>
<p>Our forms are hosted by Jotform and our secure application by Velocity. Google reviews and government education resources are run by their own providers, who control their availability, content, and terms.</p>
<h2>Brokerage relationship</h2>
<p>${SITE.brokerageStatement}</p>
<h2>Ask a question</h2>
<p>Contact Sherri or Robin for information about your situation or a service mentioned on this website.</p>
</div></div></section>`,
  });

  // 404
  list.push({
    route: "/404",
    title: "Page not found",
    description: "Find mortgage services, resources, and contact options at Bureyko Mortgage Partners.",
    noindex: true,
    body: ({ u }) => `
${pageHero(u, {
  trail: [["Page not found"]],
  h1: "Let's find<br><em>your next step.</em>",
  lead: "This page isn't available. Here are a few useful places to continue.",
  actions: `<div class="actions"><a class="btn btn-orange" href="${u("/")}">Return home</a><a class="btn btn-line" href="${u("/contact")}">Talk to us</a></div>`,
  art: ART_HOUSE,
})}
<section class="band"><div class="wrap">${resourceCards(u)}</div></section>`,
  });

  return list;
}
