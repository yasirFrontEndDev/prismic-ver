import "dotenv/config";
import * as prismic from "@prismicio/client";
import { readFile } from 'fs/promises';
import { title } from "process";
import { format } from "path";

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

// Define document metadata and main data
const researchDocData = {
  "type": "research",
  "uid": "polygenic-risk-scores-from-research-001",
  "lang": "en-us",
  "data": {
    "title": [
      {
        "type": "heading1",
        "text": "Polygenic Risk Scores: Clinical Utility and Challenges",
        "spans": []
      }
    ],
    "tldr": [
      {
        "type": "paragraph",
        "text": "This study reviews the transition of Polygenic Risk Scores (PRS) from research settings to potential clinical applications, evaluating their predictive power and limitations.",
        "spans": []
      }
    ],
    "domain_group": [
      {
        "domain_text": [
          {
            "type": "paragraph",
            "text": "Precision Medicine",
            "spans": []
          }
        ]
      },
      {
        "domain_text": [
          {
            "type": "paragraph",
            "text": "Pharmacological Treatments",
            "spans": []
          }
        ]
      }
    ],
    "publication_year": 2020,
    "doi": [
      {
        "type": "paragraph",
        "text": "10.1186/s13073-020-00742-5",
        "spans": []
      }
    ],
    "duration_group": [
      {
        "study_duration": "Long-Term (1–5 y)"
      }
    ],
    "size_group": [
      {
        "study_size": "Large size (500–5000)"
      }
    ],
    "region_group": [
      {
        "region": "Global"
      }
    ],
    "age_group": [
      {
        "age": "Young Adult (19–39)"
      },
      {
        "age": "Middle Aged (40-64)"
      }
    ],
    "other_char_group": [
      {
        "other_characteristics": "with Cardiovascular Disease"
      },
      {
        "other_characteristics": "with T2 Diabetes"
      }
    ],
    "sex_group": [
      {
        "sex": "Male"
      },
      {
        "sex": "Female"
      }
    ],
    "study_type_group": [
      {
        "study_type": "Meta-Analysis"
      },
      {
        "study_type": "Systematic Review"
      }
    ],
    "industry_sponsored": false,
    "bias_overall": "Some Concerns",
    "methodology": [
      {
        "type": "paragraph",
        "text": "The study uses a meta-analysis approach to review existing research on PRS across different diseases. It highlights how PRS is constructed using genome-wide association study data and discusses statistical methodologies such as LDpred and PRSice. Key considerations include PRS validation, population stratification, and clinical applicability.",
        "spans": []
      }
    ],
    "intervention": [
      {
        "type": "paragraph",
        "text": "The study discusses PRS as a genetic tool for identifying individuals at increased disease risk. It reviews how PRS is used in cardiovascular disease, diabetes, and psychiatric disorders for risk stratification and potential early interventions.",
        "spans": []
      }
    ],
    "intervention_snomed_list": [
      {
        "type": "paragraph",
        "text": "Polygenic Risk Score Assessment, Genetic Counseling, Personalized Risk Prediction",
        "spans": []
      }
    ],
    "key_findings": [
      {
        "type": "paragraph",
        "text": "Polygenic risk scores show promise in predicting individual disease risk, especially for cardiovascular conditions, type 2 diabetes, and psychiatric disorders. However, PRS faces challenges such as limited predictive accuracy, lack of validation in diverse populations, and ethical concerns regarding genetic determinism. The study emphasizes the need for further research before PRS can be fully integrated into clinical practice.",
        "spans": []
      }
    ]
  }
}

;

