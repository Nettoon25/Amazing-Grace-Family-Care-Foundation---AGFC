
document.addEventListener("DOMContentLoaded", function () {
    const galleryImages = Array.from(
        document.querySelectorAll(".image-gallery .gallery-image img")
    );

    const lightbox = document.getElementById("imageLightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxCounter = document.getElementById("lightboxCounter");

    const closeButton = document.getElementById("lightboxClose");
    const previousButton = document.getElementById("lightboxPrev");
    const nextButton = document.getElementById("lightboxNext");

    if (
        !lightbox ||
        !lightboxImage ||
        !closeButton ||
        !previousButton ||
        !nextButton ||
        galleryImages.length === 0
    ) {
        return;
    }

    let currentIndex = 0;
    let previouslyFocusedElement = null;

    function showImage(index) {
        // Cycle continuously through the gallery
        currentIndex =
            (index + galleryImages.length) % galleryImages.length;

        const selectedImage = galleryImages[currentIndex];

        lightboxImage.src = selectedImage.currentSrc || selectedImage.src;
        lightboxImage.alt = selectedImage.alt || "Gallery image";

        lightboxCaption.textContent = selectedImage.alt || "";
        lightboxCounter.textContent =
            `${currentIndex + 1} / ${galleryImages.length}`;

        previousButton.disabled = galleryImages.length < 2;
        nextButton.disabled = galleryImages.length < 2;
    }

    function openLightbox(index) {
        previouslyFocusedElement = document.activeElement;

        showImage(index);

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");

        closeButton.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");

        lightboxImage.removeAttribute("src");

        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
    }

    galleryImages.forEach(function (image, index) {
        image.addEventListener("click", function () {
            openLightbox(index);
        });

        image.setAttribute("tabindex", "0");
        image.setAttribute("role", "button");
        image.setAttribute("aria-label", "View image: " + (image.alt || "Gallery image"));

        image.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(index);
            }
        });
    });

    closeButton.addEventListener("click", closeLightbox);

    previousButton.addEventListener("click", function () {
        showImage(currentIndex - 1);
    });

    nextButton.addEventListener("click", function () {
        showImage(currentIndex + 1);
    });

    // Close when the dark backdrop is clicked
    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener("keydown", function (event) {
        if (!lightbox.classList.contains("active")) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowLeft") {
            showImage(currentIndex - 1);
        } else if (event.key === "ArrowRight") {
            showImage(currentIndex + 1);
        }
    });
});
