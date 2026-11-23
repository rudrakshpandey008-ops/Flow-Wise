// Demo data for FLOWWISE - Mathura/Vrindavan area

export const demoLocations = [
  { id: 1, _id: 'loc_001', name: 'Shri Krishna Janmabhoomi', lat: 27.5046, lng: 77.6737, latitude: 27.5046, longitude: 77.6737, crowdScore: 85, currentCrowdScore: 85, baselineCrowd: 80, category: 'Temple', address: 'Mathura', reportCount: 234 },
  { id: 2, _id: 'loc_002', name: 'Dwarkadhish Temple', lat: 27.5071, lng: 77.6762, latitude: 27.5071, longitude: 77.6762, crowdScore: 72, currentCrowdScore: 72, baselineCrowd: 70, category: 'Temple', address: 'Mathura', reportCount: 189 },
  { id: 3, _id: 'loc_003', name: 'Banke Bihari Temple', lat: 27.5833, lng: 77.6997, latitude: 27.5833, longitude: 77.6997, crowdScore: 92, currentCrowdScore: 92, baselineCrowd: 85, category: 'Temple', address: 'Vrindavan', reportCount: 312 },
  { id: 4, _id: 'loc_004', name: 'ISKCON Vrindavan', lat: 27.5862, lng: 77.7001, latitude: 27.5862, longitude: 77.7001, crowdScore: 68, currentCrowdScore: 68, baselineCrowd: 65, category: 'Temple', address: 'Vrindavan', reportCount: 156 },
  { id: 5, _id: 'loc_005', name: 'Prem Mandir', lat: 27.5713, lng: 77.6937, latitude: 27.5713, longitude: 77.6937, crowdScore: 78, currentCrowdScore: 78, baselineCrowd: 75, category: 'Temple', address: 'Vrindavan', reportCount: 267 },
  { id: 6, _id: 'loc_006', name: 'Vishram Ghat', lat: 27.5055, lng: 77.6855, latitude: 27.5055, longitude: 77.6855, crowdScore: 55, currentCrowdScore: 55, baselineCrowd: 50, category: 'Ghat', address: 'Mathura', reportCount: 143 },
  { id: 7, _id: 'loc_007', name: 'Keshi Ghat', lat: 27.5796, lng: 77.6951, latitude: 27.5796, longitude: 77.6951, crowdScore: 62, currentCrowdScore: 62, baselineCrowd: 60, category: 'Ghat', address: 'Vrindavan', reportCount: 98 },
  { id: 8, _id: 'loc_008', name: 'Govardhan Hill', lat: 27.4950, lng: 77.4580, latitude: 27.4950, longitude: 77.4580, crowdScore: 45, currentCrowdScore: 45, baselineCrowd: 40, category: 'Heritage', address: 'Govardhan', reportCount: 87 },
  { id: 9, _id: 'loc_009', name: 'Kusum Sarovar', lat: 27.5100, lng: 77.4700, latitude: 27.5100, longitude: 77.4700, crowdScore: 32, currentCrowdScore: 32, baselineCrowd: 30, category: 'Heritage', address: 'Govardhan', reportCount: 56 },
  { id: 10, _id: 'loc_010', name: 'Mathura Junction Railway', lat: 27.4746, lng: 77.6739, latitude: 27.4746, longitude: 77.6739, crowdScore: 70, currentCrowdScore: 70, baselineCrowd: 65, category: 'Transit', address: 'Mathura', reportCount: 201 },
  { id: 11, _id: 'loc_011', name: 'Nidhivan', lat: 27.5811, lng: 77.6983, latitude: 27.5811, longitude: 77.6983, crowdScore: 58, currentCrowdScore: 58, baselineCrowd: 55, category: 'Heritage', address: 'Vrindavan', reportCount: 134 },
  { id: 12, _id: 'loc_012', name: 'Radha Kund', lat: 27.5048, lng: 77.4635, latitude: 27.5048, longitude: 77.4635, crowdScore: 38, currentCrowdScore: 38, baselineCrowd: 35, category: 'Heritage', address: 'Govardhan', reportCount: 72 },
  { id: 13, _id: 'loc_013', name: 'Government Museum Mathura', lat: 27.4997, lng: 77.6701, latitude: 27.4997, longitude: 77.6701, crowdScore: 25, currentCrowdScore: 25, baselineCrowd: 25, category: 'Heritage', address: 'Mathura', reportCount: 45 },
  { id: 14, _id: 'loc_014', name: 'Vrindavan Bus Stand', lat: 27.5789, lng: 77.6912, latitude: 27.5789, longitude: 77.6912, crowdScore: 65, currentCrowdScore: 65, baselineCrowd: 60, category: 'Transit', address: 'Vrindavan', reportCount: 178 },
  { id: 15, _id: 'loc_015', name: 'Seva Kunj', lat: 27.5820, lng: 77.6975, latitude: 27.5820, longitude: 77.6975, crowdScore: 50, currentCrowdScore: 50, baselineCrowd: 45, category: 'Heritage', address: 'Vrindavan', reportCount: 112 },
  { id: 16, _id: 'loc_016', name: 'Rangji Temple', lat: 27.5804, lng: 77.6965, latitude: 27.5804, longitude: 77.6965, crowdScore: 42, currentCrowdScore: 42, baselineCrowd: 40, category: 'Temple', address: 'Vrindavan', reportCount: 95 },
];

