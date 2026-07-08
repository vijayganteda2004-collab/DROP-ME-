const drivers = [
  {
    name: "Ravi Kumar",
    type: "Auto",
    vehicle: "AP 05 AB 2241",
    rating: "4.9",
    distance: "1.2 km away",
    commission: "8%",
    phone: "+91 90000 11223"
  },
  {
    name: "Lakshmi Devi",
    type: "Bike",
    vehicle: "AP 05 CD 7721",
    rating: "4.8",
    distance: "800 m away",
    commission: "8%",
    phone: "+91 90000 44556"
  },
  {
    name: "Shaik Basha",
    type: "Car",
    vehicle: "AP 05 EF 9182",
    rating: "4.7",
    distance: "2.4 km away",
    commission: "8%",
    phone: "+91 90000 77889"
  }
];

let selectedDriver = drivers[0];
let activeRide = null;

const driverList = document.querySelector("#driverList");
const bookingForm = document.querySelector("#bookingForm");
const summaryTitle = document.querySelector("#summaryTitle");
const summaryText = document.querySelector("#summaryText");
const alertFeed = document.querySelector("#alertFeed");
const shareGuardian = document.querySelector("#shareGuardian");
const sosButton = document.querySelector("#sosButton");
const previewRoute = document.querySelector("#previewRoute");
const previewDriver = document.querySelector("#previewDriver");
const previewVehicle = document.querySelector("#previewVehicle");

function renderDrivers() {
  driverList.innerHTML = drivers
    .map((driver, index) => {
      const selected = selectedDriver.name === driver.name ? "Selected" : "Choose";

      return `
        <article class="driver-card">
          <div class="avatar">${driver.name.charAt(0)}</div>
          <div>
            <strong>${driver.name}</strong>
            <div class="driver-meta">
              <span>${driver.type}</span>
              <span>${driver.vehicle}</span>
              <span>${driver.rating} rating</span>
              <span>${driver.distance}</span>
              <span>${driver.commission} commission</span>
            </div>
          </div>
          <button class="button secondary" type="button" data-driver-index="${index}">
            ${selected}
          </button>
        </article>
      `;
    })
    .join("");
}

function addAlert(title, message, isDanger = false) {
  const emptyState = alertFeed.querySelector(".muted");
  if (emptyState) {
    emptyState.remove();
  }

  const alert = document.createElement("article");
  alert.className = `alert-card${isDanger ? " danger-alert" : ""}`;
  alert.innerHTML = `
    <strong>${title}</strong>
    <span>${message}</span>
  `;
  alertFeed.prepend(alert);
}

function updatePreview(ride) {
  previewRoute.textContent = `${ride.pickup} to ${ride.drop}`;
  previewDriver.textContent = selectedDriver.name;
  previewVehicle.textContent = `${selectedDriver.type} - ${selectedDriver.vehicle}`;
}

driverList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-driver-index]");
  if (!button) {
    return;
  }

  selectedDriver = drivers[Number(button.dataset.driverIndex)];
  renderDrivers();

  if (activeRide) {
    activeRide.driver = selectedDriver;
    updatePreview(activeRide);
    summaryText.textContent = `${selectedDriver.name} will pick up ${activeRide.passengerName} from ${activeRide.pickup}. Guardian sharing is ready.`;
  }
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(bookingForm);
  activeRide = {
    passengerName: data.get("passengerName"),
    pickup: data.get("pickup"),
    drop: data.get("drop"),
    guardianPhone: data.get("guardianPhone"),
    rideType: data.get("rideType"),
    driver: selectedDriver,
    policeStation: "Nearest Rural Police Station"
  };

  summaryTitle.textContent = "Ride booked successfully";
  summaryText.textContent = `${selectedDriver.name} is assigned for ${activeRide.passengerName}. Route: ${activeRide.pickup} to ${activeRide.drop}.`;
  shareGuardian.disabled = false;
  sosButton.disabled = false;
  updatePreview(activeRide);

  addAlert(
    "Ride created",
    `${activeRide.passengerName}'s ${activeRide.rideType} ride was booked with ${selectedDriver.name}.`
  );
});

shareGuardian.addEventListener("click", () => {
  if (!activeRide) {
    return;
  }

  addAlert(
    "Guardian update sent",
    `Shared route, driver ${selectedDriver.name}, vehicle ${selectedDriver.vehicle}, and live ride status with ${activeRide.guardianPhone}.`
  );
});

sosButton.addEventListener("click", () => {
  if (!activeRide) {
    return;
  }

  addAlert(
    "SOS alert sent",
    `Emergency details shared with ${activeRide.guardianPhone} and ${activeRide.policeStation}: ${activeRide.pickup} to ${activeRide.drop}, driver ${selectedDriver.name}, vehicle ${selectedDriver.vehicle}.`,
    true
  );
});

renderDrivers();
