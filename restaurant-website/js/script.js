const menuContainer = document.getElementById("menu");
const menuFeedback = document.getElementById("menu-feedback");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const categoryImage = document.getElementById("category-image");
const categoryGallery = document.getElementById("category-gallery");
const categoryKicker = document.getElementById("category-kicker");
const categoryTitle = document.getElementById("category-title");
const categoryDescription = document.getElementById("category-description");
let menuItems = [];
let selectedCategory = "All";
let menuLoadState = "loading";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealObserver =
  !reducedMotion && "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -24px 0px" },
      )
    : null;

function observeReveal(elements, className) {
  if (!revealObserver) return;

  Array.from(elements).forEach((element, index) => {
    element.classList.add(className);
    if (className === "reveal-block") {
      element.style.setProperty("--reveal-delay", `${Math.min(index * 70, 280)}ms`);
    }
    revealObserver.observe(element);
  });
}

function initializeRevealAnimations() {
  const revealGroups = [
    ".page-heading, .hero-content",
    ".intro-image-wrap, .intro-copy > *, .chef-profile, .about-highlights li",
    ".section-heading, .menu-toolbar, .menu-note, .filter-button, .category-feature__copy, .menu-feedback",
    ".gallery-item",
    ".reservation-copy, .reservation-form",
    ".contact-block, .map-frame",
    ".footer-brand, .footer-column",
  ];

  revealGroups.forEach((selector) => {
    observeReveal(document.querySelectorAll(selector), "reveal-block");
  });
  observeReveal(
    document.querySelectorAll("main img, .hero-image, .reservation-image"),
    "reveal-image",
  );
}

const categoryPreviews = {
  All: {
    kicker: "A Hungry Hunt favourite",
    title: "From our table",
    description: "Explore Andhra favourites and South Indian classics, freshly prepared for sharing.",
    images: [
      ["https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=900&q=85", "South Indian meal served on a banana leaf", "A meal made to be shared"],
      ["https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=85", "Golden dosa with potato masala, sambar and chutneys", "Dosa, sambar and chutney"],
      ["https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=900&q=85", "Fragrant biryani with rice and regional spices", "Fragrant biryani"],
      ["https://images.unsplash.com/photo-1741376509166-cbd74b608f5a?auto=format&fit=crop&w=900&q=85", "Idli and sambar served as a South Indian meal", "Idli and sambar"],
      ["https://images.unsplash.com/photo-1742281257687-092746ad6021?auto=format&fit=crop&w=900&q=85", "Indian thali served with side dishes", "A little of everything"],
    ],
  },
  Starters: {
    kicker: "Begin with something good",
    title: "Starters",
    description: "A fresh first taste, from soft idli to crisp, spice-led bites.",
    images: [
      ["https://images.unsplash.com/photo-1741376509166-cbd74b608f5a?auto=format&fit=crop&w=900&q=85", "Idli and sambar served as a South Indian meal", "Idli and sambar"],
      ["https://images.unsplash.com/photo-1694849789325-914b71ab4075?auto=format&fit=crop&w=900&q=85", "Dosa with chutney and sambar", "Crisp dosa and chutney"],
      ["https://images.unsplash.com/photo-1632104667384-06f58cb7ad44?auto=format&fit=crop&w=900&q=85", "A plate of small bites with a bowl of sauce", "A savoury first bite"],
      ["https://images.unsplash.com/photo-1680359873197-c3eb21ec05c0?auto=format&fit=crop&w=900&q=85", "South Indian plate served with bowls of sauce", "Freshly served"],
      ["https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=85", "Golden dosa with potato masala, sambar and chutneys", "Dosa with house chutneys"],
    ],
  },
  "Main Course": {
    kicker: "At the heart of the table",
    title: "Main course",
    description: "Hearty Andhra favourites and South Indian meals made for sharing.",
    images: [
      ["https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=900&q=85", "Fragrant biryani with rice and regional spices", "Andhra-style biryani"],
      ["https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=900&q=85", "South Indian meal served on a banana leaf", "Banana-leaf meal"],
      ["https://images.unsplash.com/photo-1742281257687-092746ad6021?auto=format&fit=crop&w=900&q=85", "Indian thali served with side dishes", "South Indian thali"],
      ["https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=85", "Biryani served on a plate", "Biryani for the table"],
      ["https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=900&q=85", "Rice and meat served in a white bowl", "A hearty rice dish"],
    ],
  },
  Desserts: {
    kicker: "A sweet finish",
    title: "Desserts",
    description: "Traditional sweets to bring a little extra joy to the table.",
    images: [
      ["images/sweets.jpg", "Traditional Indian sweets", "Indian sweets"],
      ["https://images.unsplash.com/photo-1695568181363-af5c78f4d059?auto=format&fit=crop&w=900&q=85", "Assorted desserts arranged on a plate", "A sweet assortment"],
      ["https://images.unsplash.com/photo-1695568181558-034b7d3e49eb?auto=format&fit=crop&w=900&q=85", "Indian dessert with nuts", "A nutty treat"],
      ["https://images.unsplash.com/photo-1695568181140-8b49ec87a96d?auto=format&fit=crop&w=900&q=85", "Traditional dessert served with flowers", "A special-occasion sweet"],
      ["https://images.unsplash.com/photo-1695568181440-aca4dac18650?auto=format&fit=crop&w=900&q=85", "Traditional Indian dessert in a serving bowl", "A comforting finish"],
    ],
  },
};

