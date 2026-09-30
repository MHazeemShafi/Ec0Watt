const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("show");
    revealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.15
});

revealElements.forEach((element) => {
  revealObserver.observe(element);
});


const barGroups = document.querySelectorAll(".bar-group");

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("revealed");
    barObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.3
});

barGroups.forEach((group) => {
  barObserver.observe(group);
});


function animateLine(id) {
  const path = document.getElementById(id);
  const length = path.getTotalLength();

  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  path.getBoundingClientRect();

  path.style.transition = "stroke-dashoffset 1.4s ease";
  path.style.strokeDashoffset = "0";
}

const chartPanel = document
  .getElementById("line-eco")
  .closest(".panel");

const chartObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    animateLine("line-eco");
    animateLine("line-conventional");

    chartObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.2
});

chartObserver.observe(chartPanel);


function scrollToSection(id) {
  const section = document.getElementById(id);

  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

document.querySelectorAll(".navlink").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".navlink").forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");
    scrollToSection(button.dataset.target);
  });
});

document.getElementById("explore-btn").addEventListener("click", () => {
  scrollToSection("dashboard");
});

document.getElementById("why-btn").addEventListener("click", () => {
  scrollToSection("sources");
});


const CIRCLE_LENGTH = 502;

const data = {
  conventional: {
    consumption: "16.8 kWh",
    consumptionSub: "Drawn from the grid",
    cost: "₹134.40",
    costSub: "At ₹8 / kWh",
    co2: "4.9 kg",
    saved: "0%",
    savedSub: "Baseline usage — no offset",
    bill: "Conventional costs about ₹134.40 every day",
    carbon: "CO₂ emitted per day: 4.9 kg (conventional)",
    mixTitle: "Conventional energy mix",
    centerValue: "100%",
    centerLabel: "FOSSIL FUEL",

    segments: [
      {
        pct: 62,
        color: "#b5502a",
        name: "Coal"
      },
      {
        pct: 28,
        color: "#d97b52",
        name: "Natural Gas"
      },
      {
        pct: 10,
        color: "#f0b795",
        name: "Oil"
      }
    ]
  },

  eco: {
    consumption: "4.7 kWh",
    consumptionSub: "Drawn from solar, wind & biomass",
    cost: "₹0.00",
    costSub: "Self-generated, zero grid cost",
    co2: "0.7 kg",
    saved: "72%",
    savedSub: "43.6 kWh vs conventional",
    bill: "Eco-friendly saves about ₹348.80 every day",
    carbon: "CO₂ emitted per day: 0.7 kg (eco-friendly)",
    mixTitle: "Eco-friendly energy mix",
    centerValue: "100%",
    centerLabel: "RENEWABLE",

    segments: [
      {
        pct: 54,
        color: "#0f6b45",
        name: "Solar"
      },
      {
        pct: 31,
        color: "#12864f",
        name: "Wind"
      },
      {
        pct: 15,
        color: "#a7e3c3",
        name: "Biomass"
      }
    ]
  }
};


const toggleRow = document.getElementById("toggle-row");
const houseSwitch = document.getElementById("house-switch");

let isEco = true;


function renderDonut(segments) {
  let offset = 0;

  segments.forEach((segment, index) => {
    const number = index + 1;

    const circle = document.getElementById(`seg${number}`);
    const title = document.getElementById(`seg${number}-title`);
    const percentage = document.getElementById(`leg${number}-pct`);
    const name = document.getElementById(`leg${number}-name`);

    const length = (segment.pct / 100) * CIRCLE_LENGTH;

    circle.style.stroke = segment.color;

    circle.setAttribute(
      "stroke-dasharray",
      `${length.toFixed(1)} ${CIRCLE_LENGTH}`
    );

    circle.setAttribute(
      "stroke-dashoffset",
      (-offset).toFixed(1)
    );

    title.textContent = `${segment.name} — ${segment.pct}%`;
    percentage.textContent = `${segment.pct}%`;
    name.textContent = segment.name;

    offset += length;
  });
}


function updateBars() {
  document.querySelectorAll(".bar").forEach((bar) => {
    const isActive =
      (bar.dataset.mode === "eco" && isEco) ||
      (bar.dataset.mode === "conventional" && !isEco);

    bar.classList.toggle("dim", !isActive);
    bar.classList.toggle("active-bar", isActive);
  });
}


function renderDashboard() {
  const current = isEco
    ? data.eco
    : data.conventional;

  document.getElementById("m-consumption").textContent =
    current.consumption;

  document.getElementById("m-consumption-sub").textContent =
    current.consumptionSub;

  document.getElementById("m-cost").textContent =
    current.cost;

  document.getElementById("m-cost-sub").textContent =
    current.costSub;

  document.getElementById("m-co2").textContent =
    current.co2;

  document.getElementById("m-saved").textContent =
    current.saved;

  document.getElementById("m-saved-sub").textContent =
    current.savedSub;

  document.getElementById("bill-line").textContent =
    current.bill;

  document.getElementById("carbon-line").textContent =
    current.carbon;

  document.getElementById("mix-title").textContent =
    current.mixTitle;

  document.getElementById("mix-center-value").textContent =
    current.centerValue;

  document.getElementById("mix-center-label").textContent =
    current.centerLabel;

  houseSwitch.classList.toggle("on", isEco);

  houseSwitch.setAttribute(
    "aria-pressed",
    String(isEco)
  );

  toggleRow.classList.toggle("state-eco", isEco);
  toggleRow.classList.toggle("state-conv", !isEco);


  const ecoLine = document.getElementById("line-eco");
  const conventionalLine = document.getElementById(
    "line-conventional"
  );

  const ecoArea = document.getElementById("area-eco");
  const conventionalArea = document.getElementById(
    "area-conventional"
  );


  ecoLine.style.opacity = isEco ? "1" : "0.12";
  ecoLine.style.strokeWidth = isEco ? "3" : "2";

  ecoArea.style.opacity = isEco ? "1" : "0";


  conventionalLine.style.opacity = isEco ? "0.12" : "1";
  conventionalLine.style.strokeWidth = isEco ? "2" : "3";

  conventionalArea.style.opacity = isEco ? "0" : "1";


  renderDonut(current.segments);
  updateBars();
}


houseSwitch.addEventListener("click", () => {
  isEco = !isEco;
  renderDashboard();
});


renderDashboard();


