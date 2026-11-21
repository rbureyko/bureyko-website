// Members-area protection for a static site (GitHub Pages has no server to check passwords).
// At build time each members page is encrypted (AES-GCM, key from the password via PBKDF2).
// The published file holds only scrambled data; without the password the content can't be read,
// even by opening the page's address directly.
// The password comes from the MEMBERS_PASSWORD secret and is never written into the code or the site.
//
// Logging in (on the public page's panel or /break-up-with-renting/login) turns the password into the
// key and keeps the KEY (never the password) on that device for 90 days. The salt is fixed for this site,
// so the key stays the same across site updates (members aren't logged out every time the site changes)
// and changes when the password changes (everyone is logged out automatically).
import { webcrypto as crypto } from "node:crypto";

const ITERATIONS = 250000;
const SALT = "bureykomortgages.ca/break-up-with-renting/members";
const b64 = (buf) => Buffer.from(buf).toString("base64");

export async function makeProtector(password) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: new TextEncoder().encode(SALT), iterations: ITERATIONS, hash: "SHA-256" },
    base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]
  );
  const protect = async (html) => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(html));
    return { iv: b64(iv), data: b64(data) };
  };
  // A tiny scrambled value the login form decrypts to check the password, without opening any page
  protect.check = await protect("buwr-ok");
  return protect;
}

// Shared by every page that reads or writes the saved login (browser side)
const STORE = `
  const KEY = "buwr-members-key", FAILS = "buwr-login-fails";
  const DAYS = 90, MAX_FAILS = 8, FAIL_WINDOW = 15 * 60 * 1000;
  const bytes = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const saved = () => { try { const s = JSON.parse(localStorage.getItem(KEY) || "null"); return s && s.v === 2 && s.exp > Date.now() ? s : null; } catch (e) { return null; } };
  const forget = () => { try { localStorage.removeItem(KEY); } catch (e) {} };`;

// The visible members page before it opens: it unlocks with the saved key, or sends the visitor to the
// login page and back again afterwards.
export function gateBody(payload, { loginUrl }) {
  if (!payload) return `
<section class="band">
  <div class="wrap narrow">
    <div class="gate card">
      <span class="eyebrow">Break Up With Renting · Members</span>
      <h1 style="font-size:clamp(1.9rem,4vw,2.6rem)">Members area</h1>
      <p>The members area opens soon. You'll get the link and password in Robin's welcome message.</p>
    </div>
  </div>
</section>`;
  return `
<section class="band">
  <div class="wrap narrow">
    <div class="gate card" id="gate">
      <span class="eyebrow">Break Up With Renting · Members</span>
      <h1 style="font-size:clamp(1.9rem,4vw,2.6rem)">Members area</h1>
      <p id="gateMsg">Opening…</p>
      <noscript><p>The members area needs JavaScript turned on in your browser.</p></noscript>
      <a class="btn btn-orange" href="${loginUrl}">Member login</a>
    </div>
  </div>
</section>
<script>
(() => {
  const P = ${JSON.stringify(payload)};
  const LOGIN = ${JSON.stringify(loginUrl)};
  ${STORE}
  const toLogin = () => location.replace(LOGIN + "?next=" + encodeURIComponent(location.pathname + location.search + location.hash));
  // Wait until this page has fully loaded, so the real page replaces it instead of being added below it
  const loaded = new Promise((r) => document.readyState === "complete" ? r() : window.addEventListener("load", r, { once: true }));
  (async () => {
    const s = saved();
    if (!s) { forget(); return toLogin(); }
    try {
      const key = await crypto.subtle.importKey("raw", bytes(s.key), "AES-GCM", false, ["decrypt"]);
      const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes(P.iv) }, key, bytes(P.data));
      await loaded;
      document.open(); document.write(new TextDecoder().decode(plain)); document.close();
    } catch (e) { forget(); toLogin(); } // the password has changed since this device logged in
  })();
})();
</script>`;
}

// The login form (used in the public page's panel and on the login page)
export function loginForm(id, { joinHref, phone, tel }) {
  return `<form class="login-form" id="${id}" action="#" method="post">
  <input class="visually-hidden" type="text" name="username" autocomplete="username" value="Break Up With Renting member" tabindex="-1" aria-hidden="true">
  <label for="${id}-pass">Members password</label>
  <div class="pass-row">
    <input id="${id}-pass" name="password" type="password" autocomplete="current-password" autocapitalize="off" autocorrect="off" spellcheck="false" required>
    <button class="pass-toggle" type="button" aria-controls="${id}-pass" aria-pressed="false">Show</button>
  </div>
  <button class="btn btn-orange" type="submit">Log in</button>
  <p class="login-msg" role="alert" aria-live="assertive"></p>
  <p class="fine">Lost the password? Text Robin at <a class="text-link" href="sms:${tel}">${phone}</a>.</p>
  <p class="fine">Not a member yet? <a class="text-link" href="${joinHref}" data-join>Join free →</a></p>
</form>`;
}

