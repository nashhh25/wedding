/**
 * ============================================================================
 * DEEPAK & LAASYA — CINEMATIC WEDDING INVITATION CONFIGURATION & INTERACTIVITY
 * ============================================================================
 * Edit DEFAULT_WEDDING_CONFIG below or use the live "✦ Customize" button
 * directly on the website to update names, photos, dates, times, venues,
 * and Google Maps links. All live edits persist in localStorage.
 */

const STORAGE_KEY = "deepak_laasya_wedding_config_v1";

const DEFAULT_WEDDING_CONFIG = {
    // Couple & Hero Section
    groomName: "Deepak",
    brideName: "Laasya",
    heroPreTitle: "TOGETHER WITH THEIR FAMILIES",
    heroDateDisplay: "25 • OCTOBER • 2026",
    heroTagline: "Two souls. One heart. One beautiful forever.",
    heroScriptLeft: "two hearts, one sacred promise...",
    heroScriptRight: "forever begins here",
    heroPhoto: "images/hero-couple.jpg",

    // Our Story Section
    storyTitle: "Once Upon A Time...",
    storyScript: "written in the stars, sealed with love",
    storySubheading: "And then there were two...",
    storyParagraph1:
        "Somewhere between ordinary moments and unexpected smiles, Deepak and Laasya found something extraordinary.",
    storyParagraph2:
        "What began as a beautiful connection slowly became a journey filled with laughter, shared dreams, and timeless love. And now, surrounded by the blessings of our families and dearest friends, we are ready to begin our forever together.",
    storyPhoto: "images/gallery-2.jpg",
    storyPhotoCaption: "\"Every step led us to each other.\"",

    // Event 1: Wedding Ceremony (Warm Romantic Floral Aesthetic)
    weddingTitle: "The Wedding Ceremony",
    weddingSubtitle:
        "A warm, romantic celebration of sacred vows amidst blooming florals and family blessings.",
    weddingScriptNote: "under the sunlit jasmine & morning blossoms...",
    weddingDateISO: "2026-10-25T10:00",
    weddingDateText: "25 October 2026",
    weddingTimeText: "10:00 AM Onwards",
    weddingVenueName: "Wedding Venue",
    weddingVenueAddress: "Bangalore, India",
    weddingMapUrl: "https://www.google.com/maps/search/?api=1&query=Bangalore+India",
    weddingNote: "Traditional Indian or Pastel Floral Festive Attire",
    weddingHeroPhoto: "images/wedding-hero.jpg",

    // Atmospheric Bridge Quote
    transitionQuote:
        "As golden sunlight fades into velvet starlight, the celebration continues...",

    // Event 2: Evening Reception (Dramatic Evening Celebration Aesthetic)
    receptionTitle: "The Evening Reception",
    receptionSubtitle:
        "An enchanting night of music, laughter, fine dining, and celebration under the chandeliers.",
    receptionScriptNote: "music, champagne toasts & dancing under the stars...",
    receptionDateISO: "2026-10-25T19:00",
    receptionDateText: "25 October 2026",
    receptionTimeText: "7:00 PM Onwards",
    receptionVenueName: "Reception Venue",
    receptionVenueAddress: "Bangalore, India",
    receptionMapUrl: "https://www.google.com/maps/search/?api=1&query=Bangalore+India",
    receptionNote: "Evening Glamour, Black Tie & Shimmering Regal Wear",
    receptionHeroPhoto: "images/reception-hero.jpg",

    // Photo Gallery Section
    galleryTitle: "Moments Of Us",
    galleryScript: "captured frames of love, laughter & togetherness",
    gallery: [
        {
            id: "gal-1",
            src: "images/gallery-1.jpg",
            caption: "Sacred promises etched in henna & gold",
            span: "span-wide"
        },
        {
            id: "gal-2",
            src: "images/gallery-2.jpg",
            caption: "Walking hand in hand into forever",
            span: "span-tall"
        },
        {
            id: "gal-3",
            src: "images/hero-couple.jpg",
            caption: "Golden hour whispers in the courtyard",
            span: "span-normal"
        },
        {
            id: "gal-4",
            src: "images/wedding-hero.jpg",
            caption: "Beneath the cascading jasmine mandap",
            span: "span-normal"
        },
        {
            id: "gal-5",
            src: "images/gallery-3.jpg",
            caption: "A tunnel of golden sparklers & joy",
            span: "span-half"
        },
        {
            id: "gal-6",
            src: "images/reception-hero.jpg",
            caption: "Candlelit toasts under the night sky",
            span: "span-half"
        }
    ],

    // Closing Invitation Section
    closingHeading: "We Would Love To Celebrate With You",
    closingScript: "your presence is our greatest blessing",
    closingMessage:
        "Your presence and blessings will make our special day even more unforgettable."
};

