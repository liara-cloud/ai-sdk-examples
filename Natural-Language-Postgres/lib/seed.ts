import pool from './db';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import "dotenv/config"

function parseDate(dateString: string | undefined | null): string | null {
  if (!dateString || typeof dateString !== "string") {
    console.warn(`Date is missing or invalid: ${dateString}`);
    return null;
  }
  const parts = dateString.split('/');
  if (parts.length === 3) {
    // CSV format is M/D/YYYY
    const month = parts[0].padStart(2, '0');
    const day = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  console.warn(`Could not parse date: ${dateString}`);
  return null;
}

export async function seed() {
  const createTable = await pool.query(
    `CREATE TABLE IF NOT EXISTS unicorns (
      id SERIAL PRIMARY KEY,
      company VARCHAR(255) NOT NULL UNIQUE,
      valuation DECIMAL(10, 2) NOT NULL,
      date_joined DATE,
      country VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      industry VARCHAR(255) NOT NULL,
      select_investors TEXT NOT NULL
    );`
  );

  console.log(`Created "unicorns" table`);

  const results: any[] = [];
  const csvFilePath = path.join(process.cwd(), 'unicorns.csv');

  // Column mapping based on example row:
  // 0: (empty/id), 1: Company, 2: Valuation ($B), 3: Date Joined, 4: Country, 5: City, 6: Industry, 7: Select Investors

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv({
        headers: [
          "id",
          "Company",
          "Valuation ($B)",
          "Date Joined",
          "Country",
          "City",
          "Industry",
          "Select Investors"
        ],
        skipLines: 4
      }))
      .on('data', (data) => results.push(data))
      .on('end', resolve)
      .on('error', reject);
  });

  for (const row of results) {
    // All fields are now guaranteed to be present and correctly named
    const company = (row["Company"] || "").trim();
    const valuationRaw = (row["Valuation ($B)"] || "").trim();
    const dateRaw = (row["Date Joined"] || "").trim();
    const country = (row["Country"] || "").trim();
    const city = (row["City"] || "").trim();
    const industry = (row["Industry"] || "").trim();
    const investors = (row["Select Investors"] || "").trim();

    if (!company || !valuationRaw) {
      console.warn(
        `Skipping row due to missing required fields: Company="${company}", Valuation="${valuationRaw}"`
      );
      continue;
    }

    const valuation = parseFloat(
      valuationRaw.replace(/\$/g, '').replace(/,/g, '')
    );
    const formattedDate = parseDate(dateRaw);

    await pool.query(
      `INSERT INTO unicorns (company, valuation, date_joined, country, city, industry, select_investors)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (company) DO NOTHING;`,
      [
        company,
        valuation,
        formattedDate,
        country,
        city,
        industry,
        investors
      ]
    );
  }

  console.log(`Seeded ${results.length} unicorns`);

  return {
    createTable,
    unicorns: results,
  };
}


seed().catch(console.error);