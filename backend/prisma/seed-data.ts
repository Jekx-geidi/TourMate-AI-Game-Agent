export type SubjectSeed = {
  code: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Array<{
    title: string;
    content: string;
    summary: string;
  }>;
  quizQuestions: Array<{
    question: string;
    options: [string, string, string, string];
    answer: string;
    explanation: string;
  }>;
  flashcards: Array<{
    front: string;
    back: string;
    category: string;
  }>;
};

const subjectBlueprint = (
  code: string,
  title: string,
  description: string,
  icon: string,
  color: string,
  lessons: SubjectSeed['lessons'],
  quizQuestions: SubjectSeed['quizQuestions'],
  flashcards: SubjectSeed['flashcards'],
): SubjectSeed => ({
  code,
  title,
  description,
  icon,
  color,
  lessons,
  quizQuestions,
  flashcards,
});

export const SUBJECT_SEEDS: SubjectSeed[] = [
  subjectBlueprint(
    'TMEL03',
    'Tourism Elective 3',
    'Explore sustainable, responsible, and trend-aware tourism practices.',
    'Globe',
    '#0F766E',
    [
      {
        title: 'Sustainable Tourism Foundations',
        summary:
          'Learn how tourism can grow while protecting people, culture, and nature.',
        content:
          'Sustainable tourism balances visitor satisfaction, community benefit, and environmental care. It encourages businesses and travelers to reduce waste, respect local culture, support local livelihoods, and protect natural resources. In practice, sustainable tourism planning looks at carrying capacity, community participation, transportation impact, and long-term destination resilience.',
      },
      {
        title: 'Ecotourism and Responsible Travel',
        summary:
          'Ecotourism focuses on meaningful travel experiences in natural areas with low impact.',
        content:
          'Ecotourism is responsible travel to natural areas that conserves the environment and supports local communities. Responsible travel also includes ethical wildlife interaction, local purchasing, cultural sensitivity, and climate-aware decision-making. Tourism professionals help guests make better choices by giving clear information, setting expectations, and modeling respectful behavior.',
      },
      {
        title: 'Destination Development Trends',
        summary:
          'Modern destinations use innovation and planning to stay competitive and resilient.',
        content:
          'Destination development combines infrastructure, policy, branding, community engagement, and visitor experience design. Tourism trends such as wellness travel, digital nomad markets, regenerative tourism, and authentic local experiences influence how destinations evolve. Students should learn to evaluate both opportunities and risks when developing tourism products.',
      },
    ],
    [
      {
        question: 'What is a main goal of sustainable tourism?',
        options: [
          'Maximize visitors without limits',
          'Protect resources while supporting communities',
          'Promote only luxury tourism',
          'Replace local culture with global standards',
        ],
        answer: 'B',
        explanation:
          'Sustainable tourism aims to protect environmental and cultural resources while still supporting communities and visitor experiences.',
      },
      {
        question: 'Which practice best shows responsible travel?',
        options: [
          'Ignoring local rules',
          'Buying illegal souvenirs',
          'Respecting wildlife and local customs',
          'Visiting overcrowded places only',
        ],
        answer: 'C',
        explanation:
          'Responsible travel includes respect for wildlife, communities, and local customs.',
      },
      {
        question: 'Ecotourism usually takes place in:',
        options: [
          'Natural areas',
          'Only shopping malls',
          'Industrial zones',
          'Only airports',
        ],
        answer: 'A',
        explanation:
          'Ecotourism is closely tied to natural environments and conservation-minded experiences.',
      },
      {
        question:
          'Why is community participation important in tourism development?',
        options: [
          'It slows progress on purpose',
          'It ensures local voices and benefits are included',
          'It removes government planning',
          'It prevents visitor services',
        ],
        answer: 'B',
        explanation:
          'Communities should help shape tourism so the benefits and impacts are fairly managed.',
      },
      {
        question:
          'Which trend is closely linked with authentic local experiences?',
        options: [
          'Mass copying of attractions',
          'Regenerative tourism',
          'Ignoring heritage',
          'Ticket scalping',
        ],
        answer: 'B',
        explanation:
          'Regenerative tourism and authentic experiences focus on deeper positive impact and local connection.',
      },
      {
        question: 'Carrying capacity refers to:',
        options: [
          'The number of bags an airline can load',
          'The limit a destination can handle without damage',
          'The number of flights per year globally',
          'A hotel room category',
        ],
        answer: 'B',
        explanation:
          'Carrying capacity measures how much use a destination can sustain before negative effects appear.',
      },
      {
        question: 'A tourism professional supporting local livelihoods might:',
        options: [
          'Recommend imported products only',
          'Hide local businesses from visitors',
          'Promote local guides and crafts',
          'Discourage community-based tours',
        ],
        answer: 'C',
        explanation:
          'Promoting local products and services helps communities benefit from tourism.',
      },
      {
        question: 'Destination resilience means a destination can:',
        options: [
          'Recover and adapt to challenges',
          'Avoid all planning',
          'Depend on one market only',
          'Ignore sustainability',
        ],
        answer: 'A',
        explanation:
          'Resilience is the ability to adapt, recover, and continue operating through change or disruption.',
      },
      {
        question: 'Which traveler behavior best fits sustainable tourism?',
        options: [
          'Wasting water',
          'Respecting waste rules',
          'Damaging coral reefs',
          'Littering in parks',
        ],
        answer: 'B',
        explanation:
          'Simple behaviors such as following waste rules support sustainable travel outcomes.',
      },
      {
        question: 'Destination development combines tourism with:',
        options: [
          'Random decisions only',
          'Policy, branding, and infrastructure',
          'Only souvenirs',
          'Only flight routes',
        ],
        answer: 'B',
        explanation:
          'Destination development includes coordinated planning, branding, infrastructure, and stakeholder work.',
      },
    ],
    [
      {
        front: 'Sustainable Tourism',
        back: 'Tourism that balances visitor needs, community benefit, and environmental care.',
        category: 'Key Term',
      },
      {
        front: 'Ecotourism',
        back: 'Responsible travel to natural areas that supports conservation and communities.',
        category: 'Key Term',
      },
      {
        front: 'Carrying Capacity',
        back: 'The amount of tourism activity a destination can handle without serious harm.',
        category: 'Key Term',
      },
      {
        front: 'Responsible Travel',
        back: 'Travel behavior that respects places, people, and natural resources.',
        category: 'Concept',
      },
      {
        front: 'Regenerative Tourism',
        back: 'Tourism that aims to leave destinations better than before.',
        category: 'Trend',
      },
      {
        front: 'Community Participation',
        back: 'Involving local residents in tourism planning and benefits.',
        category: 'Concept',
      },
      {
        front: 'Destination Development',
        back: 'Planning and improving a destination for tourism growth and quality.',
        category: 'Concept',
      },
      {
        front: 'Local Livelihoods',
        back: 'Income and work opportunities that support community well-being.',
        category: 'Concept',
      },
      {
        front: 'Tourism Trends',
        back: 'Changing patterns in traveler interests and destination demand.',
        category: 'Review',
      },
      {
        front: 'Resilience',
        back: 'The ability to adapt and recover from disruptions.',
        category: 'Review',
      },
    ],
  ),
  subjectBlueprint(
    'NMICE',
    'Meetings, Incentives, Conferences, and Exhibitions',
    'Build confidence in event, venue, and professional gathering management.',
    'CalendarDays',
    '#2563EB',
    [
      {
        title: 'Introduction to MICE',
        summary:
          'MICE is a major tourism segment built around organized business events.',
        content:
          'MICE stands for Meetings, Incentives, Conferences, and Exhibitions. It is a major part of the tourism industry because people travel for business events, company rewards, conventions, trade shows, and professional gatherings. A meeting is a formal gathering for discussion. Incentive travel is a reward trip given by a company to employees or partners. A conference is a large event where people discuss professional topics. An exhibition is an event where businesses display products or services.',
      },
      {
        title: 'Event Planning and Venue Selection',
        summary:
          'Strong planning aligns goals, guests, logistics, and venue suitability.',
        content:
          'Event planning begins with purpose, audience, budget, timeline, and program design. Venue selection considers accessibility, capacity, technical facilities, accommodation, safety, and overall experience. Tourism professionals also manage registration systems, supplier coordination, food service, transport, and contingency plans to keep events organized and welcoming.',
      },
      {
        title: 'Registration and Event Evaluation',
        summary:
          'Registration shapes guest flow, while evaluation helps improve future events.',
        content:
          'Registration is the process of collecting attendee details, issuing confirmations, and managing onsite check-in. After an event, evaluation measures outcomes such as attendance, satisfaction, learning, networking success, and return on investment. Good event managers use feedback and reporting to improve future programs.',
      },
    ],
    [
      {
        question: 'What does MICE stand for?',
        options: [
          'Meetings, Incentives, Conferences, and Exhibitions',
          'Marketing, Investments, Culture, and Events',
          'Meetings, International Commerce, and Education',
          'Management, Innovation, Communication, and Exhibits',
        ],
        answer: 'A',
        explanation:
          'MICE stands for Meetings, Incentives, Conferences, and Exhibitions.',
      },
      {
        question: 'Incentive travel is usually used to:',
        options: [
          'Punish poor performance',
          'Reward employees or partners',
          'Replace conferences',
          'Avoid planning',
        ],
        answer: 'B',
        explanation:
          'Incentive travel is a reward experience for achievement or loyalty.',
      },
      {
        question: 'Which factor is important in venue selection?',
        options: [
          'Ignoring accessibility',
          'Capacity and facilities',
          'Avoiding safety checks',
          'No transport options',
        ],
        answer: 'B',
        explanation:
          'A venue should fit the event size and provide suitable facilities and access.',
      },
      {
        question: 'Registration helps event managers by:',
        options: [
          'Removing guest data',
          'Managing attendee records and check-in',
          'Canceling programs',
          'Avoiding communication',
        ],
        answer: 'B',
        explanation:
          'Registration keeps attendee information organized before and during the event.',
      },
      {
        question: 'An exhibition mainly allows organizations to:',
        options: [
          'Hide products',
          'Display products or services',
          'Avoid networking',
          'Remove branding',
        ],
        answer: 'B',
        explanation:
          'Exhibitions help organizations present products, services, and ideas.',
      },
      {
        question: 'A conference is best described as:',
        options: [
          'A personal shopping trip',
          'A large professional discussion event',
          'A hotel housekeeping plan',
          'An airline boarding rule',
        ],
        answer: 'B',
        explanation:
          'Conferences bring people together to discuss professional topics or industries.',
      },
      {
        question: 'A contingency plan is useful because it:',
        options: [
          'Creates confusion',
          'Prepares for risks and disruptions',
          'Removes suppliers',
          'Stops evaluation',
        ],
        answer: 'B',
        explanation:
          'Contingency plans help teams respond calmly to unexpected issues.',
      },
      {
        question: 'Event evaluation happens:',
        options: [
          'Only before registration',
          'After the event to review outcomes',
          'Only during setup',
          'Only for flights',
        ],
        answer: 'B',
        explanation:
          'Evaluation is used after the event to measure success and find improvements.',
      },
      {
        question: 'Networking is often important in MICE because it:',
        options: [
          'Disconnects participants',
          'Creates relationship-building opportunities',
          'Reduces engagement',
          'Ends discussions',
        ],
        answer: 'B',
        explanation:
          'MICE events often create valuable professional connections.',
      },
      {
        question: 'A good event manager should focus on:',
        options: [
          'Guest experience and logistics',
          'Random planning',
          'No communication',
          'Ignoring suppliers',
        ],
        answer: 'A',
        explanation:
          'Strong event management combines guest care, logistics, coordination, and clear planning.',
      },
    ],
    [
      {
        front: 'MICE',
        back: 'Meetings, Incentives, Conferences, and Exhibitions.',
        category: 'Key Term',
      },
      {
        front: 'Meeting',
        back: 'A formal gathering for discussion and decision-making.',
        category: 'Key Term',
      },
      {
        front: 'Incentive Travel',
        back: 'A reward trip offered to motivate or recognize achievement.',
        category: 'Key Term',
      },
      {
        front: 'Conference',
        back: 'A large event where participants discuss professional topics.',
        category: 'Key Term',
      },
      {
        front: 'Exhibition',
        back: 'An event where organizations showcase products or services.',
        category: 'Key Term',
      },
      {
        front: 'Venue Selection',
        back: 'Choosing the event location based on capacity, access, and facilities.',
        category: 'Concept',
      },
      {
        front: 'Registration',
        back: 'The process of collecting and managing attendee details.',
        category: 'Concept',
      },
      {
        front: 'Contingency Plan',
        back: 'A backup plan for event risks and disruptions.',
        category: 'Concept',
      },
      {
        front: 'Event Evaluation',
        back: 'Reviewing event performance after completion.',
        category: 'Review',
      },
      {
        front: 'Networking',
        back: 'Building professional connections through events.',
        category: 'Review',
      },
    ],
  ),
  subjectBlueprint(
    'AIRMGT',
    'Airline Management',
    'Learn the systems, services, and safety practices behind airline operations.',
    'Plane',
    '#0EA5E9',
    [
      {
        title: 'Introduction to Airline Management',
        summary:
          'Airline management covers operations, service, safety, and business functions.',
        content:
          'Airline Management is the study of how airlines operate and serve passengers. It includes ticketing, reservations, flight scheduling, ground handling, passenger service, safety, marketing, and airline business operations. Students who study Airline Management can work in airlines, airports, travel agencies, ticketing offices, and customer service roles.',
      },
      {
        title: 'Passenger Handling and Ground Services',
        summary:
          'Passenger handling keeps travelers informed, assisted, and moving smoothly.',
        content:
          'Passenger handling includes check-in, baggage processing, boarding support, special assistance, and communication during disruptions. Ground services also include ramp coordination, aircraft cleaning, catering support, and turnaround management. Strong passenger care depends on accuracy, calm communication, and teamwork.',
      },
      {
        title: 'Aviation Safety and Airline Departments',
        summary:
          'Safety is everyone’s responsibility across airline departments.',
        content:
          'Airlines rely on departments such as operations, sales, marketing, customer service, finance, safety, engineering, and cabin services. Aviation safety includes compliance, risk awareness, emergency procedures, and service discipline. Students should understand how each department supports safe and efficient travel.',
      },
    ],
    [
      {
        question: 'Airline Management includes:',
        options: [
          'Only hotel reservations',
          'Operations and passenger service',
          'Only cruise planning',
          'Only museum tours',
        ],
        answer: 'B',
        explanation:
          'Airline Management covers operations, reservations, safety, marketing, and passenger service.',
      },
      {
        question: 'Ground handling refers to:',
        options: [
          'Only inflight meals',
          'Airport services for passengers and aircraft',
          'Only online ticket ads',
          'Only hotel check-ins',
        ],
        answer: 'B',
        explanation:
          'Ground handling includes airport-side services that support flights and travelers.',
      },
      {
        question: 'Check-in is part of:',
        options: [
          'Passenger handling',
          'Destination mapping only',
          'Exhibition design',
          'Restaurant ordering',
        ],
        answer: 'A',
        explanation:
          'Check-in is a core passenger handling activity before boarding.',
      },
      {
        question: 'Why is aviation safety important?',
        options: [
          'It is optional',
          'It protects passengers, crew, and operations',
          'It slows flights for no reason',
          'It replaces customer service',
        ],
        answer: 'B',
        explanation:
          'Safety is fundamental to airline operations and traveler protection.',
      },
      {
        question: 'Which department often promotes airline services?',
        options: ['Marketing', 'Laundry', 'Only customs', 'Exhibitions'],
        answer: 'A',
        explanation:
          'Marketing helps position and promote airline products and services.',
      },
      {
        question: 'A turnaround refers to:',
        options: [
          'A flight delay only',
          'The process of preparing an aircraft for its next flight',
          'A hotel shuttle route',
          'A tourism slogan',
        ],
        answer: 'B',
        explanation:
          'Turnaround work happens between arrival and the next departure.',
      },
      {
        question: 'Passenger handling requires:',
        options: [
          'Poor communication',
          'Accuracy and calm service',
          'No teamwork',
          'Ignoring baggage issues',
        ],
        answer: 'B',
        explanation:
          'Clear communication and accurate service are essential for smooth passenger handling.',
      },
      {
        question: 'Cabin service basics focus on:',
        options: [
          'Only cargo loading',
          'Passenger comfort and onboard assistance',
          'Only accounting',
          'Only route planning',
        ],
        answer: 'B',
        explanation:
          'Cabin service centers on the onboard passenger experience and support.',
      },
      {
        question: 'Ticketing and reservations help airlines by:',
        options: [
          'Managing customer bookings',
          'Painting aircraft only',
          'Running exhibitions',
          'Replacing airport security',
        ],
        answer: 'A',
        explanation:
          'Ticketing and reservations organize customer bookings and seat access.',
      },
      {
        question: 'Airline departments work together to achieve:',
        options: [
          'Confusion',
          'Safe and efficient travel',
          'No customer support',
          'No flight schedules',
        ],
        answer: 'B',
        explanation:
          'Cross-department coordination supports reliable, safe, and efficient service.',
      },
    ],
    [
      {
        front: 'Ground Handling',
        back: 'Airport services that support passengers, baggage, and aircraft.',
        category: 'Key Term',
      },
      {
        front: 'Passenger Handling',
        back: 'Services like check-in, boarding, and traveler assistance.',
        category: 'Key Term',
      },
      {
        front: 'Turnaround',
        back: 'Preparing an aircraft for its next departure.',
        category: 'Concept',
      },
      {
        front: 'Reservations',
        back: 'The airline booking process for seats and travel details.',
        category: 'Concept',
      },
      {
        front: 'Cabin Service',
        back: 'Onboard care focused on passenger comfort and safety.',
        category: 'Concept',
      },
      {
        front: 'Aviation Safety',
        back: 'Practices that reduce risk and protect operations.',
        category: 'Key Term',
      },
      {
        front: 'Airline Operations',
        back: 'The planning and execution of flights and supporting services.',
        category: 'Review',
      },
      {
        front: 'Flight Scheduling',
        back: 'Organizing departures, arrivals, and aircraft use.',
        category: 'Review',
      },
      {
        front: 'Marketing',
        back: 'Promoting airline services to customers.',
        category: 'Review',
      },
      {
        front: 'Passenger Service',
        back: 'Helping travelers before, during, and after flights.',
        category: 'Review',
      },
    ],
  ),
  subjectBlueprint(
    'TMEL04',
    'Tourism Elective 4',
    'Focus on heritage, culture, innovation, and product development in tourism.',
    'Sparkles',
    '#14B8A6',
    [
      {
        title: 'Heritage and Cultural Tourism',
        summary:
          'Heritage and cultural tourism connect visitors with identity, tradition, and place.',
        content:
          'Heritage tourism highlights historical places, traditions, and cultural assets. Cultural tourism focuses on arts, cuisine, rituals, festivals, and lifestyle experiences. Tourism professionals should present these assets respectfully and accurately while protecting authenticity and community dignity.',
      },
      {
        title: 'Travel Technology and Innovation',
        summary:
          'Technology improves trip planning, service, and destination storytelling.',
        content:
          'Travel technology includes booking systems, digital maps, virtual tours, AI support, mobile guides, and smart destination tools. Innovation in tourism can improve convenience, accessibility, personalization, and marketing. Good innovation should solve real visitor and operator needs rather than adding complexity.',
      },
      {
        title: 'Tourism Product Development',
        summary:
          'Tourism products are designed experiences that combine attractions, access, and service.',
        content:
          'Tourism product development turns attractions, services, and stories into marketable visitor experiences. This includes itinerary design, packaging, pricing, interpretation, partnerships, and quality control. A strong tourism product matches target markets while remaining feasible and sustainable.',
      },
    ],
    [
      {
        question: 'Heritage tourism often focuses on:',
        options: [
          'Historical places and traditions',
          'Only airport baggage',
          'Only airline catering',
          'Only sports events',
        ],
        answer: 'A',
        explanation:
          'Heritage tourism highlights historical and identity-rich places and traditions.',
      },
      {
        question: 'Travel technology can improve tourism by:',
        options: [
          'Making trips harder to manage',
          'Supporting booking and information access',
          'Removing customer service',
          'Stopping innovation',
        ],
        answer: 'B',
        explanation:
          'Technology can streamline booking, guidance, and communication.',
      },
      {
        question: 'A tourism product is:',
        options: [
          'A random idea only',
          'A designed visitor experience',
          'Only a hotel keycard',
          'Only an airline seat',
        ],
        answer: 'B',
        explanation:
          'Tourism products combine services and attractions into coherent experiences.',
      },
      {
        question: 'Why is authenticity important in cultural tourism?',
        options: [
          'To avoid respect',
          'To present culture meaningfully and responsibly',
          'To erase traditions',
          'To replace local voices',
        ],
        answer: 'B',
        explanation:
          'Authenticity helps preserve cultural meaning and respect local identity.',
      },
      {
        question: 'Innovation should ideally:',
        options: [
          'Add confusion',
          'Solve real tourism needs',
          'Ignore users',
          'Remove access',
        ],
        answer: 'B',
        explanation:
          'Useful innovation improves experiences and operations in practical ways.',
      },
      {
        question: 'Packaging in tourism product development means:',
        options: [
          'Wrapping souvenirs only',
          'Combining services into an offer',
          'Closing attractions',
          'Reducing interpretation',
        ],
        answer: 'B',
        explanation:
          'Packaging groups different tourism elements into a marketable offer.',
      },
      {
        question: 'Virtual tours are an example of:',
        options: [
          'Travel technology',
          'Ground handling',
          'Check-in',
          'Passenger boarding',
        ],
        answer: 'A',
        explanation:
          'Virtual tours are digital tools used in tourism interpretation and promotion.',
      },
      {
        question: 'Quality control in product development helps:',
        options: [
          'Maintain consistency and standards',
          'Remove planning',
          'Increase risk',
          'Ignore customers',
        ],
        answer: 'A',
        explanation:
          'Quality control supports reliable and satisfying visitor experiences.',
      },
      {
        question: 'Cultural tourism may include:',
        options: [
          'Festivals and cuisine',
          'Only airport codes',
          'Only immigration forms',
          'Only sports scoring',
        ],
        answer: 'A',
        explanation:
          'Cultural tourism includes food, arts, festivals, and lifestyle experiences.',
      },
      {
        question: 'Target markets matter because they:',
        options: [
          'Help shape suitable tourism products',
          'Remove pricing decisions',
          'End customer research',
          'Replace storytelling',
        ],
        answer: 'A',
        explanation:
          'Understanding target markets helps design relevant products and messages.',
      },
    ],
    [
      {
        front: 'Heritage Tourism',
        back: 'Travel centered on historical places, stories, and traditions.',
        category: 'Key Term',
      },
      {
        front: 'Cultural Tourism',
        back: 'Tourism focused on arts, cuisine, festivals, and way of life.',
        category: 'Key Term',
      },
      {
        front: 'Travel Technology',
        back: 'Digital tools used to plan, support, or enhance travel.',
        category: 'Concept',
      },
      {
        front: 'Innovation',
        back: 'New or improved ways to solve tourism needs.',
        category: 'Concept',
      },
      {
        front: 'Tourism Product',
        back: 'A complete visitor experience designed for a market.',
        category: 'Concept',
      },
      {
        front: 'Packaging',
        back: 'Combining tourism services into one offer.',
        category: 'Review',
      },
      {
        front: 'Interpretation',
        back: 'Explaining meaning and stories behind places and experiences.',
        category: 'Review',
      },
      {
        front: 'Authenticity',
        back: 'Presenting culture and heritage in a respectful, genuine way.',
        category: 'Review',
      },
      {
        front: 'Virtual Tour',
        back: 'A digital experience that lets users explore remotely.',
        category: 'Review',
      },
      {
        front: 'Target Market',
        back: 'The specific audience a tourism product is designed for.',
        category: 'Review',
      },
    ],
  ),
  subjectBlueprint(
    'FOLA01',
    'Foreign Language 1',
    'Practice greetings, directions, hospitality phrases, and tourist conversations.',
    'Languages',
    '#F59E0B',
    [
      {
        title: 'Basic Tourist Greetings',
        summary:
          'Simple greetings help tourism professionals create warm first impressions.',
        content:
          'Foreign language skills are important in tourism because tourism professionals often speak with international guests. Basic greetings help create a welcoming and respectful experience. Examples include Hello, Good morning, Thank you, Welcome, How can I help you, and Enjoy your stay.',
      },
      {
        title: 'Directions and Tourist Assistance',
        summary:
          'Clear phrases for location and movement help guests feel supported.',
        content:
          'Tourism workers often help guests understand directions, landmarks, and transport points. Useful phrases include Where is the airport, Please follow me, Turn left, Turn right, Go straight, and The hotel is nearby. Giving calm and simple directions improves guest confidence.',
      },
      {
        title: 'Hotel, Airport, and Restaurant Phrases',
        summary:
          'Hospitality settings rely on polite, practical communication.',
        content:
          'In hotels, staff may say Welcome to our hotel, I have your reservation, and Enjoy your stay. At airports, staff may ask for passports, boarding passes, or baggage details. In restaurants, staff may guide guests through ordering, payment, and special requests with polite language.',
      },
    ],
    [
      {
        question: 'Why are foreign language basics helpful in tourism?',
        options: [
          'They make communication harder',
          'They help serve international guests',
          'They replace all tourism skills',
          'They are only for pilots',
        ],
        answer: 'B',
        explanation:
          'Basic language skills improve hospitality and communication with diverse guests.',
      },
      {
        question: 'Which phrase is a greeting?',
        options: [
          'Where is the airport?',
          'Good morning',
          'How much is this?',
          'Boarding gate closes',
        ],
        answer: 'B',
        explanation: 'Good morning is a basic greeting phrase.',
      },
      {
        question: 'Please follow me is useful when:',
        options: [
          'Giving guidance',
          'Closing a reservation',
          'Explaining baggage loss only',
          'Scoring a quiz',
        ],
        answer: 'A',
        explanation: 'Please follow me is commonly used to guide a guest.',
      },
      {
        question: 'I have a reservation is most common in:',
        options: [
          'Hotel communication',
          'Only sports coaching',
          'Only ticket printing',
          'Only visa renewal',
        ],
        answer: 'A',
        explanation:
          'Guests often use this phrase in hotels and travel settings.',
      },
      {
        question: 'Direction phrases should be:',
        options: [
          'Complicated and fast',
          'Clear and simple',
          'Ignored by staff',
          'Only written in code',
        ],
        answer: 'B',
        explanation:
          'Clear and simple language helps travelers understand directions easily.',
      },
      {
        question: 'Which phrase shows hospitality?',
        options: [
          'Enjoy your stay',
          'No service today',
          'Find it yourself',
          'I will not help',
        ],
        answer: 'A',
        explanation: 'Enjoy your stay is a warm hospitality phrase.',
      },
      {
        question: 'How much is this? is helpful when:',
        options: [
          'Asking about price',
          'Boarding an aircraft',
          'Checking weather only',
          'Opening a conference',
        ],
        answer: 'A',
        explanation: 'That phrase asks about the cost of an item or service.',
      },
      {
        question: 'Language practice supports tourism students by:',
        options: [
          'Reducing confidence',
          'Building service communication skills',
          'Replacing subject knowledge completely',
          'Ending customer interaction',
        ],
        answer: 'B',
        explanation:
          'Language practice helps students communicate better in tourism settings.',
      },
      {
        question: 'Where is the airport? is an example of:',
        options: [
          'A direction question',
          'A farewell',
          'A conference plan',
          'A flight number',
        ],
        answer: 'A',
        explanation: 'It is a basic direction-related question.',
      },
      {
        question: 'Polite language is important because it:',
        options: [
          'Creates a welcoming guest experience',
          'Confuses travelers',
          'Removes professionalism',
          'Only matters online',
        ],
        answer: 'A',
        explanation: 'Politeness helps guests feel respected and comfortable.',
      },
    ],
    [
      {
        front: 'Hello',
        back: 'A basic greeting used in many situations.',
        category: 'Greeting',
      },
      {
        front: 'Good morning',
        back: 'A polite greeting used earlier in the day.',
        category: 'Greeting',
      },
      {
        front: 'Thank you',
        back: 'A phrase used to show appreciation.',
        category: 'Courtesy',
      },
      {
        front: 'Where is the airport?',
        back: 'A direction question used by travelers.',
        category: 'Directions',
      },
      {
        front: 'How much is this?',
        back: 'A question used to ask about price.',
        category: 'Shopping',
      },
      {
        front: 'I have a reservation.',
        back: 'A common hotel or restaurant phrase.',
        category: 'Hotel',
      },
      {
        front: 'Can you help me?',
        back: 'A simple request for assistance.',
        category: 'Assistance',
      },
      {
        front: 'Welcome to our hotel.',
        back: 'A hospitable phrase used by staff.',
        category: 'Hotel',
      },
      {
        front: 'Please follow me.',
        back: 'A guiding phrase used when escorting guests.',
        category: 'Directions',
      },
      {
        front: 'Enjoy your stay.',
        back: 'A warm hospitality phrase for guests.',
        category: 'Courtesy',
      },
    ],
  ),
  subjectBlueprint(
    'TMEL02',
    'Tourism Elective 2',
    'Study tourism marketing, itineraries, customer service, and tour operations.',
    'BookOpen',
    '#22C55E',
    [
      {
        title: 'Tourism Marketing Basics',
        summary:
          'Tourism marketing connects destinations and services with the right travelers.',
        content:
          'Tourism marketing involves understanding target markets, creating appealing messages, choosing channels, and promoting experiences. It includes branding, storytelling, timing, pricing support, and customer engagement. Strong tourism marketing highlights value while staying truthful and relevant.',
      },
      {
        title: 'Travel Agency and Tour Operations',
        summary:
          'Travel agencies and tour operators organize and deliver travel services.',
        content:
          'Travel agencies help clients book transport, accommodation, and packages. Tour operators design itineraries, arrange suppliers, and manage tour delivery. Both require service knowledge, organization, customer care, and accurate information handling.',
      },
      {
        title: 'Itinerary Planning and Customer Service',
        summary:
          'Itineraries shape the guest experience from pacing to convenience.',
        content:
          'An itinerary is a structured travel plan that includes timing, transport, activities, and rest periods. Good itinerary planning balances efficiency with enjoyment. Customer service supports the whole journey through communication, problem-solving, empathy, and professionalism.',
      },
    ],
    [
      {
        question: 'Tourism marketing helps by:',
        options: [
          'Hiding services from travelers',
          'Connecting products with target markets',
          'Replacing all operations',
          'Avoiding communication',
        ],
        answer: 'B',
        explanation:
          'Marketing helps tourism products reach the right audiences with clear value.',
      },
      {
        question: 'A travel agency often helps clients with:',
        options: [
          'Random guessing',
          'Bookings and travel information',
          'Only aircraft maintenance',
          'Only museum restoration',
        ],
        answer: 'B',
        explanation:
          'Travel agencies commonly support bookings and travel planning.',
      },
      {
        question: 'An itinerary is:',
        options: [
          'A travel schedule or plan',
          'An airport code',
          'A boarding pass',
          'A visa stamp',
        ],
        answer: 'A',
        explanation:
          'An itinerary outlines travel timing, activities, and movement.',
      },
      {
        question: 'Customer service in tourism should include:',
        options: [
          'Empathy and problem-solving',
          'Ignoring traveler concerns',
          'Late communication only',
          'No professionalism',
        ],
        answer: 'A',
        explanation:
          'Strong customer service depends on empathy, communication, and solutions.',
      },
      {
        question: 'Tour operators mainly:',
        options: [
          'Design and deliver tours',
          'Only clean airport lounges',
          'Only board flights',
          'Only issue passports',
        ],
        answer: 'A',
        explanation: 'Tour operators package and manage travel experiences.',
      },
      {
        question: 'Storytelling is useful in tourism marketing because it:',
        options: [
          'Makes offers harder to understand',
          'Creates emotional connection and interest',
          'Stops branding',
          'Eliminates service quality',
        ],
        answer: 'B',
        explanation:
          'Storytelling helps tourism experiences feel memorable and meaningful.',
      },
      {
        question: 'A balanced itinerary should:',
        options: [
          'Overload the traveler',
          'Mix timing, transport, and rest sensibly',
          'Ignore travel distance',
          'Avoid planning',
        ],
        answer: 'B',
        explanation:
          'A good itinerary considers pacing, convenience, and overall experience.',
      },
      {
        question: 'Target markets are important because they:',
        options: [
          'Help shape marketing strategy',
          'Remove all branding needs',
          'Replace customer service',
          'Only matter for airlines',
        ],
        answer: 'A',
        explanation:
          'Knowing the audience helps create relevant messages and offers.',
      },
      {
        question: 'Professionalism in customer service means:',
        options: [
          'Being careless',
          'Being courteous and reliable',
          'Avoiding accuracy',
          'Ignoring complaints',
        ],
        answer: 'B',
        explanation:
          'Professional service includes courtesy, accuracy, and dependable support.',
      },
      {
        question: 'Tour operations require:',
        options: [
          'Organization and supplier coordination',
          'No planning',
          'No communication',
          'Only decoration',
        ],
        answer: 'A',
        explanation:
          'Tours depend on organized coordination across suppliers and schedules.',
      },
    ],
    [
      {
        front: 'Tourism Marketing',
        back: 'Promoting tourism experiences to suitable target markets.',
        category: 'Key Term',
      },
      {
        front: 'Travel Agency',
        back: 'A business that helps clients plan and book travel.',
        category: 'Key Term',
      },
      {
        front: 'Tour Operator',
        back: 'A company that designs and manages tours.',
        category: 'Key Term',
      },
      {
        front: 'Itinerary',
        back: 'A travel schedule or plan.',
        category: 'Key Term',
      },
      {
        front: 'Customer Service',
        back: 'Support provided to travelers before, during, and after trips.',
        category: 'Concept',
      },
      {
        front: 'Branding',
        back: 'Creating a distinctive identity for a tourism product or destination.',
        category: 'Review',
      },
      {
        front: 'Target Market',
        back: 'The audience a tourism offer is designed for.',
        category: 'Review',
      },
      {
        front: 'Storytelling',
        back: 'Using narrative to make tourism offers more appealing.',
        category: 'Review',
      },
      {
        front: 'Supplier Coordination',
        back: 'Managing travel partners involved in a tour.',
        category: 'Review',
      },
      {
        front: 'Professionalism',
        back: 'Reliable, courteous, and accurate service behavior.',
        category: 'Review',
      },
    ],
  ),
];
