
const USERS = [
  { id: 1, name: "Club Admin", email: "admin@club.demo", password: "Admin123", role: "admin" },
  { id: 2, name: "Student User", email: "student@club.demo", password: "Student123", role: "student" },
  { id: 3, name: "Club Member", email: "member@club.demo", password: "Member123", role: "member" }
];

const CLUBS = [
  { id: 1, name: "Coding & Tech Club", category: "Technology", icon: "💻", description: "Learn coding and build websites." },
  { id: 2, name: "Music Society", category: "Arts", icon: "🎵", description: "Enjoy music and performances." },
  { id: 3, name: "Dance Collective", category: "Arts", icon: "💃", description: "Learn dance and perform." },
  { id: 4, name: "Photography Club", category: "Creative", icon: "📷", description: "Capture campus memories." },
  { id: 5, name: "Entrepreneurship Cell", category: "Business", icon: "🚀", description: "Explore startup ideas." },
  { id: 6, name: "Sports & Fitness Club", category: "Sports", icon: "⚽", description: "Play sports and stay fit." }
];

const FACILITIES = [
  { id: 1, name: "Tennis Court", type: "Sports", capacity: 4, hours: "06:00–21:00" },
  { id: 2, name: "Multi-purpose Hall", type: "Hall", capacity: 60, hours: "09:00–22:00" },
  { id: 3, name: "Fitness Studio", type: "Training", capacity: 20, hours: "07:00–20:00" }
];

const EVENTS = [
  { id: 1, title: "Coding Workshop", date: "2026-12-05", time: "15:00", location: "Computer Lab", description: "Beginner coding workshop." },
  { id: 2, title: "Campus Music Night", date: "2026-12-10", time: "18:00", location: "Main Hall", description: "Live music performances." },
  { id: 3, title: "Football Match", date: "2026-12-14", time: "16:00", location: "Sports Ground", description: "Friendly campus football match." }
];

let data = JSON.parse(localStorage.getItem("clubconnect_simple")) || {
  memberships: [],
  bookings: [],
  registrations: []
};

let user = null;
let activePage = "dashboard";

const $ = id => document.getElementById(id);

function save() {
  localStorage.setItem("clubconnect_simple", JSON.stringify(data));
}

function toast(message) {
  $("toast").textContent = message;
  $("toast").style.display = "block";

  setTimeout(() => {
    $("toast").style.display = "none";
  }, 2500);
}

// LOGIN

function demoLogin(role) {
  const account = USERS.find(u => u.role === role);
  login(account);
}

function login(account) {
  user = account;

  $("loginScreen").classList.add("hidden");
  $("app").classList.remove("hidden");

  $("welcome").textContent = "Welcome, " + account.name;

  showPage("dashboard");
}

$("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const account = USERS.find(u =>
    u.email === $("email").value &&
    u.password === $("password").value
  );

  if (!account) {
    toast("Incorrect email or password!");
    return;
  }

  login(account);
});

function logout() {
  user = null;
  $("app").classList.add("hidden");
  $("loginScreen").classList.remove("hidden");
}

// NAVIGATION

function buildNav() {
  let items = user.role === "admin"
    ? ["dashboard", "clubs", "members", "facilities", "bookings", "events", "reports"]
    : ["dashboard", "clubs", "myclubs", "facilities", "bookings", "events", "notifications"];

  const names = {
    dashboard: "Dashboard",
    clubs: "Explore Clubs",
    members: "Members",
    myclubs: "My Memberships",
    facilities: "Facilities",
    bookings: "Bookings",
    events: "Events",
    reports: "Reports",
    notifications: "Notifications"
  };

  $("navigation").innerHTML = items.map(i =>
    `<button class="nav-btn ${i === activePage ? "active" : ""}"
    onclick="showPage('${i}')">${names[i]}</button>`
  ).join("");
}

function showPage(page) {
  activePage = page;
  buildNav();

  const pages = {
    dashboard,
    clubs,
    members,
    myclubs,
    facilities,
    bookings,
    events,
    reports,
    notifications
  };

  $("page").innerHTML = (pages[page] || dashboard)();
}

// DASHBOARD

