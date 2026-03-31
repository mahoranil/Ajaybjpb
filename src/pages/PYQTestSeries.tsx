import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Play, CheckCircle2, XCircle, ChevronRight, RefreshCw, Award, Lock } from 'lucide-react';

const pyqTests = [
  {
    id: 'prelims-2023-gs1',
    title: 'UPSC CSE Prelims 2023 - GS Paper 1',
    year: 2023,
    subject: 'Full Length',
    duration: 120,
    questions: [
      {
        question: "Consider the following statements regarding 'Invasive Species Specialist Group' (ISSG):\n1. It belongs to the International Union for Conservation of Nature (IUCN).\n2. It developed the Global Invasive Species Database.\nWhich of the statements given above is/are correct?",
        options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
        correctAnswer: 2,
        explanation: "The Invasive Species Specialist Group (ISSG) is a global network of scientific and policy experts on invasive species, organized under the auspices of the Species Survival Commission (SSC) of the International Union for Conservation of Nature (IUCN). It manages the Global Invasive Species Database (GISD)."
      },
      {
        question: "In India, which one of the following is responsible for maintaining price stability by controlling inflation?",
        options: ["Department of Consumer Affairs", "Expenditure Management Commission", "Financial Stability and Development Council", "Reserve Bank of India"],
        correctAnswer: 3,
        explanation: "The Reserve Bank of India (RBI) is vested with the responsibility of conducting monetary policy. The primary objective of monetary policy is to maintain price stability while keeping in mind the objective of growth."
      },
      {
        question: "Consider the following statements:\n1. In India, prisons are managed by State Governments with their own rules and regulations.\n2. In India, prisons are governed by the Prisons Act, 1894 which expressly kept the subject of prisons in the control of Provincial Governments.\nWhich of the statements given above is/are correct?",
        options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
        correctAnswer: 2,
        explanation: "Prisons and their administration is a State subject covered by item 4 under the State List in the Seventh Schedule of the Constitution of India. The management and administration of Prisons falls exclusively in the domain of the State Governments, and is governed by the Prisons Act, 1894."
      },
      {
        question: "Which one of the following best describes the concept of 'Small Farmer Large Field'?",
        options: ["Resettlement of a large number of people, uprooted from their countries due to war, by giving them a large cultivable land.", "Many marginal farmers in an area organize themselves into groups and synchronize and harmonize selected agricultural operations.", "Many marginal farmers in an area together make a contract with a corporate body and surrender their land to the corporate body for a fixed term.", "A company extends loans, technical knowledge and material inputs to a number of small farmers in an area so that they produce the agricultural commodity required by the company."],
        correctAnswer: 1,
        explanation: "Small Farmer Large Field (SFLF) is an agribusiness model that aims to improve the livelihood of small and marginal farmers by organizing them into groups and synchronizing their agricultural operations to achieve economies of scale."
      },
      {
        question: "Consider the following trees:\n1. Jackfruit (Artocarpus heterophyllus)\n2. Mahua (Madhuca indica)\n3. Teak (Tectona grandis)\nHow many of the above are deciduous trees?",
        options: ["Only one", "Only two", "All three", "None"],
        correctAnswer: 1,
        explanation: "Mahua and Teak are deciduous trees. Jackfruit is an evergreen tree. Therefore, only two of the above are deciduous trees."
      },
      {
        question: "With reference to the 'G20 Common Framework', consider the following statements:\n1. It is an initiative endorsed by the G20 together with the Paris Club.\n2. It is an initiative to support Low Income Countries with unsustainable debt.\nWhich of the statements given above is/are correct?",
        options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
        correctAnswer: 2,
        explanation: "The Common Framework for Debt Treatments beyond the DSSI is an initiative endorsed by the G20, together with the Paris Club, to support, in a structural manner, Low Income Countries with unsustainable debt."
      },
      {
        question: "With reference to the Indian History, Alexander Rea, A. H. Longhurst, Robert Sewell, James Burgess and Walter Elliot were associated with",
        options: ["Archaeological excavations", "Establishment of English Press in Colonial India", "Establishment of Churches in Princely States", "Construction of railways in Colonial India"],
        correctAnswer: 0,
        explanation: "These individuals were prominent figures in the field of archaeology and historical research in India during the colonial period."
      },
      {
        question: "Consider the following statements:\nStatement-I: 7th August is declared as the National Handloom Day.\nStatement-II: It was in 1905 that the Swadeshi Movement was launched on the same day.\nWhich one of the following is correct in respect of the above statements?",
        options: ["Both Statement-I and Statement-II are correct and Statement-II is the correct explanation for Statement-I", "Both Statement-I and Statement-II are correct and Statement-II is not the correct explanation for Statement-I", "Statement-I is correct but Statement-II is incorrect", "Statement-I is incorrect but Statement-II is correct"],
        correctAnswer: 0,
        explanation: "The Swadeshi Movement was launched on August 7, 1905, at the Calcutta Town Hall. To commemorate this, the Government of India declared August 7 as National Handloom Day in 2015."
      },
      {
        question: "With reference to the Indian economy, consider the following statements:\n1. If the inflation is too high, Reserve Bank of India (RBI) is likely to buy Government securities.\n2. If the rupee is rapidly depreciating, RBI is likely to sell dollars in the market.\n3. If interest rates in USA or European Union were to fall, that is likely to induce RBI to buy dollars.\nWhich of the statements given above are correct?",
        options: ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"],
        correctAnswer: 1,
        explanation: "If inflation is high, RBI sells securities to suck liquidity. If rupee depreciates, RBI sells dollars. If foreign rates fall, capital flows to India, so RBI buys dollars to prevent excessive appreciation."
      },
      {
        question: "With reference to the 'Expenditure Management Commission', consider the following statements:\n1. It was set up by the Government of India to review the institutional framework of public expenditure management.\n2. It was headed by Bimal Jalan.\nWhich of the statements given above is/are correct?",
        options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
        correctAnswer: 2,
        explanation: "The Expenditure Management Commission was indeed set up to review public expenditure and was headed by former RBI Governor Bimal Jalan."
      },
      {
        question: "Consider the following statements:\n1. The Governor of the Reserve Bank of India (RBI) is appointed by the Central Government.\n2. Certain provisions in the Constitution of India give the Central Government the right to issue directions to the RBI in public interest.\n3. The Governor of the RBI draws his power from the RBI Act.\nWhich of the above statements are correct?",
        options: ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"],
        correctAnswer: 2,
        explanation: "The Governor is appointed by the Central Government. Section 7 of the RBI Act (not the Constitution) gives the government power to issue directions. The Governor's power comes from the RBI Act."
      },
      {
        question: "With reference to casual workers in India, consider the following statements:\n1. All casual workers are entitled for Employees Provident Fund coverage.\n2. All casual workers are entitled for regular working hours and overtime payment.\n3. The government can by a notification specify that an establishment or industry shall pay wages only through its bank account.\nWhich of the above statements are correct?",
        options: ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"],
        correctAnswer: 3,
        explanation: "The Supreme Court has ruled that casual workers are entitled to EPF. They are also entitled to regular hours/overtime under labor laws. The Payment of Wages Act allows for bank account payments."
      },
      {
        question: "Which among the following steps is most likely to be taken at the time of an economic recession?",
        options: ["Cut in tax rates accompanied by increase in interest rate", "Increase in expenditure on public projects", "Increase in tax rates accompanied by reduction of interest rate", "Reduction of expenditure on public projects"],
        correctAnswer: 1,
        explanation: "Increasing public expenditure is a classic Keynesian response to recession to stimulate demand."
      },
      {
        question: "Consider the following statements:\n1. Other things remaining unchanged, market demand for a good might increase if price of its substitute increases.\n2. Other things remaining unchanged, market demand for a good might increase if price of its complement increases.\n3. The good is an inferior good and income of the consumers increases.\n4. Its price falls.\nWhich of the above statements are correct?",
        options: ["1 and 4 only", "2, 3 and 4 only", "1, 3 and 4 only", "1, 2 and 3 only"],
        correctAnswer: 0,
        explanation: "Demand increases if substitute price rises. If complement price rises, demand falls. If income rises, demand for inferior goods falls. Price fall causes increase in quantity demanded, but 'market demand' usually refers to the curve shift."
      },
      {
        question: "With reference to 'Urban Cooperative Banks' in India, consider the following statements:\n1. They are supervised and regulated by local boards set up by the State Governments.\n2. They can issue equity shares and preference shares.\n3. They were brought under the purview of the Banking Regulation Act, 1949 through an amendment in 1966.\nWhich of the statements given above is/are correct?",
        options: ["1 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"],
        correctAnswer: 1,
        explanation: "UCBs are regulated by the RBI. They can issue shares. They came under the BR Act in 1966."
      }
    ]
  },
  {
    id: 'prelims-2022-gs1',
    title: 'UPSC CSE Prelims 2022 - GS Paper 1',
    year: 2022,
    subject: 'Full Length',
    duration: 120,
    questions: [
      {
        question: "With reference to the Indian economy, consider the following statements:\n1. An increase in Nominal Effective Exchange Rate (NEER) indicates the appreciation of rupee.\n2. An increase in the Real Effective Exchange Rate (REER) indicates an improvement in trade competitiveness.\n3. An increasing trend in domestic inflation relative to inflation in other countries is likely to cause an increasing divergence between NEER and REER.\nWhich of the above statements are correct?",
        options: ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"],
        correctAnswer: 2,
        explanation: "An increase in NEER means appreciation. An increase in REER indicates a loss in trade competitiveness. Inflation causes divergence."
      },
      {
        question: "Which one of the following lakes of West Africa has become dry and turned into a desert?",
        options: ["Lake Victoria", "Lake Faguibine", "Lake Oguta", "Lake Volta"],
        correctAnswer: 1,
        explanation: "Lake Faguibine in Mali has experienced significant drying since the 1970s."
      },
      {
        question: "Consider the following pairs:\nPeak : Mountains\n1. Namcha Barwa : Garhwal Himalaya\n2. Nanda Devi : Kumaon Himalaya\n3. Nokrek : Sikkim Himalaya\nWhich of the pairs given above is/are correctly matched?",
        options: ["1 and 2", "2 only", "1 and 3", "3 only"],
        correctAnswer: 1,
        explanation: "Nanda Devi is in the Kumaon Himalayas. Namcha Barwa is in the Eastern Himalayas. Nokrek is in the Garo Hills."
      },
      {
        question: "The term 'Levant' often heard in the news, roughly corresponds to which of the following regions?",
        options: ["Region along the eastern Mediterranean shores", "Region along North African shores stretching from Egypt to Morocco", "Region along Persian Gulf and Horn of Africa", "Region along Mediterranean Sea and Black Sea"],
        correctAnswer: 0,
        explanation: "The Levant refers to a large area in the Eastern Mediterranean region of Western Asia."
      },
      {
        question: "With reference to the 'Tea Board' in India, consider the following statements:\n1. The Tea Board is a statutory body.\n2. It is a regulatory body attached to the Ministry of Agriculture and Farmers Welfare.\n3. The Tea Board's Head Office is situated in Bengaluru.\n4. The Board has overseas offices at Dubai and Moscow.\nWhich of the statements given above are correct?",
        options: ["1 and 3", "2 and 4", "3 and 4", "1 and 4"],
        correctAnswer: 3,
        explanation: "Tea Board is a statutory body under the Ministry of Commerce and Industry. Its head office is in Kolkata. It has overseas offices in Dubai and Moscow."
      }
    ]
  },
  {
    id: 'history-pyq-special',
    title: 'UPSC PYQ Special - History & Culture',
    year: 'Mixed',
    subject: 'History',
    duration: 60,
    questions: [
      {
        question: "With reference to the history of ancient India, Bhavabhuti, Hastimalla and Kshemeshvara were famous",
        options: ["Jain monks", "playwrights", "temple architects", "philosophers"],
        correctAnswer: 1,
        explanation: "Bhavabhuti, Hastimalla, and Kshemeshvara were all famous playwrights of ancient India."
      },
      {
        question: "With reference to the history of India, the terms 'kulyavapa' and 'dronavapa' denote",
        options: ["measurement of land", "coins of different denominations", "classification of urban areas", "religious rituals"],
        correctAnswer: 0,
        explanation: "In the Gupta period, terms like 'kulyavapa' and 'dronavapa' were used for the measurement of land."
      },
      {
        question: "Which one of the following is not a Harappan site?",
        options: ["Chanhudaro", "Kot Diji", "Sohgaura", "Desalpur"],
        correctAnswer: 2,
        explanation: "Sohgaura is a Mauryan site (known for the copper plate inscription), not a Harappan site."
      },
      {
        question: "With reference to the cultural history of India, consider the following statements:\n1. Most of the Tyagaraja Kritis are devotional songs in praise of Lord Krishna.\n2. Tyagaraja created several new ragas.\n3. Annamacharya and Tyagaraja are contemporaries.\n4. Annamacharya kirtanas are devotional songs in praise of Lord Venkateshwara.\nWhich of the statements given above are correct?",
        options: ["1, 2 and 3", "2 and 4 only", "1, 3 and 4", "2, 3 and 4"],
        correctAnswer: 1,
        explanation: "Tyagaraja kritis are mostly in praise of Lord Rama. He created many new ragas. Annamacharya lived in the 15th century, while Tyagaraja lived in the 18th-19th century, so they were not contemporaries."
      },
      {
        question: "Consider the following pairs:\n1. Bhilsa : Madhya Pradesh\n2. Dwarasamudra : Maharashtra\n3. Girnagar : Gujarat\n4. Sthanveshvara : Uttar Pradesh\nWhich of the pairs given above are correctly matched?",
        options: ["1 and 3 only", "1 and 4 only", "2 and 3 only", "2 and 4 only"],
        correctAnswer: 0,
        explanation: "Bhilsa (Vidisha) is in MP. Dwarasamudra (Halebidu) is in Karnataka. Girnagar is in Gujarat. Sthanveshvara (Thanesar) is in Haryana."
      }
    ]
  },
  {
    id: 'polity-pyq-special',
    title: 'UPSC PYQ Special - Indian Polity',
    year: 'Mixed',
    subject: 'Polity',
    duration: 60,
    questions: [
      {
        question: "Consider the following statements:\n1. In India, prisons are managed by State Governments with their own rules and regulations.\n2. In India, prisons are governed by the Prisons Act, 1894 which expressly kept the subject of prisons in the control of Provincial Governments.\nWhich of the statements given above is/are correct?",
        options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
        correctAnswer: 2,
        explanation: "Prisons and their administration is a State subject. The management falls exclusively in the domain of the State Governments, governed by the Prisons Act, 1894."
      },
      {
        question: "With reference to the 'Gram Nyayalayas Act', which of the following statements is/are correct?\n1. As per the Act, Gram Nyayalayas can hear only civil cases and not criminal cases.\n2. The Act allows local social activists as mediators/reconciliators.\nSelect the correct answer using the code given below:",
        options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
        correctAnswer: 1,
        explanation: "Gram Nyayalayas can hear both civil and criminal cases. The Act allows for mediators."
      },
      {
        question: "In India, which one of the following is responsible for maintaining price stability by controlling inflation?",
        options: ["Department of Consumer Affairs", "Expenditure Management Commission", "Financial Stability and Development Council", "Reserve Bank of India"],
        correctAnswer: 3,
        explanation: "The Reserve Bank of India (RBI) is vested with the responsibility of conducting monetary policy to maintain price stability."
      },
      {
        question: "Consider the following statements:\n1. The Constitution of India defines its ‘basic structure’ in terms of federalism, secularism, fundamental rights and democracy.\n2. The Constitution of India provides for ‘judicial review’ to safeguard the citizens’ liberties and to preserve the ideals on which the Constitution is based.\nWhich of the statements given above is/are correct?",
        options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
        correctAnswer: 3,
        explanation: "The Constitution does not define 'basic structure'; it's a judicial innovation. Judicial review is also not explicitly mentioned as a term, though articles like 13, 32, 226 provide for it."
      }
    ]
  },
  {
    id: 'geography-pyq-special',
    title: 'UPSC PYQ Special - Geography',
    year: 'Mixed',
    subject: 'Geography',
    duration: 60,
    questions: [
      {
        question: "Which one of the following lakes of West Africa has become dry and turned into a desert?",
        options: ["Lake Victoria", "Lake Faguibine", "Lake Oguta", "Lake Volta"],
        correctAnswer: 1,
        explanation: "Lake Faguibine in Mali has experienced significant drying since the 1970s."
      },
      {
        question: "Consider the following pairs:\nPeak : Mountains\n1. Namcha Barwa : Garhwal Himalaya\n2. Nanda Devi : Kumaon Himalaya\n3. Nokrek : Sikkim Himalaya\nWhich of the pairs given above is/are correctly matched?",
        options: ["1 and 2", "2 only", "1 and 3", "3 only"],
        correctAnswer: 1,
        explanation: "Nanda Devi is in the Kumaon Himalayas. Namcha Barwa is in the Eastern Himalayas. Nokrek is in the Garo Hills."
      },
      {
        question: "The term 'Levant' often heard in the news, roughly corresponds to which of the following regions?",
        options: ["Region along the eastern Mediterranean shores", "Region along North African shores stretching from Egypt to Morocco", "Region along Persian Gulf and Horn of Africa", "Region along Mediterranean Sea and Black Sea"],
        correctAnswer: 0,
        explanation: "The Levant refers to a large area in the Eastern Mediterranean region of Western Asia."
      },
      {
        question: "Which of the following is geographically closest to Great Nicobar?",
        options: ["Sumatra", "Borneo", "Java", "Sri Lanka"],
        correctAnswer: 0,
        explanation: "Sumatra (Indonesia) is geographically closest to Great Nicobar Island."
      },
      {
        question: "Which one of the following is an artificial lake?",
        options: ["Kodaikanal (Tamil Nadu)", "Kolleru (Andhra Pradesh)", "Nainital (Uttarakhand)", "Renuka (Himachal Pradesh)"],
        correctAnswer: 0,
        explanation: "Kodaikanal Lake is a man-made lake in Tamil Nadu."
      }
    ]
  },
  {
    id: 'economy-pyq-special',
    title: 'UPSC PYQ Special - Indian Economy',
    year: 'Mixed',
    subject: 'Economy',
    duration: 60,
    questions: [
      {
        question: "With reference to the Indian economy, consider the following statements:\n1. An increase in Nominal Effective Exchange Rate (NEER) indicates the appreciation of rupee.\n2. An increase in the Real Effective Exchange Rate (REER) indicates an improvement in trade competitiveness.\n3. An increasing trend in domestic inflation relative to inflation in other countries is likely to cause an increasing divergence between NEER and REER.\nWhich of the above statements are correct?",
        options: ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"],
        correctAnswer: 2,
        explanation: "An increase in NEER means appreciation. An increase in REER indicates a loss in trade competitiveness. Inflation causes divergence."
      },
      {
        question: "With reference to the 'G20 Common Framework', consider the following statements:\n1. It is an initiative endorsed by the G20 together with the Paris Club.\n2. It is an initiative to support Low Income Countries with unsustainable debt.\nWhich of the statements given above is/are correct?",
        options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
        correctAnswer: 2,
        explanation: "The Common Framework is an initiative to support Low Income Countries with unsustainable debt."
      },
      {
        question: "In India, which one of the following is responsible for maintaining price stability by controlling inflation?",
        options: ["Department of Consumer Affairs", "Expenditure Management Commission", "Financial Stability and Development Council", "Reserve Bank of India"],
        correctAnswer: 3,
        explanation: "The RBI is responsible for maintaining price stability."
      }
    ]
  },
  {
    id: 'environment-pyq-special',
    title: 'UPSC PYQ Special - Environment',
    year: 'Mixed',
    subject: 'Environment',
    duration: 60,
    questions: [
      {
        question: "Consider the following statements regarding 'Invasive Species Specialist Group' (ISSG):\n1. It belongs to the International Union for Conservation of Nature (IUCN).\n2. It developed the Global Invasive Species Database.\nWhich of the statements given above is/are correct?",
        options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
        correctAnswer: 2,
        explanation: "ISSG is under IUCN and developed the GISD."
      },
      {
        question: "Consider the following trees:\n1. Jackfruit (Artocarpus heterophyllus)\n2. Mahua (Madhuca indica)\n3. Teak (Tectona grandis)\nHow many of the above are deciduous trees?",
        options: ["Only one", "Only two", "All three", "None"],
        correctAnswer: 1,
        explanation: "Mahua and Teak are deciduous. Jackfruit is evergreen."
      },
      {
        question: "Which one of the following regions of India has a combination of mangrove forest, evergreen forest and deciduous forest?",
        options: ["North Coastal Andhra Pradesh", "South West Bengal", "Southern Saurashtra", "Andaman and Nicobar Islands"],
        correctAnswer: 3,
        explanation: "Andaman and Nicobar Islands have all three types of forests."
      },
      {
        question: "Consider the following statements:\n1. Asiatic lion is naturally found in India only.\n2. Double-humped camel is naturally found in India only.\n3. One-horned rhinoceros is naturally found in India only.\nWhich of the statements given above is/are correct?",
        options: ["1 only", "2 only", "1 and 3 only", "1, 2 and 3"],
        correctAnswer: 0,
        explanation: "Asiatic lions are only in India. Others are found elsewhere too."
      },
      {
        question: "In the context of India's preparation for Climate Change, consider the following statements:\n1. 'National Adaptation Fund for Climate Change' was established in 2015-16.\n2. The fund is meant to assist State and Union Territories that are particularly vulnerable to the adverse effects of climate change.\nWhich of the statements given above is/are correct?",
        options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
        correctAnswer: 2,
        explanation: "NAFCC was established in 2015-16 to support adaptation activities in vulnerable states."
      },
      {
        question: "Which of the following are the reasons/factors for exposure to benzene pollution?\n1. Automobile exhaust\n2. Tobacco smoke\n3. Wood burning\n4. Using varnished wooden furniture\n5. Using products made of polyurethane\nSelect the correct answer using the code given below:",
        options: ["1, 2 and 3 only", "2, 4 and 5 only", "1, 3 and 4 only", "1, 2, 3, 4 and 5"],
        correctAnswer: 3,
        explanation: "All the listed sources contribute to benzene pollution."
      },
      {
        question: "In the context of which one of the following are the terms 'pyrolysis and plasma gasification' mentioned?",
        options: ["Extraction of rare earth elements", "Natural gas extraction technologies", "Hydrogen fuel based automobiles", "Waste-to-energy technologies"],
        correctAnswer: 3,
        explanation: "Pyrolysis and plasma gasification are advanced waste-to-energy technologies."
      },
      {
        question: "Which of the following statements are correct about the deposits of 'methane hydrate'?\n1. Global warming might trigger the release of methane gas from these deposits.\n2. Large deposits of 'methane hydrate' are found in Arctic Tundra and under the seafloor.\n3. Methane in atmosphere oxidizes to carbon dioxide after a decade or two.\nSelect the correct answer using the code given below:",
        options: ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"],
        correctAnswer: 3,
        explanation: "All statements are correct regarding methane hydrate."
      },
      {
        question: "According to the Wildlife (Protection) Act, 1972, which of the following animals cannot be hunted by any person except under some provisions provided by law?\n1. Gharial\n2. Indian wild ass\n3. Wild buffalo\nSelect the correct answer using the code given below:",
        options: ["1 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"],
        correctAnswer: 3,
        explanation: "All three are protected under Schedule I of the Act."
      },
      {
        question: "If a particular plant species is placed under Schedule VI of the Wildlife Protection Act, 1972, what is the implication?",
        options: ["A licence is required to cultivate that plant.", "Such a plant cannot be cultivated under any circumstances.", "It is a Genetically Modified crop plant.", "Such a plant is invasive and harmful to the ecosystem."],
        correctAnswer: 0,
        explanation: "Schedule VI was added to include plants whose cultivation/trade requires a license."
      }
    ]
  },
  {
    id: 'bpsc-pyq-2023',
    title: '69th BPSC Prelims 2023',
    year: 2023,
    subject: 'State PSC',
    duration: 120,
    questions: [
      {
        question: "Which of the following was the first capital of the Magadha Empire?",
        options: ["Pataliputra", "Rajgriha", "Vaishali", "Champa"],
        correctAnswer: 1,
        explanation: "Rajgriha (Girivraja) was the first capital of Magadha."
      },
      {
        question: "Who among the following was the founder of the 'Vikramshila University'?",
        options: ["Gopala", "Dharmapala", "Devapala", "Mahipala"],
        correctAnswer: 1,
        explanation: "Dharmapala, the Pala king, founded Vikramshila University."
      },
      {
        question: "In which year was the Bihar State formed?",
        options: ["1911", "1912", "1936", "1947"],
        correctAnswer: 1,
        explanation: "Bihar was separated from Bengal in 1912."
      },
      {
        question: "Who led the 1857 revolt in Bihar?",
        options: ["Nana Saheb", "Kunwar Singh", "Tatya Tope", "Maulvi Ahmadullah"],
        correctAnswer: 1,
        explanation: "Kunwar Singh of Jagdishpur led the revolt in Bihar."
      },
      {
        question: "Which river is known as the 'Sorrow of Bihar'?",
        options: ["Ganga", "Son", "Kosi", "Gandak"],
        correctAnswer: 2,
        explanation: "Kosi river is known for its frequent course changes and flooding."
      }
    ]
  },
  {
    id: 'uppcs-pyq-2023',
    title: 'UPPCS Prelims 2023',
    year: 2023,
    subject: 'State PSC',
    duration: 120,
    questions: [
      {
        question: "Which of the following is the largest sugar producing state in India (2022-23)?",
        options: ["Maharashtra", "Uttar Pradesh", "Karnataka", "Tamil Nadu"],
        correctAnswer: 1,
        explanation: "Uttar Pradesh is currently the leading sugar producer."
      },
      {
        question: "The 'Panchayati Raj' system was first inaugurated in which district of Uttar Pradesh?",
        options: ["Lucknow", "Ballia", "Etawah", "Saharanpur"],
        correctAnswer: 2,
        explanation: "The Etawah Pilot Project was a precursor to Panchayati Raj."
      },
      {
        question: "Which city is known as the 'Brass City' of Uttar Pradesh?",
        options: ["Aligarh", "Moradabad", "Firozabad", "Khurja"],
        correctAnswer: 1,
        explanation: "Moradabad is famous for its brass handicrafts."
      }
    ]
  }
];