// Define body content
const researchBodyData = {
  "body": [
    {
      "slice_type": "interventions",
      "slice_label": null,
      "primary": {
        "intervention_text": [
          {
            "type": "paragraph",
            "text": "Polygenic Risk Score Assessment",
            "spans": []
          }
        ]
      },
      "items": [
        {
          "outcome_text": [
            {
              "type": "paragraph",
              "text": "Risk stratification for cardiovascular disease",
              "spans": []
            }
          ],
          "effectiveness": "Medium",
          "rank_value": 2,
          "explanation": [
            {
              "type": "paragraph",
              "text": "PRS can help in identifying individuals at high genetic risk for cardiovascular diseases but lacks standalone predictive power and must be combined with clinical factors.",
              "spans": []
            }
          ]
        }
      ]
    },
    {
      "slice_type": "interventions",
      "slice_label": null,
      "primary": {
        "intervention_text": [
          {
            "type": "paragraph",
            "text": "Genetic Counseling",
            "spans": []
          }
        ]
      },
      "items": [
        {
          "outcome_text": [
            {
              "type": "paragraph",
              "text": "Improved patient awareness and lifestyle modifications",
              "spans": []
            }
          ],
          "effectiveness": "High",
          "rank_value": 3,
          "explanation": [
            {
              "type": "paragraph",
              "text": "Genetic counseling helps individuals understand their genetic risk and take proactive measures such as lifestyle changes to mitigate disease risk.",
              "spans": []
            }
          ]
        }
      ]
    },
    {
      "slice_type": "interventions",
      "slice_label": null,
      "primary": {
        "intervention_text": [
          {
            "type": "paragraph",
            "text": "Personalized Risk Prediction",
            "spans": []
          }
        ]
      },
      "items": [
        {
          "outcome_text": [
            {
              "type": "paragraph",
              "text": "Enhanced clinical decision-making",
              "spans": []
            }
          ],
          "effectiveness": "Medium",
          "rank_value": 2,
          "explanation": [
            {
              "type": "paragraph",
              "text": "PRS can be useful for tailoring screening recommendations and treatment approaches, but current limitations in accuracy hinder widespread adoption.",
              "spans": []
            }
          ]
        }
      ]
    }
  ]
}


;



// Define document metadata and main data
const researchDocData_es = {
  "type": "research",
  "uid": "puntuaciones-riesgo-poligenico-utilidad-001",
  "lang": "es-es",
  "data": {
    "title": [
      {
        "type": "heading1",
        "text": "Puntuaciones de Riesgo Poligénico: Utilidad Clínica y Desafíos",
        "spans": []
      }
    ],
    "tldr": [
      {
        "type": "paragraph",
        "text": "Este estudio revisa la transición de las puntuaciones de riesgo poligénico (PRS) del ámbito de la investigación a posibles aplicaciones clínicas, evaluando su precisión predictiva y limitaciones.",
        "spans": []
      }
    ],
    "methodology": [
      {
        "type": "paragraph",
        "text": "El estudio utiliza un enfoque de meta-análisis para revisar la investigación existente sobre PRS en diversas enfermedades. Se analiza cómo se construyen las PRS utilizando datos de estudios de asociación de todo el genoma (GWAS) y se explican metodologías estadísticas como LDpred y PRSice. También se destacan cuestiones clave como la validación de PRS, la estratificación de la población y su aplicabilidad clínica.",
        "spans": []
      }
    ],
    "intervention": [
      {
        "type": "paragraph",
        "text": "El estudio examina las PRS como herramienta genética para identificar individuos con mayor riesgo de enfermedades. Se evalúan sus usos en enfermedades cardiovasculares, diabetes y trastornos psiquiátricos para la estratificación del riesgo y posibles intervenciones tempranas.",
        "spans": []
      }
    ],
    "intervention_snomed_list": [
      {
        "type": "paragraph",
        "text": "Evaluación de Puntuaciones de Riesgo Poligénico, Consejería Genética, Predicción Personalizada del Riesgo",
        "spans": []
      }
    ],
    "key_findings": [
      {
        "type": "paragraph",
        "text": "Las puntuaciones de riesgo poligénico muestran potencial en la predicción del riesgo individual de enfermedades, especialmente para afecciones cardiovasculares, diabetes tipo 2 y trastornos psiquiátricos. Sin embargo, las PRS enfrentan desafíos como la precisión predictiva limitada, la falta de validación en poblaciones diversas y preocupaciones éticas sobre el determinismo genético. El estudio enfatiza la necesidad de más investigación antes de que las PRS puedan integrarse plenamente en la práctica clínica.",
        "spans": []
      }
    ]
  }
}


