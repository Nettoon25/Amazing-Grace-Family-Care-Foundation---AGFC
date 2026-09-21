/* =========================================================
   CHURCH WEBSITE - SHARED COMPONENTS
   ========================================================= */


/* =========================================================
   CHURCH INFORMATION
   ========================================================= */

const churchInfo = {

    name: "Amazing Grace Family Care Foundation",

    shortName: "AGFC",

    location: "Aviation Street, Mradi Embakasi, Nairobi, Kenya",

    phone: "+254 724 616 651",

    email: "amazinggracefamilycare@outlook.com",

    address: "Aviation Street, Mradi Embakasi, Nairobi, Kenya",

    serviceTimes: {

        sunday:
            "Sunday — Contact us for details",

        midweek:
            "Midweek — Contact us for details",

        youth:
            "Youth & Family Activities — Contact us for details"

    },

    facebook:
        "https://www.facebook.com/profile.php?id=100064535778925",

    youtube:
        "#",

    instagram:
        "https://www.instagram.com/Amazing%20Grace%20Family%20Care%20Foundation/"

};

/* =========================================================
   HEADER
   ========================================================= */

function renderHeader() {

    const header =
        document.getElementById("site-header");


    if (!header) {
        return;
    }


    header.innerHTML = `

        <header class="main-header">


            <!-- TOP BAR -->

            <div class="top-bar">

                <div class="container top-bar-inner">

                    <div class="top-info">

                        <span>
                            📍 ${churchInfo.location}
                        </span>

                        <span>
                            ⛪ Welcome to our church
                        </span>

                    </div>


                    <div class="top-contact">

                        <a href="tel:${churchInfo.phone}">
                            ${churchInfo.phone}
                        </a>

                    </div>

                </div>

            </div>



            <!-- NAVIGATION -->

            <nav class="navbar">

                <div class="container nav-inner">


                    <!-- LOGO -->

                    <a
                        href="index.html"
                        class="church-logo"
                    >

                        <div class="logo-symbol">
                            ✝
                        </div>


                        <div class="logo-text">

                            <strong>
                                ${churchInfo.shortName}
                            </strong>

                            <span>
                                Faith • Hope • Love
                            </span>

                        </div>

                    </a>



                    <!-- DESKTOP NAVIGATION -->

                    <div class="desktop-nav">

                        <a href="index.html">
                            Home
                        </a>

                        <a href="about.html">
                            About
                        </a>

                        <a href="ministries.html">
                            Ministries
                        </a>

                        <a href="sermons.html">
                            Sermons
                        </a>

                <a href="community-outreach.html">Community Outreach</a>

                        <a href="gallery.html">
                            Gallery
                        </a>

                        <a href="contact.html">
                            Contact
                        </a>

                    </div>



                    <!-- DESKTOP ACTIONS -->

                    <div class="nav-action">


                        <!-- THEME TOGGLE -->

                        <button
                            class="theme-toggle"
                            id="theme-toggle"
                            type="button"
                            aria-label="Switch to dark mode"
                            title="Toggle light/dark mode"
                        >

                            <span id="theme-icon">
                                ☾
                            </span>

                        </button>



                        <!-- GIVE -->

                        <a
                            href="give.html"
                            class="give-btn"
                        >
                            Give
                        </a>

                    </div>



                    <!-- MOBILE MENU BUTTON -->

                    <button
                        class="mobile-menu-btn"
                        id="mobile-menu-btn"
                        type="button"
                        aria-label="Open menu"
                        aria-expanded="false"
                    >

                        <span></span>
                        <span></span>
                        <span></span>

                    </button>

                </div>



                <!-- MOBILE MENU -->

                <div
                    class="mobile-menu"
                    id="mobile-menu"
                >

                    <a href="index.html">
                        Home
                    </a>

                    <a href="about.html">
                        About
                    </a>

                    <a href="ministries.html">
                        Ministries
                    </a>

                    <a href="sermons.html">
                        Sermons
                    </a>

                    <a href="events.html">
                        Events
                    </a>

                    <a href="gallery.html">
                        Gallery
                    </a>

                    <a href="contact.html">
                        Contact
                    </a>


                    <a
                        href="give.html"
                        class="mobile-give"
                    >
                        Give
                    </a>



                    <!-- MOBILE THEME -->

                    <div class="mobile-theme-row">

                        <span>
                            Appearance
                        </span>


                        <button
                            class="theme-toggle mobile-theme-toggle"
                            id="mobile-theme-toggle"
                            type="button"
                            aria-label="Switch to dark mode"
                            title="Toggle light/dark mode"
                        >

                            <span id="mobile-theme-icon">
                                ☾
                            </span>

                        </button>

                    </div>

                </div>

            </nav>

        </header>

    `;


    setupMobileMenu();

}



/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

    const button =
        document.getElementById(
            "mobile-menu-btn"
        );


    const menu =
        document.getElementById(
            "mobile-menu"
        );


    if (!button || !menu) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const isOpen =
                menu.classList.toggle(
                    "active"
                );


            button.classList.toggle(
                "active",
                isOpen
            );


            button.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    menu
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    menu.classList.remove(
                        "active"
                    );


                    button.classList.remove(
                        "active"
                    );


                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });

}



/* =========================================================
   LIGHT / DARK MODE
   ========================================================= */