function dashboard() {
  const myMemberships = data.memberships.filter(m =>
    m.userId === user.id && m.status === "Approved"
  );

  const myBookings = data.bookings.filter(b => b.userId === user.id);
  const myEvents = data.registrations.filter(r => r.userId === user.id);

  return `
    <div class="page-head">
      <h1>Dashboard</h1>
      <p>Quick overview of your campus activity.</p>
    </div>

    <div class="stats">
      ${stat("Clubs", CLUBS.length)}
      ${stat("My Memberships", myMemberships.length)}
      ${stat("Bookings", myBookings.length)}
      ${stat("Events", myEvents.length)}
    </div>

    <div class="cards">
      <div class="card">
        <h3>Explore Clubs</h3>
        <p>Find clubs and request membership.</p>
        <button onclick="showPage('clubs')">Explore Clubs</button>
      </div>

      <div class="card">
        <h3>Facilities</h3>
        <p>Book campus facilities.</p>
        <button onclick="showPage('facilities')">View Facilities</button>
      </div>

      <div class="card">
        <h3>Campus Events</h3>
        <p>Discover and register for events.</p>
        <button onclick="showPage('events')">View Events</button>
      </div>
    </div>
  `;
}

function stat(label, value) {
  return `
    <div class="card stat">
      <h3>${label}</h3>
      <h2>${value}</h2>
    </div>
  `;
}

// CLUBS

function clubs() {
  return `
    <div class="page-head">
      <h1>Explore Clubs</h1>
      <p>Find a club that matches your interest.</p>
    </div>

    <div class="cards">
      ${CLUBS.map(c => clubCard(c)).join("")}
    </div>
  `;
}

function clubCard(club) {
  const membership = data.memberships.find(m =>
    m.userId === user.id && m.clubId === club.id
  );

  let button = membership
    ? `<span class="tag yellow">${membership.status}</span>`
    : `<button onclick="joinClub(${club.id})">Request to Join</button>`;

  return `
    <div class="card">
      <h3>${club.icon} ${club.name}</h3>
      <span class="tag">${club.category}</span>
      <p>${club.description}</p>
      ${button}
    </div>
  `;
}

function joinClub(id) {
  const alreadyJoined = data.memberships.some(m =>
    m.userId === user.id && m.clubId === id
  );

  if (alreadyJoined) {
    toast("You already requested to join this club.");
    return;
  }

  data.memberships.push({
    id: Date.now(),
    userId: user.id,
    clubId: id,
    status: "Pending"
  });

  save();
  toast("Membership request submitted!");
  showPage("clubs");
}

// MY MEMBERSHIPS

