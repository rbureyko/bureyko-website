// Members-area protection for a static site (GitHub Pages has no server to check passwords).
// At build time each members page is encrypted (AES-GCM, key from the password via PBKDF2).
// The published file holds only scrambled data plus a password box; without the password the
// content can't be read, even by opening the page's address directly.
// The password comes from the MEMBERS_PASSWORD secret and is never written into the code or the site.
import { webcrypto as crypto } from "node:crypto";

const ITERATIONS = 250000;
const b64 = (buf) => Buffer.from(buf).toString("base64");

export async function makeProtector(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]
  );
  return async (html) => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(html));
    return { salt: b64(salt), iv: b64(iv), data: b64(data), iterations: ITERATIONS };
  };
}

// The visible page: a password box inside the normal site layout, plus the scrambled page.
// On the right password the real page replaces it. The derived key (not the password) is kept on
// this device so other members pages open without asking again.
export function gateBody(payload, { phone, tel }) {
  return `
<section class="band">
  <div class="wrap narrow">
    <div class="gate card" id="gate" ${payload ? 'hidden' : ""}>
      <span class="eyebrow">Break Up With Renting · Members</span>
      <h1 style="font-size:clamp(1.9rem,4vw,2.6rem)">Members area</h1>
      ${payload ? `
      <p>Enter the password from Robin's welcome message.</p>
      <form id="gateForm" class="gate-form">
        <label for="gatePass">Password</label>
        <input id="gatePass" type="password" autocomplete="current-password" required>
        <button class="btn btn-orange" type="submit">Open the members area</button>
        <p class="gate-msg" id="gateMsg" role="status" aria-live="polite"></p>
      </form>
      <p class="fine">Lost the password? Text Robin at <a class="text-link" href="sms:${tel}">${phone}</a>.</p>` : `
      <p>The members area opens soon. You'll get the link and password in Robin's welcome message.</p>`}
    </div>
  </div>
</section>
${payload ? `<script>
(() => {
  const P = ${JSON.stringify(payload)};
  const KEY = "buwr-members-key";
  const gate = document.getElementById("gate"), msg = document.getElementById("gateMsg");
  const bytes = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  // Wait until this page has fully loaded, so the real page replaces it instead of being added below it
  const loaded = new Promise((r) => document.readyState === "complete" ? r() : window.addEventListener("load", r, { once: true }));
  async function open(key) {
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes(P.iv) }, key, bytes(P.data));
    await loaded;
    const html = new TextDecoder().decode(plain);
    document.open(); document.write(html); document.close();
  }
  async function fromStore() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!s || s.salt !== P.salt) return false;
      const key = await crypto.subtle.importKey("raw", bytes(s.key), "AES-GCM", false, ["decrypt"]);
      await open(key); return true;
    } catch (e) { try { localStorage.removeItem(KEY); } catch (_) {} return false; }
  }
  fromStore().then((ok) => { if (!ok) { gate.hidden = false; document.getElementById("gatePass").focus(); } });
  document.getElementById("gateForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Checking…";
    try {
      const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(document.getElementById("gatePass").value), "PBKDF2", false, ["deriveKey"]);
      const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: bytes(P.salt), iterations: P.iterations, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, true, ["decrypt"]);
      const raw = await crypto.subtle.exportKey("raw", key);
      await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes(P.iv) }, key, bytes(P.data)); // throws if the password is wrong
      try { localStorage.setItem(KEY, JSON.stringify({ salt: P.salt, key: b64(raw) })); } catch (_) {}
      await open(key);
    } catch (err) { msg.textContent = "That password didn't work. Check Robin's welcome message and try again."; }
  });
})();
</script>` : ""}`;
}
