export type Gym = {
  id: string
  name: string
  city: string
  country: 'NZ' | 'AU'
}

// Verified by user as of April 2026. Add new gyms at the bottom of the relevant section.
// Names must be unique. Convention: "<Brand> <Suburb>" when a city has multiple venues.
// Custom gyms use the "custom:<name>" id prefix and are never stored here.
export const GYMS: Gym[] = [

  // ─────────────────────────────────────────────────────────────────────────────
  // NEW ZEALAND
  // ─────────────────────────────────────────────────────────────────────────────

  // Auckland
  { id: 'auckland-climbing-gym',          name: 'Auckland Climbing Gym',             city: 'Auckland',       country: 'NZ' },
  { id: 'birkenhead-leisure',             name: 'Birkenhead Pool & Leisure Centre',  city: 'Auckland',       country: 'NZ' },
  { id: 'boulder-co-westgate',            name: 'Boulder Co Westgate',               city: 'Auckland',       country: 'NZ' },
  { id: 'clip-n-climb-albany',            name: "Clip 'n Climb Albany",              city: 'Auckland',       country: 'NZ' },
  { id: 'clip-n-climb-balmoral',          name: "Clip 'n Climb Balmoral",            city: 'Auckland',       country: 'NZ' },
  { id: 'extreme-edge-panmure',           name: 'Extreme Edge Panmure',              city: 'Auckland',       country: 'NZ' },
  { id: 'northern-rocks',                 name: 'Northern Rocks',                    city: 'Auckland',       country: 'NZ' },
  { id: 'vertical-adventures',            name: 'Vertical Adventures',               city: 'Auckland',       country: 'NZ' },

  // Waikato
  { id: 'boulder-co-hamilton',            name: 'Boulder Co Hamilton',               city: 'Hamilton',       country: 'NZ' },
  { id: 'extreme-edge-hamilton',          name: 'Extreme Edge Hamilton',             city: 'Hamilton',       country: 'NZ' },
  { id: 'harvest-rock',                   name: 'Harvest Rock',                      city: 'Otorohanga',     country: 'NZ' },

  // Bay of Plenty
  { id: 'rock-house-mt-maunganui',        name: 'The Rock House',                    city: 'Mt Maunganui',   country: 'NZ' },
  { id: 'rocktopia-mt-maunganui',         name: 'Rocktopia',                         city: 'Mt Maunganui',   country: 'NZ' },

  // Central North Island
  { id: 'taupo-events-centre',            name: 'Taupo Events Centre',               city: 'Taupo',          country: 'NZ' },
  { id: 'the-wall-rotorua',               name: 'The Wall',                          city: 'Rotorua',        country: 'NZ' },
  { id: 'turangi-climbing-gym',           name: 'Turangi Climbing Gym',              city: 'Turangi',        country: 'NZ' },
  { id: 'vertigo-ohakune',                name: 'Vertigo Climbing Centre',           city: 'Ohakune',        country: 'NZ' },

  // Taranaki / Manawatu
  { id: 'crux-taranaki',                  name: 'The Crux Climbing Gym',             city: 'New Plymouth',   country: 'NZ' },
  { id: 'massey-palmerston-north',        name: 'Massey University Climbing Wall',   city: 'Palmerston North', country: 'NZ' },

  // Wellington
  { id: 'faultline-wellington',           name: 'Faultline Climbing',                city: 'Wellington',     country: 'NZ' },
  { id: 'fergs-wellington',               name: 'Fergs Kayaks',                      city: 'Wellington',     country: 'NZ' },
  { id: 'clip-n-climb-wellington',        name: "Clip 'n Climb Wellington",          city: 'Wellington',     country: 'NZ' },
  { id: 'hangdog-lower-hutt',             name: 'HangDog Climbing Centre',           city: 'Lower Hutt',     country: 'NZ' },

  // Christchurch
  { id: 'adventure-centre-chch',          name: 'The Kind Foundation',               city: 'Christchurch',   country: 'NZ' },
  { id: 'boulder-co-christchurch',        name: 'Boulder Co Christchurch',           city: 'Christchurch',   country: 'NZ' },
  { id: 'clip-n-climb-christchurch',      name: "Clip 'n Climb Christchurch",        city: 'Christchurch',   country: 'NZ' },
  { id: 'uprising-christchurch',          name: 'Uprising Boulder Gym',              city: 'Christchurch',   country: 'NZ' },

  // Queenstown / Wanaka
  { id: 'basecamp-queenstown',            name: 'Basecamp Adventures Queenstown',    city: 'Queenstown',     country: 'NZ' },
  { id: 'clip-n-climb-queenstown',        name: "Clip 'n Climb Queenstown",          city: 'Queenstown',     country: 'NZ' },
  { id: 'basecamp-wanaka',               name: 'Basecamp Adventures Wanaka',        city: 'Wanaka',         country: 'NZ' },
  { id: 'clip-n-climb-wanaka',            name: "Clip 'n Climb Wanaka",             city: 'Wanaka',         country: 'NZ' },

  // Dunedin / Southland
  { id: 'clip-n-climb-dunedin',           name: "Clip 'n Climb Dunedin",             city: 'Dunedin',        country: 'NZ' },
  { id: 'resistance-climbing-dunedin',    name: 'Resistance Climbing',               city: 'Dunedin',        country: 'NZ' },
  { id: 'ymca-invercargill',              name: 'YMCA Climbing Wall',                city: 'Invercargill',   country: 'NZ' },

  // ─────────────────────────────────────────────────────────────────────────────
  // AUSTRALIA — New South Wales
  // ─────────────────────────────────────────────────────────────────────────────

  // Sydney — 9 Degrees
  { id: '9-degrees-alexandria',           name: '9 Degrees Alexandria',              city: 'Sydney',         country: 'AU' },
  { id: '9-degrees-lane-cove',            name: '9 Degrees Lane Cove',               city: 'Sydney',         country: 'AU' },
  { id: '9-degrees-parramatta',           name: '9 Degrees Parramatta',              city: 'Sydney',         country: 'AU' },
  { id: '9-degrees-waterloo',             name: '9 Degrees Waterloo',                city: 'Sydney',         country: 'AU' },

  // Sydney — BlocHaus
  { id: 'blochaus-marrickville',          name: 'BlocHaus Marrickville',             city: 'Sydney',         country: 'AU' },

  // Sydney — Climb Fit
  { id: 'climbfit-kirrawee',              name: 'Climbfit Kirrawee',                 city: 'Sydney',         country: 'AU' },
  { id: 'climbfit-st-leonards',           name: 'Climbfit St Leonards',              city: 'Sydney',         country: 'AU' },

  // Sydney — SICG
  { id: 'sicg-st-peters',                 name: 'SICG St Peters',                    city: 'Sydney',         country: 'AU' },
  { id: 'sicg-villawood',                 name: 'SICG Villawood',                    city: 'Sydney',         country: 'AU' },

  // Sydney — Nomad / Skywood / Other
  { id: 'beta-one-south-granville',       name: 'Beta One',                          city: 'Sydney',         country: 'AU' },
  { id: 'nomad-annandale',                name: 'Nomad Bouldering Annandale',        city: 'Sydney',         country: 'AU' },
  { id: 'nomad-gladesville',              name: 'Nomad Bouldering Gladesville',      city: 'Sydney',         country: 'AU' },
  { id: 'skywood-bondi-junction',         name: 'Skywood Climbing Bondi Junction',   city: 'Sydney',         country: 'AU' },
  { id: 'skywood-freshwater',             name: 'Skywood Climbing Freshwater',       city: 'Sydney',         country: 'AU' },
  { id: 'the-ledge-sydney-uni',           name: 'The Ledge',                         city: 'Sydney',         country: 'AU' },

  // NSW Regional
  { id: 'camp-street-katoomba',           name: 'Camp Street Climbing',              city: 'Katoomba',       country: 'AU' },
  { id: 'climbing-jungle-ballina',        name: 'Climbing Jungle',                   city: 'Ballina',        country: 'AU' },
  { id: 'hangdog-wollongong',             name: 'Hangdog Climbing Gym',              city: 'Wollongong',     country: 'AU' },
  { id: 'pulse-adamstown',                name: 'Pulse Climbing Adamstown',          city: 'Newcastle',      country: 'AU' },
  { id: 'pulse-gosford',                  name: 'Pulse Climbing Gosford',            city: 'Gosford',        country: 'AU' },
  { id: 'pulse-maitland',                 name: 'Pulse Climbing Maitland',           city: 'Maitland',       country: 'AU' },
  { id: 'pulse-warners-bay',              name: 'Pulse Climbing Warners Bay',        city: 'Newcastle',      country: 'AU' },
  { id: 'the-climbing-centre-penrith',    name: 'The Climbing Centre',               city: 'Penrith',        country: 'AU' },

  // ─────────────────────────────────────────────────────────────────────────────
  // AUSTRALIA — Victoria
  // ─────────────────────────────────────────────────────────────────────────────

  // Melbourne — BlocHaus
  { id: 'blochaus-port-melbourne',        name: 'BlocHaus Port Melbourne',           city: 'Melbourne',      country: 'AU' },

  // Melbourne — Boulder Lab
  { id: 'boulder-lab-brunswick',          name: 'Boulder Lab Brunswick',             city: 'Melbourne',      country: 'AU' },
  { id: 'boulder-lab-clayton',            name: 'Boulder Lab Clayton',               city: 'Melbourne',      country: 'AU' },
  { id: 'boulder-lab-ferntree-gully',     name: 'Boulder Lab Ferntree Gully',        city: 'Melbourne',      country: 'AU' },

  // Melbourne — Hardrock
  { id: 'hardrock-cbd',                   name: 'Hardrock Climbing CBD',             city: 'Melbourne',      country: 'AU' },
  { id: 'hardrock-nunawading',            name: 'Hardrock Climbing Nunawading',      city: 'Melbourne',      country: 'AU' },

  // Melbourne — Northside Boulders
  { id: 'northside-boulders-abbotsford',  name: 'Northside Boulders Abbotsford',     city: 'Melbourne',      country: 'AU' },
  { id: 'northside-boulders-brunswick',   name: 'Northside Boulders Brunswick',      city: 'Melbourne',      country: 'AU' },
  { id: 'northside-boulders-northcote',   name: 'Northside Boulders Northcote',      city: 'Melbourne',      country: 'AU' },

  // Melbourne — Urban Climb
  { id: 'urban-climb-blackburn',          name: 'Urban Climb Blackburn',             city: 'Melbourne',      country: 'AU' },
  { id: 'urban-climb-collingwood',        name: 'Urban Climb Collingwood',           city: 'Melbourne',      country: 'AU' },

  // Melbourne — Other
  { id: 'burnley-bouldering-wall',        name: 'Burnley Bouldering Wall',           city: 'Melbourne',      country: 'AU' },
  { id: 'cliffhanger-altona-north',       name: 'Cliffhanger Altona North',          city: 'Melbourne',      country: 'AU' },
  { id: 'gravity-worx-pascoe-vale',       name: 'Gravity Worx',                      city: 'Melbourne',      country: 'AU' },
  { id: 'the-lactic-factory',             name: 'The Lactic Factory',                city: 'Melbourne',      country: 'AU' },

  // Victoria Regional
  { id: 'bayside-rock-carrum-downs',      name: 'Bayside Rock',                      city: 'Carrum Downs',   country: 'AU' },
  { id: 'the-boulder-hub-geelong',        name: 'The Boulder Hub Geelong',           city: 'Geelong',        country: 'AU' },

  // ─────────────────────────────────────────────────────────────────────────────
  // AUSTRALIA — Queensland
  // ─────────────────────────────────────────────────────────────────────────────

  // Brisbane — 9 Degrees
  { id: '9-degrees-enoggera',             name: '9 Degrees Enoggera',                city: 'Brisbane',       country: 'AU' },
  { id: '9-degrees-morningside',          name: '9 Degrees Morningside',             city: 'Brisbane',       country: 'AU' },

  // Brisbane — Urban Climb
  { id: 'urban-climb-milton',             name: 'Urban Climb Milton',                city: 'Brisbane',       country: 'AU' },
  { id: 'urban-climb-newstead',           name: 'Urban Climb Newstead',              city: 'Brisbane',       country: 'AU' },
  { id: 'urban-climb-west-end',           name: 'Urban Climb West End',              city: 'Brisbane',       country: 'AU' },

  // Brisbane — Other
  { id: 'beta-boulevard-acacia-ridge',    name: 'Beta Boulevard Acacia Ridge',       city: 'Brisbane',       country: 'AU' },
  { id: 'beta-boulevard-chandler',        name: 'Beta Boulevard Chandler',           city: 'Brisbane',       country: 'AU' },
  { id: 'crank-macgregor',                name: 'Crank Indoor Climbing',             city: 'Brisbane',       country: 'AU' },
  { id: 'rocksports-fortitude-valley',    name: 'Rocksports',                        city: 'Brisbane',       country: 'AU' },

  // QLD Coast
  { id: 'alpine-indoor-robina',           name: 'Alpine Indoor Climbing',            city: 'Gold Coast',     country: 'AU' },
  { id: 'boulder-heads-baringa',          name: 'Boulder Heads',                     city: 'Sunshine Coast', country: 'AU' },
  { id: 'core-climber-carrara',           name: 'Core Climber',                      city: 'Gold Coast',     country: 'AU' },
  { id: 'rockit-warana',                  name: 'Rockit Climbing Gym',               city: 'Sunshine Coast', country: 'AU' },

  // ─────────────────────────────────────────────────────────────────────────────
  // AUSTRALIA — Western Australia
  // ─────────────────────────────────────────────────────────────────────────────

  { id: 'adrenaline-vault-belmont',       name: 'Adrenaline Vault Belmont',          city: 'Perth',          country: 'AU' },
  { id: 'adrenaline-vault-cockburn',      name: 'Adrenaline Vault Cockburn',         city: 'Perth',          country: 'AU' },
  { id: 'city-summit-malaga',             name: 'City Summit',                       city: 'Perth',          country: 'AU' },
  { id: 'portside-boulders-canning-vale', name: 'Portside Boulders Canning Vale',    city: 'Perth',          country: 'AU' },
  { id: 'portside-boulders-oconnor',      name: "Portside Boulders O'Connor",        city: 'Perth',          country: 'AU' },
  { id: 'portside-boulders-osborne-park', name: 'Portside Boulders Osborne Park',    city: 'Perth',          country: 'AU' },
  { id: 'rockface-balcatta',              name: 'Rockface',                           city: 'Perth',          country: 'AU' },
  { id: 'the-boulder-hub-wangara',        name: 'The Boulder Hub Wangara',           city: 'Perth',          country: 'AU' },
  { id: 'the-hangout-bayswater',          name: 'The Hangout',                       city: 'Perth',          country: 'AU' },
  { id: 'urban-jungle-jandakot',          name: 'Urban Jungle',                      city: 'Perth',          country: 'AU' },

  // ─────────────────────────────────────────────────────────────────────────────
  // AUSTRALIA — South Australia
  // ─────────────────────────────────────────────────────────────────────────────

  { id: 'abc-thebarton',                  name: "Adelaide's Bouldering Club",         city: 'Adelaide',       country: 'AU' },
  { id: 'beyond-bouldering-clovelly-park', name: 'Beyond Bouldering Clovelly Park',  city: 'Adelaide',       country: 'AU' },
  { id: 'beyond-bouldering-kent-town',    name: 'Beyond Bouldering Kent Town',       city: 'Adelaide',       country: 'AU' },
  { id: 'beyond-bouldering-keswick',      name: 'Beyond Bouldering Keswick',         city: 'Adelaide',       country: 'AU' },
  { id: 'urban-climb-adelaide',           name: 'Urban Climb Adelaide',              city: 'Adelaide',       country: 'AU' },
  { id: 'vertical-reality-adelaide',      name: 'Vertical Reality',                  city: 'Adelaide',       country: 'AU' },

  // ─────────────────────────────────────────────────────────────────────────────
  // AUSTRALIA — ACT / TAS / NT
  // ─────────────────────────────────────────────────────────────────────────────

  { id: 'blochaus-fyshwick',              name: 'BlocHaus Fyshwick',                 city: 'Canberra',       country: 'AU' },
  { id: 'blochaus-mitchell',              name: 'BlocHaus Mitchell',                 city: 'Canberra',       country: 'AU' },
  { id: 'circ-belconnen',                 name: 'Canberra Indoor Rock Climbing Belconnen', city: 'Canberra',  country: 'AU' },
  { id: 'circ-hume',                      name: 'Canberra Indoor Rock Climbing Hume', city: 'Canberra',      country: 'AU' },
  { id: 'rock-it-hobart',                 name: 'Rock It Climbing Centre',           city: 'Hobart',         country: 'AU' },
  { id: 'the-rock-darwin',                name: 'The Rock',                          city: 'Darwin',         country: 'AU' },
]

export function filterGyms(query: string): Gym[] {
  const q = query.toLowerCase().trim()
  if (!q) return GYMS
  return GYMS.filter(
    (g) => g.name.toLowerCase().includes(q) || g.city.toLowerCase().includes(q),
  )
}

export function getGymById(id: string): Gym | undefined {
  return GYMS.find((g) => g.id === id)
}

/** Resolves a gymId to a display name, handling both static gyms and custom: prefixed entries. */
export function getGymName(gymId: string): string {
  if (gymId.startsWith('custom:')) return gymId.slice(7)
  return getGymById(gymId)?.name ?? gymId
}