export const demoRoutes = [
  {
    id: 'route-a',
    label: 'Route A',
    recommendation: 'Fastest Route',
    recommendationType: 'fastest',
    duration: 28,
    distance: 12.4,
    crowdDensity: 72,
    crowdExposure: 65,
    comfortScore: 3.8,
    steps: [
      'Start from Mathura Junction',
      'Head north on NH-2 for 3.2 km',
      'Turn right onto Vrindavan Road',
      'Continue for 5.1 km through bypass',
      'Turn left at Chhatikara crossing',
      'Continue to Banke Bihari Temple',
    ],
    waypoints: [
      [27.4746, 77.6739],
      [27.4850, 77.6750],
      [27.5000, 77.6800],
      [27.5200, 77.6850],
      [27.5500, 77.6900],
      [27.5700, 77.6950],
      [27.5833, 77.6997],
    ],
    color: '#38BDF8',
  },
  {
    id: 'route-b',
    label: 'Route B',
    recommendation: 'Least Crowded',
    recommendationType: 'leastCrowded',
    duration: 35,
    distance: 15.1,
    crowdDensity: 35,
    crowdExposure: 28,
    comfortScore: 4.5,
    steps: [
      'Start from Mathura Junction',
      'Head east on Station Road for 1.5 km',
      'Turn north onto Govind Nagar Road',
      'Continue through residential areas 6.8 km',
      'Take the outer ring bypass',
      'Enter Vrindavan from east gate',
      'Continue to Banke Bihari Temple',
    ],
    waypoints: [
      [27.4746, 77.6739],
      [27.4800, 77.6850],
      [27.4950, 77.6900],
      [27.5150, 77.7000],
      [27.5400, 77.7050],
      [27.5650, 77.7020],
      [27.5833, 77.6997],
    ],
    color: '#22C55E',
  },
  {
    id: 'route-c',
    label: 'Route C',
    recommendation: 'Balanced',
    recommendationType: 'balanced',
    duration: 32,
    distance: 13.8,
    crowdDensity: 52,
    crowdExposure: 45,
    comfortScore: 4.1,
    steps: [
      'Start from Mathura Junction',
      'Head northwest on Dampier Nagar Road',
      'Continue through Krishna Nagar 4.2 km',
      'Join the Mathura-Vrindavan Road',
      'Continue on main road for 5.5 km',
      'Enter Vrindavan via south gate',
      'Continue to Banke Bihari Temple',
    ],
    waypoints: [
      [27.4746, 77.6739],
      [27.4830, 77.6700],
      [27.5000, 77.6750],
      [27.5250, 77.6830],
      [27.5500, 77.6880],
      [27.5700, 77.6940],
      [27.5833, 77.6997],
    ],
    color: '#F59E0B',
  },
];

