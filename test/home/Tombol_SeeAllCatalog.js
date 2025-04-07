const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const assert = require("assert");

describe("Tes Fitur Tombol See All Catalog", function () {
  this.timeout(60000); // Set waktu maksimal test 60 detik agar lebih aman

  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async function () {
    await driver.quit();
  });

  it("Verifikasi tombol 'See All Catalog' berfungsi dengan baik", async function () {
    // 1. Buka halaman utama
    await driver.get("https://loista.co.id/home");
    await driver.manage().setTimeouts({ implicit: 10000 });

    // 2. Temukan tombol "See All Catalog"
    const seeAllCatalogButton = await driver.findElement(By.xpath("//a[contains(text(),'See All Catalog')]"));

    // 3. Scroll tombol ke tampilan yang dapat dilihat
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", seeAllCatalogButton);

    // 4. Tunggu hingga tombol dapat diklik
    await driver.wait(until.elementIsVisible(seeAllCatalogButton), 10000);

    // 5. Pastikan tidak ada overlay atau modal yang menghalangi
    try {
      const overlay = await driver.findElement(By.css(".overlay-class")); // Ganti dengan selector overlay jika ada
      await driver.wait(until.elementIsNotVisible(overlay), 10000);
    } catch (e) {
      console.log("Tidak ada overlay yang menghalangi.");
    }

    // 6. Klik tombol menggunakan JavaScript
    await driver.executeScript("arguments[0].click();", seeAllCatalogButton);

    // 7. Verifikasi apakah halaman atau elemen tertentu terbuka
    const currentUrl = await driver.getCurrentUrl();
    assert.ok(currentUrl.includes("/ProductMain"), "URL harus mengandung '/ProductMain' setelah klik tombol.");

    // 8. Ambil screenshot setelah interaksi
    const screenshot = await driver.takeScreenshot();

    // 9. Simpan screenshot ke folder
    const folderPath = "screenshots";
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    fs.writeFileSync(`${folderPath}/screenshot-see-all-catalog.png`, screenshot, "base64");
    console.log("📸 Screenshot disimpan di screenshots/screenshot-see-all-catalog.png");
  });
});