import { UserProfile } from '../types';
import { Link } from 'react-router-dom';

export default function PYQTestSeries({ user, userProfile }: { user: User | null, userProfile: UserProfile | null }) {
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [questionLimit, setQuestionLimit] = useState(10);
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('All');

  const subjects = ['All', 'Full Length', 'History', 'Polity', 'Geography', 'Economy', 'Environment', 'State PSC'];

  const filteredTests = pyqTests.filter(test => 
    selectedSubject === 'All' || test.subject === selectedSubject
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isStarted && !isFinished) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [isStarted, isFinished, timeLeft]);

  const handleSetup = (test: any) => {
    setSelectedTest(test);
    setIsSetup(true);
    // Default to 10 or max available
    setQuestionLimit(Math.min(test.questions.length, 10));
  };

  const handleStart = () => {
    // Shuffle and pick questions
    const shuffled = [...selectedTest.questions].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, questionLimit);
    
    // Proportional timing: if full test (100 questions) is 120 mins, then X questions is (120/100)*X
    // Since our sample data has fewer questions, we'll use a base of 1.2 mins per question
    const duration = Math.ceil(questionLimit * 1.2);
    
    setActiveQuestions(picked);
    setAnswers(new Array(picked.length).fill(null));
    setTimeLeft(duration * 60);
    setCurrentIdx(0);
    setIsStarted(true);
    setIsFinished(false);
    setIsSetup(false);
  };

  const handleAnswer = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optionIdx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsFinished(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[2.5rem] border border-zinc-200 shadow-sm max-w-lg mx-auto"
        >
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-100">
            <Lock className="w-10 h-10 text-zinc-400" />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 mb-4 tracking-tight">Authentication Required</h2>
          <p className="text-zinc-500 mb-8">
            Please login to access the timed PYQ Test Series and track your performance.
          </p>
        </motion.div>
      </div>
    );
  }

  if (!userProfile?.isPremium) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[2.5rem] border border-zinc-200 shadow-xl max-w-lg mx-auto"
        >
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-100">
            <Lock className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 mb-4 tracking-tight">Premium Required</h2>
          <p className="text-zinc-500 mb-8">
            The PYQ Test Series is a premium feature. Please upgrade to a Premium plan to practice with official UPSC questions in a timed environment.
          </p>
          <Link
            to="/payment"
            className="inline-block px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Upgrade to Premium
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <AnimatePresence mode="wait">
        {!isStarted && !isSetup ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-zinc-900 tracking-tight">PYQ Test Series</h2>
                  <p className="text-zinc-500">Practice last 10 years of UPSC Prelims questions.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      selectedSubject === sub
                        ? 'bg-zinc-900 text-white shadow-lg'
                        : 'bg-white text-zinc-400 border border-zinc-100 hover:border-zinc-300'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTests.map((test) => (
                <div key={test.id} className="bg-white p-8 rounded-[2rem] border border-zinc-200 shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-zinc-900 leading-tight">{test.title}</h3>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">{test.year}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs font-bold text-zinc-400 mb-8">
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {test.duration} mins</span>
                    <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> {test.questions.length} Questions</span>
                    <span className="px-2 py-0.5 bg-zinc-100 rounded text-[9px] uppercase tracking-tighter">{test.subject}</span>
                  </div>
                  <button
                    onClick={() => handleSetup(test)}
                    className="mt-auto w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-100"
                  >
                    <Play className="w-5 h-5" />
                    <span>Select & Start</span>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ) : isSetup ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[2.5rem] border border-zinc-200 shadow-xl max-w-lg mx-auto"
          >
            <h2 className="text-2xl font-black text-zinc-900 mb-2">Test Configuration</h2>
            <p className="text-zinc-500 mb-8">{selectedTest.title}</p>

            <div className="space-y-6 mb-10">
              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Number of Questions</label>
                <div className="grid grid-cols-3 gap-3">
                  {[5, 10, 20, 50, 100].map((num) => (
                    <button
                      key={num}
                      disabled={num > selectedTest.questions.length}
                      onClick={() => setQuestionLimit(num)}
                      className={`py-3 rounded-xl font-black text-sm border-2 transition-all ${
                        questionLimit === num
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                          : 'bg-white border-zinc-100 text-zinc-400 hover:border-indigo-200 disabled:opacity-20'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="flex justify-between items-center text-indigo-900">
                  <span className="text-sm font-bold">Estimated Duration:</span>
                  <span className="text-lg font-black">{Math.ceil(questionLimit * 1.2)} mins</span>
                </div>
                <p className="text-[10px] text-indigo-600 mt-1 font-bold uppercase tracking-wider">Based on UPSC standard timing</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setIsSetup(false)}
                className="flex-1 py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-black hover:bg-zinc-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleStart}
                className="flex-2 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Start Test
              </button>
            </div>
          </motion.div>
        ) : isFinished ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[2.5rem] border border-zinc-200 shadow-xl"
          >
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-6">
                <Award className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Test Completed!</h2>
              <p className="text-xl text-zinc-500 mt-2 font-medium">
                You scored <span className="text-indigo-600 font-black">{answers.reduce((acc, ans, idx) => ans === activeQuestions[idx].correctAnswer ? acc + 1 : acc, 0)}</span> out of <span className="font-black">{activeQuestions.length}</span>
              </p>
            </div>

            <div className="space-y-8">
              {activeQuestions.map((q: any, idx: number) => (
                <div key={idx} className="p-8 rounded-[2rem] border border-zinc-100 bg-zinc-50/50">
                  <p className="font-black text-zinc-900 text-lg mb-6 leading-tight">{idx + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 gap-3">
                    {q.options.map((opt: string, oIdx: number) => (
                      <div
                        key={oIdx}
                        className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                          oIdx === q.correctAnswer
                            ? 'bg-green-50 border-green-200 text-green-900 font-bold'
                            : answers[idx] === oIdx
                            ? 'bg-red-50 border-red-200 text-red-900 font-bold'
                            : 'bg-white border-zinc-100 text-zinc-500'
                        }`}
                      >
                        <span>{opt}</span>
                        {oIdx === q.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                        {answers[idx] === oIdx && oIdx !== q.correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-6 bg-white rounded-2xl text-sm text-zinc-600 border border-zinc-100 shadow-sm">
                    <span className="font-black text-indigo-600 uppercase tracking-widest text-[10px] block mb-2">Detailed Explanation</span>
                    {q.explanation}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsStarted(false)}
              className="w-full mt-12 py-5 bg-zinc-900 text-white rounded-[1.5rem] font-black text-lg hover:bg-zinc-800 transition-all shadow-xl"
            >
              Back to Test Series
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="test"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[2.5rem] border border-zinc-200 shadow-xl"
          >
            <div className="flex justify-between items-center mb-10 bg-zinc-50 p-6 rounded-[1.5rem] border border-zinc-100">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Progress</span>
                <span className="text-xl font-black text-zinc-900">
                  Question {currentIdx + 1} <span className="text-zinc-300">/</span> {activeQuestions.length}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-red-600 font-black bg-white px-6 py-3 rounded-2xl border border-red-100 shadow-sm">
                <Clock className="w-6 h-6" />
                <span className="text-2xl tracking-tighter tabular-nums">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <h3 className="text-2xl font-black text-zinc-900 mb-10 leading-tight whitespace-pre-wrap">
              {activeQuestions[currentIdx].question}
            </h3>

            <div className="space-y-4">
              {activeQuestions[currentIdx].options.map((opt: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full p-5 rounded-[1.5rem] border-2 text-left transition-all flex items-center justify-between group ${
                    answers[currentIdx] === idx
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100'
                      : 'bg-white border-zinc-100 text-zinc-700 hover:border-indigo-600 hover:bg-indigo-50/50'
                  }`}
                >
                  <span className="font-bold text-lg">{opt}</span>
                  <ChevronRight className={`w-6 h-6 transition-transform ${answers[currentIdx] === idx ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-12 pt-8 border-t border-zinc-100">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(currentIdx - 1)}
                className="px-8 py-4 text-zinc-400 font-black hover:text-zinc-900 disabled:opacity-20 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                {currentIdx === activeQuestions.length - 1 ? 'Finish Test' : 'Next Question'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