function myclubs() {
  const list = data.memberships.filter(m => m.userId === user.id);

  if (list.length === 0) {
    return `<div class="card empty">You haven't joined any clubs yet.</div>`;
  }

  return `
    <h1>My Memberships</h1>
    <div class="cards">
      ${list.map(m => {
        const c = CLUBS.find(x => x.id === m.clubId);

        return `
          <div class="card">
            <h3>${c.icon} ${c.name}</h3>
            <p>${c.description}</p>
            ${pill(m.status)}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function pill(status) {
  let color = status === "Approved" ? "green"
            : status === "Rejected" ? "red" : "yellow";

  return `<span class="tag ${color}">${status}</span>`;
}

// ADMIN MEMBERS

function members() {
  return `
    <h1>Members & Requests</h1>
    <div class="table-wrap">
      <table>
        <tr>
          <th>Member</th>
          <th>Club</th>
          <th>Status</th>
          <th>Action</th>
        </tr>

        ${data.memberships.map(m => {
          const club = CLUBS.find(c => c.id === m.clubId);
          const member = USERS.find(u => u.id === m.userId);

          return `
            <tr>
              <td>${member ? member.name : "Student"}</td>
              <td>${club ? club.name : "Club"}</td>
              <td>${pill(m.status)}</td>
              <td>
                ${m.status === "Pending" ? `
                  <button onclick="setMembership(${m.id},'Approved')">Approve</button>
                  <button onclick="setMembership(${m.id},'Rejected')">Reject</button>
                ` : ""}
              </td>
            </tr>
          `;
        }).join("")}
      </table>
    </div>
  `;
}

function setMembership(id, status) {
  const m = data.memberships.find(x => x.id === id);

  if (m) {
    m.status = status;
    save();
    toast("Membership " + status);
    showPage("members");
  }
}

// FACILITIES

function facilities() {
  return `
    <h1>Facilities</h1>
    <p>Available campus facilities.</p>

    <div class="cards">
      ${FACILITIES.map(f => `
        <div class="card">
          <h3>🏟️ ${f.name}</h3>
          <span class="tag green">Available</span>
          <p>
            Type: ${f.type}<br>
            Capacity: ${f.capacity}<br>
            Hours: ${f.hours}
          </p>
          <button onclick="bookFacility(${f.id})">Book Facility</button>
        </div>
      `).join("")}
    </div>
  `;
}

function bookFacility(id) {
  const date = prompt("Enter booking date (YYYY-MM-DD):");
  if (!date) return;

  const time = prompt("Enter time (e.g. 10:00):");
  if (!time) return;

  data.bookings.push({
    id: Date.now(),
    userId: user.id,
    facilityId: id,
    date: date,
    time: time,
    status: "Pending"
  });

  save();
  toast("Booking request submitted!");
  showPage("bookings");
}

// BOOKINGS

function bookings() {
  const list = data.bookings.filter(b =>
    user.role === "admin" || b.userId === user.id
  );

  return `
    <h1>Bookings</h1>

    <div class="table-wrap">
      <table>
        <tr>
          <th>Member</th>
          <th>Facility</th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
          <th>Action</th>
        </tr>

        ${list.map(b => {
          const member = USERS.find(u => u.id === b.userId);
          const facility = FACILITIES.find(f => f.id === b.facilityId);

          return `
            <tr>
              <td>${member ? member.name : "Student"}</td>
              <td>${facility ? facility.name : "Facility"}</td>
              <td>${b.date}</td>
              <td>${b.time}</td>
              <td>${pill(b.status)}</td>
              <td>
                ${user.role === "admin" && b.status === "Pending" ? `
                  <button onclick="setBooking(${b.id},'Approved')">Approve</button>
                  <button onclick="setBooking(${b.id},'Rejected')">Reject</button>
                ` : ""}
              </td>
            </tr>
          `;
        }).join("")}
      </table>
    </div>
  `;
}

function setBooking(id, status) {
  const b = data.bookings.find(x => x.id === id);

  if (b) {
    b.status = status;
    save();
    toast("Booking " + status);
    showPage("bookings");
  }
}

// EVENTS

function events() {
  return `
    <h1>Campus Events</h1>

    <div class="cards">
      ${EVENTS.map(e => {
        const registered = data.registrations.some(r =>
          r.userId === user.id && r.eventId === e.id
        );

        return `
          <div class="card">
            <h3>🎉 ${e.title}</h3>
            <p>${e.description}</p>
            <p>
              📅 ${e.date} | ${e.time}<br>
              📍 ${e.location}
            </p>

            ${registered
              ? `<span class="tag green">Registered</span>`
              : `<button onclick="registerEvent(${e.id})">Register</button>`
            }
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function registerEvent(id) {
  const alreadyRegistered = data.registrations.some(r =>
    r.userId === user.id && r.eventId === id
  );

  if (alreadyRegistered) {
    toast("You are already registered!");
    return;
  }

  data.registrations.push({
    id: Date.now(),
    userId: user.id,
    eventId: id
  });

  save();
  toast("Registration successful!");
  showPage("events");
}

// REPORTS

function reports() {
  return `
    <h1>Reports</h1>

    <div class="stats">
      ${stat("Membership Requests", data.memberships.length)}
      ${stat("Approved", data.memberships.filter(m => m.status === "Approved").length)}
      ${stat("Bookings", data.bookings.length)}
      ${stat("Event Registrations", data.registrations.length)}
    </div>
  `;
}

// NOTIFICATIONS

function notifications() {
  return `
    <h1>Notifications</h1>
    <div class="card">
      <p>Your membership and booking status can be checked from their respective pages.</p>
    </div>
  `;
}
// CHECK JAVASCRIPT CONNECTION
console.log("ClubConnect JavaScript is connected successfully!");