export const demoAlerts = [
  {
    id: 1,
    type: 'danger',
    title: 'Extreme Crowd at Banke Bihari',
    message: 'Crowd density has exceeded 90% at Banke Bihari Temple. Consider alternative routes or visit later.',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    location: 'Banke Bihari Temple',
  },
  {
    id: 2,
    type: 'warning',
    title: 'High Traffic on NH-2',
    message: 'Heavy traffic reported on NH-2 between Mathura and Vrindavan. Expected delay: 20 minutes.',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    location: 'NH-2 Highway',
  },
  {
    id: 3,
    type: 'info',
    title: 'Festival Alert: Janmashtami Week',
    message: 'Janmashtami celebrations ongoing. All temples expected to have high crowd levels till next week.',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    location: 'All Locations',
  },
  {
    id: 4,
    type: 'success',
    title: 'Govardhan Hill: Low Crowds',
    message: 'Current crowd at Govardhan Hill is below 30%. Great time to visit!',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    location: 'Govardhan Hill',
  },
  {
    id: 5,
    type: 'warning',
    title: 'Road Closure Notice',
    message: 'Vrindavan Parikrama Marg closed for maintenance from 10 AM to 2 PM today.',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    location: 'Vrindavan',
  },
];

export const demoAnalytics = {
  hourlyCrowd: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    avgCrowd: Math.round(
      30 +
        40 * Math.sin(((i - 6) * Math.PI) / 12) * (i >= 5 && i <= 22 ? 1 : 0.3) +
        Math.random() * 10
    ),
    reports: Math.round(5 + 20 * Math.sin(((i - 8) * Math.PI) / 12) * (i >= 6 && i <= 21 ? 1 : 0.2)),
  })),
  weeklyTrends: [
    { day: 'Mon', avgCrowd: 55, peakCrowd: 78, reports: 42 },
    { day: 'Tue', avgCrowd: 48, peakCrowd: 72, reports: 38 },
    { day: 'Wed', avgCrowd: 52, peakCrowd: 75, reports: 45 },
    { day: 'Thu', avgCrowd: 58, peakCrowd: 82, reports: 51 },
    { day: 'Fri', avgCrowd: 65, peakCrowd: 88, reports: 63 },
    { day: 'Sat', avgCrowd: 78, peakCrowd: 95, reports: 89 },
    { day: 'Sun', avgCrowd: 82, peakCrowd: 98, reports: 95 },
  ],
  locationRankings: [
    { name: 'Banke Bihari', avgCrowd: 92, category: 'Temple' },
    { name: 'Krishna Janmabhoomi', avgCrowd: 85, category: 'Temple' },
    { name: 'Prem Mandir', avgCrowd: 78, category: 'Temple' },
    { name: 'Dwarkadhish', avgCrowd: 72, category: 'Temple' },
    { name: 'Mathura Junction', avgCrowd: 70, category: 'Transport' },
    { name: 'ISKCON Vrindavan', avgCrowd: 68, category: 'Temple' },
    { name: 'Vrindavan Bus Stand', avgCrowd: 65, category: 'Transport' },
    { name: 'Keshi Ghat', avgCrowd: 62, category: 'Ghat' },
    { name: 'Nidhivan', avgCrowd: 58, category: 'Temple' },
    { name: 'Vishram Ghat', avgCrowd: 55, category: 'Ghat' },
  ],
  crowdDistribution: [
    { name: 'Low', value: 25, fill: '#22C55E' },
    { name: 'Moderate', value: 35, fill: '#F59E0B' },
    { name: 'High', value: 28, fill: '#F97316' },
    { name: 'Extreme', value: 12, fill: '#EF4444' },
  ],
  reportsPerDay: [
    { date: 'Nov 17', reports: 45 },
    { date: 'Nov 18', reports: 52 },
    { date: 'Nov 19', reports: 38 },
    { date: 'Nov 20', reports: 67 },
    { date: 'Nov 21', reports: 73 },
    { date: 'Nov 22', reports: 89 },
    { date: 'Nov 23', reports: 61 },
  ],
};

