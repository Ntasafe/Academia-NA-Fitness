const bookingKey = "na-fitness-bookings";
const billingSwitch = document.querySelector("#billing-switch");
const priceLabels = document.querySelectorAll("[data-plan-price]");
const dayTabs = document.querySelectorAll("[data-day-tab]");
const classList = document.querySelector("#class-list");
const bookingDialog = document.querySelector("#booking-dialog");
const bookingForm = document.querySelector("#booking-form");
const toast = document.querySelector("#toast");
let selectedClass = null;
let toastTimer;

function getBookings() {
    try {
        return JSON.parse(localStorage.getItem(bookingKey) || "[]");
    } catch {
        return [];
    }
}

function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.hidden = true;
    }, 3200);
}

function renderBookings() {
    const bookings = getBookings();

    document.querySelectorAll("[data-book-class]").forEach((button) => {
        const booking = bookings.find((item) => item.id === button.dataset.bookClass);
        button.textContent = booking ? "Cancelar" : "Agendar";
        button.setAttribute("aria-pressed", String(Boolean(booking)));
        button.classList.toggle("is-booked", Boolean(booking));
    });

    const bookingCount = document.querySelector("#booking-count");
    bookingCount.textContent = String(bookings.length).padStart(2, "0");
}

function updatePrices() {
    const billingPeriod = billingSwitch.checked ? "annual" : "monthly";
    document.querySelector("#billing-label").textContent = billingSwitch.checked
        ? "Anual"
        : "Mensal";

    priceLabels.forEach((label) => {
        label.textContent = label.dataset[billingPeriod];
    });

    document.querySelectorAll("[data-billing-note]").forEach((note) => {
        note.textContent = note.dataset[billingPeriod];
    });
}

function renderSchedule(day) {
    const scheduleByDay = {
        1: [
            { id: "functional", time: "06:30", title: "Treino funcional", coach: "com prof. Marina", detail: "45 min · todos os níveis" },
            { id: "bike", time: "08:00", title: "Bike indoor", coach: "com prof. Caio", detail: "45 min · condicionamento" },
            { id: "pilates", time: "18:30", title: "Pilates solo", coach: "com prof. Luiza", detail: "50 min · mobilidade" },
            { id: "boxing", time: "19:30", title: "Boxe fitness", coach: "com prof. Rafael", detail: "50 min · todos os níveis" }
        ],
        2: [
            { id: "dance", time: "07:00", title: "Dança", coach: "com prof. Bia", detail: "45 min · todos os níveis" },
            { id: "bike", time: "12:15", title: "Bike indoor", coach: "com prof. Caio", detail: "45 min · condicionamento" },
            { id: "yoga", time: "18:30", title: "Yoga", coach: "com prof. Luiza", detail: "50 min · mobilidade" }
        ],
        3: [
            { id: "functional", time: "06:30", title: "Treino funcional", coach: "com prof. Marina", detail: "45 min · todos os níveis" },
            { id: "hiit", time: "18:00", title: "HIIT", coach: "com prof. Rafael", detail: "40 min · condicionamento" },
            { id: "pilates", time: "19:00", title: "Pilates solo", coach: "com prof. Luiza", detail: "50 min · mobilidade" }
        ],
        4: [
            { id: "bike", time: "07:00", title: "Bike indoor", coach: "com prof. Caio", detail: "45 min · condicionamento" },
            { id: "boxing", time: "18:00", title: "Boxe fitness", coach: "com prof. Rafael", detail: "50 min · todos os níveis" },
            { id: "dance", time: "19:15", title: "Dança", coach: "com prof. Bia", detail: "45 min · todos os níveis" }
        ],
        5: [
            { id: "yoga", time: "07:00", title: "Yoga", coach: "com prof. Luiza", detail: "50 min · mobilidade" },
            { id: "functional", time: "18:00", title: "Treino funcional", coach: "com prof. Marina", detail: "45 min · todos os níveis" },
            { id: "hiit", time: "19:00", title: "HIIT", coach: "com prof. Rafael", detail: "40 min · condicionamento" }
        ],
        6: [
            { id: "bike", time: "08:00", title: "Bike indoor", coach: "com prof. Caio", detail: "45 min · condicionamento" },
            { id: "pilates", time: "09:30", title: "Pilates solo", coach: "com prof. Luiza", detail: "50 min · mobilidade" }
        ],
        7: []
    };
    const sessions = scheduleByDay[day] || [];

    classList.replaceChildren();

    if (sessions.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "schedule-empty";
        emptyMessage.textContent = "Sem aulas coletivas neste dia. A unidade funciona de segunda a sábado.";
        classList.append(emptyMessage);
        return;
    }

    sessions.forEach((session) => {
        const row = document.createElement("article");
        row.className = "class-row";

        const time = document.createElement("time");
        time.className = "class-time";
        time.textContent = session.time;

        const details = document.createElement("div");
        details.className = "class-details";
        const title = document.createElement("h3");
        title.textContent = session.title;
        const coach = document.createElement("p");
        coach.textContent = `${session.coach} · ${session.detail}`;
        details.append(title, coach);

        const button = document.createElement("button");
        button.className = "book-button";
        button.type = "button";
        button.dataset.bookClass = `${day}-${session.id}`;
        button.dataset.classDay = day;
        button.dataset.classTitle = session.title;
        button.textContent = "Agendar";

        row.append(time, details, button);
        classList.append(row);
    });
}