;

// Define body content
const researchBodyData_es = {
  "body": [
    {
      "slice_type": "interventions",
      "slice_label": null,
      "primary": {
        "intervention_text": [
          {
            "type": "paragraph",
            "text": "Intervenciones SNOMED CT Edición en Español",
            "spans": []
          }
        ]
      },
      "items": [
        {
          "outcome_text": [
            {
              "type": "paragraph",
              "text": "Estratificación del riesgo para enfermedades cardiovasculares",
              "spans": []
            }
          ],
          "effectiveness": "Medium",
          "rank_value": 2,
          "explanation": [
            {
              "type": "paragraph",
              "text": "Las PRS pueden ayudar a identificar a individuos con alto riesgo genético de enfermedades cardiovasculares, pero carecen de poder predictivo independiente y deben combinarse con factores clínicos.",
              "spans": []
            }
          ]
        }
      ]
    },
    {
      "slice_type": "interventions",
      "slice_label": null,
      "primary": {
        "intervention_text": [
          {
            "type": "paragraph",
            "text": "Consejería Genética",
            "spans": []
          }
        ]
      },
      "items": [
        {
          "outcome_text": [
            {
              "type": "paragraph",
              "text": "Mayor conciencia del paciente y modificaciones en el estilo de vida",
              "spans": []
            }
          ],
          "effectiveness": "High",
          "rank_value": 3,
          "explanation": [
            {
              "type": "paragraph",
              "text": "La consejería genética ayuda a los individuos a comprender su riesgo genético y tomar medidas proactivas, como cambios en el estilo de vida, para reducir el riesgo de enfermedad.",
              "spans": []
            }
          ]
        }
      ]
    },
    {
      "slice_type": "interventions",
      "slice_label": null,
      "primary": {
        "intervention_text": [
          {
            "type": "paragraph",
            "text": "Predicción Personalizada del Riesgo",
            "spans": []
          }
        ]
      },
      "items": [
        {
          "outcome_text": [
            {
              "type": "paragraph",
              "text": "Mejor toma de decisiones clínicas",
              "spans": []
            }
          ],
          "effectiveness": "Medium",
          "rank_value": 2,
          "explanation": [
            {
              "type": "paragraph",
              "text": "Las PRS pueden ser útiles para personalizar las recomendaciones de detección y enfoques de tratamiento, aunque las limitaciones actuales en su precisión dificultan su adopción generalizada.",
              "spans": []
            }
          ]
        }
      ]
    }
  ]
}


;

const researchDocData_es2 = {
  type: researchDocData_es.type,    // Extract type from Spanish version
  uid: researchDocData_es.uid,      // Extract uid from Spanish version
  lang: researchDocData_es.lang,    // Extract lang from Spanish version
  data: {
    ...researchDocData.data,        // Start with English version data
    // Override specific fields with Spanish versions
    title: researchDocData_es.data.title,
    tldr: researchDocData_es.data.tldr,
    methodology: researchDocData_es.data.methodology,
    intervention: researchDocData_es.data.intervention,
    intervention_snomed_list: researchDocData_es.data.intervention_snomed_list,
    key_findings: researchDocData_es.data.key_findings
  }
}