// Browser script for login forms, the public page's "Member login" buttons and panel, and "Log out".
// check: the scrambled test value (null when the members area isn't open yet).
export function loginScript({ check, membersUrl, publicUrl, phone }) {
  return `<script>
(() => {
  const CHECK = ${JSON.stringify(check)};
  const MEMBERS = ${JSON.stringify(membersUrl)}, PUBLIC = ${JSON.stringify(publicUrl)};
  const SALT = ${JSON.stringify(SALT)}, ITERATIONS = ${ITERATIONS};
  ${STORE}
  const recentFails = () => { try { return JSON.parse(localStorage.getItem(FAILS) || "[]").filter((t) => Date.now() - t < FAIL_WINDOW); } catch (e) { return []; } };
  const addFail = () => { try { localStorage.setItem(FAILS, JSON.stringify([...recentFails(), Date.now()])); } catch (e) {} };
  // Only ever go on to a members page on this site
  const safeNext = (n) => {
    if (!n) return null;
    try {
      const url = new URL(n, location.href);
      if (url.origin !== location.origin || !/\\/break-up-with-renting\\/members(\\/|\\.html|$)/.test(url.pathname)) return null;
      return url.pathname + url.search + url.hash;
    } catch (e) { return null; }
  };

  document.querySelectorAll(".login-form").forEach((form) => {
    const pass = form.querySelector("input[type=password], input[name=password]");
    const msg = form.querySelector(".login-msg");
    const toggle = form.querySelector(".pass-toggle");
    toggle.addEventListener("click", () => {
      const show = pass.type === "password";
      pass.type = show ? "text" : "password";
      toggle.textContent = show ? "Hide" : "Show";
      toggle.setAttribute("aria-pressed", String(show));
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!CHECK) { msg.textContent = "The members area opens soon. You'll get the password in Robin's welcome message."; return; }
      if (recentFails().length >= MAX_FAILS) { msg.textContent = "Too many tries. Wait a few minutes, or text Robin at ${phone}."; return; }
      msg.textContent = "Checking…";
      try {
        const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass.value.trim()), "PBKDF2", false, ["deriveKey"]);
        const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: new TextEncoder().encode(SALT), iterations: ITERATIONS, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, true, ["decrypt"]);
        await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes(CHECK.iv) }, key, bytes(CHECK.data)); // throws if the password is wrong
        const raw = await crypto.subtle.exportKey("raw", key);
        try {
          localStorage.setItem(KEY, JSON.stringify({ v: 2, key: b64(raw), exp: Date.now() + DAYS * 864e5 }));
          localStorage.removeItem(FAILS);
        } catch (err) {}
        msg.textContent = "You're in. Opening the members area…";
        location.href = safeNext(new URLSearchParams(location.search).get("next")) || MEMBERS;
      } catch (err) {
        addFail();
        msg.textContent = "That password doesn't match. Check Robin's welcome email, or text Robin at ${phone}.";
        pass.select();
      }
    });
  });

  // Public page: "Member login" buttons open the panel, or go straight in when already logged in
  const sheet = document.getElementById("loginSheet");
  let opener = null;
  document.querySelectorAll("[data-member-login]").forEach((btn) => {
    if (saved()) {
      btn.textContent = "Go to members area →";
      btn.href = MEMBERS;
      return;
    }
    if (!sheet || !sheet.showModal) return; // falls back to the login page link
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      opener = btn;
      sheet.showModal();
      sheet.querySelector("input[type=password]").focus();
    });
  });
  if (sheet) {
    sheet.querySelector(".sheet-close").addEventListener("click", () => sheet.close());
    sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); }); // tap outside
    sheet.addEventListener("close", () => { if (opener) opener.focus(); });
    sheet.querySelectorAll("[data-join]").forEach((a) => a.addEventListener("click", () => sheet.close()));
  }

  // Members hub: "Log out"
  document.querySelectorAll("[data-member-logout]").forEach((b) => b.addEventListener("click", () => { forget(); location.href = PUBLIC; }));
})();
</script>`;
}