// Active runtime state
let appConfig = loadConfig();
let currentLightboxIndex = 0;
let isGuestPreviewMode = false;
let prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ============================================================================
// 1. CONFIGURATION PERSISTENCE & DATA BINDING
// ============================================================================

function loadConfig() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return {
                ...DEFAULT_WEDDING_CONFIG,
                ...parsed,
                gallery: Array.isArray(parsed.gallery) && parsed.gallery.length > 0
                    ? parsed.gallery
                    : JSON.parse(JSON.stringify(DEFAULT_WEDDING_CONFIG.gallery))
            };
        }
    } catch (err) {
        console.warn("Could not read saved wedding config:", err);
    }
    return JSON.parse(JSON.stringify(DEFAULT_WEDDING_CONFIG));
}

function saveConfig() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appConfig));
        const statusEl = document.getElementById("autosaveStatus");
        if (statusEl) {
            statusEl.textContent = "✓ Saved automatically";
        }
    } catch (err) {
        console.warn("Storage quota exceeded or unavailable:", err);
        showToast("Note: Image is large; applied for this session.");
    }
    updateExportTextarea();
}

function buildMapsUrl(customUrl, venueName, venueAddress) {
    const trimmed = (customUrl || "").trim();
    if (
        trimmed &&
        trimmed !== "https://www.google.com/maps" &&
        !trimmed.endsWith("query=Bangalore+India")
    ) {
        return trimmed;
    }
    const query = [venueName, venueAddress]
        .map((s) => (s || "").trim())
        .filter((s) => s && s !== "Wedding Venue" && s !== "Reception Venue")
        .join(", ") || "Bangalore, India";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function renderAllBindings() {
    // Update document title
    document.title = `${appConfig.groomName} & ${appConfig.brideName} | Save The Date — Wedding Invitation`;

    // Compute initials
    const groomInitial = (appConfig.groomName || "D").trim().charAt(0).toUpperCase();
    const brideInitial = (appConfig.brideName || "L").trim().charAt(0).toUpperCase();

    // Bind text elements
    document.querySelectorAll("[data-bind]").forEach((el) => {
        const key = el.getAttribute("data-bind");
        if (key === "groomInitial") {
            el.textContent = groomInitial;
        } else if (key === "brideInitial") {
            el.textContent = brideInitial;
        } else if (appConfig[key] !== undefined) {
            el.textContent = appConfig[key];
        }
    });

    // Bind primary photos
    setPhotoElement("heroPhotoImg", appConfig.heroPhoto, `${appConfig.groomName} and ${appConfig.brideName} Hero Portrait`);
    setPhotoElement("storyPhotoImg", appConfig.storyPhoto, `${appConfig.groomName} and ${appConfig.brideName} Story Portrait`);
    setPhotoElement("weddingHeroPhotoImg", appConfig.weddingHeroPhoto, `${appConfig.weddingTitle} Hero Photo`);
    setPhotoElement("receptionHeroPhotoImg", appConfig.receptionHeroPhoto, `${appConfig.receptionTitle} Hero Photo`);

    // Bind Google Maps links
    const weddingMapLink = document.getElementById("weddingMapLink");
    if (weddingMapLink) {
        weddingMapLink.href = buildMapsUrl(
            appConfig.weddingMapUrl,
            appConfig.weddingVenueName,
            appConfig.weddingVenueAddress
        );
    }

    const receptionMapLink = document.getElementById("receptionMapLink");
    if (receptionMapLink) {
        receptionMapLink.href = buildMapsUrl(
            appConfig.receptionMapUrl,
            appConfig.receptionVenueName,
            appConfig.receptionVenueAddress
        );
    }

    // Render Gallery
    renderGallery();

    // Update Countdowns immediately
    updateAllCountdowns();

    // Sync Form Inputs in Studio Dialog
    populateEditorForm();
    updateExportTextarea();
}

function setPhotoElement(imgId, src, altText) {
    const img = document.getElementById(imgId);
    if (!img || !src) return;
    const slot = img.closest(".image-slot");

    if (img.getAttribute("src") !== src) {
        if (slot) slot.classList.remove("img-loaded");
        img.src = src;
    }
    if (altText) {
        img.alt = altText;
    }
}

function attachImageLoadStates() {
    document.querySelectorAll(".image-slot img").forEach((img) => {
        const slot = img.closest(".image-slot");
        if (!slot) return;

        const markLoaded = () => slot.classList.add("img-loaded");
        if (img.complete && img.naturalWidth > 0) {
            markLoaded();
        }
        img.addEventListener("load", markLoaded);
        img.addEventListener("error", () => {
            slot.classList.add("img-loaded");
        });
    });
}

// ============================================================================
// 2. PHOTO GALLERY RENDERING, UPLOAD, REPLACEMENT & LIGHTBOX
// ============================================================================

function renderGallery() {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;

    grid.innerHTML = "";

    appConfig.gallery.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = `gallery-card image-slot ${item.span || "span-normal"} reveal-on-scroll is-visible`;
        card.setAttribute("data-gallery-index", String(index));

        card.innerHTML = `
            <div class="image-skeleton" aria-hidden="true"></div>
            <img
                src="${escapeHtml(item.src)}"
                alt="${escapeHtml(item.caption || `Couple memory ${index + 1}`)}"
                class="gallery-card-img"
                loading="lazy"
                decoding="async"
                data-lightbox-open="${index}"
            >
            <div class="gallery-item-edit-actions">
                <label class="gallery-mini-btn" tabindex="0" title="Replace this gallery photo">
                    <span aria-hidden="true">📷</span>
                    <span>Replace</span>
                    <input type="file" accept="image/*" class="sr-only-file" data-gallery-upload="${index}" aria-label="Replace gallery photo ${index + 1}">
                </label>
                <button type="button" class="gallery-mini-btn" data-gallery-caption-edit="${index}" title="Edit photo caption">
                    ✎ Caption
                </button>
                ${
                    appConfig.gallery.length > 1
                        ? `<button type="button" class="gallery-mini-btn delete-btn" data-gallery-delete="${index}" title="Remove photo from gallery" aria-label="Remove photo ${index + 1}">✕</button>`
                        : ""
                }
            </div>
            <div class="gallery-card-caption-bar">
                <span class="gallery-caption-text" data-gallery-caption-edit="${index}" title="Click to edit caption">${escapeHtml(item.caption || "")}</span>
                <button type="button" class="gallery-zoom-btn" data-lightbox-open="${index}" aria-label="View photo ${index + 1} fullscreen" title="View Fullscreen">⤢</button>
            </div>
        `;

        // Image load skeleton handler
        const img = card.querySelector("img");
        if (img) {
            if (img.complete) card.classList.add("img-loaded");
            img.addEventListener("load", () => card.classList.add("img-loaded"));
            img.addEventListener("error", () => card.classList.add("img-loaded"));
        }

        // Drag-and-drop photo replacement on gallery card
        setupDragAndDropOnSlot(card, (dataUrl) => {
            appConfig.gallery[index].src = dataUrl;
            saveConfig();
            renderGallery();
            showToast(`Updated Gallery Photo #${index + 1}`);
        });

        grid.appendChild(card);
    });
}

