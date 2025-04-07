const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const assert = require("assert");

describe("Tes Fitur Navbar Menu", function () {
  this.timeout(60000); // Set waktu maksimal test 60 detik agar lebih aman

  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async function () {
    await driver.quit();
  });

  const menuItems = [
    { name: "Products", urlPart: "/ProductMain" },
    { name: "Company Profile", urlPart: "/CompanyProfile" },
    { name: "Our Projects", urlPart: "/project" },
    { name: "Gallery", urlPart: "/Gallery" },
    { name: "Step Order", urlPart: "/StepOrder" },
    { name: "Info & Promotions", urlPart: "/InfoPromotions" },
    { name: "Contact Us", urlPart: "/Contactus" },
    { name: "Whatsapp Us", urlPart: "wa.me" }, // Match exact case from website
  ];

  menuItems.forEach((menu) => {
    it(`Verifikasi menu ${menu.name} dan navigasi`, async function () {
      // 1. Buka halaman utama
      await driver.get("https://loista.co.id/home");
      await driver.manage().setTimeouts({ implicit: 10000 });

      // 2. Temukan menu berdasarkan nama dan klik untuk memastikan fungsionalitasnya
      const menuButton = await driver.findElement(By.linkText(menu.name));

      // 3. Jika elemen terhalang, scroll untuk memastikan elemen bisa diklik
      await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", menuButton);

      // 4. Tunggu hingga tombol dapat diklik dan klik
      await driver.wait(until.elementIsVisible(menuButton), 10000); // Waktu tunggu lebih lama
      await driver.executeScript("arguments[0].click();", menuButton); // Klik menggunakan JavaScript untuk menghindari masalah elemen yang terhalang

      // 5. Jika menu adalah "Products", lanjutkan untuk klik "Design and Builds"
      if (menu.name === "Products") {
        // Menunggu dan klik "Design and Builds"
        const designAndBuildsButton = await driver.findElement(By.partialLinkText("Design"));
        await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", designAndBuildsButton);
        await driver.wait(until.elementIsVisible(designAndBuildsButton), 10000);
        await designAndBuildsButton.click();
      }

      if (menu.name === "Whatsapp Us") {
        // Find menu by exact text match first
        const menuButton = await driver.findElement(By.xpath("//a[text()='Whatsapp Us']"));
        await menuButton.click();

        // Then find and click any WhatsApp link
        const whatsappLink = await driver.findElement(By.xpath("//a[contains(@href, 'wa.me')]"));
        await whatsappLink.click();
        return;
      }

      // 6. Tunggu sampai URL mengandung bagian yang sesuai
      await driver.wait(until.urlContains(menu.urlPart), 10000); // Perpanjang waktu tunggu

      // 7. Verifikasi apakah URL mengandung bagian yang sesuai
      const currentUrl = await driver.getCurrentUrl();
      console.log(`URL saat ini: ${currentUrl}`);
      assert.ok(currentUrl.includes(menu.urlPart), `URL harus mengandung '${menu.urlPart}' setelah klik menu ${menu.name}.`);

      // 8. Scroll halaman ke bawah untuk memverifikasi bahwa halaman dimuat sepenuhnya
      await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");

      // 9. Tunggu beberapa detik agar halaman sepenuhnya dimuat
      await driver.sleep(2000); // Tunggu agar halaman sepenuhnya dimuat

      // 10. Scroll halaman ke atas untuk memverifikasi bahwa halaman dapat digulir ke atas
      await driver.executeScript("window.scrollTo(0, 0);");

      // 11. Ambil screenshot setelah interaksi dengan navbar
      const screenshot = await driver.takeScreenshot();
      const folderPath = "screenshots";
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      fs.writeFileSync(`${folderPath}/screenshot-${menu.name.replace(/\s+/g, "-").toLowerCase()}.png`, screenshot, "base64");
      console.log(`📸 Screenshot menu ${menu.name} disimpan di screenshots/screenshot-${menu.name.replace(/\s+/g, "-").toLowerCase()}.png`);
    });
  });
});
