import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import puppeteer from "puppeteer";
import 'dotenv/config';

const hotel_resp: Record<string, { hotel_name: string; hotel_url: string }> = {
  "54329": { "hotel_name": "Mayura Phalguni River Resort -Mangalore", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-mayuraphalguniriverresort" },
  "35072": { "hotel_name": "Mayura Valleyview Madikeri", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayuravalleyview" },
  "35090": { "hotel_name": "Mayura Krishna Almatti", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-mayurakrishnaalmatti" },
  "35073": { "hotel_name": "Mayura Riverview Srirangapatna", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayurariverview" },
  "35079": { "hotel_name": "Mayura Shantala Halebeedu", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayurashanthalahalebedu" },
  "35089": { "hotel_name": "Mayura Yagachi Belur", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayurayagachi" },
  "35085": { "hotel_name": "Mayura Gerusoppa Jogfalls", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayuragerusoppajogfalls" },
  "35081": { "hotel_name": "Mayura Bhuvaneshwari Hampi", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayurabhuvaneshwarihampi" },
  "35077": { "hotel_name": "Mayura Nisarga Pearl Valley,Muthyalmaduvu", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayuranisargamuthyalamaduvu" },
  "35083": { "hotel_name": "Mayura Vijayanagara Hampi (TB Dam)", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayuravijayanagartbdam" },
  "35080": { "hotel_name": "Mayura Talakavery, Bhagamandala", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayuratalakaverybagamandala" },
  "35087": { "hotel_name": "Mayura Bharachukki Shivanasamudra", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayurabharachukkishivanasamudra" },
  "35084": { "hotel_name": "Mayura Adil Shahi Vijaypura", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayuraadilshahi" },
  "35078": { "hotel_name": "Mayura Velapuri Belur", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayuravelapuribelur" },
  "35086": { "hotel_name": "Mayura Sangama Mekedatu", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayurasangammekedhatu" },
  "35101": { "hotel_name": "Mayura Durg Chitradurga", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayuradurgachitradurga" },
  "34112": { "hotel_name": "Mayura Pine Top Nandi Hills", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-mayurapinetopnandihills" },
  "48639": { "hotel_name": "Hotel Mayura Royal Heritage-Ooty", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-mayuraroyalheritageooty" },
  "35076": { "hotel_name": "Mayura Sudarshan Ooty", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayurasudarshanooty" },
  "35074": { "hotel_name": "Mayura Hoysala Mysuru", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayurahoysalamysore" },
  "35082": { "hotel_name": "Mayura Chalukya Badami", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayurachalukyabadami" },
  "35075": { "hotel_name": "Mayura Kauvery KRS (Brindavan Gardens)", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayuracauverykrsbhrundavangarden" },
  "35088": { "hotel_name": "Mayura Biligiri, B.R Hills", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-hotelmayurabiligiribrhills" },
  "35114": { "hotel_name": "Mayura Pavithra Yediyur", "hotel_url": "https://bookings.kstdc.co/booking/book-rooms-mayurapavithrayediyuru" }
};

async function scrapeData(hotel_id: string, check_in: string, check_out: string): Promise<any> {
  const hotel = hotel_resp[hotel_id];
  if (!hotel) throw new Error("Invalid hotel_id");

  const runScrape = async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(90000);
    await page.goto(hotel.hotel_url, { waitUntil: 'networkidle2', timeout: 90000 });

    await page.evaluate((check_in, check_out) => {
      const checkInInput = document.getElementById('eZ_chkin') as HTMLInputElement;
      const checkOutInput = document.getElementById('eZ_chkout') as HTMLInputElement;
      if (checkInInput) checkInInput.removeAttribute('readonly');
      if (checkOutInput) checkOutInput.removeAttribute('readonly');
      if (checkInInput) checkInInput.value = check_in;
      if (checkOutInput) checkOutInput.value = check_out;
    }, check_in, check_out);

    await page.click('input[value="Check Availability"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 90000 });

    const hotel_array = await page.evaluate((hotel_id, check_in, check_out) => {
      const hotels = Array.from(document.querySelectorAll('#main_otarow'));
      const results: any[] = [];
      
      hotels.forEach(hotel => {
        const rooms = Array.from(hotel.querySelectorAll('.card-list.otartrow'));
        const hotel_name = document.querySelector('.brandname')?.textContent?.trim() || "";
        
        rooms.forEach(room => {
          const room_type = room.querySelector('h3')?.textContent?.trim() || "";
          const price = room.querySelector('#rmamt')?.textContent?.replace(',', '').trim() || "";
          const rooms_left = room.querySelector('.leftroomcls')?.textContent?.trim() || "";
          
          results.push({ 
            hotel_name,
            hotel_id,
            check_in_date: check_in,
            check_out_date: check_out,
            room_type, 
            price,
            rooms_left
          });
        });
      });
      return results;
    }, hotel_id, check_in, check_out);

    await browser.close();
    return hotel_array;
  };

  try {
    return await runScrape();
  } catch (error: any) {
    // Simple retry for 502/errors
    return await runScrape();
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get("/check_availability", async (req, res) => {
    const { check_in, check_out, hotel_id } = req.query;
    if (!check_in || !check_out || !hotel_id) {
      return res.status(400).json({ status: 400, message: "Missing parameters" });
    }
    try {
      const data = await scrapeData(hotel_id as string, check_in as string, check_out as string);
      res.json({ status: 200, data });
    } catch (error: any) {
      res.status(502).json({ status: 502, message: error.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
