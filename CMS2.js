const DEFAULT_USERS = [
  {
    id: 1,
    name: "Club Admin",
    email: "admin@club.demo",
    password: "Admin123",
    role: "admin"
  },
  {
    id: 2,
    name: "Student User",
    email: "student@club.demo",
    password: "Student123",
    role: "student"
  },
  {
    id: 3,
    name: "Club Member",
    email: "member@club.demo",
    password: "Member123",
    role: "member"
  }
];

// Keep demo accounts and load accounts created in this browser.
let USERS = loadUsers();

function loadUsers() {
  try {
    const savedUsers = JSON.parse(
      localStorage.getItem("clubconnect_users")
    );

    if (!Array.isArray(savedUsers)) {
      return [...DEFAULT_USERS];
    }

    const newUsers = savedUsers.filter(savedUser =>
      !DEFAULT_USERS.some(
        demoUser =>
          demoUser.email.toLowerCase() ===
          String(savedUser.email).toLowerCase()
      )
    );

    return [...DEFAULT_USERS, ...newUsers];
  } catch (error) {
    console.log("Could not load saved users.", error);
    return [...DEFAULT_USERS];
  }
}

function saveUsers() {
  const customUsers = USERS.filter(
    account => !DEFAULT_USERS.some(demoUser => demoUser.id === account.id)
  );

  localStorage.setItem(
    "clubconnect_users",
    JSON.stringify(customUsers)
  );
}

const CLUBS = [
  {
    id: 1,
    name: "Coding & Tech Club",
    category: "Technology",
    icon: "💻",
    description: "Learn coding and build websites."
  },
  {
    id: 2,
    name: "Music Society",
    category: "Arts",
    icon: "🎵",
    description: "Enjoy music and performances."
  },
  {
    id: 3,
    name: "Dance Collective",
    category: "Arts",
    icon: "💃",
    description: "Learn dance and perform."
  },
  {
    id: 4,
    name: "Photography Club",
    category: "Creative",
    icon: "📷",
    description: "Capture campus memories."
  },
  {
    id: 5,
    name: "Entrepreneurship Cell",
    category: "Business",
    icon: "🚀",
    description: "Explore startup ideas."
  },
  {
    id: 6,
    name: "Sports & Fitness Club",
    category: "Sports",
    icon: "⚽",
    description: "Play sports and stay fit."
  }
];

const FACILITIES = [
  {
    id: 1,
    name: "Tennis Court",
    type: "Sports",
    capacity: 4,
    hours: "06:00–21:00"
  },
  {
    id: 2,
    name: "Multi-purpose Hall",
    type: "Hall",
    capacity: 60,
    hours: "09:00–22:00"
  },
  {
    id: 3,
    name: "Fitness Studio",
    type: "Training",
    capacity: 20,
    hours: "07:00–20:00"
  }
];

const EVENTS = [
  {
    id: 1,
    title: "Coding Workshop",
    date: "2026-12-05",
    time: "15:00",
    location: "Computer Lab",
    description: "Beginner coding workshop."
  },
  {
    id: 2,
    title: "Campus Music Night",
    date: "2026-12-10",
    time: "18:00",
    location: "Main Hall",
    description: "Live music performances."
  },
  {
    id: 3,
    title: "Football Match",
    date: "2026-12-14",
    time: "16:00",
    location: "Sports Ground",
    description: "Friendly campus football match."
  }
];

let data;

try {
  data = JSON.parse(localStorage.getItem("clubconnect_simple")) || {
    memberships: [],
    bookings: [],
    registrations: []
  };
} catch (error) {
  data = {
    memberships: [],
    bookings: [],
    registrations: []
  };
}

let user = null;
let activePage = "dashboard";

const $ = id => document.getElementById(id);

function save() {
  localStorage.setItem("clubconnect_simple", JSON.stringify(data));
}

function toast(message) {
  const toastBox = $("toast");
  toastBox.textContent = message;
  toastBox.style.display = "block";

  setTimeout(() => {
    toastBox.style.display = "none";
  }, 2500);
}

/* Login and demo accounts */

function demoLogin(role) {
  const account = USERS.find(savedUser => savedUser.role === role);

  if (account) {
    login(account);
  }
}

function login(account) {
  user = account;

  $("loginScreen").classList.add("hidden");
  $("app").classList.remove("hidden");
  $("welcome").textContent = "Welcome, " + account.name;

  showPage("dashboard");
}

function toggleAuthMode() {
  const showingSignup = $("signupForm").classList.contains("hidden");

  $("loginForm").classList.toggle("hidden", showingSignup);
  $("signupForm").classList.toggle("hidden", !showingSignup);
  $("demoAccounts").classList.toggle("hidden", showingSignup);

  $("loginHeading").textContent = showingSignup
    ? "Create your account"
    : "Welcome Back";

  $("loginDescription").textContent = showingSignup
    ? "Join the campus community. New accounts start as students."
    : "Sign in to your campus community.";

  $("authSwitchText").innerHTML = showingSignup
    ? 'Already have an account? <button type="button" class="auth-switch">Log in</button>'
    : 'New here? <button type="button" class="auth-switch">Create an account</button>';
}

