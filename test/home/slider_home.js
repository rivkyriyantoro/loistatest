const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const assert = require("assert");

describe("Tes Fitur Slider Carousel Banner", function () {
  this.timeout(60000); // Set waktu maksimal test 60 detik agar lebih aman

  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async function () {
    await driver.quit();
  });

  it("Verifikasi bahwa carousel dapat di-scroll dan gambar berubah", async function () {
    // 1. Buka halaman utama
    await driver.get("https://loista.co.id/home");
    await driver.manage().setTimeouts({ implicit: 10000 });

    // 2. Temukan elemen carousel
    const carousel = await driver.findElement(By.css(".carousel-inner")); // Ganti dengan selector yang sesuai

    // 3. Temukan tombol Next dan Previous
    const nextButton = await driver.findElement(By.css(".carousel-control-next")); // Ganti dengan selector yang sesuai
    const prevButton = await driver.findElement(By.css(".carousel-control-prev")); // Ganti dengan selector yang sesuai

    // 4. Klik tombol Next dan pastikan gambar atau konten berubah
    await nextButton.click();
    await driver.sleep(1000); // Tunggu sebentar untuk memastikan perubahan
    const currentImage = await driver.findElement(By.css(".carousel-item.active img")); // Ganti dengan selector yang sesuai
    const imageSrc = await currentImage.getAttribute("src");
    assert.ok(imageSrc, "Gambar harus berubah setelah tombol Next diklik.");

    // 5. Klik tombol Previous dan pastikan gambar kembali ke sebelumnya
    await prevButton.click();
    await driver.sleep(1000); // Tunggu sebentar untuk memastikan perubahan
    const prevImageSrc = await currentImage.getAttribute("src");
    assert.strictEqual(prevImageSrc, imageSrc, "Gambar harus kembali ke gambar sebelumnya setelah tombol Previous diklik.");

    // 6. Ambil screenshot setelah interaksi
    const screenshot = await driver.takeScreenshot();

    // 7. Simpan screenshot ke folder
    const folderPath = "screenshots";
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    fs.writeFileSync(`${folderPath}/screenshot-carousel.png`, screenshot, "base64");
    console.log("📸 Screenshot disimpan di screenshots/screenshot-carousel.png");
  });
});