function showDay(day) {
    dayTabs.forEach((tab) => {
        const isSelected = tab.dataset.dayTab === day;
        tab.setAttribute("aria-selected", String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;
    });
    renderSchedule(day);
    renderBookings();

    const monday = new Date();
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    monday.setDate(monday.getDate() + Number(day) - 1);
    document.querySelector("#selected-date").textContent = new Intl.DateTimeFormat(
        "pt-BR",
        { day: "2-digit", month: "long" }
    ).format(monday);
}

billingSwitch.addEventListener("change", updatePrices);

dayTabs.forEach((tab) => {
    tab.addEventListener("click", () => showDay(tab.dataset.dayTab));
});

classList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-book-class]");
    if (!button) return;

    const existingBooking = getBookings().find(
        (item) => item.id === button.dataset.bookClass
    );

    if (existingBooking) {
        if (window.confirm(`Cancelar ${existingBooking.title}?`)) {
            const bookings = getBookings().filter(
                (item) => item.id !== existingBooking.id
            );
            localStorage.setItem(bookingKey, JSON.stringify(bookings));
            renderBookings();
            showToast("Aula removida da sua agenda neste aparelho.");
        }
        return;
    }

    selectedClass = {
        id: button.dataset.bookClass,
        title: button.dataset.classTitle,
        day: button.dataset.classDay
    };
    document.querySelector("#booking-title").textContent = selectedClass.title;
    bookingDialog.showModal();
});

bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!selectedClass) return;

    const bookings = getBookings();
    bookings.push(selectedClass);
    localStorage.setItem(bookingKey, JSON.stringify(bookings));
    bookingForm.reset();
    bookingDialog.close();
    renderBookings();
    showToast("Agendamento demonstrativo salvo neste aparelho.");
});

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => bookingDialog.close());
});

document.querySelector("#contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    showToast("Demonstração: conecte este formulário ao atendimento da unidade.");
});

const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#primary-navigation");
menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    navigation.classList.toggle("is-open", !isExpanded);
});

navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
        menuToggle.setAttribute("aria-expanded", "false");
        navigation.classList.remove("is-open");
    }
});

document.querySelector("#schedule-list").addEventListener("keydown", (event) => {
    const tab = event.target.closest("[data-day-tab]");
    if (!tab || !["ArrowRight", "ArrowLeft"].includes(event.key)) return;

    event.preventDefault();
    const currentIndex = [...dayTabs].indexOf(tab);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + dayTabs.length) % dayTabs.length;
    dayTabs[nextIndex].focus();
    showDay(dayTabs[nextIndex].dataset.dayTab);
});

updatePrices();
showDay("1");