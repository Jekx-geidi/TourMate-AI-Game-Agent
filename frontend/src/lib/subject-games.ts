import type { MatchPair } from '../components/games/MatchingGame';
import type { Scenario } from '../components/games/ScenarioGame';

export type SignatureGame =
  | {
      type: 'scenario';
      title: string;
      description: string;
      role: string;
      scenarios: Scenario[];
    }
  | {
      type: 'sequence';
      title: string;
      description: string;
      prompt: string;
      steps: string[];
    };

export type SubjectGameConfig = {
  signature: SignatureGame;
  matchTitle: string;
  matchDescription: string;
  matchPairs: MatchPair[];
  agentName: string;
  agentIntro: string;
  agentSuggestions: string[];
};

export const SUBJECT_GAMES: Record<string, SubjectGameConfig> = {
  TMEL03: {
    signature: {
      type: 'scenario',
      title: 'Eco Guardian Challenge',
      description:
        'You are a tour operator in a fragile island destination. Make the most sustainable choice in each situation and earn Eco Points.',
      role: 'Sustainable Tour Operator',
      scenarios: [
        {
          situation:
            'A group wants to visit a coral reef. The cheapest boat operator anchors directly on the reef, while a certified operator uses mooring buoys but costs 20% more.',
          options: [
            {
              text: 'Choose the certified operator with mooring buoys and explain the value to guests.',
              feedback: 'Protecting the reef protects the destination — and guests value responsible choices.',
              points: 10,
            },
            {
              text: 'Choose the cheaper operator to keep the tour price low.',
              feedback: 'Anchor damage destroys the very attraction tourists come to see.',
              points: 2,
            },
            {
              text: 'Skip the reef visit entirely without offering alternatives.',
              feedback: 'Well-managed visits can fund conservation — avoidance helps no one.',
              points: 5,
            },
          ],
        },
        {
          situation:
            'Your hiking tour passes through a village. Guests want souvenirs. What do you recommend?',
          options: [
            {
              text: 'Buy handicrafts made by local artisans at fair prices.',
              feedback: 'Local purchases keep tourism income in the community.',
              points: 10,
            },
            {
              text: 'Point guests to the imported souvenir shop at the airport.',
              feedback: 'Imported souvenirs leak tourism money out of the local economy.',
              points: 2,
            },
            {
              text: 'Tell guests souvenirs are a waste of money.',
              feedback: 'Respect guest choices — guide them toward purchases that benefit locals.',
              points: 5,
            },
          ],
        },
        {
          situation:
            'A popular waterfall trail is showing erosion from heavy foot traffic. Bookings keep rising.',
          options: [
            {
              text: 'Introduce daily visitor limits and alternate routes to spread the impact.',
              feedback: 'Carrying capacity management is a core principle of sustainable tourism.',
              points: 10,
            },
            {
              text: 'Keep selling unlimited tickets while demand is high.',
              feedback: 'Overtourism destroys attractions and future income.',
              points: 2,
            },
            {
              text: 'Raise prices sharply so only wealthy tourists visit.',
              feedback: 'Pricing can help, but limits and route management protect the site more fairly.',
              points: 5,
            },
          ],
        },
        {
          situation:
            'Guests on your ecotour want to feed wild monkeys to get better photos.',
          options: [
            {
              text: 'Politely explain why feeding wildlife is harmful and offer a guided observation spot instead.',
              feedback: 'Education plus an alternative keeps guests happy and wildlife safe.',
              points: 10,
            },
            {
              text: 'Allow it once since it makes guests happy.',
              feedback: 'Feeding changes animal behavior and can create dangerous encounters.',
              points: 2,
            },
            {
              text: 'Strictly scold the guests in front of the group.',
              feedback: 'The instinct is right, but hospitable guidance works better than shaming.',
              points: 5,
            },
          ],
        },
        {
          situation:
            'You are designing a new tour package. Which transport plan is most responsible?',
          options: [
            {
              text: 'Group guests into one modern van and include a walking segment in town.',
              feedback: 'Shared transport and walking cut emissions and enrich the experience.',
              points: 10,
            },
            {
              text: 'Offer each couple a private car for comfort.',
              feedback: 'Multiple vehicles multiply emissions for the same route.',
              points: 3,
            },
            {
              text: 'Use the oldest cheap bus available to save money.',
              feedback: 'Cost matters, but old vehicles often pollute far more.',
              points: 5,
            },
          ],
        },
      ],
    },
    matchTitle: 'Sustainability Term Match',
    matchDescription: 'Match each sustainable tourism concept with its meaning.',
    matchPairs: [
      { left: 'Ecotourism', right: 'Responsible travel to natural areas that conserves the environment' },
      { left: 'Carrying capacity', right: 'Maximum visitors a site can handle without damage' },
      { left: 'Overtourism', right: 'Too many visitors harming a destination and local life' },
      { left: 'Carbon footprint', right: 'Total greenhouse gases produced by travel activities' },
      { left: 'Community-based tourism', right: 'Tourism owned and managed by local residents' },
      { left: 'Greenwashing', right: 'Falsely marketing a product as environmentally friendly' },
    ],
    agentName: 'Eco Agent',
    agentIntro:
      'Hi! I am your TMEL03 Eco Agent — ask me anything about sustainable tourism, ecotourism, responsible travel, or destination development!',
    agentSuggestions: [
      'What is the difference between ecotourism and sustainable tourism?',
      'Give me a real example of overtourism and how it was solved.',
      'How can a small resort become more sustainable?',
      'Quiz me on responsible travel principles!',
    ],
  },
  NMICE: {
    signature: {
      type: 'sequence',
      title: 'Event Planner Pro',
      description:
        'A client hired you to organize a national tourism conference. Arrange the event planning steps in the correct professional order.',
      prompt: 'Click the steps in the order a professional event planner would do them.',
      steps: [
        'Define the event objectives and target audience',
        'Set the overall budget',
        'Select the date and book the venue',
        'Arrange speakers, suppliers, and catering',
        'Open registration and promote the event',
        'Run the event-day operations and coordination',
        'Evaluate the event and report the results',
      ],
    },
    matchTitle: 'MICE Term Match',
    matchDescription: 'Match each MICE industry term with its meaning.',
    matchPairs: [
      { left: 'MICE', right: 'Meetings, Incentives, Conferences, and Exhibitions' },
      { left: 'Incentive travel', right: 'Reward trips companies give to top-performing employees' },
      { left: 'Exhibition', right: 'Event where companies display products to buyers and visitors' },
      { left: 'Venue', right: 'The location or facility where an event is held' },
      { left: 'Delegate', right: 'A registered participant attending a conference' },
      { left: 'Post-event evaluation', right: 'Measuring event success against its objectives' },
    ],
    agentName: 'Events Agent',
    agentIntro:
      'Hello! I am your NMICE Events Agent — ask me about meetings, incentives, conferences, exhibitions, venue selection, or event planning!',
    agentSuggestions: [
      'Explain the 4 parts of MICE with examples.',
      'What should I check when selecting a venue?',
      'How do you evaluate if an event was successful?',
      'Quiz me on event planning steps!',
    ],
  },
  AIRMGT: {
    signature: {
      type: 'scenario',
      title: 'Airport Operations Rush',
      description:
        'You are the duty manager at a busy international airport. Handle each passenger situation like a pro and earn Service Points.',
      role: 'Airport Duty Manager',
      scenarios: [
        {
          situation:
            'A flight is delayed by 4 hours due to weather. Passengers at the gate are getting angry and crowding your desk.',
          options: [
            {
              text: 'Make clear announcements, apologize, provide meal vouchers, and give regular updates.',
              feedback: 'Communication plus care — exactly how airlines protect trust during delays.',
              points: 10,
            },
            {
              text: 'Avoid the crowd until the new departure time is confirmed.',
              feedback: 'Silence makes anxious passengers angrier and escalates complaints.',
              points: 2,
            },
            {
              text: 'Announce the delay once and tell passengers to wait quietly.',
              feedback: 'One announcement is not enough — regular updates calm the crowd.',
              points: 5,
            },
          ],
        },
        {
          situation:
            'A passenger arrives at check-in 20 minutes before an international departure. The counter is officially closed.',
          options: [
            {
              text: 'Explain the cutoff rule with empathy and immediately rebook them on the next flight.',
              feedback: 'Rules protect safety and schedules; empathy plus a solution protects the relationship.',
              points: 10,
            },
            {
              text: 'Sneak them through and hope security and boarding go fast.',
              feedback: 'Breaking cutoff rules risks delaying the whole flight and violating safety procedures.',
              points: 2,
            },
            {
              text: 'Simply say "the counter is closed" and walk away.',
              feedback: 'Correct rule, poor service — always offer the next option.',
              points: 4,
            },
          ],
        },
        {
          situation:
            "A passenger's checked bag did not arrive on the carousel. She is in tears — her medicines are inside.",
          options: [
            {
              text: 'File a Property Irregularity Report, trace the bag, and help her contact a pharmacy for urgent needs.',
              feedback: 'The PIR starts the official trace, and helping with medicine shows real care.',
              points: 10,
            },
            {
              text: 'Tell her lost bags usually show up and send her home.',
              feedback: 'Without a PIR there is no official trace — never skip the report.',
              points: 2,
            },
            {
              text: 'File the report but tell her the medicine problem is not your job.',
              feedback: 'Process done, but hospitality means helping with the human need too.',
              points: 5,
            },
          ],
        },
        {
          situation:
            'The flight is overbooked by 3 seats. Boarding starts in 45 minutes.',
          options: [
            {
              text: 'Ask for volunteers first, offering compensation and rebooking on the next flight.',
              feedback: 'Voluntary offloading with fair compensation is standard industry practice.',
              points: 10,
            },
            {
              text: 'Deny boarding to the last 3 passengers who checked in without explanation.',
              feedback: 'Involuntary denied boarding without communication creates complaints and penalties.',
              points: 2,
            },
            {
              text: 'Upgrade 3 random passengers to business class without checking status.',
              feedback: 'Creative, but upgrades follow priority rules — frequent flyers and fare class first.',
              points: 5,
            },
          ],
        },
        {
          situation:
            'During boarding, a passenger refuses to stow a large bag that clearly will not fit in the cabin.',
          options: [
            {
              text: 'Calmly explain the safety rule and offer to gate-check the bag for free.',
              feedback: 'Safety rules plus a friendly solution — smooth boarding continues.',
              points: 10,
            },
            {
              text: 'Let the passenger keep it to avoid a scene.',
              feedback: 'Unsecured cabin baggage is a genuine safety hazard.',
              points: 2,
            },
            {
              text: 'Call security immediately.',
              feedback: 'Escalate only after calm explanation fails.',
              points: 4,
            },
          ],
        },
      ],
    },
    matchTitle: 'Airport & Airline Code Match',
    matchDescription: 'Match each IATA airport code with the right airport.',
    matchPairs: [
      { left: 'MNL', right: 'Ninoy Aquino International Airport, Manila' },
      { left: 'SIN', right: 'Changi Airport, Singapore' },
      { left: 'HND', right: 'Haneda Airport, Tokyo' },
      { left: 'ICN', right: 'Incheon International Airport, Seoul' },
      { left: 'DXB', right: 'Dubai International Airport' },
      { left: 'LHR', right: 'Heathrow Airport, London' },
    ],
    agentName: 'Aviation Agent',
    agentIntro:
      'Welcome aboard! I am your AIRMGT Aviation Agent — ask me about airline operations, ticketing, passenger handling, ground services, or aviation safety!',
    agentSuggestions: [
      'What happens during aircraft turnaround?',
      'Explain the difference between IATA and ICAO codes.',
      'How do airlines handle overbooking?',
      'Quiz me on airport operations!',
    ],
  },
  TMEL04: {
    signature: {
      type: 'scenario',
      title: 'Heritage Hunter',
      description:
        'You are a cultural tourism consultant. Protect heritage while creating amazing visitor experiences and earn Heritage Points.',
      role: 'Cultural Tourism Consultant',
      scenarios: [
        {
          situation:
            'A centuries-old church wants more visitors but worries about damage to its fragile frescoes.',
          options: [
            {
              text: 'Create timed-entry tours with trained guides and a small conservation fee.',
              feedback: 'Managed access funds preservation while sharing the heritage.',
              points: 10,
            },
            {
              text: 'Open the doors freely to maximize visitor numbers.',
              feedback: 'Uncontrolled crowds, humidity, and flash photos destroy frescoes.',
              points: 2,
            },
            {
              text: 'Close the church to tourists permanently.',
              feedback: 'Heritage locked away loses public support and funding.',
              points: 5,
            },
          ],
        },
        {
          situation:
            'A town wants to attract younger tourists to its traditional weaving village.',
          options: [
            {
              text: 'Launch hands-on weaving workshops and short-form video storytelling with the artisans.',
              feedback: 'Living heritage plus travel technology — perfect tourism innovation.',
              points: 10,
            },
            {
              text: 'Replace the workshop with a modern souvenir mall.',
              feedback: 'That erases the authentic culture visitors come for.',
              points: 2,
            },
            {
              text: 'Print more brochures about the village history.',
              feedback: 'Brochures alone rarely reach or excite younger travelers.',
              points: 4,
            },
          ],
        },
        {
          situation:
            'Tourists want photos inside a sacred indigenous ritual site.',
          options: [
            {
              text: 'Follow the community’s rules — allow photos only where elders permit, and explain why.',
              feedback: 'Communities decide how their culture is shared. That is ethical cultural tourism.',
              points: 10,
            },
            {
              text: 'Allow all photos — tourists paid for the experience.',
              feedback: 'Payment never overrides cultural consent.',
              points: 2,
            },
            {
              text: 'Ban all tourists from the site forever.',
              feedback: 'Respectful, managed visits can support the community better than a total ban.',
              points: 5,
            },
          ],
        },
        {
          situation:
            'You must design a new tourism product for a heritage food district.',
          options: [
            {
              text: 'Create a guided food-story walk where visitors meet the cooks behind each heirloom dish.',
              feedback: 'Storytelling turns food into a memorable cultural experience — great product development.',
              points: 10,
            },
            {
              text: 'Invite international fast-food chains to draw crowds.',
              feedback: 'That competes with, rather than celebrates, the heritage food culture.',
              points: 2,
            },
            {
              text: 'Set up a food-photo contest with no local involvement.',
              feedback: 'Fun idea, but products need genuine community participation to last.',
              points: 5,
            },
          ],
        },
        {
          situation:
            'A developer proposes a glass elevator on the side of a historic rice terrace viewpoint.',
          options: [
            {
              text: 'Require a heritage impact assessment and community consultation first.',
              feedback: 'Innovation is welcome only after checking impact on the living cultural landscape.',
              points: 10,
            },
            {
              text: 'Approve it immediately — accessibility means more tourists.',
              feedback: 'Unchecked construction can destroy the UNESCO value of a site.',
              points: 2,
            },
            {
              text: 'Reject all development on principle.',
              feedback: 'Careful, assessed improvements can make heritage more inclusive.',
              points: 5,
            },
          ],
        },
      ],
    },
    matchTitle: 'World Heritage Match',
    matchDescription: 'Match each famous heritage site with its country.',
    matchPairs: [
      { left: 'Banaue Rice Terraces', right: 'Philippines' },
      { left: 'Angkor Wat', right: 'Cambodia' },
      { left: 'Machu Picchu', right: 'Peru' },
      { left: 'Taj Mahal', right: 'India' },
      { left: 'Great Wall', right: 'China' },
      { left: 'Acropolis', right: 'Greece' },
    ],
    agentName: 'Heritage Agent',
    agentIntro:
      'Greetings! I am your TMEL04 Heritage Agent — ask me about heritage tourism, cultural tourism, travel technology, and tourism product development!',
    agentSuggestions: [
      'What makes a site a UNESCO World Heritage Site?',
      'How is cultural tourism different from heritage tourism?',
      'Give an example of tourism innovation using technology.',
      'Quiz me on famous heritage sites!',
    ],
  },
  FOLA01: {
    signature: {
      type: 'scenario',
      title: 'Front Desk Language Challenge',
      description:
        'International guests are arriving! Choose the right phrase for each situation and earn Language Points.',
      role: 'Hotel Front Desk Officer',
      scenarios: [
        {
          situation:
            'A French guest approaches your desk in the morning. How do you greet them politely?',
          options: [
            {
              text: '"Bonjour! Bienvenue à notre hôtel." (Good morning! Welcome to our hotel.)',
              feedback: 'Perfect polite French greeting for the morning.',
              points: 10,
            },
            {
              text: '"Bonsoir!" (Good evening!)',
              feedback: 'Bonsoir is for the evening — mornings use Bonjour.',
              points: 4,
            },
            {
              text: '"Au revoir!" (Goodbye!)',
              feedback: 'That is a farewell, not a greeting!',
              points: 2,
            },
          ],
        },
        {
          situation:
            'A Japanese guest thanks you for carrying their bags. How do you respond?',
          options: [
            {
              text: '"Dō itashimashite." (You are welcome.)',
              feedback: 'Exactly right — the polite response to arigatō.',
              points: 10,
            },
            {
              text: '"Arigatō gozaimasu." (Thank you very much.)',
              feedback: 'That thanks them back — kind, but "dō itashimashite" is the proper reply.',
              points: 5,
            },
            {
              text: '"Sayōnara." (Goodbye.)',
              feedback: 'That ends the conversation instead of accepting their thanks.',
              points: 2,
            },
          ],
        },
        {
          situation:
            'A Spanish-speaking guest asks: "¿Dónde está el aeropuerto?" What are they asking?',
          options: [
            {
              text: 'Where is the airport?',
              feedback: '¡Correcto! Dónde está = where is, aeropuerto = airport.',
              points: 10,
            },
            {
              text: 'How much is the room?',
              feedback: 'That would be "¿Cuánto cuesta la habitación?"',
              points: 2,
            },
            {
              text: 'Where is the restaurant?',
              feedback: 'Close! Restaurant is "restaurante" — aeropuerto is the airport.',
              points: 5,
            },
          ],
        },
        {
          situation:
            'A Korean guest arrives at check-in. Which greeting is appropriate?',
          options: [
            {
              text: '"Annyeonghaseyo! Hwan-yeong-hamnida." (Hello! Welcome.)',
              feedback: 'Perfect polite Korean welcome.',
              points: 10,
            },
            {
              text: '"Kamsahamnida." (Thank you.)',
              feedback: 'That is thank you — useful, but not a greeting.',
              points: 5,
            },
            {
              text: '"Annyeonghi gaseyo." (Goodbye — to someone leaving.)',
              feedback: 'That says goodbye as the guest walks in!',
              points: 2,
            },
          ],
        },
        {
          situation:
            'An Italian guest at the restaurant asks for the bill. Which phrase did they most likely use?',
          options: [
            {
              text: '"Il conto, per favore." (The bill, please.)',
              feedback: 'Esatto! Conto means bill or check.',
              points: 10,
            },
            {
              text: '"Buon appetito!" (Enjoy your meal!)',
              feedback: 'That is said before eating, not when paying.',
              points: 3,
            },
            {
              text: '"Grazie mille!" (Thanks a lot!)',
              feedback: 'A thank-you — polite, but not asking for the bill.',
              points: 5,
            },
          ],
        },
      ],
    },
    matchTitle: 'Phrase Master Match',
    matchDescription: 'Match each foreign phrase with its English meaning.',
    matchPairs: [
      { left: 'Bonjour (French)', right: 'Hello / Good day' },
      { left: 'Arigatō (Japanese)', right: 'Thank you' },
      { left: '¿Cuánto cuesta? (Spanish)', right: 'How much does it cost?' },
      { left: 'Xièxie (Mandarin)', right: 'Thanks' },
      { left: 'Entschuldigung (German)', right: 'Excuse me / Sorry' },
      { left: 'Kamsahamnida (Korean)', right: 'Thank you (formal)' },
    ],
    agentName: 'Language Agent',
    agentIntro:
      'Bonjour! Hola! Konnichiwa! I am your FOLA01 Language Agent — ask me for tourism phrases, greetings, translations, or pronunciation help in any language!',
    agentSuggestions: [
      'Teach me 5 hotel phrases in Japanese.',
      'How do I greet guests in French, Spanish, and Korean?',
      'Translate "Welcome to the Philippines, enjoy your stay!" into Spanish.',
      'Quiz me on basic travel phrases!',
    ],
  },
  TMEL02: {
    signature: {
      type: 'sequence',
      title: 'Dream Itinerary Builder',
      description:
        'A family booked a 5-day island holiday through your travel agency. Build their tour package in the correct professional order.',
      prompt: 'Click the steps in the order a professional travel agent would do them.',
      steps: [
        'Interview the clients about needs, dates, and budget',
        'Research the destination and available suppliers',
        'Design the day-by-day itinerary',
        'Cost the package and set the selling price',
        'Book the transport, hotel, and activities',
        'Prepare and send travel documents and confirmations',
        'Deliver the tour and collect client feedback',
      ],
    },
    matchTitle: 'Tourism Marketing Match',
    matchDescription: 'Match each tourism business term with its meaning.',
    matchPairs: [
      { left: 'Itinerary', right: 'A planned day-by-day travel schedule' },
      { left: 'Target market', right: 'The specific group of customers a product is designed for' },
      { left: 'Package tour', right: 'Transport, accommodation, and activities sold as one price' },
      { left: 'FIT', right: 'Free Independent Traveler arranging a custom trip' },
      { left: '4 Ps of marketing', right: 'Product, Price, Place, and Promotion' },
      { left: 'Upselling', right: 'Offering a better version of a service for extra value' },
    ],
    agentName: 'Travel Biz Agent',
    agentIntro:
      'Hello, future travel entrepreneur! I am your TMEL02 Travel Biz Agent — ask me about tourism marketing, tour operations, itineraries, and customer service!',
    agentSuggestions: [
      'Explain the 4 Ps of marketing using a beach resort.',
      'How do travel agencies earn money?',
      'Help me design a 3-day Palawan itinerary.',
      'Quiz me on customer service basics!',
    ],
  },
};

export const DEFAULT_AGENT = {
  agentName: 'Subject Agent',
  agentIntro:
    'Hi! I am your subject agent — ask me anything about this subject and I will explain it step by step!',
  agentSuggestions: [
    'Summarize the most important topics of this subject.',
    'Give me a 5-question practice quiz.',
    'Explain the hardest concept in simple words.',
  ],
};