function setupTheme() {

    const desktopToggle =
        document.getElementById(
            "theme-toggle"
        );


    const mobileToggle =
        document.getElementById(
            "mobile-theme-toggle"
        );


    const desktopIcon =
        document.getElementById(
            "theme-icon"
        );


    const mobileIcon =
        document.getElementById(
            "mobile-theme-icon"
        );


    function applyTheme(theme) {

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );


        localStorage.setItem(
            "churchTheme",
            theme
        );


        const icon =
            theme === "dark"
                ? "☀"
                : "☾";


        if (desktopIcon) {

            desktopIcon.textContent =
                icon;

        }


        if (mobileIcon) {

            mobileIcon.textContent =
                icon;

        }


        if (desktopToggle) {

            desktopToggle.setAttribute(
                "aria-label",
                theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );

        }


        if (mobileToggle) {

            mobileToggle.setAttribute(
                "aria-label",
                theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );

        }

    }



    /* LOAD SAVED THEME */

    const savedTheme =
        localStorage.getItem(
            "churchTheme"
        );


    if (
        savedTheme === "dark" ||
        savedTheme === "light"
    ) {

        applyTheme(savedTheme);

    } else {

        const prefersDark =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;


        applyTheme(
            prefersDark
                ? "dark"
                : "light"
        );

    }



    /* DESKTOP TOGGLE */

    if (desktopToggle) {

        desktopToggle.addEventListener(
            "click",
            () => {

                const currentTheme =
                    document.documentElement
                        .getAttribute(
                            "data-theme"
                        );


                applyTheme(
                    currentTheme === "dark"
                        ? "light"
                        : "dark"
                );

            }
        );

    }



    /* MOBILE TOGGLE */

    if (mobileToggle) {

        mobileToggle.addEventListener(
            "click",
            () => {

                const currentTheme =
                    document.documentElement
                        .getAttribute(
                            "data-theme"
                        );


                applyTheme(
                    currentTheme === "dark"
                        ? "light"
                        : "dark"
                );

            }
        );

    }

}



/* =========================================================
   FOOTER
   ========================================================= */

function renderFooter() {

    const footer =
        document.getElementById(
            "site-footer"
        );


    if (!footer) {
        return;
    }


    footer.innerHTML = `

        <footer class="site-footer">


            <div class="container footer-grid">


                <!-- ABOUT -->

                <div class="footer-column footer-about">

                    <div class="footer-logo">

                        <div class="footer-logo-symbol">
                            ✝
                        </div>


                        <div>

                            <strong>
                                ${churchInfo.shortName}
                            </strong>

                            <span>
                                Faith • Hope • Love
                            </span>

                        </div>

                    </div>


                    <p>

                        A place where people come
                        together to worship God,
                        grow in faith and serve
                        the community.

                    </p>


                    <div class="social-links">

                        <a
                            href="${churchInfo.facebook}"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            f
                        </a>


                        <a
                            href="${churchInfo.instagram}"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            ◎
                        </a>


                        <a
                            href="${churchInfo.youtube}"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                        >
                            ▶
                        </a>

                    </div>

                </div>



                <!-- QUICK LINKS -->

                <div class="footer-column">

                    <h3>
                        Quick Links
                    </h3>

                    <a href="index.html">
                        Home
                    </a>

                    <a href="about.html">
                        About Us
                    </a>

                    <a href="ministries.html">
                        Ministries
                    </a>

                    <a href="sermons.html">
                        Sermons
                    </a>

                    <a href="events.html">
                        Events
                    </a>

                    <a href="gallery.html">
                        Gallery
                    </a>

                    <a href="contact.html">
                        Contact
                    </a>

                </div>



                <!-- SERVICES -->

                <div class="footer-column">

                    <h3>
                        Service Times
                    </h3>


                    <div class="service-item">

                        <strong>
                            Sunday
                        </strong>

                        <span>
                            ${churchInfo.serviceTimes.sunday}
                        </span>

                    </div>


                    <div class="service-item">

                        <strong>
                            Midweek Service
                        </strong>

                        <span>
                            ${churchInfo.serviceTimes.midweek}
                        </span>

                    </div>


                    <div class="service-item">

                        <strong>
                            Youth Fellowship
                        </strong>

                        <span>
                            ${churchInfo.serviceTimes.youth}
                        </span>

                    </div>

                </div>



                <!-- CONTACT -->

                <div class="footer-column">

                    <h3>
                        Contact Us
                    </h3>


                    <p>
                        📍 ${churchInfo.address}
                    </p>


                    <p>

                        📞

                        <a
                            href="tel:${churchInfo.phone}"
                        >
                            ${churchInfo.phone}
                        </a>

                    </p>


                    <p>

                        ✉

                        <a
                            href="mailto:${churchInfo.email}"
                        >
                            ${churchInfo.email}
                        </a>

                    </p>

                </div>

            </div>



            <!-- FOOTER BOTTOM -->

            <div class="footer-bottom">

                <div class="container footer-bottom-inner">

                    <p>

                        © ${new Date().getFullYear()}

                        ${churchInfo.name}.

                        All Rights Reserved.

                    </p>


                    <p>
                        Built with faith & purpose.
                    </p>

                </div>

            </div>


        </footer>

    `;

}



/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderHeader();

        renderFooter();

        setupTheme();

    }
);