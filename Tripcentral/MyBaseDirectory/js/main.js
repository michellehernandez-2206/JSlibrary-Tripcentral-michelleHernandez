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

    // actualiza números visibles y texto del input.
    function renderOccupancy() {
        countEls.adults.textContent = occupancyState.adults;
        countEls.children.textContent = occupancyState.children;
        countEls.rooms.textContent = occupancyState.rooms;
        occupancyInput.value = formatOccupancyLabel();
    }

    // abre o cierra el panel del occupancy picker.
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

    // Cambio agregado: estado inicial del preferences picker con máximo de 3 selecciones.
    const preferencesTrigger = document.getElementById("preferences-trigger");
    const preferencesPanel = document.getElementById("preferences-panel");
    const preferencesInput = document.getElementById("preferences-input");
    const preferenceOptions = document.querySelectorAll(".preference-option");
    const selectedPreferences = new Set();

    function renderPreferences() {
        if (!preferencesInput) {
            return;
        }

        preferencesInput.value = selectedPreferences.size
            ? Array.from(selectedPreferences).join(", ")
            : "Select up to 3";
    }

    // Cambio agregado: abre o cierra el panel de preferences.
    function setPreferencesOpen(isOpen) {
        if (!preferencesPanel || !preferencesTrigger) {
            return;
        }

        preferencesPanel.hidden = !isOpen;
        preferencesTrigger.setAttribute("aria-expanded", String(isOpen));
    }

    if (preferencesTrigger && preferencesPanel && preferencesInput && preferenceOptions.length) {
        renderPreferences();

        preferencesTrigger.addEventListener("click", function () {
            setPreferencesOpen(preferencesPanel.hidden);
        });

        preferencesTrigger.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setPreferencesOpen(preferencesPanel.hidden);
            }
        });

        preferencesPanel.addEventListener("click", function (event) {
            const option = event.target.closest(".preference-option");

            if (!option) {
                return;
            }

            const value = option.dataset.value;

            if (selectedPreferences.has(value)) {
                selectedPreferences.delete(value);
                option.classList.remove("is-selected");
            } else if (selectedPreferences.size < 3) {
                selectedPreferences.add(value);
                option.classList.add("is-selected");
            }

            renderPreferences();
        });

        document.addEventListener("click", function (event) {
            const clickedInside =
                preferencesTrigger.contains(event.target) || preferencesPanel.contains(event.target);

            if (!clickedInside) {
                setPreferencesOpen(false);
            }
        });
    }

});
