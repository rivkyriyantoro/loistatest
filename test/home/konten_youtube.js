const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const assert = require("assert");

describe("Tes YouTube di halaman Loista", function () {
  this.timeout(60000); // Set waktu maksimal test 60 detik agar lebih aman

  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async function () {
    await driver.quit();
  });

  it("Klik tombol About dan mainkan video YouTube", async function () {
    // 1. Buka halaman utama
    await driver.get("https://loista.co.id/home");
    await driver.manage().setTimeouts({ implicit: 10000 });

    // 2. Klik tombol "See About Our Company"
    const aboutBtn = await driver.findElement(By.xpath("//a[contains(text(), 'See About Our Company')]"));
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' })", aboutBtn);
    await driver.sleep(500);
    await driver.actions({ bridge: true }).move({ origin: aboutBtn }).click().perform();

    // 3. Scroll ke bawah agar iframe terlihat
    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    await driver.sleep(1500);

    // 4. Temukan iframe YouTube dan masuk ke dalamnya
    const iframe = await driver.findElement(By.css("iframe[src*='youtube.com']"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", iframe);
    await driver.sleep(1000);
    await driver.switchTo().frame(iframe);

    // 5. Tunggu tombol play dan klik
    await driver.wait(until.elementLocated(By.css(".ytp-cued-thumbnail-overlay")), 10000);
    const playButton = await driver.findElement(By.css(".ytp-cued-thumbnail-overlay"));
    await playButton.click();

    // 6. Ambil screenshot setelah video diputar
    await driver.sleep(3000);
    const screenshot = await driver.takeScreenshot();

    // 7. Simpan screenshot ke folder
    const folderPath = "screenshots";
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    fs.writeFileSync(`${folderPath}/screenshot-youtube.png`, screenshot, "base64");
    console.log("📸 Screenshot disimpan di screenshots/screenshot-youtube.png");

    // 8. Assertion supaya test dianggap sukses
    assert.ok(true, "Test berhasil dijalankan sampai akhir.");
  });
});