$("authSwitchText").addEventListener("click", function (event) {
  if (event.target.closest("button")) {
    toggleAuthMode();
  }
});

$("signupForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = $("signupName").value.trim();
  const email = $("signupEmail").value.trim().toLowerCase();
  const password = $("signupPassword").value;

  if (name.length < 2) {
    toast("Please enter your name.");
    return;
  }

  const alreadyExists = USERS.some(
    savedUser => savedUser.email.toLowerCase() === email
  );

  if (alreadyExists) {
    toast("An account already uses this email. Please log in.");
    return;
  }

  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: password,
    role: "student"
  };

  USERS.push(newUser);

  try {
    saveUsers();
  } catch (error) {
    USERS = USERS.filter(savedUser => savedUser.id !== newUser.id);
    toast("Could not save the account in this browser.");
    return;
  }

  this.reset();
  toast("Account created! You are now signed in.");
  login(newUser);
});

$("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const email = $("email").value.trim().toLowerCase();
  const password = $("password").value;

  const account = USERS.find(
    savedUser =>
      savedUser.email.toLowerCase() === email &&
      savedUser.password === password
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

  $("loginForm").reset();
  $("signupForm").reset();
  $("loginForm").classList.remove("hidden");
  $("signupForm").classList.add("hidden");
  $("demoAccounts").classList.remove("hidden");

  $("loginHeading").textContent = "Welcome Back";
  $("loginDescription").textContent = "Sign in to your campus community.";

  $("authSwitchText").innerHTML =
    'New here? <button type="button" class="auth-switch">Create an account</button>';
}

/* Navigation */

function buildNav() {
  const items = user.role === "admin"
    ? [
        "dashboard",
        "clubs",
        "members",
        "useraccounts",
        "facilities",
        "bookings",
        "events",
        "reports"
      ]
    : [
        "dashboard",
        "clubs",
        "myclubs",
        "facilities",
        "bookings",
        "events",
        "notifications"
      ];

  const names = {
    dashboard: "Dashboard",
    clubs: "Explore Clubs",
    members: "Members & Requests",
    useraccounts: "User Accounts",
    myclubs: "My Memberships",
    facilities: "Facilities",
    bookings: "Bookings",
    events: "Events",
    reports: "Reports",
    notifications: "Notifications"
  };

  $("navigation").innerHTML = items.map(pageName => `
    <button
      class="nav-btn ${pageName === activePage ? "active" : ""}"
      onclick="showPage('${pageName}')"
    >
      ${names[pageName]}
    </button>
  `).join("");
}

function showPage(page) {
  activePage = page;
  buildNav();

  const pages = {
    dashboard,
    clubs,
    members,
    useraccounts,
    myclubs,
    facilities,
    bookings,
    events,
    reports,
    notifications
  };

  $("page").innerHTML = (pages[page] || dashboard)();
}

/* Dashboard */

function dashboard() {
  const myMemberships = data.memberships.filter(
    membership =>
      membership.userId === user.id &&
      membership.status === "Approved"
  );

  const myBookings = data.bookings.filter(
    booking => booking.userId === user.id
  );

  const myEvents = data.registrations.filter(
    registration => registration.userId === user.id
  );

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

/* Clubs */

function clubs() {
  return `
    <div class="page-head">
      <h1>Explore Clubs</h1>
      <p>Find a club that matches your interest.</p>
    </div>

    <div class="cards">
      ${CLUBS.map(club => clubCard(club)).join("")}
    </div>
  `;
}

function clubCard(club) {
  const membership = data.memberships.find(
    item => item.userId === user.id && item.clubId === club.id
  );

  const button = membership
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
  const alreadyRequested = data.memberships.some(
    item => item.userId === user.id && item.clubId === id
  );

  if (alreadyRequested) {
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

/* My memberships */

function myclubs() {
  const list = data.memberships.filter(
    membership => membership.userId === user.id
  );

  if (list.length === 0) {
    return `<div class="card empty">You haven't joined any clubs yet.</div>`;
  }

  return `
    <h1>My Memberships</h1>

    <div class="cards">
      ${list.map(membership => {
        const club = CLUBS.find(item => item.id === membership.clubId);

        if (!club) {
          return "";
        }

        return `
          <div class="card">
            <h3>${club.icon} ${club.name}</h3>
            <p>${club.description}</p>
            ${pill(membership.status)}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function pill(status) {
  const color = status === "Approved"
    ? "green"
    : status === "Rejected"
      ? "red"
      : "yellow";

  return `<span class="tag ${color}">${status}</span>`;
}

/* Admin membership requests */

function members() {
  if (data.memberships.length === 0) {
    return `
      <h1>Members &amp; Requests</h1>
      <div class="card empty">There are no membership requests yet.</div>
    `;
  }

  return `
    <h1>Members &amp; Requests</h1>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Club</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          ${data.memberships.map(membership => {
            const club = CLUBS.find(item => item.id === membership.clubId);
            const member = USERS.find(item => item.id === membership.userId);

            return `
              <tr>
                <td>${member ? member.name : "Student"}</td>
                <td>${club ? club.name : "Club"}</td>
                <td>${pill(membership.status)}</td>
                <td>
                  ${membership.status === "Pending" ? `
                    <button onclick="setMembership(${membership.id}, 'Approved')">
                      Approve
                    </button>
                    <button onclick="setMembership(${membership.id}, 'Rejected')">
                      Reject
                    </button>
                  ` : ""}
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function setMembership(id, status) {
  const membership = data.memberships.find(item => item.id === id);

  if (!membership) {
    return;
  }

  membership.status = status;
  save();
  toast("Membership " + status);
  showPage("members");
}

/* Admin account list */

function useraccounts() {
  if (user.role !== "admin") {
    return `<div class="card empty">This page is for the club administrator.</div>`;
  }

  const accounts = USERS.filter(account => account.role !== "admin");
  const students = accounts.filter(account => account.role === "student").length;
  const members = accounts.filter(account => account.role === "member").length;

  return `
    <div class="page-head">
      <h1>Registered Accounts</h1>
      <p>Accounts created or provided for this browser.</p>
    </div>

    <div class="stats">
      ${stat("Student accounts", students)}
      ${stat("Member accounts", members)}
      ${stat("Total accounts", accounts.length)}
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Account type</th>
          </tr>
        </thead>

        <tbody>
          ${accounts.map(account => `
            <tr>
              <td>${account.name}</td>
              <td>${account.email}</td>
              <td>${account.role}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

/* Facilities */

function facilities() {
  return `
    <h1>Facilities</h1>
    <p>Available campus facilities.</p>

    <div class="cards">
      ${FACILITIES.map(facility => `
        <div class="card">
          <h3>🏟️ ${facility.name}</h3>
          <span class="tag green">Available</span>

          <p>
            Type: ${facility.type}<br>
            Capacity: ${facility.capacity}<br>
            Hours: ${facility.hours}
          </p>

          <button onclick="bookFacility(${facility.id})">
            Book Facility
          </button>
        </div>
      `).join("")}
    </div>
  `;
}

function bookFacility(id) {
  const facility = FACILITIES.find(item => item.id === id);

  if (!facility) {
    toast("Facility could not be found.");
    return;
  }

  const date = prompt("Enter booking date (YYYY-MM-DD):");

  if (!date) {
    return;
  }

  const time = prompt("Enter time (for example, 10:00):");

  if (!time) {
    return;
  }

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

/* Bookings */

function bookings() {
  const list = data.bookings.filter(
    booking => user.role === "admin" || booking.userId === user.id
  );

  if (list.length === 0) {
    return `
      <h1>Bookings</h1>
      <div class="card empty">There are no facility bookings yet.</div>
    `;
  }

  return `
    <h1>Bookings</h1>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Facility</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          ${list.map(booking => {
            const member = USERS.find(item => item.id === booking.userId);
            const facility = FACILITIES.find(
              item => item.id === booking.facilityId
            );

            return `
              <tr>
                <td>${member ? member.name : "Student"}</td>
                <td>${facility ? facility.name : "Facility"}</td>
                <td>${booking.date}</td>
                <td>${booking.time}</td>
                <td>${pill(booking.status)}</td>
                <td>
                  ${user.role === "admin" && booking.status === "Pending" ? `
                    <button onclick="setBooking(${booking.id}, 'Approved')">
                      Approve
                    </button>
                    <button onclick="setBooking(${booking.id}, 'Rejected')">
                      Reject
                    </button>
                  ` : ""}
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function setBooking(id, status) {
  const booking = data.bookings.find(item => item.id === id);

  if (!booking) {
    return;
  }

  booking.status = status;
  save();
  toast("Booking " + status);
  showPage("bookings");
}

/* Events */

function events() {
  return `
    <h1>Campus Events</h1>

    <div class="cards">
      ${EVENTS.map(event => {
        const registered = data.registrations.some(
          item => item.userId === user.id && item.eventId === event.id
        );

        return `
          <div class="card">
            <h3>🎉 ${event.title}</h3>
            <p>${event.description}</p>

            <p>
              📅 ${event.date} | ${event.time}<br>
              📍 ${event.location}
            </p>

            ${registered
              ? `<span class="tag green">Registered</span>`
              : `<button onclick="registerEvent(${event.id})">Register</button>`
            }
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function registerEvent(id) {
  const alreadyRegistered = data.registrations.some(
    item => item.userId === user.id && item.eventId === id
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

/* Reports */

function reports() {
  return `
    <h1>Reports</h1>

    <div class="stats">
      ${stat("Membership Requests", data.memberships.length)}
      ${stat(
        "Approved",
        data.memberships.filter(item => item.status === "Approved").length
      )}
      ${stat("Bookings", data.bookings.length)}
      ${stat("Event Registrations", data.registrations.length)}
    </div>
  `;
}

/* Notifications */

function notifications() {
  return `
    <h1>Notifications</h1>

    <div class="card">
      <p>
        Your membership and booking status can be checked from their respective pages.
      </p>
    </div>
  `;
}
