document.addEventListener("DOMContentLoaded", function () {
    // date selector library
    if (typeof flatpickr === "function") {
        flatpickr("#date-input", {
            dateFormat: "F j, Y",
            allowInput: true,
            disableMobile: true
        });
    }


    // gradient library
    if (typeof Granim === "function") {
        var granimInstance = new Granim({
            element: '#canvas-basic',
            direction: 'diagonal',
            isPausedWhenNotInView: true,
            states: {
                "default-state": {
                    gradients: [
                        ['#3E7379', '#D82332'],
                        ['#3E7379', '#3E7379'],
                        ['#96dde5', '#3E7379'],
                        ['#D82332', '#96dde5'],
                        ['#3E7379', '#3E7379']
                    ]
                }
            }
        });
    }

    // Anime.js scroll trigger for Lowest Prices title and paragraph.
    const animatedTitle = document.querySelector("[data-animate-chars]");
    const animatedCopy = document.querySelector("[data-animate-copy]");
    const firstDestinationCards = document.querySelector(".sun-destination .element-cards");
    // Tweak these values to control when the animation starts and how fast it feels.
    const lowestPricesScrollOffset = 60;
    const lowestPricesCharDuration = 900;
    const lowestPricesCharStagger = 45;
    const lowestPricesCopyDuration = 700;

    function splitTextToChars(element) {
        const text = element.textContent;
        element.setAttribute("aria-label", text);
        element.textContent = "";

        Array.from(text).forEach(function (char) {
            const span = document.createElement("span");
            span.className = "char";
            span.setAttribute("aria-hidden", "true");
            span.textContent = char === " " ? "\u00A0" : char;
            element.appendChild(span);
        });
    }

    if (animatedTitle && animatedCopy && firstDestinationCards && typeof anime === "function") {
        splitTextToChars(animatedTitle);

        const titleChars = animatedTitle.querySelectorAll(".char");
        let hasPlayedTitleAnimation = false;

        const playTitleAnimation = function () {
            if (hasPlayedTitleAnimation) {
                return;
            }

            hasPlayedTitleAnimation = true;

            const titleTimeline = anime.timeline({
                easing: "easeOutExpo"
            });

            titleTimeline
                .add({
                    targets: titleChars,
                    translateY: [24, 0],
                    opacity: [0, 1],
                    duration: lowestPricesCharDuration,
                    delay: anime.stagger(lowestPricesCharStagger)
                })
                .add({
                    targets: animatedCopy,
                    translateY: [24, 0],
                    opacity: [0, 1],
                    duration: lowestPricesCopyDuration
                }, "-=420");
        };

        const checkTitleScrollTrigger = function () {
            if (hasPlayedTitleAnimation) {
                return;
            }

            const cardsTop = firstDestinationCards.getBoundingClientRect().top + window.scrollY;
            const triggerPoint = cardsTop - window.innerHeight + lowestPricesScrollOffset;

            if (window.scrollY >= triggerPoint) {
                playTitleAnimation();
                window.removeEventListener("scroll", checkTitleScrollTrigger);
                window.removeEventListener("resize", checkTitleScrollTrigger);
            }
        };

        window.addEventListener("scroll", checkTitleScrollTrigger, { passive: true });
        window.addEventListener("resize", checkTitleScrollTrigger);
        checkTitleScrollTrigger();
    }

    // occupancy picker
    const occupancyState = {
        adults: 0,
        children: 0,
        rooms: 1
    };

    const occupancyTrigger = document.getElementById("occupancy-trigger");
    const occupancyPanel = document.getElementById("occupancy-panel");
    const occupancyInput = document.getElementById("occupancy-input");
    const countEls = {
        adults: document.getElementById("adults-count"),
        children: document.getElementById("children-count"),
        rooms: document.getElementById("rooms-count")
    };

    function formatOccupancyLabel() {
        const roomLabel = occupancyState.rooms === 1 ? "Room" : "Rooms";
        return `${occupancyState.adults} Adults, ${occupancyState.children} Children, ${occupancyState.rooms} ${roomLabel}`;
    }

    // update visible numbers and input text
    function renderOccupancy() {
        countEls.adults.textContent = occupancyState.adults;
        countEls.children.textContent = occupancyState.children;
        countEls.rooms.textContent = occupancyState.rooms;
        occupancyInput.value = formatOccupancyLabel();
    }

    // open or close occupancy picker panel
    function setOccupancyOpen(isOpen) {
        occupancyPanel.hidden = !isOpen;
        occupancyTrigger.setAttribute("aria-expanded", String(isOpen));
    }

    if (occupancyTrigger && occupancyPanel && occupancyInput) {
        renderOccupancy();

        occupancyTrigger.addEventListener("click", function () {
            setOccupancyOpen(occupancyPanel.hidden);
        });

        occupancyTrigger.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setOccupancyOpen(occupancyPanel.hidden);
            }
        });

        occupancyPanel.addEventListener("click", function (event) {
            const button = event.target.closest(".occupancy-btn");

            if (!button) {
                return;
            }

            const target = button.dataset.target;
            const action = button.dataset.action;

            if (action === "increase") {
                occupancyState[target] += 1;
            }

            if (action === "decrease") {
                const minimum = target === "rooms" ? 1 : 0;
                occupancyState[target] = Math.max(minimum, occupancyState[target] - 1);
            }

            renderOccupancy();
        });

        document.addEventListener("click", function (event) {
            const clickedInside =
                occupancyTrigger.contains(event.target) || occupancyPanel.contains(event.target);

            if (!clickedInside) {
                setOccupancyOpen(false);
            }
        });
    }

});
