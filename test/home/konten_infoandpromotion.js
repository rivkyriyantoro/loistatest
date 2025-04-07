const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const assert = require("assert");

describe("Tes Klik Konten Post pada Halaman Utama", function () {
  this.timeout(20000); // Waktu maksimal test lebih cepat

  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async function () {
    await driver.quit();
  });

  it("Verifikasi dapat mengklik salah satu konten di content-post", async function () {
    // 1. Buka halaman utama
    await driver.get("https://loista.co.id/home");
    await driver.manage().setTimeouts({ implicit: 5000 }); // Waktu tunggu lebih cepat

    // 2. Temukan elemen div untuk konten info menggunakan selector yang benar
    const contentPostDiv = await driver.findElement(By.id("content-post"));

    // 3. Temukan konten pertama di dalam div content-post menggunakan XPath
    const firstContentPost = await contentPostDiv.findElement(By.xpath(".//div[1]"));

    // 4. Scroll konten pertama ke tampilan yang terlihat
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", firstContentPost);

    // 5. Tunggu sampai elemen dapat diklik (Waktu tunggu lebih cepat)
    await driver.wait(until.elementIsVisible(firstContentPost), 3000); // Waktu tunggu lebih cepat

    // 6. Pastikan tidak ada overlay atau modal yang menghalangi
    try {
      const overlay = await driver.findElement(By.css(".overlay-class")); // Ganti dengan selector overlay jika ada
      await driver.wait(until.elementIsNotVisible(overlay), 3000); // Waktu tunggu lebih cepat
    } catch (e) {
      console.log("Tidak ada overlay yang menghalangi.");
    }

    // 7. Klik konten pertama menggunakan JavaScript (Klik langsung)
    await firstContentPost.click();

    // 8. Tunggu sampai URL mengandung "/BlogDetail"
    await driver.wait(until.urlContains("/BlogDetail"), 3000); // Waktu tunggu lebih cepat

    // 9. Verifikasi apakah URL mengandung '/BlogDetail'
    const currentUrl = await driver.getCurrentUrl();
    console.log("URL saat ini: ", currentUrl);
    assert.ok(currentUrl.includes("/BlogDetail"), "URL harus mengandung '/BlogDetail' setelah klik konten.");

    // 10. Tunggu sampai elemen dengan kelas 'container-fluid no-gutter' muncul
    const detailElement = await driver.wait(until.elementLocated(By.css(".container-fluid.no-gutter")), 3000); // Waktu tunggu lebih cepat

    // 11. Tunggu gambar selesai dimuat (lebih cepat)
    const images = await detailElement.findElements(By.tagName("img"));
    for (let image of images) {
      await driver.wait(async () => {
        const isLoaded = await driver.executeScript("return arguments[0].complete && arguments[0].naturalWidth > 0;", image);
        return isLoaded; // Mengembalikan true jika gambar sudah selesai dimuat
      }, 3000); // Waktu tunggu lebih cepat
    }

    // 12. Ambil screenshot setelah gambar dimuat dan elemen detail muncul
    const screenshot = await driver.takeScreenshot();
    const folderPath = "screenshots";
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    fs.writeFileSync(`${folderPath}/screenshot-content-post.png`, screenshot, "base64");
    console.log("📸 Screenshot detail konten disimpan di screenshots/screenshot-content-post.png");
  });
});
