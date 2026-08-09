/* ============================================
   BRICKWELL — Landing interactions
   ============================================ */

(function () {
  "use strict";

  // ========== CONFIG: Telegram ==========
  // 1) Создайте бота через @BotFather → получите TOKEN
  // 2) Напишите боту любое сообщение
  // 3) Узнайте chat_id: https://api.telegram.org/bot<TOKEN>/getUpdates
  // 4) Вставьте ниже:
  const TELEGRAM_BOT_TOKEN = "PASTE_BOT_TOKEN_HERE";
  const TELEGRAM_CHAT_ID = "PASTE_CHAT_ID_HERE";
  // =====================================

  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const form = document.getElementById("leadForm");
  const formStatus = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const productSelect = document.getElementById("product");

  // Sticky header
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("open");
      burger.classList.toggle("active");
      document.body.style.overflow = nav.classList.contains("open") ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        burger.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // Product buttons → prefill form
  document.querySelectorAll("[data-product]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-product");
      if (productSelect && name) {
        const options = [...productSelect.options];
        const match = options.find((o) => o.value === name || o.text === name);
        if (match) productSelect.value = match.value;
        else productSelect.value = name;
      }
    });
  });

  // Gallery lightbox
  document.querySelectorAll(".gallery__item").forEach((item) => {
    item.addEventListener("click", () => {
      const src = item.getAttribute("data-full") || item.querySelector("img")?.src;
      if (!src) return;
      lightboxImg.src = src;
      lightboxImg.alt = item.querySelector("img")?.alt || "Объект BRICKWELL";
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  };

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  // Phone mask (BY)
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      let v = phoneInput.value.replace(/\D/g, "");
      if (v.startsWith("375")) v = v.slice(3);
      if (v.startsWith("80")) v = v.slice(2);
      if (v.startsWith("0")) v = v.slice(1);
      v = v.slice(0, 9);
      let out = "+375";
      if (v.length > 0) out += " (" + v.slice(0, 2);
      if (v.length >= 2) out += ") " + v.slice(2, 5);
      if (v.length >= 5) out += "-" + v.slice(5, 7);
      if (v.length >= 7) out += "-" + v.slice(7, 9);
      phoneInput.value = out;
    });
  }

  function showStatus(ok, text) {
    formStatus.hidden = false;
    formStatus.className = "form__status " + (ok ? "ok" : "err");
    formStatus.textContent = text;
  }

  // Form → Telegram
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const product = form.product.value || "—";
      const message = form.message.value.trim() || "—";

      if (!name || !phone) {
        showStatus(false, "Заполните имя и телефон");
        return;
      }

      const text =
        `🧱 <b>Новая заявка BRICKWELL</b>\n\n` +
        `👤 <b>Имя:</b> ${escapeHtml(name)}\n` +
        `📞 <b>Телефон:</b> ${escapeHtml(phone)}\n` +
        `📦 <b>Интерес:</b> ${escapeHtml(product)}\n` +
        `💬 <b>Комментарий:</b> ${escapeHtml(message)}\n` +
        `🌐 <b>Страница:</b> ${location.href}\n` +
        `🕐 <b>Время:</b> ${new Date().toLocaleString("ru-RU")}`;

      // If tokens not set — open Telegram share / fallback
      if (
        TELEGRAM_BOT_TOKEN.includes("PASTE_") ||
        TELEGRAM_CHAT_ID.includes("PASTE_")
      ) {
        // Fallback: open WhatsApp/Telegram deep link style message for manager
        const plain =
          `Заявка BRICKWELL\nИмя: ${name}\nТелефон: ${phone}\nИнтерес: ${product}\nКомментарий: ${message}`;
        const tgShare = `https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(plain)}`;
        // Better UX: copy + show instructions
        try {
          await navigator.clipboard.writeText(plain);
        } catch (_) {}
        showStatus(
          true,
          "Заявка сформирована. Вставьте TELEGRAM_BOT_TOKEN и CHAT_ID в script.js — тогда заявки будут приходить автоматически. Сейчас текст заявки скопирован в буфер."
        );
        // Optional: open your manager chat
        // window.open("https://t.me/your_manager", "_blank");
        form.reset();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Отправка…";

      try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text,
            parse_mode: "HTML",
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.description || "Ошибка Telegram API");
        }

        showStatus(true, "Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
        form.reset();
      } catch (err) {
        console.error(err);
        showStatus(
          false,
          "Не удалось отправить. Напишите нам в Telegram или позвоните."
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Отправить в Telegram";
      }
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Soft reveal on scroll
  const revealEls = document.querySelectorAll(
    ".product, .step, .gallery__item, .about__text, .showroom__text, .form"
  );
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      io.observe(el);
    });
  }
})();
