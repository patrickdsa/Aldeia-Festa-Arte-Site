const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");

    toggle.setAttribute("aria-expanded", String(opened));
    toggle.setAttribute("aria-label", opened ? "Fechar menu" : "Abrir menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
    });
  });
}

const bookingForm = document.querySelector("#booking-form");

if (bookingForm) {
  // Configure este endereço com o email de reservas da Aldeia.
  const contactEmail = "aldeia.coimbra@gmail.com";
  const dateInput = bookingForm.querySelector('[name="data"]');
  const status = document.querySelector("#form-status");

  if (dateInput) {
    dateInput.min = new Date().toISOString().slice(0, 10);
  }

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactEmail) {
      status.textContent = "O pedido está pronto, mas falta configurar o email de destino da Aldeia para o poder enviar.";
      return;
    }

    const fields = new FormData(bookingForm);
    const date = new Date(`${fields.get("data")}T00:00:00`).toLocaleDateString("pt-PT");
    const subject = "Pedido de reserva — Aldeia Festa e Arte";
    const body = [
      "Olá, gostaria de saber a disponibilidade para a minha festa.",
      "",
      `Data que pretende reservar: ${date}`,
      `Nome: ${fields.get("nome")}`,
      `Horário: ${fields.get("horario")}`,
      `Contacto telefónico: ${fields.get("telefone")}`,
    ].join("\n");

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

document.querySelectorAll("[data-slider]").forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll(".space-slide"));
  const counter = slider.querySelector("[data-slider-count]");
  const previous = slider.querySelector("[data-slider-prev]");
  const next = slider.querySelector("[data-slider-next]");
  let activeIndex = slides.findIndex((slide) =>
    slide.classList.contains("is-active"),
  );

  if (activeIndex < 0) activeIndex = 0;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;

      slide.hidden = !isActive;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
      slide.setAttribute(
        "aria-label",
        `${slideIndex + 1} de ${slides.length}`,
      );
    });

    counter.textContent = `${activeIndex + 1} / ${slides.length}`;
  }

  previous.addEventListener("click", () => {
    showSlide(activeIndex - 1);
  });

  next.addEventListener("click", () => {
    showSlide(activeIndex + 1);
  });
});

const spacePage = document.querySelector(".space-page");

if (spacePage) {
  const revealItems = spacePage.querySelectorAll(
    ".page-hero, .feature-photo, .space-story .text-col, .space-story > img, .space-story .feature-list li, .space-gallery-heading, .space-slider",
  );

  revealItems.forEach((item) => item.classList.add("scroll-reveal"));

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    const revealOnScroll = () => {
      revealItems.forEach((item) => {
        if (item.getBoundingClientRect().top < window.innerHeight - 24) {
          item.classList.add("is-revealed");
        }
      });
    };

    window.addEventListener("scroll", revealOnScroll, { passive: true });
    window.addEventListener("resize", revealOnScroll);
    revealOnScroll();
  }
}

