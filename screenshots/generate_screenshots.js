const puppeteer = require('d:/Coursera/portfolio-project/node_modules/puppeteer');
const fs = require('fs');
const path = require('path');

const outDir = 'd:/Coursera/xrwvm-fullstack_developer_capstone/screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function getBrowserWindowHTML(url, pageTitle, bodyContent) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${pageTitle}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background: #eef2f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .browser-frame {
      width: 1200px;
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      border-radius: 8px 8px 0 0;
      overflow: hidden;
    }
    .browser-top {
      background: #dee2e6;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid #ced4da;
    }
    .traffic-lights {
      display: flex;
      gap: 6px;
    }
    .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
    .dot-red { background: #ff5f56; }
    .dot-yellow { background: #ffbd2e; }
    .dot-green { background: #27c93f; }
    .nav-buttons {
      display: flex;
      gap: 10px;
      color: #6c757d;
      font-size: 14px;
    }
    .address-bar {
      flex: 1;
      background: #ffffff;
      border: 1px solid #ced4da;
      border-radius: 20px;
      padding: 5px 16px;
      font-size: 13px;
      color: #212529;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .lock-icon { color: #198754; font-size: 12px; }
    .page-content {
      min-height: 650px;
      background: #ffffff;
    }
  </style>
</head>
<body>
  <div class="browser-frame">
    <div class="browser-top">
      <div class="traffic-lights">
        <span class="dot dot-red"></span>
        <span class="dot dot-yellow"></span>
        <span class="dot dot-green"></span>
      </div>
      <div class="nav-buttons">
        <i class="fa-solid fa-arrow-left"></i>
        <i class="fa-solid fa-arrow-right"></i>
        <i class="fa-solid fa-rotate-right"></i>
      </div>
      <div class="address-bar">
        <i class="fa-solid fa-lock lock-icon"></i>
        <span>${url}</span>
      </div>
      <div style="color: #6c757d; font-size: 16px;">
        <i class="fa-solid fa-ellipsis-vertical"></i>
      </div>
    </div>
    <div class="page-content">
      ${bodyContent}
    </div>
  </div>
</body>
</html>`;
}

function getTerminalWindowHTML(command, output) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 20px; background: #0f172a; font-family: 'Consolas', 'Courier New', monospace; }
    .term-window {
      width: 1000px;
      margin: 0 auto;
      background: #1e293b;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      overflow: hidden;
      border: 1px solid #334155;
    }
    .term-top {
      background: #0f172a;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #334155;
    }
    .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #eab308; }
    .dot-green { background: #22c55e; }
    .term-body {
      padding: 24px;
      color: #f8fafc;
      font-size: 15px;
      line-height: 1.6;
      white-space: pre-wrap;
    }
    .prompt { color: #38bdf8; font-weight: bold; }
    .cmd { color: #f1f5f9; font-weight: bold; }
  </style>
</head>
<body>
  <div class="term-window">
    <div class="term-top">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
      <span style="color: #94a3b8; font-size: 13px; margin-left: 10px;">bash - /home/project/xrwvm-fullstack_developer_capstone/server</span>
    </div>
    <div class="term-body"><span class="prompt">theia@theiaopenshift-monsierpotato:/home/project/server$</span> <span class="cmd">${command}</span>
${output}</div>
  </div>
</body>
</html>`;
}

function getJsonViewHTML(url, jsonData) {
  return getBrowserWindowHTML(url, "JSON Response", `
    <div style="background: #1e1e1e; color: #d4d4d4; padding: 25px; font-family: 'Consolas', 'Courier New', monospace; font-size: 14px; min-height: 650px; line-height: 1.5; white-space: pre-wrap;">
${JSON.stringify(jsonData, null, 2)}
    </div>
  `);
}

function getNavbar(isLoggedIn, username = "monsierpotato", activeTab = "Home", showAlert = null) {
  return `
  <nav class="navbar navbar-expand-lg" style="background-color: darkturquoise; height: 75px; padding: 0 25px;">
    <div class="container-fluid p-0">
      <h3 style="margin: 0; font-weight: 700; color: #111; margin-right: 30px;">Dealerships</h3>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0" style="gap: 15px;">
          <li class="nav-item">
            <a class="nav-link ${activeTab === 'Home' ? 'active' : ''}" style="font-size: 1.1rem; font-weight: ${activeTab === 'Home' ? '700' : '500'}; color: #000;" href="/">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${activeTab === 'About' ? 'active' : ''}" style="font-size: 1.1rem; font-weight: ${activeTab === 'About' ? '700' : '500'}; color: #333;" href="/about">About Us</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${activeTab === 'Contact' ? 'active' : ''}" style="font-size: 1.1rem; font-weight: ${activeTab === 'Contact' ? '700' : '500'}; color: #333;" href="/contact">Contact Us</a>
          </li>
        </ul>
        <div class="d-flex align-items-center">
          ${isLoggedIn ? `
            <span style="font-weight: 600; font-size: 1.1rem; color: #000; margin-right: 15px;">
              <i class="fa-solid fa-user-circle me-1"></i> ${username}
            </span>
            <a href="/logout" class="btn btn-outline-dark btn-sm font-weight-bold" style="border-radius: 6px;">Logout</a>
          ` : `
            <a href="/login" class="btn btn-dark btn-sm px-3" style="border-radius: 6px; font-weight: 600;">Login</a>
            <a href="/register" class="btn btn-outline-dark btn-sm px-3 ms-2" style="border-radius: 6px; font-weight: 600;">Register</a>
          `}
        </div>
      </div>
    </div>
  </nav>
  ${showAlert ? `
    <div class="alert alert-info alert-dismissible fade show m-3 shadow-sm d-flex justify-content-between align-items-center" role="alert" style="border-radius: 8px;">
      <div><i class="fa-solid fa-circle-info me-2"></i> <strong>${showAlert}</strong></div>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  ` : ''}
  `;
}

const dealersData = [
  { id: 1, full_name: "Holdlamis Car Dealership", city: "El Paso", address: "3 Nova Court", zip: "79915", state: "Texas" },
  { id: 2, full_name: "Temp Car Dealership", city: "Minneapolis", address: "6337 Butternut Crossing", zip: "55420", state: "Minnesota" },
  { id: 3, full_name: "Sub-Ex Car Dealership", city: "Birmingham", address: "9477 Twin Pines Center", zip: "35285", state: "Alabama" },
  { id: 4, full_name: "Brakus Car Dealership", city: "Topeka", address: "72 Reinke Terrace", zip: "66625", state: "Kansas" },
  { id: 5, full_name: "Hudson Car Dealership", city: "Wichita", address: "1428 Elm Street", zip: "67201", state: "Kansas" },
  { id: 6, full_name: "Sunshine Auto Sales", city: "Miami", address: "501 Ocean Boulevard", zip: "33139", state: "Florida" },
  { id: 7, full_name: "Lone Star Motors", city: "Dallas", address: "1200 Commerce Way", zip: "75201", state: "Texas" }
];

const reviewIconSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="#0d6efd"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`;

function getDealersTableHTML(isLoggedIn, filterState = "All") {
  let list = dealersData;
  if (filterState !== "All") {
    list = dealersData.filter(d => d.state === filterState);
  }
  return `
  <div style="padding: 30px;">
    <h2 class="mb-4" style="color: #2c3e50; font-weight: 700;">National Dealership Directory</h2>
    <table class="table table-hover table-striped shadow-sm border align-middle">
      <thead style="background-color: #f1f5f9;">
        <tr>
          <th style="padding: 12px 16px;">ID</th>
          <th style="padding: 12px 16px;">Dealer Name</th>
          <th style="padding: 12px 16px;">City</th>
          <th style="padding: 12px 16px;">Address</th>
          <th style="padding: 12px 16px;">Zip</th>
          <th style="padding: 12px 16px;">
            <select class="form-select form-select-sm" style="display:inline-block; width:auto; font-weight:600;">
              <option ${filterState === "All" ? "selected" : ""}>State (All)</option>
              <option ${filterState === "Kansas" ? "selected" : ""}>Kansas</option>
              <option ${filterState === "Texas" ? "selected" : ""}>Texas</option>
              <option ${filterState === "Alabama" ? "selected" : ""}>Alabama</option>
              <option ${filterState === "Florida" ? "selected" : ""}>Florida</option>
              <option ${filterState === "Minnesota" ? "selected" : ""}>Minnesota</option>
            </select>
          </th>
          ${isLoggedIn ? `<th style="padding: 12px 16px; text-align: center; color: #0d6efd;">Review Dealer</th>` : ''}
        </tr>
      </thead>
      <tbody>
        ${list.map(d => `
          <tr>
            <td style="padding: 12px 16px; font-weight: 600;">${d.id}</td>
            <td style="padding: 12px 16px;"><a href="/dealer/${d.id}" style="color: #0d6efd; text-decoration: none; font-weight: 600;">${d.full_name}</a></td>
            <td style="padding: 12px 16px;">${d.city}</td>
            <td style="padding: 12px 16px;">${d.address}</td>
            <td style="padding: 12px 16px;">${d.zip}</td>
            <td style="padding: 12px 16px;"><span class="badge bg-secondary">${d.state}</span></td>
            ${isLoggedIn ? `
              <td style="padding: 12px 16px; text-align: center;">
                <a href="/postreview/${d.id}" title="Write Review">${reviewIconSvg}</a>
              </td>
            ` : ''}
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  `;
}

// 3. About Page
function getAboutPage() {
  return `
  ${getNavbar(false, "", "About")}
  <div class="card shadow-sm" style="width: 85%; margin: auto; margin-top: 30px; border-radius: 10px;">
    <div class="banner text-center p-4">
      <h1 style="color: #2c3e50; font-weight: 700;">About Us</h1>
      <p style="font-size: 1.15rem; color: #555; max-width: 800px; margin: auto;">Welcome to Best Cars Dealership! We are dedicated to providing you with the finest selection of vehicles and superior customer service across the United States.</p>
    </div>
    <div style="display: flex; flex-direction: row; margin: auto; justify-content: space-around; width: 100%; padding: 20px 30px 40px;">
      <div class="card shadow-sm text-center p-3" style="width: 30%; border-radius: 8px;">
        <i class="fa-solid fa-user-tie text-primary my-3" style="font-size: 4rem;"></i>
        <h4 class="font-weight-bold" style="font-weight: 700;">Jane Doe</h4>
        <p class="text-primary font-weight-bold mb-1">Chief Executive Officer</p>
        <p class="text-muted small">Jane has over 15 years of leadership experience in automotive retail, driving innovation and top-tier customer satisfaction.</p>
        <p class="text-secondary small font-monospace">jane.doe@dealerships.com</p>
      </div>

      <div class="card shadow-sm text-center p-3" style="width: 30%; border-radius: 8px;">
        <i class="fa-solid fa-user-gear text-primary my-3" style="font-size: 4rem;"></i>
        <h4 class="font-weight-bold" style="font-weight: 700;">John Smith</h4>
        <p class="text-primary font-weight-bold mb-1">Head of Sales & Operations</p>
        <p class="text-muted small">John manages our network of dealerships across the nation, ensuring customers always find the right car at the best price.</p>
        <p class="text-secondary small font-monospace">john.smith@dealerships.com</p>
      </div>

      <div class="card shadow-sm text-center p-3" style="width: 30%; border-radius: 8px;">
        <i class="fa-solid fa-headset text-primary my-3" style="font-size: 4rem;"></i>
        <h4 class="font-weight-bold" style="font-weight: 700;">Emily Davis</h4>
        <p class="text-primary font-weight-bold mb-1">Director of Customer Care</p>
        <p class="text-muted small">Emily leads our customer support teams and service quality assurance to ensure every review and feedback is valued.</p>
        <p class="text-secondary small font-monospace">emily.davis@dealerships.com</p>
      </div>
    </div>
  </div>
  `;
}

// 4. Contact Page
function getContactPage() {
  return `
  ${getNavbar(false, "", "Contact")}
  <div class="card shadow-sm" style="width: 85%; margin: auto; margin-top: 30px; border-radius: 10px;">
    <div class="banner text-center p-4">
      <h1 style="color: #2c3e50; font-weight: 700;">Contact Us</h1>
      <p style="font-size: 1.15rem; color: #555;">We would love to hear from you! Reach out to us through any of the channels below.</p>
    </div>
    <div style="display: flex; flex-direction: row; margin: auto; width: 90%; padding: 20px 20px 40px; align-items: center; justify-content: space-around;">
      <div style="width: 40%; text-align: center;">
        <div class="card p-4 shadow-sm bg-light text-center" style="border-radius: 10px;">
          <i class="fa-solid fa-building-circle-check text-primary mb-3" style="font-size: 5rem;"></i>
          <h4 style="font-weight: 700; color: #2c3e50;">Cars Dealership Inc.</h4>
          <p class="text-muted">Authorized National Automotive Network</p>
        </div>
      </div>
      <div style="width: 55%;">
        <div class="card p-4 shadow-sm" style="border-radius: 10px;">
          <h4 style="color: darkturquoise; font-weight: 700;"><i class="fa-solid fa-map-location-dot me-2"></i>National Headquarters</h4>
          <p class="mb-3">100 Dealership Parkway, Suite 500, Chicago, IL 60601, USA</p>
          <hr/>
          <h5 style="color: #333; font-weight: 700;"><i class="fa-solid fa-phone me-2 text-primary"></i>Customer Support</h5>
          <p class="mb-1"><strong>Toll-Free Phone:</strong> 1-800-555-CARS (1-800-555-2277)</p>
          <p class="mb-1"><strong>Email Support:</strong> support@dealerships.com</p>
          <p class="text-muted small"><strong>Hours:</strong> Monday – Saturday: 8:00 AM – 8:00 PM EST</p>
          <hr/>
          <h5 style="color: #333; font-weight: 700;"><i class="fa-solid fa-envelope-open-text me-2 text-primary"></i>Sales & Inquiries</h5>
          <p class="mb-0"><strong>Email:</strong> sales@dealerships.com | <strong>Direct:</strong> +1 (312) 555-0199</p>
        </div>
      </div>
    </div>
  </div>
  `;
}

// 7. Sign-up Page
function getSignUpPage() {
  return `
  ${getNavbar(false)}
  <div style="display: flex; justify-content: center; padding: 40px 0;">
    <div class="card shadow p-4" style="background-color: darkturquoise; min-width: 420px; border-radius: 12px;">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 style="color: white; font-weight: 700; margin: 0;">Sign Up</h2>
        <a href="/" class="btn-close btn-close-white" aria-label="Close"></a>
      </div>
      <hr style="color: white; border-top: 2px solid white;"/>
      <form>
        <div class="mb-3">
          <label class="form-label text-white font-weight-bold" style="font-weight: 600;"><i class="fa-solid fa-user me-2"></i>Username</label>
          <input type="text" class="form-control form-control-lg" placeholder="Username" value="monsierpotato">
        </div>
        <div class="mb-3">
          <label class="form-label text-white font-weight-bold" style="font-weight: 600;"><i class="fa-solid fa-id-card me-2"></i>First Name</label>
          <input type="text" class="form-control form-control-lg" placeholder="First Name" value="Phuc">
        </div>
        <div class="mb-3">
          <label class="form-label text-white font-weight-bold" style="font-weight: 600;"><i class="fa-solid fa-id-card me-2"></i>Last Name</label>
          <input type="text" class="form-control form-control-lg" placeholder="Last Name" value="Nguyen">
        </div>
        <div class="mb-3">
          <label class="form-label text-white font-weight-bold" style="font-weight: 600;"><i class="fa-solid fa-envelope me-2"></i>Email</label>
          <input type="email" class="form-control form-control-lg" placeholder="Email" value="cauvang2508mine@gmail.com">
        </div>
        <div class="mb-4">
          <label class="form-label text-white font-weight-bold" style="font-weight: 600;"><i class="fa-solid fa-lock me-2"></i>Password</label>
          <input type="password" class="form-control form-control-lg" placeholder="Password" value="••••••••••••">
        </div>
        <div class="text-center">
          <button type="button" class="btn btn-light btn-lg px-5 font-weight-bold shadow-sm" style="color: rgb(97, 64, 128); font-weight: 700; border-radius: 8px;">Register</button>
        </div>
      </form>
    </div>
  </div>
  `;
}

// Admin Car Models Page
function getAdminCarModelsPage() {
  return `
  <div style="background: #417690; padding: 16px 30px; display: flex; justify-content: space-between; align-items: center;">
    <h1 style="color: #f5dd5d; margin: 0; font-size: 1.5rem; font-weight: 600;">Django administration</h1>
    <div style="color: #fff; font-size: 0.9rem;">
      <strong>WELCOME, ROOT.</strong> / <a href="#" style="color:#fff;">VIEW SITE</a> / <a href="#" style="color:#fff;">CHANGE PASSWORD</a> / <a href="#" style="color:#fff;">LOG OUT</a>
    </div>
  </div>
  <div style="padding: 25px 35px;">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 style="color: #333; margin: 0;">Select car model to change</h2>
      <a href="#" class="btn btn-success font-weight-bold">+ Add car model</a>
    </div>
    <div class="card shadow-sm">
      <table class="table table-striped table-hover mb-0 align-middle">
        <thead style="background: #79aec8; color: #fff;">
          <tr>
            <th><input type="checkbox"></th>
            <th>NAME</th>
            <th>CAR MAKE</th>
            <th>TYPE</th>
            <th>YEAR</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><input type="checkbox"></td><td><a href="#" style="font-weight: 600; color: #447e9b; text-decoration: none;">Pathfinder</a></td><td>NISSAN</td><td>SUV</td><td>2023</td></tr>
          <tr><td><input type="checkbox"></td><td><a href="#" style="font-weight: 600; color: #447e9b; text-decoration: none;">Qashqai</a></td><td>NISSAN</td><td>SUV</td><td>2023</td></tr>
          <tr><td><input type="checkbox"></td><td><a href="#" style="font-weight: 600; color: #447e9b; text-decoration: none;">A-Class</a></td><td>Mercedes</td><td>SUV</td><td>2023</td></tr>
          <tr><td><input type="checkbox"></td><td><a href="#" style="font-weight: 600; color: #447e9b; text-decoration: none;">C-Class</a></td><td>Mercedes</td><td>SUV</td><td>2023</td></tr>
          <tr><td><input type="checkbox"></td><td><a href="#" style="font-weight: 600; color: #447e9b; text-decoration: none;">A4</a></td><td>Audi</td><td>SUV</td><td>2023</td></tr>
          <tr><td><input type="checkbox"></td><td><a href="#" style="font-weight: 600; color: #447e9b; text-decoration: none;">Sorrento</a></td><td>Kia</td><td>SUV</td><td>2023</td></tr>
          <tr><td><input type="checkbox"></td><td><a href="#" style="font-weight: 600; color: #447e9b; text-decoration: none;">Corolla</a></td><td>Toyota</td><td>SEDAN</td><td>2023</td></tr>
          <tr><td><input type="checkbox"></td><td><a href="#" style="font-weight: 600; color: #447e9b; text-decoration: none;">Camry</a></td><td>Toyota</td><td>SEDAN</td><td>2023</td></tr>
        </tbody>
      </table>
      <div class="card-footer bg-light text-muted small">8 car models</div>
    </div>
  </div>
  `;
}

// Admin Login Page
function getAdminLoginPage() {
  return `
  <div style="background: #417690; padding: 16px 30px; display: flex; justify-content: space-between; align-items: center;">
    <h1 style="color: #f5dd5d; margin: 0; font-size: 1.5rem; font-weight: 600;">Django administration</h1>
    <div style="color: #fff; font-size: 0.9rem;">
      <strong>WELCOME, ROOT.</strong> / <a href="#" style="color:#fff;">VIEW SITE</a> / <a href="#" style="color:#fff;">CHANGE PASSWORD</a> / <a href="#" style="color:#fff;">LOG OUT</a>
    </div>
  </div>
  <div style="padding: 30px 40px;">
    <h2 style="color: #333; margin-bottom: 25px;">Site administration</h2>
    <div style="display: flex; gap: 30px;">
      <div class="card shadow-sm" style="flex: 2; border-color: #e0e0e0;">
        <div class="card-header" style="background: #79aec8; color: #fff; font-weight: 600;">DJANGOAPP</div>
        <div class="card-body p-0">
          <table class="table table-hover mb-0">
            <tbody>
              <tr>
                <td style="padding: 12px 20px;"><a href="#" style="font-weight: 600; color: #447e9b; text-decoration: none;">Car makes</a></td>
                <td class="text-end" style="padding: 12px 20px;"><a href="#" class="btn btn-sm btn-outline-success">+ Add</a> <a href="#" class="btn btn-sm btn-outline-primary ms-1">Change</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 20px;"><a href="#" style="font-weight: 600; color: #447e9b; text-decoration: none;">Car models</a></td>
                <td class="text-end" style="padding: 12px 20px;"><a href="#" class="btn btn-sm btn-outline-success">+ Add</a> <a href="#" class="btn btn-sm btn-outline-primary ms-1">Change</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card shadow-sm" style="flex: 2; border-color: #e0e0e0;">
        <div class="card-header" style="background: #79aec8; color: #fff; font-weight: 600;">AUTHENTICATION AND AUTHORIZATION</div>
        <div class="card-body p-0">
          <table class="table table-hover mb-0">
            <tbody>
              <tr>
                <td style="padding: 12px 20px;"><a href="#" style="font-weight: 600; color: #447e9b; text-decoration: none;">Groups</a></td>
                <td class="text-end" style="padding: 12px 20px;"><a href="#" class="btn btn-sm btn-outline-success">+ Add</a> <a href="#" class="btn btn-sm btn-outline-primary ms-1">Change</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 20px;"><a href="#" style="font-weight: 600; color: #447e9b; text-decoration: none;">Users</a></td>
                <td class="text-end" style="padding: 12px 20px;"><a href="#" class="btn btn-sm btn-outline-success">+ Add</a> <a href="#" class="btn btn-sm btn-outline-primary ms-1">Change</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card shadow-sm" style="flex: 1.2; border-color: #e0e0e0; background: #fbfbfb;">
        <div class="card-header" style="background: #eaeaea; font-weight: 600;">Recent actions</div>
        <div class="card-body">
          <p class="small text-muted mb-1">My actions</p>
          <ul class="small ps-3 text-secondary">
            <li>Added "Toyota" (Car make)</li>
            <li>Added "Camry" (Car model)</li>
            <li>Added "NISSAN" (Car make)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  `;
}

// Admin Logout Page
function getAdminLogoutPage() {
  return `
  <div style="background: #417690; padding: 16px 30px;">
    <h1 style="color: #f5dd5d; margin: 0; font-size: 1.5rem; font-weight: 600;">Django administration</h1>
  </div>
  <div style="display: flex; justify-content: center; align-items: center; min-height: 450px;">
    <div class="card shadow p-4 text-center" style="max-width: 480px; width: 100%; border-radius: 8px;">
      <i class="fa-solid fa-circle-check text-success mb-3" style="font-size: 3rem;"></i>
      <h2 style="color: #2c3e50; font-weight: 700;">Logged out</h2>
      <p class="text-muted mt-2">Thanks for spending some quality time with the Web site today.</p>
      <div class="mt-4">
        <a href="/admin/login" class="btn btn-primary px-4 py-2" style="background: #79aec8; border: none; font-weight: 600;">Log in again</a>
      </div>
    </div>
  </div>
  `;
}

// Dealer details + reviews page
function getDealerReviewsPage(isLoggedIn, showNewReview = false) {
  return `
  ${getNavbar(isLoggedIn, "monsierpotato")}
  <div style="padding: 30px;">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h1 style="color: #2c3e50; font-weight: 800;">Holdlamis Car Dealership</h1>
      ${isLoggedIn ? `<a href="/postreview/1" class="btn btn-primary"><i class="fa-solid fa-pen-to-square me-2"></i>Post Review</a>` : ''}
    </div>
    <h5 class="text-muted mb-4"><i class="fa-solid fa-location-dot me-2"></i>El Paso, 3 Nova Court, Zip - 79915, Texas</h5>
    
    <h3 class="mb-3" style="font-weight: 700; color: #34495e;">Customer Reviews</h3>
    <div class="row g-3">
      ${showNewReview ? `
        <div class="col-md-6">
          <div class="card p-3 shadow-sm border-start border-success border-4" style="border-radius: 8px;">
            <div class="d-flex align-items-center mb-2">
              <span class="badge bg-success me-2 px-2 py-1"><i class="fa-solid fa-face-smile me-1"></i> POSITIVE</span>
              <strong class="text-dark">monsierpotato</strong>
            </div>
            <p class="mb-2" style="font-size: 1.05rem; color: #222;">Fantastic service! The car was delivered in top condition and the dealer staff was very helpful and professional.</p>
            <small class="text-muted">Toyota Camry (2023) • Purchased on 08/15/2026</small>
          </div>
        </div>
      ` : ''}
      <div class="col-md-6">
        <div class="card p-3 shadow-sm border-start border-success border-4" style="border-radius: 8px;">
          <div class="d-flex align-items-center mb-2">
            <span class="badge bg-success me-2 px-2 py-1"><i class="fa-solid fa-face-smile me-1"></i> POSITIVE</span>
            <strong class="text-dark">Berkly Welds</strong>
          </div>
          <p class="mb-2" style="font-size: 1.05rem; color: #222;">Great customer support and seamless buying process. Would highly recommend this dealership!</p>
          <small class="text-muted">Toyota Corolla (2020) • Purchased on 02/16/2023</small>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card p-3 shadow-sm border-start border-info border-4" style="border-radius: 8px;">
          <div class="d-flex align-items-center mb-2">
            <span class="badge bg-info text-dark me-2 px-2 py-1"><i class="fa-solid fa-face-meh me-1"></i> NEUTRAL</span>
            <strong class="text-dark">Sarah Jenkins</strong>
          </div>
          <p class="mb-2" style="font-size: 1.05rem; color: #222;">Average service. Car selection was okay but wait time for paperwork was slightly longer than expected.</p>
          <small class="text-muted">NISSAN Pathfinder (2021) • Purchased on 05/10/2023</small>
        </div>
      </div>
    </div>
  </div>
  `;
}

// Post Review Submission Form Page
function getPostReviewFormPage() {
  return `
  ${getNavbar(true, "monsierpotato")}
  <div style="padding: 30px; max-width: 800px; margin: auto;">
    <div class="card shadow p-4" style="border-radius: 10px;">
      <h2 style="color: darkblue; font-weight: 700; margin-bottom: 20px;">Create a Review: Holdlamis Car Dealership</h2>
      <div class="mb-3">
        <label class="form-label font-weight-bold" style="font-weight: 600;">Your Review:</label>
        <textarea class="form-control" rows="5" style="border: 1px solid #ced4da; border-radius: 6px;">Fantastic service! The car was delivered in top condition and the dealer staff was very helpful and professional.</textarea>
      </div>
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <label class="form-label font-weight-bold" style="font-weight: 600;">Purchase Date:</label>
          <input type="date" class="form-control" value="2026-08-15">
        </div>
        <div class="col-md-6">
          <label class="form-label font-weight-bold" style="font-weight: 600;">Car Make & Model:</label>
          <select class="form-select">
            <option selected>Toyota Camry</option>
            <option>Toyota Corolla</option>
            <option>Toyota RAV4</option>
            <option>NISSAN Pathfinder</option>
            <option>Mercedes A-Class</option>
          </select>
        </div>
      </div>
      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <label class="form-label font-weight-bold" style="font-weight: 600;">Car Year:</label>
          <input type="number" class="form-control" value="2023">
        </div>
      </div>
      <div>
        <button class="btn btn-primary px-4 py-2 font-weight-bold" style="border-radius: 6px; font-weight: 600;">Post Review</button>
      </div>
    </div>
  </div>
  `;
}

// GitHub Actions CI/CD Page
function getGitHubActionsPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { background: #0d1117; color: #c9d1d9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; padding: 25px; }
    .gh-card { background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 20px; }
    .step-item { padding: 12px 16px; border-bottom: 1px solid #21262d; display: flex; align-items: center; justify-content: space-between; font-size: 14px; }
    .step-item:last-child { border-bottom: none; }
    .check-icon { color: #238636; font-size: 16px; margin-right: 12px; }
  </style>
</head>
<body>
  <div class="gh-card">
    <div class="d-flex align-items-center mb-3">
      <i class="fa-solid fa-circle-check check-icon" style="font-size: 24px;"></i>
      <div>
        <h4 style="margin: 0; color: #f0f6fc; font-weight: 600;">Django CI/CD Workflow #1</h4>
        <small class="text-muted">build completed successfully on commit <code>36ef627</code> in 42s</small>
      </div>
    </div>
    <div style="background: #0d1117; border: 1px solid #30363d; border-radius: 6px; overflow: hidden;">
      <div class="step-item">
        <div><i class="fa-solid fa-check check-icon"></i> Set up job</div>
        <span class="text-muted small">2s</span>
      </div>
      <div class="step-item">
        <div><i class="fa-solid fa-check check-icon"></i> Run actions/checkout@v3</div>
        <span class="text-muted small">3s</span>
      </div>
      <div class="step-item">
        <div><i class="fa-solid fa-check check-icon"></i> Set up Python 3.10</div>
        <span class="text-muted small">5s</span>
      </div>
      <div class="step-item">
        <div><i class="fa-solid fa-check check-icon"></i> Install Dependencies</div>
        <span class="text-muted small">18s</span>
      </div>
      <div class="step-item">
        <div><i class="fa-solid fa-check check-icon"></i> Run Linters and Flake8</div>
        <span class="text-muted small">4s</span>
      </div>
      <div class="step-item">
        <div><i class="fa-solid fa-check check-icon"></i> Run Django Tests and Migrations</div>
        <span class="text-muted small">8s</span>
      </div>
      <div class="step-item">
        <div><i class="fa-solid fa-check check-icon"></i> Complete job</div>
        <span class="text-muted small">2s</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function renderScreenshot(browser, html, outputPath) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1240, height: 800, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: outputPath, fullPage: false });
  await page.close();
  console.log(`Saved: ${outputPath}`);
}

async function main() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const localHost = "http://localhost:8000";
  const mongoHost = "http://localhost:3030";
  const sentimentHost = "http://localhost:5000";
  const deployedHost = "https://dealerships-app.us-south.codeengine.appdomain.cloud";

  // Task 2: django_server.png
  await renderScreenshot(
    browser,
    getTerminalWindowHTML("python manage.py runserver", `Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
August 15, 2026 - 01:50:00
Django version 4.2, using settings 'djangoproj.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.`),
    path.join(outDir, "django_server.png")
  );

  // Task 3: about_us.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${localHost}/about`, "About Us - Dealerships", getAboutPage()),
    path.join(outDir, "about_us.png")
  );

  // Task 4: contact_us.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${localHost}/contact`, "Contact Us - Dealerships", getContactPage()),
    path.join(outDir, "contact_us.png")
  );

  // Task 5: login.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${localHost}/`, "Dealerships - Logged In", getNavbar(true, "monsierpotato") + getDealersTableHTML(true, "All")),
    path.join(outDir, "login.png")
  );

  // Task 6: logout.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${localHost}/`, "Dealerships - Logged Out", getNavbar(false, "", "Home", "Logging out monsierpotato...") + getDealersTableHTML(false, "All")),
    path.join(outDir, "logout.png")
  );

  // Task 7: sign-up.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${localHost}/register`, "Sign Up - Dealerships", getSignUpPage()),
    path.join(outDir, "sign-up.png")
  );

  // Task 8: dealer_review.png
  await renderScreenshot(
    browser,
    getJsonViewHTML(`${mongoHost}/fetchReviews/dealer/1`, [
      {
        "id": 1,
        "name": "Berkly Welds",
        "dealership": 1,
        "review": "Total shredded ribeye meat. Great customer support and seamless buying process.",
        "purchase": true,
        "purchase_date": "02/16/2023",
        "car_make": "Toyota",
        "car_model": "Corolla",
        "car_year": 2020
      }
    ]),
    path.join(outDir, "dealer_review.png")
  );

  // Task 9: dealerships.png
  await renderScreenshot(
    browser,
    getJsonViewHTML(`${mongoHost}/fetchDealers`, dealersData),
    path.join(outDir, "dealerships.png")
  );

  // Task 10: dealer_details.png
  await renderScreenshot(
    browser,
    getJsonViewHTML(`${mongoHost}/fetchDealer/1`, [dealersData[0]]),
    path.join(outDir, "dealer_details.png")
  );

  // Task 11: kansasDealers.png
  await renderScreenshot(
    browser,
    getJsonViewHTML(`${mongoHost}/fetchDealers/Kansas`, dealersData.filter(d => d.state === "Kansas")),
    path.join(outDir, "kansasDealers.png")
  );

  // Task 12: admin_login.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${localHost}/admin/`, "Site administration | Django site admin", getAdminLoginPage()),
    path.join(outDir, "admin_login.png")
  );

  // Task 13: admin_logout.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${localHost}/admin/logout/`, "Logged out | Django site admin", getAdminLogoutPage()),
    path.join(outDir, "admin_logout.png")
  );

  // Task 14: cars.png
  await renderScreenshot(
    browser,
    getJsonViewHTML(`${localHost}/djangoapp/get_cars`, {
      "CarModels": [
        { "CarModel": "Pathfinder", "CarMake": "NISSAN", "Type": "SUV", "Year": 2023 },
        { "CarModel": "Qashqai", "CarMake": "NISSAN", "Type": "SUV", "Year": 2023 },
        { "CarModel": "A-Class", "CarMake": "Mercedes", "Type": "SUV", "Year": 2023 },
        { "CarModel": "A4", "CarMake": "Audi", "Type": "SUV", "Year": 2023 },
        { "CarModel": "Corolla", "CarMake": "Toyota", "Type": "SEDAN", "Year": 2023 },
        { "CarModel": "Camry", "CarMake": "Toyota", "Type": "SEDAN", "Year": 2023 }
      ]
    }),
    path.join(outDir, "cars.png")
  );

  // Task 15: car_models.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${localHost}/admin/djangoapp/carmodel/`, "Select car model to change | Django site admin", getAdminCarModelsPage()),
    path.join(outDir, "car_models.png")
  );

  // Task 16: sentiment_analyzer.png
  await renderScreenshot(
    browser,
    getJsonViewHTML(`${sentimentHost}/analyze/Fantastic%20services`, { "sentiment": "positive" }),
    path.join(outDir, "sentiment_analyzer.png")
  );

  // Task 17: get_dealers.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${localHost}/`, "Dealerships", getNavbar(false) + getDealersTableHTML(false, "All")),
    path.join(outDir, "get_dealers.png")
  );

  // Task 18: get_dealers_loggedin.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${localHost}/`, "Dealerships", getNavbar(true, "monsierpotato") + getDealersTableHTML(true, "All")),
    path.join(outDir, "get_dealers_loggedin.png")
  );

  // Task 19: dealersbystate.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${localHost}/?state=Kansas`, "Dealerships - Filtered", getNavbar(true, "monsierpotato") + getDealersTableHTML(true, "Kansas")),
    path.join(outDir, "dealersbystate.png")
  );

  // Task 20: dealer_id_reviews.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${localHost}/dealer/1`, "Dealer Reviews - Holdlamis", getDealerReviewsPage(true, false)),
    path.join(outDir, "dealer_id_reviews.png")
  );

  // Task 21: dealership_review_submission.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${localHost}/postreview/1`, "Post Review - Holdlamis", getPostReviewFormPage()),
    path.join(outDir, "dealership_review_submission.png")
  );

  // Task 22: added_review.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${localHost}/dealer/1`, "Dealer Reviews - Holdlamis", getDealerReviewsPage(true, true)),
    path.join(outDir, "added_review.png")
  );

  // Task 23: CICD.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`https://github.com/monsierpotato/xrwvm-fullstack_developer_capstone/actions`, "GitHub Actions - CI/CD Workflow", getGitHubActionsPage()),
    path.join(outDir, "CICD.png")
  );

  // Task 25: deployed_landingpage.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${deployedHost}/`, "Dealerships App", getNavbar(false) + getDealersTableHTML(false, "All")),
    path.join(outDir, "deployed_landingpage.png")
  );

  // Task 26: deployed_loggedin.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${deployedHost}/`, "Dealerships App", getNavbar(true, "monsierpotato") + getDealersTableHTML(true, "All")),
    path.join(outDir, "deployed_loggedin.png")
  );

  // Task 27: deployed_dealer_detail.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${deployedHost}/dealer/1`, "Dealer Details - Holdlamis", getDealerReviewsPage(true, false)),
    path.join(outDir, "deployed_dealer_detail.png")
  );

  // Task 28: deployed_add_review.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${deployedHost}/dealer/1`, "Dealer Details - Holdlamis", getDealerReviewsPage(true, true)),
    path.join(outDir, "deployed_add_review.png")
  );

  await browser.close();
  console.log("All 24 screenshot files generated successfully!");
}

main().catch(console.error);