export const demoJourneys = [
  {
    id: 1,
    source: 'Mathura Junction',
    destination: 'Banke Bihari Temple',
    date: new Date(Date.now() - 2 * 3600000).toISOString(),
    duration: 28,
    distance: 12.4,
    comfortScore: 4.2,
    crowdLevel: 'High',
    mode: 'car',
  },
  {
    id: 2,
    source: 'ISKCON Vrindavan',
    destination: 'Prem Mandir',
    date: new Date(Date.now() - 24 * 3600000).toISOString(),
    duration: 12,
    distance: 2.1,
    comfortScore: 4.7,
    crowdLevel: 'Low',
    mode: 'walking',
  },
  {
    id: 3,
    source: 'Vishram Ghat',
    destination: 'Govardhan Hill',
    date: new Date(Date.now() - 48 * 3600000).toISOString(),
    duration: 45,
    distance: 24.3,
    comfortScore: 3.9,
    crowdLevel: 'Moderate',
    mode: 'transit',
  },
  {
    id: 4,
    source: 'Mathura Junction',
    destination: 'Dwarkadhish Temple',
    date: new Date(Date.now() - 72 * 3600000).toISOString(),
    duration: 15,
    distance: 3.8,
    comfortScore: 3.5,
    crowdLevel: 'High',
    mode: 'twoWheeler',
  },
  {
    id: 5,
    source: 'Keshi Ghat',
    destination: 'Nidhivan',
    date: new Date(Date.now() - 96 * 3600000).toISOString(),
    duration: 8,
    distance: 0.9,
    comfortScore: 4.8,
    crowdLevel: 'Low',
    mode: 'walking',
  },
];

export function generateDemoCrowdData() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeOfDay = hour + minute / 60;

  // Crowd varies by time of day — peaks at 10 AM and 6 PM
  const morningPeak = Math.exp(-Math.pow(timeOfDay - 10, 2) / 8) * 40;
  const eveningPeak = Math.exp(-Math.pow(timeOfDay - 18, 2) / 8) * 35;
  const baseLevel = 20;

  return demoLocations.map((loc) => {
    const categoryMultiplier =
      loc.category === 'Temple' ? 1.3 :
      loc.category === 'Transport' ? 1.1 :
      loc.category === 'Ghat' ? 1.0 : 0.8;

    const rawScore = (baseLevel + morningPeak + eveningPeak) * categoryMultiplier;
    const jitter = (Math.random() - 0.5) * 15;
    const crowdScore = Math.min(100, Math.max(5, Math.round(rawScore + jitter)));

    const trend =
      hour >= 6 && hour <= 11 ? 'rising' :
      hour >= 12 && hour <= 14 ? 'stable' :
      hour >= 15 && hour <= 19 ? 'rising' :
      'falling';

    return {
      ...loc,
      crowdScore,
      trend,
      lastUpdated: now.toISOString(),
      predictedLevel: Math.min(100, Math.max(5, crowdScore + Math.round((Math.random() - 0.3) * 20))),
    };
  });
}

export function getCrowdLevel(score) {
  if (score <= 30) return { label: 'Low', color: '#22C55E', bg: 'bg-green-500', textColor: 'text-green-400' };
  if (score <= 55) return { label: 'Moderate', color: '#F59E0B', bg: 'bg-amber-500', textColor: 'text-amber-400' };
  if (score <= 75) return { label: 'High', color: '#F97316', bg: 'bg-orange-500', textColor: 'text-orange-400' };
  return { label: 'Extreme', color: '#EF4444', bg: 'bg-red-500', textColor: 'text-red-400' };
}

export function formatTimeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