function createCategoryPhoto([source, alt, caption]) {
  const figure = document.createElement("figure");
  figure.className = "category-photo";

  const image = document.createElement("img");
  image.src = source;
  image.alt = alt;
  image.width = 600;
  image.height = 400;
  image.loading = "lazy";

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = caption;
  figure.append(image, figcaption);
  return figure;
}

function updateCategoryPreview(category) {
  if (!categoryKicker || !categoryTitle || !categoryDescription) return;

  const preview = categoryPreviews[category] || categoryPreviews.All;
  categoryKicker.textContent = preview.kicker;
  categoryTitle.textContent = preview.title;
  categoryDescription.textContent = preview.description;

  if (categoryGallery) {
    categoryGallery.replaceChildren(...preview.images.map(createCategoryPhoto));
    observeReveal(categoryGallery.querySelectorAll(".category-photo"), "reveal-block");
    observeReveal(categoryGallery.querySelectorAll("img"), "reveal-image");
  } else if (categoryImage) {
    categoryImage.src = preview.images[0][0];
    categoryImage.alt = preview.images[0][1];
  }
}

function setMenuMessage(message, state = "") {
  menuFeedback.textContent = message;
  menuFeedback.className = `menu-feedback${state ? ` menu-feedback--${state}` : ""}`;
}

function safeImageUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;

  try {
    const url = new URL(value, window.location.href);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function createMenuCard(item) {
  const card = document.createElement("article");
  card.className = "menu-card";

  const visual = document.createElement("div");
  visual.className = "menu-card__visual";

  const placeholder = document.createElement("span");
  placeholder.className = "menu-card__placeholder";
  placeholder.textContent = "Hungry Hunt";
  visual.append(placeholder);

  const imageUrl = safeImageUrl(item.image_url);
  if (imageUrl) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = item.name;
    image.loading = "lazy";
    image.width = 600;
    image.height = 405;
    image.addEventListener("load", () => placeholder.remove(), { once: true });
    image.addEventListener("error", () => image.remove(), { once: true });
    visual.append(image);
  }

  const category = document.createElement("span");
  category.className = "menu-card__category";
  category.textContent = item.category;
  visual.append(category);

  const body = document.createElement("div");
  body.className = "menu-card__body";
  const top = document.createElement("div");
  top.className = "menu-card__top";

  const name = document.createElement("h3");
  name.textContent = item.name;
  const price = document.createElement("span");
  price.className = "menu-card__price";
  price.textContent = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(item.price));
  top.append(name, price);
  body.append(top);

  if (item.description) {
    const description = document.createElement("p");
    description.textContent = item.description;
    body.append(description);
  }

  card.append(visual, body);
  return card;
}

