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

function getNavbar(isLoggedIn, username = "monsierpotato") {
  return `
  <nav class="navbar navbar-expand-lg" style="background-color: darkturquoise; height: 75px; padding: 0 25px;">
    <div class="container-fluid p-0">
      <h3 style="margin: 0; font-weight: 700; color: #111; margin-right: 30px;">Dealerships</h3>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0" style="gap: 15px;">
          <li class="nav-item">
            <a class="nav-link active" style="font-size: 1.1rem; font-weight: 600; color: #000;" href="/">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" style="font-size: 1.1rem; color: #333;" href="/about">About Us</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" style="font-size: 1.1rem; color: #333;" href="/contact">Contact Us</a>
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

// 1. Django Admin Login Page
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

// 2. Django Admin Logout Page
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

// 3. Dealer details + reviews page
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

// 4. Post Review Submission Form Page
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
  const deployedHost = "https://dealerships-app.us-south.codeengine.appdomain.cloud";

  // Task 12: admin_login.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${localHost}/admin/`, "Django site admin", getAdminLoginPage()),
    path.join(outDir, "admin_login.png")
  );

  // Task 13: admin_logout.png
  await renderScreenshot(
    browser,
    getBrowserWindowHTML(`${localHost}/admin/logout/`, "Logged out | Django site admin", getAdminLogoutPage()),
    path.join(outDir, "admin_logout.png")
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
  console.log("All screenshots generated successfully!");
}

main().catch(console.error);
