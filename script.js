```javascript
document.addEventListener("DOMContentLoaded", () => {


  /* =====================================================
     HEADER SCROLL EFFECT
  ====================================================== */

  const header =
    document.querySelector(".main-header");


  function handleHeaderScroll() {

    if (!header) {
      return;
    }


    if (window.scrollY > 30) {

      header.classList.add(
        "header-scrolled"
      );

    } else {

      header.classList.remove(
        "header-scrolled"
      );

    }

  }


  window.addEventListener(
    "scroll",
    handleHeaderScroll,
    { passive: true }
  );


  handleHeaderScroll();



  /* =====================================================
     SMOOTH SCROLL
  ====================================================== */

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {

          const targetId =
            link.getAttribute("href");


          if (
            !targetId ||
            targetId === "#"
          ) {

            return;

          }


          const target =
            document.querySelector(
              targetId
            );


          if (!target) {

            return;

          }


          event.preventDefault();


          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    });



  /* =====================================================
     REVEAL ANIMATIONS
  ====================================================== */

  const revealElements =
    document.querySelectorAll(
      ".welcome-content, " +
      ".welcome-images, " +
      ".community-card, " +
      ".sermon-content, " +
      ".sermon-video, " +
      ".event-row, " +
      ".gallery-item"
    );


  revealElements.forEach(
    element => {

      element.classList.add(
        "reveal-element"
      );

    }
  );


  if (
    "IntersectionObserver"
    in window
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "revealed"
                );

                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach(
      element => {

        observer.observe(element);

      }
    );

  } else {

    revealElements.forEach(
      element => {

        element.classList.add(
          "revealed"
        );

      }
    );

  }



  /* =====================================================
     SERMON BUTTON
  ====================================================== */

  const sermonButton =
    document.getElementById(
      "playSermon"
    );


  if (sermonButton) {

    sermonButton.addEventListener(
      "click",
      () => {

        const videoFrame =
          sermonButton.closest(
            ".video-frame"
          );


        if (!videoFrame) {
          return;
        }


        sermonButton.classList.add(
          "playing"
        );


        /*
          Temporary behavior.

          Later we can replace this with:

          - YouTube video
          - Vimeo
          - local MP4
          - church livestream
          - sermon player
        */


        const existingMessage =
          videoFrame.querySelector(
            ".temporary-player-message"
          );


        if (
          existingMessage
        ) {

          return;

        }


        const message =
          document.createElement(
            "div"
          );


        message.className =
          "temporary-player-message";


        message.innerHTML = `
          <strong>
            Sermon player
          </strong>

          <span>
            Connect your YouTube,
            Vimeo or video source here.
          </span>
        `;


        videoFrame.appendChild(
          message
        );

      }
    );

  }



  /* =====================================================
     CURRENT YEAR
  ====================================================== */

  const currentYear =
    new Date().getFullYear();


  document
    .querySelectorAll(
      ".footer-bottom-inner"
    )
    .forEach(footer => {

      footer.innerHTML =
        footer.innerHTML.replace(
          "2026",
          currentYear
        );

    });



  /* =====================================================
     ESCAPE KEY
  ====================================================== */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        const navigation =
          document.getElementById(
            "mainNavigation"
          );

        const menuButton =
          document.getElementById(
            "mobileMenuButton"
          );


        if (navigation) {

          navigation.classList.remove(
            "mobile-open"
          );

        }


        if (menuButton) {

          menuButton.classList.remove(
            "open"
          );

          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );

        }

      }

    }
  );


});
```