const experts = [
  {
    "source": "Expert",
    "title1": [
      {
        "type": "heading3",
        "text": "Predicting Diseases with Polygenic Risk Scores",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Dr. Marc Tischkowitz",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.youtube.com/watch?v=5KnpWe0lWJE"
    }
  },
  {
    "source": "Expert",
    "title1": [
      {
        "type": "heading3",
        "text": "Understanding Your Risk with a PRS",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Dr. David Duggan",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.tgen.org/tgen-talks/episode-71-understanding-your-risk-with-a-prs/"
    }
  },
  {
    "source": "Expert",
    "title1": [
      {
        "type": "heading3",
        "text": "Polygenic Risk Scores with Giordano Bottà",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Giordano Bottà",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.youtube.com/watch?v=y4eHL_G5R8A"
    }
  },
  {
    "source": "Expert",
    "title1": [
      {
        "type": "heading3",
        "text": "Polygenic Risk Scores: Clinical Utility and Challenges",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Prof. Cathryn Lewis",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://genomemedicine.biomedcentral.com/articles/10.1186/s13073-020-00742-5"
    }
  },
  {
    "source": "Expert",
    "title1": [
      {
        "type": "heading3",
        "text": "Challenging the Assumptions of Polygenic Risk Scores",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Dr. Laura Almasy",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.research.chop.edu/events/dbhi-presents-informatics-talks-challenging-the-assumptions-of-polygenic-risk-scores"
    }
  }
]





;

const experts_es = [
  {
    "source": "Expert",
    "title1": [
      {
        "type": "heading3",
        "text": "Predicción de Enfermedades con Puntuaciones de Riesgo Poligénico",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Dr. Marc Tischkowitz",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.youtube.com/watch?v=5KnpWe0lWJE"
    }
  },
  {
    "source": "Expert",
    "title1": [
      {
        "type": "heading3",
        "text": "Comprendiendo su Riesgo con una PRS",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Dr. David Duggan",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.tgen.org/tgen-talks/episode-71-understanding-your-risk-with-a-prs/"
    }
  },
  {
    "source": "Expert",
    "title1": [
      {
        "type": "heading3",
        "text": "Puntuaciones de Riesgo Poligénico con Giordano Bottà",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Giordano Bottà",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.youtube.com/watch?v=y4eHL_G5R8A"
    }
  },
  {
    "source": "Expert",
    "title1": [
      {
        "type": "heading3",
        "text": "Puntuaciones de Riesgo Poligénico: Utilidad Clínica y Desafíos",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Prof. Cathryn Lewis",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://genomemedicine.biomedcentral.com/articles/10.1186/s13073-020-00742-5"
    }
  },
  {
    "source": "Expert",
    "title1": [
      {
        "type": "heading3",
        "text": "Desafiando las Suposiciones de las Puntuaciones de Riesgo Poligénico",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Dra. Laura Almasy",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.research.chop.edu/events/dbhi-presents-informatics-talks-challenging-the-assumptions-of-polygenic-risk-scores"
    }
  }
]






;

const online = [
  {
    "source": "Online",
    "title1": [
      {
        "type": "heading3",
        "text": "A New Era of Designer Babies May Be Based on Overhyped Science",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Scientific American",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.scientificamerican.com/article/a-new-era-of-designer-babies-may-be-based-on-overhyped-science/"
    }
  },
  {
    "source": "Online",
    "title1": [
      {
        "type": "heading3",
        "text": "Unmasking Alzheimer's Disease Risk in Young Adults",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "CNN",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.cnn.com/2016/07/06/health/alzheimers-risk-young-adults/index.html"
    }
  },
  {
    "source": "Online",
    "title1": [
      {
        "type": "heading3",
        "text": "A Field at a Crossroads: Genetics and Racial Mythmaking",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Scientific American",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.scientificamerican.com/article/a-field-at-a-crossroads-genetics-and-racial-mythmaking/"
    }
  },
  {
    "source": "Online",
    "title1": [
      {
        "type": "heading3",
        "text": "How Can Trump's Announced $500 Billion Investment In AI Change Healthcare?",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Forbes",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.forbes.com/sites/talpatalon/2025/01/28/how-can-trumps-announced-500-billion-investment-in-ai-change-healthcare/"
    }
  },
  {
    "source": "Online",
    "title1": [
      {
        "type": "heading3",
        "text": "El regreso de la eugenesia",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "El País",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://elpais.com/opinion/2025-01-11/el-regreso-de-la-eugenesia.html"
    }
  }
]







const online_es = [
  {
    "source": "Online",
    "title1": [
      {
        "type": "heading3",
        "text": "El regreso de la eugenesia",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "El País",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://elpais.com/opinion/2025-01-11/el-regreso-de-la-eugenesia.html"
    }
  },
  {
    "source": "Online",
    "title1": [
      {
        "type": "heading3",
        "text": "Una nueva era de bebés de diseño puede estar basada en una ciencia exagerada",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Scientific American",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
        "url": "https://www.scientificamerican.com/article/a-new-era-of-designer-babies-may-be-based-on-overhyped-science/"
    }
  },
  {
    "source": "Online",
    "title1": [
      {
        "type": "heading3",
        "text": "Desenmascarando el riesgo de la enfermedad de Alzheimer en adultos jóvenes",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "CNN",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.cnn.com/2016/07/06/health/alzheimers-risk-young-adults/index.html"
    }
  },
  {
    "source": "Online",
    "title1": [
      {
        "type": "heading3",
        "text": "Un campo en una encrucijada: genética y creación de mitos raciales",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Scientific American",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.scientificamerican.com/article/a-field-at-a-crossroads-genetics-and-racial-mythmaking/"
    }
  },
  {
    "source": "Online",
    "title1": [
      {
        "type": "heading3",
        "text": "¿Cómo puede la inversión anunciada de 500.000 millones de dólares en IA por parte de Trump cambiar la atención médica?",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Forbes",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.forbes.com/sites/talpatalon/2025/01/28/how-can-trumps-announced-500-billion-investment-in-ai-change-healthcare/"
    }
  }
]






const reddit = [
  {
    "source": "Reddit",
    "title1": [
      {
        "type": "heading3",
        "text": "Is there anything methodologically unsound about Polygenic Risk Scores?",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "DefenestrateFriends",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.reddit.com/r/genetics/comments/r8o228/is_there_anything_methodologically_unsound_about/"
    }
  },
  {
    "source": "Reddit",
    "title1": [
      {
        "type": "heading3",
        "text": "What does a given polygenic score 'mean'?",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Byblosopher",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.reddit.com/r/genetics/comments/h9snej/what_does_a_given_polygenic_score_mean/"
    }
  },
  {
    "source": "Reddit",
    "title1": [
      {
        "type": "heading3",
        "text": "Online Courses to Learn about Polygenic Risk Scores",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "misguided_goat",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.reddit.com/r/genomics/comments/1954pk9/online_courses_to_learn_about_polygenic_risk/"
    }
  },
  {
    "source": "Reddit",
    "title1": [
      {
        "type": "heading3",
        "text": "Benchmarking Polygenic Risk Scores: A Tool for Your Research",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Muneeb007007007",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.reddit.com/r/bioinformatics/comments/1gqyo0z/benchmarking_polygenic_risk_scores_a_tool_for/"
    }
  },
  {
    "source": "Reddit",
    "title1": [
      {
        "type": "heading3",
        "text": "Harvard Study reveals 72% of the US public approves selecting embryos based on DNA (polygenic scores) for likelihood of developing conditions and traits. What do you think?",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "blue_cedar_fig",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.reddit.com/r/genetics/comments/1ct14oj/harvard_study_reveals_72_of_the_us_public/"
    }
  }
]






const reddit_es = [
  {
    "source": "Reddit",
    "title1": [
      {
        "type": "heading3",
        "text": "¿Hay algo metodológicamente incorrecto en las puntuaciones de riesgo poligénico?",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "DefenestrateFriends",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.reddit.com/r/genetics/comments/r8o228/is_there_anything_methodologically_unsound_about/"
    }
  },
  {
    "source": "Reddit",
    "title1": [
      {
        "type": "heading3",
        "text": "¿Qué significa una puntuación poligénica determinada?",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Byblosopher",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.reddit.com/r/genetics/comments/h9snej/what_does_a_given_polygenic_score_mean/"
    }
  },
  {
    "source": "Reddit",
    "title1": [
      {
        "type": "heading3",
        "text": "Cursos en línea para aprender sobre puntuaciones de riesgo poligénico",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "misguided_goat",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.reddit.com/r/genomics/comments/1954pk9/online_courses_to_learn_about_polygenic_risk/"
    }
  },
  {
    "source": "Reddit",
    "title1": [
      {
        "type": "heading3",
        "text": "Evaluación comparativa de puntuaciones de riesgo poligénico: una herramienta para tu investigación",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Muneeb007007007",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.reddit.com/r/bioinformatics/comments/1gqyo0z/benchmarking_polygenic_risk_scores_a_tool_for/"
    }
  },
  {
    "source": "Reddit",
    "title1": [
      {
        "type": "heading3",
        "text": "Estudio de Harvard revela que el 72% del público estadounidense aprueba la selección de embriones basada en ADN (puntuaciones poligénicas) para la probabilidad de desarrollar condiciones y rasgos. ¿Qué opinas?",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "blue_cedar_fig",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.reddit.com/r/genetics/comments/1ct14oj/harvard_study_reveals_72_of_the_us_public/"
    }
  }
]






const studies = [
  {
    "source": "Studies",
    "title1": [
      {
        "type": "heading3",
        "text": "Can polygenic risk scores contribute to cost-effective cancer screening?",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Journal of Personalized Medicine",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7614235/"
    }
  },
  {
    "source": "Studies",
    "title1": [
      {
        "type": "heading3",
        "text": "Systematic Review of Polygenic Risk Scores for Type 1 and Type 2 Diabetes",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "International Journal of Molecular Sciences",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7084489/"
    }
  },
  {
    "source": "Studies",
    "title1": [
      {
        "type": "heading3",
        "text": "Polygenic risk scores: from research tools to clinical instruments",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Genome Medicine",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://genomemedicine.biomedcentral.com/articles/10.1186/s13073-020-00742-5"
    }
  },
  {
    "source": "Studies",
    "title1": [
      {
        "type": "heading3",
        "text": "Utility of Polygenic Risk Scores in Predicting Pancreatic Cancer Risk",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Cancers",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.mdpi.com/2072-6694/17/2/241"
    }
  },
  {
    "source": "Studies",
    "title1": [
      {
        "type": "heading3",
        "text": "The clinical utility of polygenic risk scores in genomic medicine",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Human Genetics",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://link.springer.com/article/10.1007/s00439-022-02452-x"
    }
  }
]







const studies_es = [
  {
    "source": "Studies",
    "title1": [
      {
        "type": "heading3",
        "text": "Puntuaciones de riesgo poligénico (PRS): una herramienta en la predicción de enfermedades y la medicina personalizada",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Revista de Osteoporosis y Metabolismo Mineral",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://scielo.isciii.es/scielo.php?pid=S1889-836X2023000400004&script=sci_arttext"
    }
  },
  {
    "source": "Studies",
    "title1": [
      {
        "type": "heading3",
        "text": "La puntuación de riesgo poligénico como factor clave en los modelos de predicción clínica cardiovascular",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Revista Española de Cardiología",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.revespcardiol.org/es-la-puntuacion-riesgo-poligenico-como-articulo-S0300893220300397"
    }
  },
  {
    "source": "Studies",
    "title1": [
      {
        "type": "heading3",
        "text": "Evaluación del riesgo de cáncer y asesoramiento genético (PDQ®)",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Instituto Nacional del Cáncer",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.cancer.gov/espanol/cancer/causas-prevencion/genetica/evaluacion-del-riesgo-pdq"
    }
  },
  {
    "source": "Studies",
    "title1": [
      {
        "type": "heading3",
        "text": "Explorando las puntuaciones de riesgo poligénico usando All of Us",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Programa All of Us",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://allofus.nih.gov/news-events/investigaciones-destacadas/explorando-puntuaciones-de-riesgo-poligenico-con-all-us"
    }
  },
  {
    "source": "Studies",
    "title1": [
      {
        "type": "heading3",
        "text": "Puntuaciones de riesgo poligénico",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Instituto Nacional de Investigación del Genoma Humano",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.genome.gov/es/Health/Genomics-and-Medicine/Puntuaciones-de-Riesgo-Polig%C3%A9nico"
    }
  }
]







const xmentions = [
  {
    "source": "X",
    "title1": [
      {
        "type": "heading3",
        "text": "For over 4 million insurees, 'free' polygenic risk scores for 8 conditions (including heart disease, multiple cancers, type 2 diabetes...)",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Eric Topol",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://twitter.com/EricTopol/status/1777809349337137407"
    }
  },
  {
    "source": "X",
    "title1": [
      {
        "type": "heading3",
        "text": "Polygenic risk scores may be able to help clinicians differentiate the more dangerous prostate cancers from those that will never cause an issue.",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Fred Hutchinson Cancer Center",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://twitter.com/fredhutch/status/1868391833937621422"
    }
  },
  {
    "source": "X",
    "title1": [
      {
        "type": "heading3",
        "text": "Do polygenic risk scores developed to research coronary heart disease have clinical and commercial applications?",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "JAMA",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://twitter.com/JAMA_current/status/1857915358457348576"
    }
  },
  {
    "source": "X",
    "title1": [
      {
        "type": "heading3",
        "text": "Researchers incl @nialljlennon have implemented polygenic risk scores for clinical research for 10 common diseases including heart disease.",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Broad Institute",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://twitter.com/broadinstitute/status/1759954239600881836"
    }
  },
  {
    "source": "X",
    "title1": [
      {
        "type": "heading3",
        "text": "Does the addition of a polygenic risk score for CVD to clinical risk scores improve the identification of individuals at increased risk?",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "American College of Cardiology",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://twitter.com/ACCinTouch/status/1836924486483931289"
    }
  }
]






const xmentions_es = [
  {
    "source": "X",
    "title1": [
      {
        "type": "heading3",
        "text": "Las puntuaciones de riesgo poligénico para Esquizofrenia y Trastorno Bipolar predicen creatividad. La creatividad y la psicosis comparten raíces genéticas.",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Deusto NeuroLab",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://twitter.com/deustoNeuroLab/statuses/1130496885477785600"
    }
  },
  {
    "source": "X",
    "title1": [
      {
        "type": "heading3",
        "text": "Nuevo número de la Revista de osteoporosis y metabolismo mineral!!! Abaloparatida, Osteoporosis posmenopáusica, Puntuaciones riesgo poligénico.",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Grupo Arán",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://twitter.com/GRUPOARAN/status/1806659611556184365"
    }
  },
  {
    "source": "X",
    "title1": [
      {
        "type": "heading3",
        "text": "Medición de riesgo poligénico.",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Ciencia Comunitaria RS",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://genome.gov/es/Health/Genomics-and-Medicine/Puntuaciones-de-Riesgo-Polig%C3%A9nico"
    }
  },
  {
    "source": "X",
    "title1": [
      {
        "type": "heading3",
        "text": "Penetración y pleiotropía de las puntuaciones de riesgo poligénico para la esquizofrenia, el trastorno bipolar y la depresión entre adultos en el sistema de salud.",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "WWM",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://twitter.com/WWMIJR"
    }
  },
  {
    "source": "X",
    "title1": [
      {
        "type": "heading3",
        "text": "Profesora e Investigadora @USPCEU. Interesada en Fisiopatología ósea. Revista de Osteoporosis y Metabolismo Mineral (ROMM).",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Arancha Gortazar",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://twitter.com/argortazar"
    }
  }
]






const youtube = [
  {
    "source": "YouTube",
    "title1": [
      {
        "type": "heading3",
        "text": "Predicting Diseases with Polygenic Risk Scores",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Cambridge University",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.youtube.com/watch?v=5KnpWe0lWJE"
    }
  },
  {
    "source": "YouTube",
    "title1": [
      {
        "type": "heading3",
        "text": "What are Polygenic Risk Scores and how can they be used?",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Genomics plc",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.youtube.com/watch?v=BqR_G8DnPJw"
    }
  },
  {
    "source": "YouTube",
    "title1": [
      {
        "type": "heading3",
        "text": "Polygenic Risk Scores: Development, Validation and Applications",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Johns Hopkins Bloomberg School of Public Health",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.youtube.com/watch?v=gjBWlgWr-9E"
    }
  },
  {
    "source": "YouTube",
    "title1": [
      {
        "type": "heading3",
        "text": "Complex Disease and Polygenic Risk Scores",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Illumina",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.youtube.com/watch?v=qzPikQFBxTo"
    }
  },
  {
    "source": "YouTube",
    "title1": [
      {
        "type": "heading3",
        "text": "Calculating polygenic scores with the Polygenic Score Catalog",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "EBI Training",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.youtube.com/watch?v=YBobYO7tgIk"
    }
  }
]








const youtube_es = [
  {
    "source": "YouTube",
    "title1": [
      {
        "type": "heading3",
        "text": "Puntuaciones de riesgo poligénico, potenciales herramientas para la medicina personalizada",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "NOTIMED",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.youtube.com/watch?v=ymclndp5mKM"
    }
  },
  {
    "source": "YouTube",
    "title1": [
      {
        "type": "heading3",
        "text": "Puntuaciones de riesgo poligénico: ¿Deberían los clínicos utilizarlas?",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Educational Sessions",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.youtube.com/watch?v=ncxXEChj53A"
    }
  },
  {
    "source": "YouTube",
    "title1": [
      {
        "type": "heading3",
        "text": "Puntuaciones de riesgo poligénico en la investigación y la atención médica: el caso del hierro",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Genomics plc",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.youtube.com/watch?v=8z-wKDr_zSk"
    }
  },
  {
    "source": "YouTube",
    "title1": [
      {
        "type": "heading3",
        "text": "Resumen de la solución de puntuación de riesgo poligénico de Illumina",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Illumina",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.youtube.com/watch?v=ykgOcAM6d_E"
    }
  },
  {
    "source": "YouTube",
    "title1": [
      {
        "type": "heading3",
        "text": "Puntuaciones de riesgo poligénico",
        "spans": []
      }
    ],
    "name": [
      {
        "type": "paragraph",
        "text": "Illumina",
        "spans": []
      }
    ],
    "link": {
      "link_type": "Web",
      "url": "https://www.youtube.com/watch?v=1I64mnEcIVA"
    }
  }
]







  //   "text": "Impact of Dietary Sugars on Body Weight",
  //   "spans
  // 
  const mentions_group = {
      mentions_group: [
        ...experts,
        ...online,
        ...reddit,
        ...studies,
        ...xmentions,
        ...youtube,

      ]
  }



  const mentions_group_es = {
    mentions_group: [
      ...experts_es,
      ...online_es,
      ...reddit_es,
      ...studies_es,
      ...xmentions_es,
      ...youtube_es,

    ]
}  
// Define document title using DOI
const documentTitle = ("res-") + researchDocData.data.doi[0].text.replace(/[\/.]/g, '-')

const documentTitle_es = ("res-") + researchDocData.data.doi[0].text.replace(/[\/.]/g, '-') + ("-es")

// Create document using the defined constants
const document = migration.createDocument(
  {
    ...researchDocData,
    data: {
      ...researchDocData.data,
      ...mentions_group,
      ...researchBodyData
    }
  },
  documentTitle
);

// Create document using the defined constants
const documentos = migration.createDocument(
  {
    ...researchDocData_es2,
    data: {
      ...researchDocData_es2.data,
      ...mentions_group_es,
      ...researchBodyData_es
    }
  },
  documentTitle_es, {masterLanguageDocument: document}
);


// Execute the prepared migration at the very end of the script
await writeClient.migrate(migration, {
  reporter: (event) => console.log(event),
});