import "dotenv/config";
import * as prismic from "@prismicio/client";
import { readFile } from 'fs/promises';
import { title } from "process";

const configFile = await readFile('./slicemachine.config.json', 'utf8');
const { repositoryName: configRepositoryName } = JSON.parse(configFile);

// Use environment variable if available, fallback to config
const repositoryName = process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || configRepositoryName;

// Prismic setup with additional configuration
const writeClient = prismic.createWriteClient(repositoryName, {
  writeToken: process.env.PRISMIC_WRITE_TOKEN,
  routes: [
    {
      type: "research",
      lang: "en-us",
      path: "/:uid",
    }
  ],
  defaultParams: {
    lang: "en-us"
  }
});

const migration = prismic.createMigration();

// Define common title
const documentTitle = "research-" + Date.now()

// Function to format title for UID
const formatTitleForUid = (title) => {
  const timestamp = Date.now();
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '-') // Replace special characters with dashes
    .replace(/\s+/g, '-')          // Replace spaces with dashes
    .replace(/-+/g, '-')           // Replace multiple dashes with single dash
    + timestamp;                    // Append timestamp
};

// Define document metadata and main data
const researchDocData = {
  type: "research",
    uid: formatTitleForUid(title),
    lang: "en-us",
    tags: [],
    data: {
      title: [{
        type: "heading1",
        text: documentTitle,
        spans: []
      }],
      tldr: [{
        type: "paragraph",
        text: "This is a test research document created via migration script.",
        spans: []
      }],
      "domain_group": [
        {
          "domain_text": [{
            "type": "paragraph",
            "text": "Pharmacological Treatments",
            "spans": []
          }]
        },
        {
          "domain_text": [{
            "type": "paragraph",
            "text": "Diabetes Complications",
            "spans": []
          }]
        }
      ],
      duration_group: [{
        study_duration: "Short-Term (≤3 mo)"
      }, {study_duration: "Medium-Term (3–12 mo)"}],
      size_group: [{
        study_size: "Small size (≤100)"
      }],
      region_group: [{
        region: "North America"
      }],
      age_group: [{
        age: "Young Adult (19–39)"
      }],
      other_char_group: [{
        other_characteristics: "with Non-diabetics"
      }],
      sex_group: [{
        sex: "Male"
      }],
      study_type_group: [{
        study_type: "RCTs"
      }],
      bias_overall: "Low",
      methodology: [{
        type: "paragraph",
        text: "Test methodology description",
        spans: []
      }],
      intervention: [{
        type: "paragraph",
        text: "Test intervention description",
        spans: []
      }],
      key_findings: [{
        type: "paragraph",
        text: "Test key findings",
        spans: []
      }],
      mentions_group: [{
        "source": "Expert",
        "title1": [
          {
            "type": "heading3",
            "text": "The Role of Magnesium in Diabetes Management",
            "spans": []
          }
        ],
        "name": [
          {
            "type": "paragraph",
            "text": "Dr. Simin Liu",
            "spans": []
          }
        ],
        "link": {
          "link_type": "Web",
          "url": "https://www.health.com/diabetes-lacking-nutrients-magnesium-study-8784792"
        }
      },
      {
        "source": "Expert",
        "title1": [
          {
            "type": "heading3",
            "text": "Personalized Nutrition for Glycemic Control",
            "spans": []
          }
        ],
        "name": [
          {
            "type": "paragraph",
            "text": "Dr. Eran Elinav",
            "spans": []
          }
        ],
        "link": {
          "link_type": "Web",
          "url": "https://www.cell.com/cell/fulltext/S0092-8674(15)01481-6"
        }
      },
      {
        "source": "Expert",
        "title1": [
          {
            "type": "heading3",
            "text": "Behavioral Strategies in Diabetes Prevention",
            "spans": []
          }
        ],
        "name": [
          {
            "type": "paragraph",
            "text": "Dr. Rena R. Wing",
            "spans": []
          }
        ],
        "link": {
          "link_type": "Web",
          "url": "https://www.niddk.nih.gov/about-niddk/research-areas/diabetes/diabetes-prevention-program-dpp"
        }
      },
      {
        "source": "Expert",
        "title1": [
          {
            "type": "heading3",
            "text": "Impact of Dietary Sugars on Body Weight",
            "spans": []
          }
        ],
        "name": [
          {
            "type": "paragraph",
            "text": "Dr. Lisa Te Morenga",
            "spans": []
          }
        ],
        "link": {
          "link_type": "Web",
          "url": "https://www.bmj.com/content/346/bmj.e7492"
        }
      },
      {
        "source": "Expert",
        "title1": [
          {
            "type": "heading3",
            "text": "Nutritional Epidemiology and Diabetes Risk",
            "spans": []
          }
        ],
        "name": [
          {
            "type": "paragraph",
            "text": "Dr. Nita Forouhi",
            "spans": []
          }
        ],
        "link": {
          "link_type": "Web",
          "url": "https://www.mrc-epid.cam.ac.uk/people/nita-forouhi/"
        }
      }]
  }
}
;

// Define body content
const researchBodyData = {
  body: [{
    slice_type: "interventions",
    slice_label: null,
    primary: {
      intervention_text: [{
        type: "paragraph",
        text: `Interventions for ${documentTitle}`,
        spans: []
      }]
    },
    items: [
      {
        outcome_text: [{
          type: "paragraph",
          text: "outcomes text 1",
          spans: []
        }],
        effectiveness: "High"
      },
      {
        outcome_text: [{
          type: "paragraph",
          text: "outcomes text 2",
          spans: []
        }],
        effectiveness: "Low"
      }
    ]
  }]
};

// Create document using the defined constants
const document = migration.createDocument(
  {
    ...researchDocData,
    data: {
      ...researchDocData.data,
      ...researchBodyData
    }
  },
  documentTitle
);

// Execute the prepared migration at the very end of the script
await writeClient.migrate(migration, {
  reporter: (event) => console.log(event),
});