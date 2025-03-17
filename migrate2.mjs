import "dotenv/config";
import * as prismic from "@prismicio/client";
import { readFile, readFileSync } from 'fs';
import { title } from "process";
import { format } from "path";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

// Check if we're in a production environment
const isProduction = process.env.NODE_ENV === 'production';
console.log(`Running in ${isProduction ? 'production' : 'development'} mode`);

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to get data from API or files
async function getData(key) {
  if (isProduction) {
    // In production, fetch from API
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/run-migration?key=${key}`);
      if (!response.ok) {
        console.error(`Failed to fetch ${key} from API: ${response.statusText}`);
        return null;
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error fetching ${key} from API:`, error);
      return null;
    }
  } else {
    // In development, read from file
    try {
      const filePath = join(__dirname, `./data/${key}.json`);
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return null;
      }
      const content = readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error reading ${key} from file:`, error);
      return null;
    }
  }
}

// Load configuration
const configFile = readFileSync(join(__dirname, './slicemachine.config.json'), 'utf8');
const { repositoryName: configRepositoryName } = JSON.parse(configFile);

// Use environment variable if available, fallback to config
const repositoryName = process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || configRepositoryName;

// Prismic setup with additional configuration
const writeClient = prismic.createWriteClient(repositoryName, {
  writeToken: process.env.PRISMIC_WRITE_TOKEN,
  routes: [
    {
      type: "research",
      lang: "es-es",
      path: "/:uid",
    }
  ],
  defaultParams: {
    lang: "en-us"
  }
});

const migration = prismic.createMigration();

// Function to format title for UID
const formatTitleForUid = (tile) => {
  const timestamp = Date.now();
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '-') // Replace special characters with dashes
    .replace(/\s+/g, '-')          // Replace spaces with dashes
    .replace(/-+/g, '-')           // Replace multiple dashes with single dash
    + timestamp;                    // Append timestamp
};

// Function to load all data
async function loadAllData() {
  console.log('Loading data...');
  
  // Load JSON data files
  const researchDocData = await getData('researchDocData');
  const researchBodyData = await getData('researchBodyData');
  const researchDocData_es = await getData('researchDocData_es');
  const researchBodyData_es = await getData('researchBodyData_es');
  
  // Source arrays
  const experts = await getData('experts');
  const experts_es = await getData('experts_es');
  const online = await getData('online');
  const online_es = await getData('online_es');
  const reddit = await getData('reddit');
  const reddit_es = await getData('reddit_es');
  const studies = await getData('studies');
  const studies_es = await getData('studies_es');
  const xmentions = await getData('xmentions');
  const xmentions_es = await getData('xmentions_es');
  const youtube = await getData('youtube');
  const youtube_es = await getData('youtube_es');
  
  // Check if we have all required data
  if (!researchDocData || !researchBodyData || !researchDocData_es || !researchBodyData_es) {
    console.error('Missing required data files');
    return null;
  }
  
  // Generate researchDocData_es2 dynamically based on researchDocData and researchDocData_es
  console.log('Generating researchDocData_es2 dynamically...');
  const researchDocData_es2 = {
    type: researchDocData_es.type,
    uid: researchDocData_es.uid,
    lang: researchDocData_es.lang,
    data: {
      ...researchDocData.data,
      title: researchDocData_es.data.title,
      tldr: researchDocData_es.data.tldr,
      methodology: researchDocData_es.data.methodology,
      intervention: researchDocData_es.data.intervention,
      intervention_snomed_list: researchDocData_es.data.intervention_snomed_list,
      key_findings: researchDocData_es.data.key_findings
    }
  };
  
  // Create mentions groups
  const mentions_group = {
    mentions_group: [
      ...(experts || []),
      ...(online || []),
      ...(reddit || []),
      ...(studies || []),
      ...(xmentions || []),
      ...(youtube || [])
    ]
  };
  
  const mentions_group_es = {
    mentions_group: [
      ...(experts_es || []),
      ...(online_es || []),
      ...(reddit_es || []),
      ...(studies_es || []),
      ...(xmentions_es || []),
      ...(youtube_es || [])
    ]
  };
  
  return {
    researchDocData,
    researchBodyData,
    researchDocData_es,
    researchBodyData_es,
    researchDocData_es2,
    mentions_group,
    mentions_group_es
  };
}

// Main migration function
async function runMigration() {
  try {
    // Load all data
    const data = await loadAllData();
    if (!data) {
      console.error('Failed to load required data');
      return;
    }
    
    const { 
      researchDocData, 
      researchBodyData, 
      researchDocData_es, 
      researchBodyData_es, 
      researchDocData_es2,
      mentions_group,
      mentions_group_es
    } = data;
    
    // Define document title and UID using DOI with timestamp to ensure uniqueness
    const timestamp = Date.now();
    const documentTitle = ("res-") + researchDocData.data.doi[0].text.replace(/[\/.]/g, '-') + `-${timestamp}`;
    const documentTitle_es = ("res-") + researchDocData.data.doi[0].text.replace(/[\/.]/g, '-') + `-${timestamp}-es`;
    
    // Create document with unique UID
    const document = migration.createDocument(
      {
        ...researchDocData,
        uid: researchDocData.uid, // Set the UID explicitly
        data: {
          ...researchDocData.data,
          ...mentions_group,
          ...researchBodyData
        }
      },
      documentTitle
    );
    
    // Create document with unique UID
    const documentos = migration.createDocument(
      {
        ...researchDocData_es2,
        uid: researchDocData_es.uid, // Set the UID explicitly
        data: {
          ...researchDocData_es2.data,
          ...mentions_group_es,
          ...researchBodyData_es
        }
      },
      documentTitle_es, {masterLanguageDocument: document}
    );
    
    // Execute the migration
    await writeClient.migrate(migration, {
      reporter: (event) => console.log(event),
    });
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
runMigration();
