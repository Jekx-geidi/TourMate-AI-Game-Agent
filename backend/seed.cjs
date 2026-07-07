const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const subjects = [
    { code: 'NMICE', title: 'MICE Management', description: 'Meetings, Incentives, Conferences, and Exhibitions.', icon: '🎪', color: '#F59E0B' },
    { code: 'AIRMGT', title: 'Airline Management', description: 'Airline and airport operations, ticketing, and aviation safety.', icon: '✈️', color: '#3B82F6' },
    { code: 'FOLA01', title: 'Foreign Language 1', description: 'Basic foreign language for tourism: greetings, phrases, and assistance.', icon: '🌐', color: '#10B981' },
    { code: 'TMEL02', title: 'Tourism Elective 2', description: 'Tourism marketing, tour operations, and itinerary planning.', icon: '🗺️', color: '#8B5CF6' },
    { code: 'TMEL03', title: 'Tourism Elective 3', description: 'Sustainable tourism, ecotourism, and responsible travel.', icon: '🌿', color: '#22C55E' },
    { code: 'TMEL04', title: 'Tourism Elective 4', description: 'Heritage tourism, cultural tourism, and travel technology.', icon: '🏛️', color: '#EC4899' },
  ];

  for (const s of subjects) {
    await prisma.subject.upsert({
      where: { code: s.code },
      update: s,
      create: s,
    });
    console.log(`✅ ${s.code} - ${s.title}`);
  }

  const count = await prisma.subject.count();
  console.log(`\nTotal subjects: ${count}`);
}

main()
  .catch(e => { console.error('ERROR:', e.message || e); process.exit(1); })
  .finally(() => prisma.$disconnect());