function renderMenu() {
  if (menuLoadState !== "loaded") return;

  const visibleItems = menuItems.filter(
    (item) => selectedCategory === "All" || item.category.toLowerCase() === selectedCategory.toLowerCase(),
  );

  menuContainer.replaceChildren(...visibleItems.map(createMenuCard));
  menuContainer.setAttribute("aria-busy", "false");
  observeReveal(menuContainer.querySelectorAll(".menu-card"), "reveal-block");
  observeReveal(menuContainer.querySelectorAll(".menu-card__visual img"), "reveal-image");

  if (visibleItems.length === 0) {
    setMenuMessage(
      selectedCategory === "All"
        ? "Our menu is being updated. Please check back soon."
        : `There are no ${selectedCategory.toLowerCase()} on the menu right now.`,
      "empty",
    );
  } else {
    setMenuMessage("");
  }
}

async function loadMenu() {
  menuContainer.setAttribute("aria-busy", "true");

  if (!supabaseClient) {
    menuLoadState = "setup";
    setMenuMessage("Menu setup needed: add your Supabase Project URL and publishable key in js/supabase.js.", "setup");
    menuContainer.setAttribute("aria-busy", "false");
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from("menu_items")
      .select("id, name, category, description, price, image_url, is_available")
      .eq("is_available", true);

    if (error) throw error;

    menuItems = (Array.isArray(data) ? data : []).filter((item) => {
      const valid =
        item &&
        typeof item.name === "string" &&
        item.name.trim() &&
        typeof item.category === "string" &&
        item.category.trim() &&
        Number.isFinite(Number(item.price));

      if (!valid) console.warn("Skipped invalid menu item:", item);
      return valid;
    });

    menuLoadState = "loaded";
    console.log("Menu items loaded:", menuItems.length, menuItems);
    renderMenu();
  } catch (error) {
    console.error("Unable to load menu:", error);
    menuLoadState = "error";
    menuContainer.replaceChildren();
    menuContainer.setAttribute("aria-busy", "false");
    setMenuMessage("Unable to load the menu. Please try again later.", "error");
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category || "All";
    updateCategoryPreview(selectedCategory);
    filterButtons.forEach((filter) => {
      const isActive = filter === button;
      filter.classList.toggle("is-active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });
    renderMenu();
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.getElementById("primary-nav");

function closeNavigation() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  primaryNav.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("is-open", !isOpen);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeNavigation();
});

const reservationForm = document.getElementById("reservation-form");
if (reservationForm && document.body.dataset.page === "reservation") {
  const reservationDate = document.getElementById("reservation-date");
  const formFeedback = document.getElementById("form-feedback");
  const localToday = new Date();
  localToday.setMinutes(localToday.getMinutes() - localToday.getTimezoneOffset());
  reservationDate.min = localToday.toISOString().slice(0, 10);

  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formFeedback.className = "form-feedback";

    if (!reservationForm.reportValidity()) {
      formFeedback.textContent = "Please check the highlighted fields and try again.";
      formFeedback.classList.add("is-error");
      return;
    }

    const guests = Number(reservationForm.elements.guests.value);
    if (!Number.isInteger(guests) || guests < 1 || guests > 12) {
      formFeedback.textContent = "Please choose between 1 and 12 guests.";
      formFeedback.classList.add("is-error");
      return;
    }

    formFeedback.textContent = "Your details are complete. This demo does not send or store bookings yet; please contact Hungry Hunt directly to confirm your table.";
    formFeedback.classList.add("is-success");
  });
}

if (categoryGallery || categoryImage) updateCategoryPreview(selectedCategory);
initializeRevealAnimations();
if (menuContainer && document.body.dataset.page === "menu") loadMenu();