function setupGalleryInteractions() {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;

    // Click delegation for lightbox, caption edit, and delete
    grid.addEventListener("click", (e) => {
        const lightboxTrigger = e.target.closest("[data-lightbox-open]");
        if (lightboxTrigger) {
            const idx = parseInt(lightboxTrigger.getAttribute("data-lightbox-open"), 10);
            openLightbox(idx);
            return;
        }

        const captionTrigger = e.target.closest("[data-gallery-caption-edit]");
        if (captionTrigger && !isGuestPreviewMode) {
            const idx = parseInt(captionTrigger.getAttribute("data-gallery-caption-edit"), 10);
            const current = appConfig.gallery[idx]?.caption || "";
            const updated = window.prompt("Edit caption for this memory:", current);
            if (updated !== null) {
                appConfig.gallery[idx].caption = updated.trim();
                saveConfig();
                renderGallery();
                showToast("Gallery caption updated");
            }
            return;
        }

        const deleteTrigger = e.target.closest("[data-gallery-delete]");
        if (deleteTrigger) {
            const idx = parseInt(deleteTrigger.getAttribute("data-gallery-delete"), 10);
            if (appConfig.gallery.length > 1) {
                appConfig.gallery.splice(idx, 1);
                saveConfig();
                renderGallery();
                showToast("Removed photo from gallery");
            }
        }
    });

    // File input change for replacing an individual gallery photo
    grid.addEventListener("change", async (e) => {
        const fileInput = e.target.closest("[data-gallery-upload]");
        if (!fileInput || !fileInput.files || !fileInput.files[0]) return;
        const idx = parseInt(fileInput.getAttribute("data-gallery-upload"), 10);
        const dataUrl = await processUploadedImageFile(fileInput.files[0]);
        if (dataUrl && appConfig.gallery[idx]) {
            appConfig.gallery[idx].src = dataUrl;
            saveConfig();
            renderGallery();
            showToast(`Replaced Gallery Photo #${idx + 1}`);
        }
    });

    // Add new photo(s) to gallery
    const addInput = document.getElementById("addGalleryPhotoInput");
    if (addInput) {
        addInput.addEventListener("change", async () => {
            if (!addInput.files || addInput.files.length === 0) return;
            const spans = ["span-normal", "span-half", "span-wide"];
            for (const file of Array.from(addInput.files)) {
                const dataUrl = await processUploadedImageFile(file);
                if (dataUrl) {
                    appConfig.gallery.push({
                        id: `gal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                        src: dataUrl,
                        caption: `${appConfig.groomName} & ${appConfig.brideName}`,
                        span: spans[appConfig.gallery.length % spans.length]
                    });
                }
            }
            addInput.value = "";
            saveConfig();
            renderGallery();
            showToast("Added new photo to gallery!");
        });
    }
}

// Lightbox Modal Controls
function openLightbox(index) {
    const dialog = document.getElementById("lightboxDialog");
    if (!dialog || !appConfig.gallery.length) return;
    currentLightboxIndex = (index + appConfig.gallery.length) % appConfig.gallery.length;
    updateLightboxSlide();
    dialog.showModal();
}

function updateLightboxSlide() {
    const item = appConfig.gallery[currentLightboxIndex];
    if (!item) return;
    const img = document.getElementById("lightboxImg");
    const cap = document.getElementById("lightboxCaption");
    if (img) {
        img.src = item.src;
        img.alt = item.caption || "Gallery photo";
    }
    if (cap) {
        cap.textContent = item.caption || "";
    }
}

function setupLightboxControls() {
    const dialog = document.getElementById("lightboxDialog");
    const closeBtn = document.getElementById("closeLightboxBtn");
    const prevBtn = document.getElementById("prevLightboxBtn");
    const nextBtn = document.getElementById("nextLightboxBtn");

    if (!dialog) return;

    closeBtn?.addEventListener("click", () => dialog.close());
    prevBtn?.addEventListener("click", () => {
        currentLightboxIndex = (currentLightboxIndex - 1 + appConfig.gallery.length) % appConfig.gallery.length;
        updateLightboxSlide();
    });
    nextBtn?.addEventListener("click", () => {
        currentLightboxIndex = (currentLightboxIndex + 1) % appConfig.gallery.length;
        updateLightboxSlide();
    });

    // Light dismiss fallback when clicking backdrop
    dialog.addEventListener("click", (e) => {
        if (e.target === dialog) dialog.close();
    });

    // Keyboard arrow navigation when lightbox is open
    window.addEventListener("keydown", (e) => {
        if (!dialog.open) return;
        if (e.key === "ArrowLeft") {
            currentLightboxIndex = (currentLightboxIndex - 1 + appConfig.gallery.length) % appConfig.gallery.length;
            updateLightboxSlide();
        } else if (e.key === "ArrowRight") {
            currentLightboxIndex = (currentLightboxIndex + 1) % appConfig.gallery.length;
            updateLightboxSlide();
        }
    });
}

// ============================================================================
// 3. PHOTO UPLOAD & DRAG-AND-DROP REPLACEMENT FOR ALL SECTIONS
// ============================================================================

function processUploadedImageFile(file) {
    return new Promise((resolve) => {
        if (!file || !file.type.startsWith("image/")) {
            showToast("Please select a valid image file.");
            resolve(null);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const rawDataUrl = event.target?.result;
            if (!rawDataUrl) {
                resolve(null);
                return;
            }

            // Optimize image size on canvas so it renders fast and saves cleanly in localStorage
            const img = new Image();
            img.onload = () => {
                const maxDim = 1600;
                let { width, height } = img;
                if (width > maxDim || height > maxDim) {
                    const ratio = Math.min(maxDim / width, maxDim / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressed = canvas.toDataURL("image/jpeg", 0.86);
                    resolve(compressed);
                } else {
                    resolve(rawDataUrl);
                }
            };
            img.onerror = () => resolve(rawDataUrl);
            img.src = rawDataUrl;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
    });
}

function setupDragAndDropOnSlot(slotEl, onImageReady) {
    slotEl.addEventListener("dragover", (e) => {
        e.preventDefault();
        slotEl.classList.add("drag-over");
    });

    slotEl.addEventListener("dragleave", () => {
        slotEl.classList.remove("drag-over");
    });

    slotEl.addEventListener("drop", async (e) => {
        e.preventDefault();
        slotEl.classList.remove("drag-over");
        const file = e.dataTransfer?.files?.[0];
        if (file) {
            const dataUrl = await processUploadedImageFile(file);
            if (dataUrl) onImageReady(dataUrl);
        }
    });
}

function setupSectionPhotoReplacements() {
    // File upload inputs for heroPhoto, storyPhoto, weddingHeroPhoto, receptionHeroPhoto
    document.querySelectorAll("input[type='file'][data-upload-target]").forEach((input) => {
        input.addEventListener("change", async () => {
            const targetKey = input.getAttribute("data-upload-target");
            const file = input.files?.[0];
            if (!targetKey || !file) return;

            const dataUrl = await processUploadedImageFile(file);
            if (dataUrl) {
                appConfig[targetKey] = dataUrl;
                saveConfig();
                renderAllBindings();
                showToast("Photo updated & saved!");
            }
            input.value = "";
        });
    });

    // URL buttons for setting image path/URL
    document.querySelectorAll("[data-url-target]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetKey = btn.getAttribute("data-url-target");
            if (!targetKey) return;
            const currentVal = appConfig[targetKey]?.startsWith("data:")
                ? ""
                : appConfig[targetKey] || "";
            const nextUrl = window.prompt(
                "Enter image URL or local file path (e.g. images/my-photo.jpg):",
                currentVal
            );
            if (nextUrl && nextUrl.trim()) {
                appConfig[targetKey] = nextUrl.trim();
                saveConfig();
                renderAllBindings();
                showToast("Photo URL updated!");
            }
        });
    });

    // Drag-and-drop on main photo slots
    document.querySelectorAll(".image-slot[data-photo-key]").forEach((slot) => {
        const key = slot.getAttribute("data-photo-key");
        if (!key) return;
        setupDragAndDropOnSlot(slot, (dataUrl) => {
            appConfig[key] = dataUrl;
            saveConfig();
            renderAllBindings();
            showToast("Photo replaced via drag & drop!");
        });
    });
}

// ============================================================================
// 4. DUAL INDEPENDENT COUNTDOWN TIMERS (WEDDING & RECEPTION)
// ============================================================================

function computeTimeParts(targetISODate) {
    const parsed = Date.parse(targetISODate);
    const targetMs = Number.isNaN(parsed)
        ? new Date("2026-10-25T10:00:00").getTime()
        : parsed;
    const nowMs = Date.now();
    const diff = targetMs - nowMs;

    if (diff <= 0) {
        return { expired: true, days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return {
        expired: false,
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0")
    };
}

function updateAllCountdowns() {
    // 1. Wedding Ceremony Countdown
    const wed = computeTimeParts(appConfig.weddingDateISO);
    setTextIfChanged("weddingDays", wed.days);
    setTextIfChanged("weddingHours", wed.hours);
    setTextIfChanged("weddingMinutes", wed.minutes);
    setTextIfChanged("weddingSeconds", wed.seconds);

    const wedStatus = document.getElementById("weddingCountdownStatus");
    if (wedStatus) {
        wedStatus.textContent = wed.expired
            ? "✨ Today we celebrate our sacred union! ✨"
            : "Every heartbeat brings us closer to this sacred morning.";
    }

    // 2. Evening Reception Countdown
    const rec = computeTimeParts(appConfig.receptionDateISO);
    setTextIfChanged("receptionDays", rec.days);
    setTextIfChanged("receptionHours", rec.hours);
    setTextIfChanged("receptionMinutes", rec.minutes);
    setTextIfChanged("receptionSeconds", rec.seconds);

    const recStatus = document.getElementById("receptionCountdownStatus");
    if (recStatus) {
        recStatus.textContent = rec.expired
            ? "🥂 The evening reception celebration is underway! 🥂"
            : "Join us as we raise a glass to our new beginning.";
    }
}

function setTextIfChanged(id, val) {
    const el = document.getElementById(id);
    if (el && el.textContent !== val) {
        el.textContent = val;
    }
}

// ============================================================================
// 5. LIVE CUSTOMIZATION STUDIO DIALOG & INLINE CLICK-TO-EDIT
// ============================================================================

function populateEditorForm() {
    const form = document.getElementById("invitationEditorForm");
    if (!form) return;

    const fields = [
        "groomName",
        "brideName",
        "heroPreTitle",
        "heroDateDisplay",
        "heroTagline",
        "heroPhoto",
        "weddingTitle",
        "weddingDateISO",
        "weddingDateText",
        "weddingTimeText",
        "weddingVenueName",
        "weddingVenueAddress",
        "weddingMapUrl",
        "weddingNote",
        "weddingHeroPhoto",
        "receptionTitle",
        "receptionDateISO",
        "receptionDateText",
        "receptionTimeText",
        "receptionVenueName",
        "receptionVenueAddress",
        "receptionMapUrl",
        "receptionNote",
        "receptionHeroPhoto",
        "storySubheading",
        "storyParagraph1",
        "storyParagraph2",
        "storyPhoto"
    ];

    fields.forEach((name) => {
        const input = form.elements.namedItem(name);
        if (input && appConfig[name] !== undefined) {
            // Avoid flooding text inputs with multi-megabyte data URLs
            if (typeof appConfig[name] === "string" && appConfig[name].startsWith("data:image")) {
                input.value = "[Custom Uploaded Photo]";
            } else {
                input.value = appConfig[name];
            }
        }
    });
}

function updateExportTextarea() {
    const output = document.getElementById("configJsonOutput");
    if (!output) return;
    output.value = JSON.stringify(appConfig, null, 2);
}

function switchEditorTab(tabName) {
    document.querySelectorAll(".editor-tab").forEach((tab) => {
        const isTarget = tab.getAttribute("data-tab") === tabName;
        tab.classList.toggle("active", isTarget);
        tab.setAttribute("aria-selected", String(isTarget));
    });

    document.querySelectorAll(".editor-panel").forEach((panel) => {
        const isTarget = panel.getAttribute("data-panel") === tabName;
        panel.classList.toggle("active", isTarget);
        panel.hidden = !isTarget;
    });
}

function setupEditorDialog() {
    const dialog = document.getElementById("editorDialog");
    const openBtn = document.getElementById("openEditorBtn");
    const footerOpenBtn = document.getElementById("footerCustomizeBtn");
    const closeBtn = document.getElementById("closeEditorBtn");
    const doneBtn = document.getElementById("doneEditingBtn");
    const form = document.getElementById("invitationEditorForm");

    if (!dialog || !form) return;

    const openStudio = (initialTab = "couple") => {
        populateEditorForm();
        switchEditorTab(initialTab);
        dialog.showModal();
    };

    openBtn?.addEventListener("click", () => openStudio("couple"));
    footerOpenBtn?.addEventListener("click", () => openStudio("couple"));
    closeBtn?.addEventListener("click", () => dialog.close());
    doneBtn?.addEventListener("click", () => {
        dialog.close();
        showToast("All invitation details saved!");
    });

    dialog.addEventListener("click", (e) => {
        if (e.target === dialog) dialog.close();
    });

    // Section-specific "✎ Edit Details" buttons
    document.querySelectorAll("[data-open-editor-tab]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const tab = btn.getAttribute("data-open-editor-tab") || "couple";
            openStudio(tab);
        });
    });

    // Tab switching
    document.querySelectorAll(".editor-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            const tabName = tab.getAttribute("data-tab");
            if (tabName) switchEditorTab(tabName);
        });
    });

    // Live input synchronization
    form.addEventListener("input", (e) => {
        const target = e.target;
        if (!target || !target.name) return;
        const name = target.name;
        const val = target.value;

        if (val === "[Custom Uploaded Photo]") return;

        appConfig[name] = val;
        saveConfig();
        renderAllBindings();
    });

    // Export / Copy / Reset actions
    document.getElementById("copyConfigJsonBtn")?.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(appConfig, null, 2));
            showToast("Configuration JSON copied to clipboard!");
        } catch {
            showToast("Select and copy the JSON from the text box.");
        }
    });

    document.getElementById("downloadConfigJsonBtn")?.addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(appConfig, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "wedding-invitation-config.json";
        a.click();
        URL.revokeObjectURL(url);
        showToast("Downloaded wedding-invitation-config.json");
    });

    document.getElementById("resetDefaultConfigBtn")?.addEventListener("click", () => {
        if (window.confirm("Reset all names, dates, venues, and photos back to the default template?")) {
            localStorage.removeItem(STORAGE_KEY);
            appConfig = JSON.parse(JSON.stringify(DEFAULT_WEDDING_CONFIG));
            renderAllBindings();
            showToast("Reset to default template");
        }
    });

    // Click-to-edit inline fields on the page
    document.querySelectorAll("[data-editable-field]").forEach((el) => {
        el.addEventListener("click", () => {
            if (isGuestPreviewMode) return;
            const field = el.getAttribute("data-editable-field");
            if (!field) return;

            const currentVal = appConfig[field] || el.textContent.trim();
            const nextVal = window.prompt("Update text:", currentVal);
            if (nextVal !== null && nextVal.trim() !== "") {
                appConfig[field] = nextVal.trim();
                saveConfig();
                renderAllBindings();
                showToast("Updated!");
            }
        });
    });
}

// ============================================================================
// 6. GUEST PREVIEW MODE, ENTER INVITATION, CALENDAR (.ICS) & SHARE
// ============================================================================

function setupActionButtons() {
    // Guest Preview Mode Toggle (hides/shows photo upload overlays)
    const previewBtn = document.getElementById("togglePreviewModeBtn");
    const previewLabel = document.getElementById("previewModeLabel");
    previewBtn?.addEventListener("click", () => {
        isGuestPreviewMode = !isGuestPreviewMode;
        document.body.classList.toggle("guest-preview-mode", isGuestPreviewMode);
        previewBtn.setAttribute("aria-pressed", String(isGuestPreviewMode));
        if (previewLabel) {
            previewLabel.textContent = isGuestPreviewMode ? "Edit Mode" : "Guest View";
        }
        showToast(
            isGuestPreviewMode
                ? "Guest View enabled — upload & edit controls hidden"
                : "Edit Mode enabled — click any photo or text to customize"
        );
    });

    // Enter Invitation CTA button
    const enterBtn = document.getElementById("enterInvitationBtn");
    enterBtn?.addEventListener("click", () => {
        triggerCelebrationBurst(36);
        const storySection = document.getElementById("story");
        storySection?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });

    // Save to Calendar (.ics download) buttons
    document.querySelectorAll("[data-calendar-event]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const type = btn.getAttribute("data-calendar-event");
            downloadCalendarEvent(type === "reception" ? "reception" : "wedding");
        });
    });

    // Celebrate / Shower Blessings Confetti button
    document.getElementById("celebrateConfettiBtn")?.addEventListener("click", () => {
        triggerCelebrationBurst(95);
        showToast(`✨ Blessings showered for ${appConfig.groomName} & ${appConfig.brideName}! ♥`);
    });

    // Share / Copy Invitation Summary button
    document.getElementById("shareInvitationBtn")?.addEventListener("click", async () => {
        const wedMap = buildMapsUrl(appConfig.weddingMapUrl, appConfig.weddingVenueName, appConfig.weddingVenueAddress);
        const recMap = buildMapsUrl(appConfig.receptionMapUrl, appConfig.receptionVenueName, appConfig.receptionVenueAddress);
        const summary = [
            `✨ SAVE THE DATE: ${appConfig.groomName} & ${appConfig.brideName} ✨`,
            `${appConfig.heroTagline}`,
            ``,
            `💍 ${appConfig.weddingTitle}`,
            `📅 ${appConfig.weddingDateText} at ${appConfig.weddingTimeText}`,
            `🏛️ ${appConfig.weddingVenueName}, ${appConfig.weddingVenueAddress}`,
            `📍 Map: ${wedMap}`,
            ``,
            `🥂 ${appConfig.receptionTitle}`,
            `📅 ${appConfig.receptionDateText} at ${appConfig.receptionTimeText}`,
            `✨ ${appConfig.receptionVenueName}, ${appConfig.receptionVenueAddress}`,
            `📍 Map: ${recMap}`
        ].join("\n");

        try {
            await navigator.clipboard.writeText(summary);
            showToast("Invitation summary copied to clipboard!");
        } catch {
            showToast("Could not copy automatically.");
        }
    });
}

function downloadCalendarEvent(eventType) {
    const isReception = eventType === "reception";
    const title = isReception
        ? `${appConfig.groomName} & ${appConfig.brideName} — ${appConfig.receptionTitle}`
        : `${appConfig.groomName} & ${appConfig.brideName} — ${appConfig.weddingTitle}`;

    const iso = isReception ? appConfig.receptionDateISO : appConfig.weddingDateISO;
    const venue = isReception
        ? `${appConfig.receptionVenueName}, ${appConfig.receptionVenueAddress}`
        : `${appConfig.weddingVenueName}, ${appConfig.weddingVenueAddress}`;

    const startDate = new Date(iso || "2026-10-25T10:00:00");
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

    const formatICSDate = (d) =>
        d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Deepak & Laasya Wedding Invitation//EN",
        "BEGIN:VEVENT",
        `SUMMARY:${title}`,
        `DTSTART:${formatICSDate(startDate)}`,
        `DTEND:${formatICSDate(endDate)}`,
        `LOCATION:${venue}`,
        `DESCRIPTION:${appConfig.heroTagline}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${appConfig.groomName}-${appConfig.brideName}-${eventType}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Saved ${isReception ? "Reception" : "Wedding"} to Calendar (.ics)`);
}

// ============================================================================
// 7. AMBIENT MUSIC (HTML5 AUDIO + WEB AUDIO API ROMANTIC HARP SYNTHESIS)
// ============================================================================

let audioCtx = null;
let chimeInterval = null;
let isMusicPlaying = false;

function playGentleChimeChord() {
    if (!audioCtx || !isMusicPlaying) return;
    const now = audioCtx.currentTime;
    // Warm F-major-9 / C-major pentatonic harp notes
    const chordSets = [
        [261.63, 329.63, 392.00, 493.88, 587.33],
        [220.00, 261.63, 329.63, 392.00, 523.25],
        [174.61, 220.00, 261.63, 349.23, 440.00],
        [196.00, 246.94, 293.66, 392.00, 493.88]
    ];
    const chord = chordSets[Math.floor(Math.random() * chordSets.length)];

    chord.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.28);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.28);
        gain.gain.exponentialRampToValueAtTime(0.025, now + idx * 0.28 + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.28 + 3.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.28);
        osc.stop(now + idx * 0.28 + 3.3);
    });
}

function setupMusicController() {
    const btn = document.getElementById("musicToggleBtn");
    const icon = document.getElementById("musicIcon");
    const audioEl = document.getElementById("weddingMusic");

    if (!btn) return;

    btn.addEventListener("click", () => {
        isMusicPlaying = !isMusicPlaying;
        btn.setAttribute("aria-pressed", String(isMusicPlaying));
        if (icon) icon.textContent = isMusicPlaying ? "🔊" : "🎵";

        if (isMusicPlaying) {
            // Try playing HTML5 audio file first; fallback to Web Audio API romantic harp synth
            if (audioEl) {
                audioEl.play().catch(() => {
                    startSynthesizedMusic();
                });
            } else {
                startSynthesizedMusic();
            }
            showToast("Ambient wedding melody playing ♪");
        } else {
            audioEl?.pause();
            if (chimeInterval) {
                clearInterval(chimeInterval);
                chimeInterval = null;
            }
            showToast("Ambient music paused");
        }
    });
}

function startSynthesizedMusic() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === "suspended") audioCtx.resume();
    playGentleChimeChord();
    if (chimeInterval) clearInterval(chimeInterval);
    chimeInterval = setInterval(playGentleChimeChord, 4200);
}

// ============================================================================
// 8. SCROLL REVEALS, SCROLLSPY & AMBIENT PETAL/SPARKLE CANVAS
// ============================================================================

function setupScrollObservers() {
    // Reveal on scroll
    const revealEls = document.querySelectorAll(".reveal-on-scroll");
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                    }
                });
            },
            { threshold: 0.14 }
        );
        revealEls.forEach((el) => revealObserver.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add("is-visible"));
    }

    // Active section & header night-mode switch when viewing Evening Reception
    const sections = ["hero", "story", "wedding", "reception", "gallery"]
        .map((id) => document.getElementById(id))
        .filter(Boolean);
    const navLinks = document.querySelectorAll(".nav-link[data-section]");
    const header = document.getElementById("floatingHeader");

    if ("IntersectionObserver" in window && sections.length) {
        const spyObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        navLinks.forEach((link) => {
                            link.classList.toggle("active", link.getAttribute("data-section") === id);
                        });
                        if (header) {
                            header.classList.toggle("night-mode", id === "reception");
                        }
                    }
                });
            },
            { rootMargin: "-35% 0px -55% 0px" }
        );
        sections.forEach((sec) => spyObserver.observe(sec));
    }
}

function setupAmbientCanvas() {
    const canvas = document.getElementById("ambientCanvas");
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 26 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3.2 + 1.4,
        vx: (Math.random() - 0.5) * 0.35,
        vy: Math.random() * 0.45 + 0.18,
        alpha: Math.random() * 0.45 + 0.15,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.015
    }));

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const isNight = document.getElementById("floatingHeader")?.classList.contains("night-mode");

        particles.forEach((p) => {
            p.x += p.vx;
            p.y += isNight ? -p.vy * 0.65 : p.vy;
            p.angle += p.spin;

            if (p.y > height + 10) p.y = -10;
            if (p.y < -10) p.y = height + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.x < -10) p.x = width + 10;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.globalAlpha = p.alpha;

            if (isNight) {
                // Golden champagne starlight sparkle
                ctx.fillStyle = "#EAC966";
                ctx.beginPath();
                ctx.arc(0, 0, p.r * 0.85, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Soft blush/ivory floral petal
                ctx.fillStyle = "#E6B8AD";
                ctx.beginPath();
                ctx.ellipse(0, 0, p.r * 1.45, p.r * 0.85, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

// ============================================================================
// 9. CELEBRATION CONFETTI & TOAST NOTIFICATIONS
// ============================================================================

function triggerCelebrationBurst(count = 60) {
    if (prefersReducedMotion) return;
    const symbols = ["✨", "♥", "✦", "✿", "🥂"];
    for (let i = 0; i < count; i++) {
        const el = document.createElement("span");
        el.textContent = symbols[i % symbols.length];
        el.setAttribute("aria-hidden", "true");
        const startX = 40 + Math.random() * 20;
        const driftX = (Math.random() - 0.5) * 70;
        const duration = 1800 + Math.random() * 1400;

        Object.assign(el.style, {
            position: "fixed",
            left: `${startX}vw`,
            top: "55vh",
            fontSize: `${14 + Math.random() * 16}px`,
            color: i % 2 === 0 ? "#D4AF37" : "#C85A48",
            pointerEvents: "none",
            zIndex: "9998",
            transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration}ms ease`
        });

        document.body.appendChild(el);
        requestAnimationFrame(() => {
            el.style.transform = `translate(${driftX}vw, ${-35 - Math.random() * 45}vh) rotate(${Math.random() * 360}deg)`;
            el.style.opacity = "0";
        });

        setTimeout(() => el.remove(), duration + 100);
    }
}

function showToast(message) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.25s ease";
        setTimeout(() => toast.remove(), 260);
    }, 2800);
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// ============================================================================
// INITIALIZE APPLICATION
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    renderAllBindings();
    attachImageLoadStates();
    setupSectionPhotoReplacements();
    setupGalleryInteractions();
    setupLightboxControls();
    setupEditorDialog();
    setupActionButtons();
    setupMusicController();
    setupScrollObservers();
    setupAmbientCanvas();

    // Update both countdown timers every second
    setInterval(updateAllCountdowns, 1000);
});