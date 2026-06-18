# 💰 Empire Builder — Deep Business Upgrade System Spec

> **Each business is a mini-game.** Beyond the simple level-up system, every business
> has 4 sub-systems modeled after real-world operations:
>
> 1. **Regions** — Geographic markets to expand into (unlock one at a time)
> 2. **Hubs/Locations** — Specific bases within each region (buy individually)
> 3. **Assets** — Physical equipment/inventory to purchase (small → mega)
> 4. **Licenses** — One-time regulatory/professional unlocks that gate progression
>
> Each region has a **completion %** tracked by how many hubs + assets + routes you own.
> Income scales with total coverage across all regions.

---

## Universal Systems

### Business Slots
- Player starts with **3 business slots**
- Earn more via milestones (net worth thresholds) or IAP
- Max 15 business slots
- Each business occupies 1 slot

### Income Formula
- **Base income per hour** = `baseIncome × (1 + level × 0.1)`
- **Region multiplier** = sum of all region completion %s / 100
- **Asset multiplier** = 1 + (total_assets × 0.05)
- **Hub bonus** = +2% income per owned hub
- **License bonus** = +10% income per owned license
- **Final income/hour** = base × region_mult × asset_mult × hub_mult × license_mult

### Regions (Universal)
All businesses share these 7 regions (unlock progressively):
| # | Region | Unlock Requirement |
|---|--------|-------------------|
| 1 | North America | Available from start (after buying business) |
| 2 | South America | $10K invested in business |
| 3 | Europe | $50K invested in business |
| 4 | Africa | $200K invested in business |
| 5 | Asia | $1M invested in business |
| 6 | Middle East | $10M invested in business |
| 7 | Oceania | $100M invested in business |

---

## TIER 1 — Street Hustler

---

### 1. 🌭 Hot Dog Stand
**Description:** Grill some dogs on the corner. Classic starter.

#### Hubs (per region)
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | New York City | Los Angeles | Chicago |
| South America | São Paulo | Buenos Aires | Bogotá |
| Europe | Berlin | London | Rome |
| Africa | Lagos | Cape Town | Nairobi |
| Asia | Tokyo | Bangkok | Mumbai |
| Middle East | Dubai | Istanbul | Riyadh |
| Oceania | Sydney | Auckland | Melbourne |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Borrowed Cart | $0 | +0% | What you start with. Rusted, dented. |
| 2 | Second-Hand Cart | $2K | +10% | Slightly cleaner, wheels actually work |
| 3 | Custom Push Cart | $15K | +25% | Your own design, insulated grill area |
| 4 | Branded Cart | $50K | +50% | Logo, colors, matching umbrella |
| 5 | Hot Dog Trailer | $200K | +100% | Towable trailer with full kitchen |
| 6 | Food Truck | $1M | +200% | Full mobile kitchen, health inspection A+ |
| 7 | Hot Dog Fleet (3 trucks) | $5M | +400% | Three trucks hitting different corners |
| 8 | Hot Dog Empire Van | $25M | +800% | Electric van with AI ordering system |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Street Vendor Permit | $500 | +10% income | Buy business |
| 2 | Food Handler's Certificate | $2K | +15% income | 3 hubs owned |
| 3 | Health Department A-Rating | $10K | +25% income | 10 hubs owned |
| 4 | Catering License | $50K | +30% income | 3 regions active |
| 5 | Franchise License | $500K | +50% income | All 7 regions active |

---

### 2. 🍋 Lemonade Cart
**Description:** Fresh-squeezed. Summer never ends.

#### Hubs (per region)
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Miami | San Diego | Phoenix |
| South America | Rio de Janeiro | Lima | Santiago |
| Europe | Barcelona | Nice | Lisbon |
| Africa | Marrakech | Accra | Dar es Salaam |
| Asia | Bali | Singapore | Kuala Lumpur |
| Middle East | Abu Dhabi | Doha | Muscat |
| Oceania | Brisbane | Perth | Fiji |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Wooden Crate Stand | $0 | +0% | A crate and a sign. Humble beginnings. |
| 2 | Folding Table Setup | $1.5K | +10% | Proper table, real cups |
| 3 | Insulated Cooler Cart | $8K | +25% | Keeps lemonade ice cold for hours |
| 4 | Branded Lemonade Cart | $30K | +50% | Custom cart with logo and ice shaver |
| 5 | Juice Bar Trailer | $120K | +100% | Full juice bar on wheels |
| 6 | Smoothie Truck | $500K | +200% | Expanded menu: smoothies, shakes, açaí |
| 7 | Juice Fleet (3 trucks) | $2.5M | +400% | Three trucks covering the city |
| 8 | Fresh Squeeze Co. Van | $12M | +800% | Premium electric juice van |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Temporary Vendor Permit | $300 | +10% income | Buy business |
| 2 | Food Safety Certification | $1.5K | +15% income | 3 hubs owned |
| 3 | Health Inspection Pass | $8K | +25% income | 10 hubs owned |
| 4 | Organic Certification | $30K | +30% income | 3 regions active |
| 5 | Beverage Distribution License | $250K | +50% income | All 7 regions active |

---

### 3. 📰 Newspaper Stand
**Description:** Headlines sell. Be the first on the corner.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Washington D.C. | Boston | Philadelphia |
| South America | Caracas | Montevideo | Medellín |
| Europe | Paris | Amsterdam | Vienna |
| Africa | Cairo | Johannesburg | Addis Ababa |
| Asia | Seoul | Hong Kong | Shanghai |
| Middle East | Beirut | Tel Aviv | Kuwait City |
| Oceania | Wellington | Adelaide | Brisbane |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Cardboard Box Display | $0 | +0% | Papers stacked on a box |
| 2 | Wooden News Rack | $1K | +10% | Proper display, weather-resistant |
| 3 | Metal Newsstand | $5K | +25% | Lockable, holds magazines too |
| 4 | Glass Display Stand | $20K | +50% | Theft-proof, backlit display |
| 5 | Corner News Kiosk | $80K | +100% | Full kiosk with snacks and drinks |
| 6 | Mini Convenience Store | $350K | +200% | Walls, roof, AC, the works |
| 7 | News & Snacks Chain (3) | $1.5M | +400% | Three stores across the city |
| 8 | Media Hub Flagship | $8M | +800% | Premium store with digital screens |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Street Retail Permit | $400 | +10% income | Buy business |
| 2 | Print Distribution License | $2K | +15% income | 3 hubs owned |
| 3 | Tobacco Sales Permit | $10K | +25% income | 10 hubs owned |
| 4 | Lottery Vendor License | $40K | +30% income | 3 regions active |
| 5 | National Distribution License | $300K | +50% income | All 7 regions active |

---

### 4. 🚗 Car Wash
**Description:** SOAP. RINSE. REPEAT. The cycle of profit.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Houston | Atlanta | Dallas |
| South America | Brasília | Valparaíso | Cali |
| Europe | Munich | Milan | Madrid |
| Africa | Nairobi | Accra | Casablanca |
| Asia | Osaka | Taipei | Ho Chi Minh City |
| Middle East | Riyadh | Manama | Amman |
| Oceania | Christchurch | Darwin | Canberra |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Bucket & Sponge Setup | $0 | +0% | A bucket, soap, and elbow grease |
| 2 | Pressure Washer Kit | $3K | +10% | Industrial sprayer, proper chemicals |
| 3 | Manual Wash Bay | $15K | +25% | Covered bay with drainage |
| 4 | Automatic Wash System | $60K | +50% | Roller brush system, timer controls |
| 5 | Premium Detailing Bay | $200K | +100% | Full detail shop, interior/exterior |
| 6 | Express Car Wash | $800K | +200% | Tunnel wash, 10 min turnaround |
| 7 | Car Wash Chain (3) | $3M | +400% | Three locations, branded |
| 8 | Smart Wash Hub | $15M | +800% | AI-guided, water recycling, EV charging |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Water Usage Permit | $600 | +10% income | Buy business |
| 2 | Environmental Compliance | $3K | +15% income | 3 hubs owned |
| 3 | Commercial Zoning License | $12K | +25% income | 10 hubs owned |
| 4 | Green Business Certification | $50K | +30% income | 3 regions active |
| 5 | National Franchise License | $400K | +50% income | All 7 regions active |

---

### 5. 🌿 Lawn Mowing
**Description:** Mow. Edge. Blow. Repeat. Cash grows like grass.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Orlando | Nashville | Charlotte |
| South America | Curitiba | Asunción | Quito |
| Europe | Stockholm | Copenhagen | Helsinki |
| Africa | Windhoek | Lusaka | Kampala |
| Asia | Chengdu | Hanoi | Hyderabad |
| Middle East | Muscat | Jeddah | Manama |
| Oceania | Perth | Hamilton | Samoa |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Borrowed Push Mower | $0 | +0% | Your neighbor's mower. Return it eventually. |
| 2 | Personal Push Mower | $2K | +10% | Your own. Self-propelled. |
| 3 | Riding Mower | $12K | +25% | Sit-down mower for big lawns |
| 4 | Commercial Mower Trailer | $40K | +50% | Truck + trailer setup, 3 crews |
| 5 | Zero-Turn Fleet | $150K | +100% | Multiple zero-turn mowers |
| 6 | Landscaping Business | $600K | +200% | Full landscaping: mowing, trimming, design |
| 7 | Green Empire (3 crews) | $2M | +400% | Three crews across the city |
| 8 | Smart Landscape Co. | $10M | +800% | Drone-guided mowing, robotic assistants |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Business Operating Permit | $500 | +10% income | Buy business |
| 2 | Pesticide Applicator License | $2K | +15% income | 3 hubs owned |
| 3 | Commercial Driver's License | $8K | +25% income | 10 hubs owned |
| 4 | Landscaping Contractor License | $30K | +30% income | 3 regions active |
| 5 | National Operations License | $200K | +50% income | All 7 regions active |

---

### 6. 🍕 Pizza Delivery
**Description:** Hot pies, fast feet. The original side hustle.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Detroit | Philadelphia | St. Louis |
| South America | Buenos Aires | Medellín | São Paulo |
| Europe | Naples | Athens | Krakow |
| Africa | Lagos | Casablanca | Addis Ababa |
| Asia | Seoul | Manila | Osaka |
| Middle East | Istanbul | Beirut | Amman |
| Oceania | Melbourne | Sydney | Auckland |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Home Oven Setup | $0 | +0% | Baking from your apartment |
| 2 | Used Pizza Oven | $3K | +10% | Second-hand deck oven |
| 3 | Delivery Bicycle | $15K | +25% | Thermal bag, city delivery |
| 4 | Commercial Pizza Kitchen | $50K | +50% | Proper kitchen, walk-in cooler |
| 5 | Delivery Scooter Fleet | $200K | +100% | 5 scooters, GPS tracking |
| 6 | Pizza Restaurant | $800K | +200% | Full sit-down + delivery |
| 7 | Pizza Chain (3 locations) | $3.5M | +400% | Three branded locations |
| 8 | Global Pizza Brand | $18M | +800% | Franchise-ready, app ordering |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Food Handler's Permit | $400 | +10% income | Buy business |
| 2 | Delivery Service License | $2K | +15% income | 3 hubs owned |
| 3 | Commercial Kitchen Permit | $10K | +25% income | 10 hubs owned |
| 4 | Health & Safety Certificate | $40K | +30% income | 3 regions active |
| 5 | Franchise Operations License | $350K | +50% income | All 7 regions active |

---

## TIER 2 — Small Business ($10K net worth)

---

### 7. ☕ Coffee Shop
**Description:** Bean there, done that. Now do it at scale.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Seattle | Portland | San Francisco |
| South America | Bogotá | Medellín | Montevideo |
| Europe | Vienna | Milan | Copenhagen |
| Africa | Addis Ababa | Nairobi | Cape Town |
| Asia | Tokyo | Seoul | Taipei |
| Middle East | Dubai | Riyadh | Muscat |
| Oceania | Melbourne | Sydney | Auckland |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | French Press Kit | $0 | +0% | One cup at a time. Artisan vibes. |
| 2 | Drip Coffee Machine | $5K | +10% | Auto-drip, 12-cup capacity |
| 3 | Espresso Machine | $25K | +25% | Semi-automatic, steam wand |
| 4 | Commercial Espresso Bar | $80K | +50% | Double group head, grinder, fridge |
| 5 | Roasted Bean Shop | $300K | +100% | In-house roaster, cupping bar |
| 6 | Café & Bakery | $1.2M | +200% | Full café with pastries and lunch |
| 7 | Coffee Chain (3 shops) | $5M | +400% | Branded locations across the city |
| 8 | Artisan Coffee Brand | $25M | +800% | Roastery, 10 locations, online sales |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Food Service License | $800 | +10% income | Buy business |
| 2 | Specialty Coffee Certification | $5K | +15% income | 3 hubs owned |
| 3 | Liquor License (Irish Coffee) | $20K | +25% income | 10 hubs owned |
| 4 | Organic Sourcing Certification | $60K | +30% income | 3 regions active |
| 5 | National Brand License | $500K | +50% income | All 7 regions active |

---

### 8. 👗 Clothing Boutique
**Description:** Style sells. Curate the look, name the price.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | New York | Miami | Las Vegas |
| South America | São Paulo | Buenos Aires | Lima |
| Europe | Milan | Paris | Barcelona |
| Africa | Lagos | Johannesburg | Casablanca |
| Asia | Seoul | Shanghai | Bangkok |
| Middle East | Dubai | Istanbul | Riyadh |
| Oceania | Sydney | Melbourne | Auckland |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Market Stall | $0 | +0% | Rack of clothes at the flea market |
| 2 | Pop-Up Shop | $8K | +10% | Weekend pop-up, folding displays |
| 3 | Small Retail Unit | $35K | +25% | Tiny shop, one fitting room |
| 4 | Boutique Store | $100K | +50% | Designed interior, mannequins, POS |
| 5 | Designer Studio | $400K | +100% | In-house design, limited collections |
| 6 | Flagship Store | $1.5M | +200% | Premium location, VIP lounge |
| 7 | Fashion Chain (3 stores) | $6M | +400% | Multiple locations, brand recognition |
| 8 | Fashion Empire | $30M | +800% | Global brand, e-commerce, runway shows |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Retail Business Permit | $1K | +10% income | Buy business |
| 2 | Import/Export License | $8K | +15% income | 3 hubs owned |
| 3 | Trademark Registration | $25K | +25% income | 10 hubs owned |
| 4 | Textile Quality Certification | $75K | +30% income | 3 regions active |
| 5 | International Brand License | $600K | +50% income | All 7 regions active |

---

### 9. 🔧 Auto Repair Shop
**Description:** Fix it right, charge it tight.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Detroit | Houston | Phoenix |
| South America | São Paulo | Mexico City | Santiago |
| Europe | Stuttgart | Birmingham | Turin |
| Africa | Johannesburg | Nairobi | Lagos |
| Asia | Osaka | Guangzhou | Chennai |
| Middle East | Dubai | Istanbul | Riyadh |
| Oceania | Melbourne | Brisbane | Perth |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Garage Jack & Tools | $0 | +0% | Basic hand tools, a floor jack |
| 2 | Used Hydraulic Lift | $8K | +10% | Two-post lift, proper wrenches |
| 3 | Full Tool Set + Air Compressor | $30K | +25% | Pneumatic tools, diagnostic scanner |
| 4 | 2-Bay Workshop | $100K | +50% | Two lifts, alignment machine |
| 5 | 4-Bay Auto Shop | $350K | +100% | Full service: tires, brakes, engine |
| 6 | Body Shop + Mechanical | $1.2M | +200% | Collision repair + mechanical |
| 7 | Multi-Location Garage (3) | $5M | +400% | Three shops, fleet accounts |
| 8 | Auto Service Center | $22M | +800% | 10-bay center, EV certified |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Auto Repair Permit | $1.2K | +10% income | Buy business |
| 2 | ASE Certification | $6K | +15% income | 3 hubs owned |
| 3 | Environmental Disposal License | $18K | +25% income | 10 hubs owned |
| 4 | Dealer Repair Authorization | $60K | +30% income | 3 regions active |
| 5 | National Service License | $450K | +50% income | All 7 regions active |

---

### 10. 👔 Laundromat
**Description:** Spin cycle profits. Clean money, literally.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | New York | Chicago | Boston |
| South America | Mexico City | Lima | Bogotá |
| Europe | Paris | Berlin | Barcelona |
| Africa | Lagos | Nairobi | Accra |
| Asia | Tokyo | Hong Kong | Manila |
| Middle East | Istanbul | Beirut | Dubai |
| Oceania | Sydney | Auckland | Melbourne |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Home Washer | $0 | +0% | Your apartment washer. Opens to neighbors. |
| 2 | 2 Commercial Washers | $10K | +10% | Coin-operated, proper commercial |
| 3 | 5-Washer Laundromat | $40K | +25% | Small space, 5 washers, 3 dryers |
| 4 | 10-Washer Shop | $120K | +50% | Vending machines, folding tables |
| 5 | Full Laundromat | $400K | +100% | 20 machines, wash-dry-fold service |
| 6 | Wash & Fold + Delivery | $1.5M | +200% | Pickup/delivery service added |
| 7 | Laundromat Chain (3) | $6M | +400% | Three locations, branded |
| 8 | Smart Laundry Hub | $28M | +800% | App-connected, card payment, eco-friendly |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Small Business License | $800 | +10% income | Buy business |
| 2 | Water Discharge Permit | $4K | +15% income | 3 hubs owned |
| 3 | Commercial Lease Permit | $15K | +25% income | 10 hubs owned |
| 4 | Delivery Service License | $50K | +30% income | 3 regions active |
| 5 | National Operations License | $400K | +50% income | All 7 regions active |

---

### 11. 📚 Bookstore
**Description:** Sell stories. Build your own.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Portland | Austin | Burlington |
| South America | Buenos Aires | Bogotá | São Paulo |
| Europe | Amsterdam | Edinburgh | Prague |
| Africa | Cape Town | Nairobi | Lagos |
| Asia | Taipei | Seoul | Kyoto |
| Middle East | Beirut | Abu Dhabi | Amman |
| Oceania | Melbourne | Wellington | Hobart |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Online Listing | $0 | +0% | Selling used books on a marketplace |
| 2 | Market Stall | $4K | +10% | Weekend book stall, milk crate display |
| 3 | Small Bookshop | $20K | +25% | Tiny storefront, floor-to-ceiling shelves |
| 4 | Cozy Bookstore | $60K | +50% | Reading nook, espresso corner |
| 5 | Bookstore & Café | $200K | +100% | Books + coffee + events |
| 6 | Literary Hub | $800K | +200% | Author signings, rare books section |
| 7 | Book Chain (3 shops) | $3M | +400% | Three locations, online store |
| 8 | Global Book Brand | $14M | +800% | Publishing house + retail + digital |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Retail Vendor Permit | $600 | +10% income | Buy business |
| 2 | ISBN Registration | $3K | +15% income | 3 hubs owned |
| 3 | Import License (foreign books) | $12K | +25% income | 10 hubs owned |
| 4 | Publishing License | $45K | +30% income | 3 regions active |
| 5 | National Distribution License | $350K | +50% income | All 7 regions active |

---

### 12. 🏋️ Gym
**Description:** No pain, no gain. No members, no profit.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Los Angeles | Miami | New York |
| South America | São Paulo | Bogotá | Santiago |
| Europe | London | Berlin | Barcelona |
| Africa | Lagos | Johannesburg | Nairobi |
| Asia | Tokyo | Seoul | Bangkok |
| Middle East | Dubai | Riyadh | Doha |
| Oceania | Sydney | Melbourne | Auckland |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Home Gym Setup | $0 | +0% | Basic dumbbells and a pull-up bar |
| 2 | Garage Gym | $8K | +10% | Squat rack, bench, Olympic bar |
| 3 | Small Studio | $35K | +25% | 200sqm, mirrors, 10 machines |
| 4 | Fitness Center | $120K | +50% | Cardio zone, weights, locker room |
| 5 | Full Gym | $400K | +100% | Pool, sauna, spin class studio |
| 6 | Premium Fitness Club | $1.5M | +200% | VIP, personal trainers, spa |
| 7 | Gym Chain (3 locations) | $6M | +400% | Three locations, app booking |
| 8 | Fitness Empire | $28M | +800% | 10 locations, wellness app, supplements |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Fitness Facility Permit | $1K | +10% income | Buy business |
| 2 | Personal Trainer Certification | $5K | +15% income | 3 hubs owned |
| 3 | Health & Safety Compliance | $18K | +25% income | 10 hubs owned |
| 4 | Swimming Pool License | $60K | +30% income | 3 regions active |
| 5 | National Franchise License | $500K | +50% income | All 7 regions active |

---

## TIER 3 — Mid-Range ($100K net worth)

---

### 13. 🍽️ Restaurant
**Description:** From food truck to Michelin stars.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | New York | San Francisco | Chicago |
| South America | São Paulo | Lima | Buenos Aires |
| Europe | Paris | Rome | Tokyo |
| Africa | Cape Town | Lagos | Marrakech |
| Asia | Tokyo | Hong Kong | Singapore |
| Middle East | Dubai | Beirut | Istanbul |
| Oceania | Sydney | Melbourne | Auckland |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Food Truck | $0 | +0% | Starting from the street |
| 2 | Food Trailer | $25K | +10% | Bigger kitchen, more menu items |
| 3 | Small Bistro | $100K | +25% | 20 seats, limited menu |
| 4 | Full Restaurant | $350K | +50% | 60 seats, bar, full kitchen |
| 5 | Fine Dining | $1.2M | +100% | White tablecloths, wine cellar |
| 6 | Chef's Table Experience | $4M | +200% | 12-seat tasting menu, exclusive |
| 7 | Restaurant Group (3) | $15M | +400% | Three concepts, shared kitchen |
| 8 | Michelin Empire | $60M | +800% | Multiple starred restaurants, brand |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Restaurant Operating License | $3K | +10% income | Buy business |
| 2 | Liquor License | $15K | +15% income | 3 hubs owned |
| 3 | Health Department Grade A | $30K | +25% income | 10 hubs owned |
| 4 | Entertainment License | $80K | +30% income | 3 regions active |
| 5 | International Franchise License | $800K | +50% income | All 7 regions active |

---

### 14. 🏨 Boutique Hotel
**Description:** A room for the night. A suite for a fortune.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | New York | Miami | Las Vegas |
| South America | Rio de Janeiro | Buenos Aires | Cartagena |
| Europe | Paris | Santorini | Florence |
| Africa | Cape Town | Zanzibar | Marrakech |
| Asia | Bali | Phuket | Kyoto |
| Middle East | Dubai | Doha | Muscat |
| Oceania | Fiji | Sydney | Queenstown |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Airbnb Listing | $0 | +0% | Rent out your spare room |
| 2 | Guesthouse (2 rooms) | $20K | +10% | Two rooms, shared bathroom |
| 3 | Small Inn (8 rooms) | $100K | +25% | Cozy inn, breakfast included |
| 4 | Boutique Hotel (20 rooms) | $500K | +50% | Designed interiors, concierge |
| 5 | Premium Hotel (50 rooms) | $2M | +100% | Spa, restaurant, rooftop bar |
| 6 | Luxury Resort | $8M | +200% | Pool, beach access, butler service |
| 7 | Hotel Chain (3 properties) | $30M | +400% | Branded hotels in 3 cities |
| 8 | Global Hotel Brand | $120M | +800% | 20+ properties, loyalty program |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Hospitality License | $5K | +10% income | Buy business |
| 2 | Tourism Board Registration | $15K | +15% income | 3 hubs owned |
| 3 | Fire Safety Certification | $35K | +25% income | 10 hubs owned |
| 4 | Casino License | $200K | +30% income | 3 regions active |
| 5 | International Hospitality License | $1.5M | +50% income | All 7 regions active |

---

### 15. 💻 Tech Startup
**Description:** From garage to IPO. The dream.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | San Francisco | Austin | New York |
| South America | São Paulo | Buenos Aires | Bogotá |
| Europe | London | Berlin | Stockholm |
| Africa | Lagos | Nairobi | Cape Town |
| Asia | Bangalore | Singapore | Tokyo |
| Middle East | Dubai | Tel Aviv | Riyadh |
| Oceania | Sydney | Melbourne | Auckland |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Laptop & WiFi | $0 | +0% | Coding from your bedroom |
| 2 | Co-working Desk | $5K | +10% | Hot desk in a co-working space |
| 3 | Small Office (5 desks) | $30K | +25% | Private office, meeting room |
| 4 | Startup Office (15 desks) | $120K | +50% | Open plan, server room, kitchen |
| 5 | Tech HQ (50 desks) | $500K | +100% | Full office, gym, cafeteria |
| 6 | Innovation Campus | $2M | +200% | Multiple floors, lab, demo room |
| 7 | Tech Campus (3 offices) | $8M | +400% | Offices in 3 cities |
| 8 | Global Tech HQ | $35M | +800% | Worldwide offices, 500+ employees |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Business Incorporation | $2K | +10% income | Buy business |
| 2 | Software Patent | $12K | +15% income | 3 hubs owned |
| 3 | Data Processing License | $30K | +25% income | 10 hubs owned |
| 4 | IPO Certification | $150K | +30% income | 3 regions active |
| 5 | Global Operations License | $1M | +50% income | All 7 regions active |

---

### 16. 🏢 Real Estate Agency
**Description:** Location, location, commission.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | New York | Los Angeles | Miami |
| South America | São Paulo | Mexico City | Bogotá |
| Europe | London | Paris | Dubai |
| Africa | Lagos | Cape Town | Nairobi |
| Asia | Hong Kong | Singapore | Tokyo |
| Middle East | Dubai | Riyadh | Doha |
| Oceania | Sydney | Auckland | Melbourne |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Business Cards & Clipboard | $0 | +0% | Walking neighborhoods, door-knocking |
| 2 | Car + Signage | $10K | +10% | Branded car, yard signs |
| 3 | Small Office | $40K | +25% | 2 desks, MLS access, lockboxes |
| 4 | Real Estate Office | $150K | +50% | 5 agents, window displays |
| 5 | Premium Agency | $500K | +100% | 15 agents, luxury listings |
| 6 | Commercial & Residential | $2M | +200% | Both markets, property management |
| 7 | Agency Chain (3 offices) | $8M | +400% | Three offices, 50 agents |
| 8 | Global Realty Brand | $35M | +800% | International, tech-powered |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Real Estate License | $3K | +10% income | Buy business |
| 2 | Broker License | $15K | +15% income | 3 hubs owned |
| 3 | Property Management License | $35K | +25% income | 10 hubs owned |
| 4 | Commercial Property License | $100K | +30% income | 3 regions active |
| 5 | International Real Estate License | $750K | +50% income | All 7 regions active |

---

### 17. 🏋️ Fitness Center
**Description:** Pump iron. Pump profits.

*(Uses same Hubs as Gym, but with upgraded assets. See Gym #12 for hub locations.)*

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Resistance Band Kit | $0 | +0% | Selling workout programs online |
| 2 | Small Pilates Studio | $15K | +10% | 10 reformers, mirrored walls |
| 3 | CrossFit Box | $50K | +25% | Open floor, rigs, rowers |
| 4 | Full Fitness Center | $200K | +50% | Weights, cardio, classes |
| 5 | Premium Gym + Spa | $700K | +100% | Pool, sauna, massage |
| 6 | Wellness Complex | $2.5M | +200% | Gym + spa + juice bar + yoga |
| 7 | Fitness Chain (3) | $10M | +400% | Three locations, app |
| 8 | Global Fitness Brand | $45M | +800% | Franchise, digital platform |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Fitness Facility Permit | $2K | +10% income | Buy business |
| 2 | Yoga/Meditation Certification | $8K | +15% income | 3 hubs owned |
| 3 | Swimming Pool License | $25K | +25% income | 10 hubs owned |
| 4 | Medical Wellness License | $80K | +30% income | 3 regions active |
| 5 | International Franchise License | $600K | +50% income | All 7 regions active |

---

### 18. 📱 Electronics Store
**Description:** Gadgets, gizmos, and gross margins.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | New York | San Francisco | Dallas |
| South America | São Paulo | Mexico City | Santiago |
| Europe | London | Munich | Amsterdam |
| Africa | Lagos | Johannesburg | Nairobi |
| Asia | Shenzhen | Seoul | Tokyo |
| Middle East | Dubai | Istanbul | Riyadh |
| Oceania | Sydney | Melbourne | Auckland |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Online Storefront | $0 | +0% | Selling refurbished phones online |
| 2 | Market Stall | $8K | +10% | Phone cases, chargers, accessories |
| 3 | Small Electronics Shop | $35K | +25% | 30sqm, display cases, repair counter |
| 4 | Retail Store | $120K | +50% | Full store: phones, laptops, TVs |
| 5 | Premium Electronics Store | $400K | +100% | Apple reseller, gaming section |
| 6 | Tech Megastore | $1.5M | +200% | 500sqm, experience zones, service desk |
| 7 | Electronics Chain (3) | $6M | +400% | Three stores, online platform |
| 8 | Global Electronics Brand | $28M | +800% | Own-brand products, worldwide |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Retail Electronics Permit | $1.5K | +10% income | Buy business |
| 2 | Electronics Repair License | $6K | +15% income | 3 hubs owned |
| 3 | Import License (electronics) | $20K | +25% income | 10 hubs owned |
| 4 | Carrier Partnership License | $70K | +30% income | 3 regions active |
| 5 | Global Distribution License | $500K | +50% income | All 7 regions active |

---

## TIER 4 — Corporate ($1M net worth)

---

### 19. 🏭 Manufacturing Plant
**Description:** Raw materials in. Big money out.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Detroit | Houston | Charlotte |
| South America | São Paulo | Monterrey | Buenos Aires |
| Europe | Munich | Lyon | Milan |
| Africa | Johannesburg | Lagos | Cairo |
| Asia | Guangzhou | Osaka | Mumbai |
| Middle East | Jeddah | Dubai | Ankara |
| Oceania | Melbourne | Brisbane | Auckland |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Home Workshop | $0 | +0% | Garage workshop, hand tools |
| 2 | Small Production Line | $50K | +10% | 1 conveyor, 2 machines |
| 3 | Medium Factory | $250K | +25% | 500sqm, 5 machines, 10 workers |
| 4 | Industrial Plant | $1M | +50% | 2000sqm, automated line |
| 5 | Large Manufacturing Facility | $4M | +100% | 5000sqm, robotic arms |
| 6 | Mega Factory | $15M | +200% | Full automation, quality lab |
| 7 | Factory Network (3 plants) | $50M | +400% | Plants in 3 regions |
| 8 | Global Manufacturing Corp | $200M | +800% | Worldwide, ISO certified |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Manufacturing Permit | $10K | +10% income | Buy business |
| 2 | ISO 9001 Certification | $30K | +15% income | 3 hubs owned |
| 3 | Environmental Impact License | $80K | +25% income | 10 hubs owned |
| 4 | Export License | $250K | +30% income | 3 regions active |
| 5 | Global Manufacturing License | $2M | +50% income | All 7 regions active |

---

### 20. 🏬 Shopping Mall
**Description:** Build it. Lease it. Collect rent forever.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | New York | Dallas | Los Angeles |
| South America | São Paulo | Mexico City | Santiago |
| Europe | London | Istanbul | Warsaw |
| Africa | Lagos | Johannesburg | Nairobi |
| Asia | Tokyo | Singapore | Dubai |
| Middle East | Dubai | Riyadh | Doha |
| Oceania | Sydney | Melbourne | Auckland |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Pop-Up Retail Space | $0 | +0% | Rent a kiosk for a weekend |
| 2 | Market Hall Stall | $30K | +10% | Permanent stall in a market hall |
| 3 | Strip Mall Unit | $150K | +25% | Lease a unit in a strip mall |
| 4 | Small Shopping Center | $800K | +50% | 20-unit center, parking lot |
| 5 | Full Shopping Mall | $3M | +100% | 100+ stores, food court, cinema |
| 6 | Premium Mall | $12M | +200% | Luxury brands, valet, concierge |
| 7 | Mall Network (3) | $40M | +400% | Three malls, centralized management |
| 8 | Global Mall Empire | $150M | +800% | Worldwide, REIT structure |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Commercial Property Permit | $15K | +10% income | Buy business |
| 2 | Fire Safety Certification | $40K | +15% income | 3 hubs owned |
| 3 | Entertainment Venue License | $100K | +25% income | 10 hubs owned |
| 4 | Food Court License | $250K | +30% income | 3 regions active |
| 5 | International Property License | $2M | +50% income | All 7 regions active |

---

### 21. 🖥️ Software Company
**Description:** Code is currency. Deploy to profit.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | San Francisco | Seattle | Austin |
| South America | São Paulo | Buenos Aires | Bogotá |
| Europe | London | Berlin | Stockholm |
| Africa | Lagos | Nairobi | Cape Town |
| Asia | Bangalore | Singapore | Tokyo |
| Middle East | Tel Aviv | Dubai | Riyadh |
| Oceania | Sydney | Melbourne | Auckland |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Personal Computer | $0 | +0% | Solo developer, coffee shop WiFi |
| 2 | Home Office Setup | $8K | +10% | Dual monitors, standing desk |
| 3 | Small Dev Team Office | $40K | +25% | 5 devs, whiteboards, snacks |
| 4 | Tech Office | $200K | +50% | 20 devs, server room, game room |
| 5 | Development Center | $800K | +100% | 50 engineers, QA lab, UX studio |
| 6 | Tech Campus | $3M | +200% | 150 engineers, cafeteria, gym |
| 7 | Multi-City Dev (3 offices) | $12M | +400% | Dev centers in 3 regions |
| 8 | Global Software Corp | $50M | +800% | 500+ engineers, AI lab, IPO |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Software Copyright | $5K | +10% income | Buy business |
| 2 | Security Audit Certification | $20K | +15% income | 3 hubs owned |
| 3 | SOC 2 Compliance | $50K | +25% income | 10 hubs owned |
| 4 | GDPR Compliance License | $150K | +30% income | 3 regions active |
| 5 | Global Enterprise License | $1M | +50% income | All 7 regions active |

---

### 22. 🏨 Hotel Chain
**Description:** Check in. Cash out. Repeat across continents.

*(Uses same Hubs as Boutique Hotel, but upgraded assets.)*

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Bed & Breakfast | $0 | +0% | 3 rooms in your house |
| 2 | Small Hotel (15 rooms) | $80K | +10% | Reception, breakfast room |
| 3 | Mid-Range Hotel (50 rooms) | $400K | +25% | Restaurant, meeting rooms |
| 4 | Business Hotel (100 rooms) | $1.5M | +50% | Gym, business center, bar |
| 5 | Full-Service Hotel (200 rooms) | $6M | +100% | Pool, spa, multiple restaurants |
| 6 | Luxury Hotel (300 rooms) | $20M | +200% | 5-star, penthouse suites |
| 7 | Hotel Chain (3 properties) | $60M | +400% | Branded hotels in 3 regions |
| 8 | Global Hotel Empire | $250M | +800% | 20+ properties, loyalty program |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Hotel Operating License | $15K | +10% income | Buy business |
| 2 | Star Rating Certification | $40K | +15% income | 3 hubs owned |
| 3 | Casino & Entertainment License | $200K | +25% income | 10 hubs owned |
| 4 | International Hotel License | $500K | +30% income | 3 regions active |
| 5 | Global Hospitality License | $3M | +50% income | All 7 regions active |

---

### 23. 🥂 Luxury Restaurant
**Description:** Fine dining. Finer margins.

*(Uses same Hubs as Restaurant, but premium locations.)*

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Catering from Home | $0 | +0% | Private chef events |
| 2 | Supper Club | $30K | +10% | 12-seat underground dining |
| 3 | Fine Dining Bistro | $150K | +25% | 30 seats, curated wine list |
| 4 | Upscale Restaurant | $600K | +50% | 80 seats, private dining room |
| 5 | Michelin-Starred Restaurant | $2.5M | +100% | 50 seats, tasting menu only |
| 6 | Celebrity Chef Restaurant | $8M | +200% | Brand-driven, media attention |
| 7 | Restaurant Group (3) | $25M | +400% | Three concepts, shared kitchen |
| 8 | Fine Dining Empire | $100M | +800% | Global, multiple stars, cookbook |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Premium Food License | $10K | +10% income | Buy business |
| 2 | Sommelier Certification | $25K | +15% income | 3 hubs owned |
| 3 | Import License (wines/spirits) | $80K | +25% income | 10 hubs owned |
| 4 | Entertainment & Events License | $200K | +30% income | 3 regions active |
| 5 | International Luxury License | $1.5M | +50% income | All 7 regions active |

---

### 24. 🏗️ Commercial Real Estate
**Description:** Buy land. Build towers. Collect rent.

*(Uses same Hubs as Real Estate Agency.)*

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Vacant Lot | $0 | +0% | Bought land on a deal |
| 2 | Small Office Building | $100K | +10% | 4-story building, 10 tenants |
| 3 | Office Complex | $500K | +25% | 3 buildings, parking garage |
| 4 | Commercial Tower | $2M | +50% | 20-story tower, retail base |
| 5 | Business Park | $8M | +100% | 5 buildings, landscaping, security |
| 6 | Downtown Skyscraper | $30M | +200% | Iconic tower, observation deck |
| 7 | Property Portfolio (3 cities) | $100M | +400% | Commercial properties in 3 regions |
| 8 | Global REIT | $400M | +800% | Worldwide, publicly traded |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Commercial Property License | $20K | +10% income | Buy business |
| 2 | Building Code Compliance | $60K | +15% income | 3 hubs owned |
| 3 | Environmental Impact Assessment | $150K | +25% income | 10 hubs owned |
| 4 | International Property License | $500K | +30% income | 3 regions active |
| 5 | Global Real Estate License | $4M | +50% income | All 7 regions active |

---

## TIER 5 — Mogul ($50M net worth)

---

### 25. ✈️ Airline
**Description:** Fly the skies. Own the clouds.

#### Hubs (per region — airport codes)
| Region | Hub 1 | Hub 2 | Hub 3 | Hub 4 |
|--------|-------|-------|-------|-------|
| North America | JFK | LAX | ORD | ATL |
| South America | GRU | EZE | BOG | SCL |
| Europe | LHR | CDG | FRA | AMS |
| Africa | JNB | CAI | ADD | LOS |
| Asia | NRT | SIN | PEK | BKK |
| Middle East | DXB | DOH | IST | AUH |
| Oceania | SYD | AKL | MEL | NAN |

#### Assets (Aircraft — like the screenshots!)
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Cessna 172 (4 seats) | $0 | +0% | Single prop, short hops |
| 2 | Embraer ERG-145 (50 seats) | $32M | +10% | Regional jet, small airports |
| 3 | Boeing 737-700 (150 seats) | $98M | +25% | Workhorse of the fleet |
| 4 | Airbus A320neo (180 seats) | $200M | +50% | Fuel-efficient, medium routes |
| 5 | Boeing 787-9 (250 seats) | $400M | +100% | Long-haul, premium cabins |
| 6 | Airbus A350-900 (350 seats) | $700M | +200% | Next-gen, ultra-efficient |
| 7 | Boeing 777-300ER (400 seats) | $1.2B | +400% | High-capacity long-haul |
| 8 | Airbus A380 (550 seats) | $2.5B | +800% | The jumbo. King of the skies. |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Air Operator Certificate | $500K | +10% income | Buy business |
| 2 | International Flying License | $2M | +15% income | 3 hubs owned |
| 3 | Safety Certification (IATA) | $5M | +25% income | 10 hubs owned |
| 4 | Open Skies Agreement | $20M | +30% income | 3 regions active |
| 5 | Global Aviation License | $100M | +50% income | All 7 regions active |

#### Routes (Flights)
Each hub pair = a route. Routes generate **bonus income** based on distance.
| Route Type | Example | Bonus |
|-----------|---------|-------|
| Domestic | JFK → LAX | +5% per flight |
| Continental | JFK → GRU | +15% per flight |
| Intercontinental | JFK → NRT | +30% per flight |
| Ultra Long-Haul | LHR → SYD | +50% per flight |

---

### 26. 🔌 Tech Conglomerate
**Description:** Hardware. Software. Everything-ware.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Silicon Valley | New York | Seattle |
| South America | São Paulo | Buenos Aires | Bogotá |
| Europe | London | Dublin | Zurich |
| Africa | Lagos | Nairobi | Cairo |
| Asia | Shenzhen | Bangalore | Seoul |
| Middle East | Dubai | Tel Aviv | Riyadh |
| Oceania | Sydney | Auckland | Melbourne |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Solo Consultant Setup | $0 | +0% | Laptop, LinkedIn, hustle |
| 2 | Small Tech Firm (5 devs) | $50K | +10% | Niche SaaS product |
| 3 | Mid-Size Tech Co (25 people) | $300K | +25% | Multiple products, B2B |
| 4 | Enterprise Tech (100 people) | $1.5M | +50% | Cloud platform, API ecosystem |
| 5 | Tech Giant (500 people) | $6M | +100% | AI, cloud, hardware divisions |
| 6 | Innovation Lab | $25M | +200% | R&D, quantum computing, robotics |
| 7 | Multi-Division Corp (3 HQ) | $80M | +400% | Three divisions across regions |
| 8 | Global Tech Conglomerate | $350M | +800% | Trillion-dollar company |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Tech Business License | $20K | +10% income | Buy business |
| 2 | Patent Portfolio | $100K | +15% income | 3 hubs owned |
| 3 | Government Contract License | $500K | +25% income | 10 hubs owned |
| 4 | AI Regulation License | $2M | +30% income | 3 regions active |
| 5 | Global Tech License | $15M | +50% income | All 7 regions active |

---

### 27. ⛏️ Mining Corporation
**Description:** Dig deep. Rich deeper.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Nevada | Colorado | Alaska |
| South America | Chile | Peru | Brazil |
| Europe | Sweden | Finland | Norway |
| Africa | DRC | Ghana | Tanzania |
| Asia | Mongolia | Indonesia | Australia |
| Middle East | Oman | Jordan | Turkey |
| Oceania | Western Australia | Papua New Guinea | New Zealand |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Panning Equipment | $0 | +0% | Gold panning in the river |
| 2 | Small Excavation Kit | $40K | +10% | Metal detector, small digger |
| 3 | Drilling Rig | $250K | +25% | Core sampling,地质 survey |
| 4 | Mining Operation | $1.2M | +50% | Open pit, dump trucks |
| 5 | Deep Mine | $5M | +100% | Underground, ventilation, rails |
| 6 | Mega Mine Complex | $20M | +200% | Processing plant, rail link |
| 7 | Mining Empire (3 sites) | $70M | +400% | Operations in 3 regions |
| 8 | Global Mining Corp | $300M | +800% | Worldwide, rare earth metals |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Prospecting License | $15K | +10% income | Buy business |
| 2 | Mining Claim License | $80K | +15% income | 3 hubs owned |
| 3 | Environmental Permit | $250K | +25% income | 10 hubs owned |
| 4 | Export License (minerals) | $1M | +30% income | 3 regions active |
| 5 | Global Mining License | $8M | +50% income | All 7 regions active |

---

### 28. 🏖️ Luxury Resort
**Description:** Paradise isn't free. But the profit is real.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Hawaii | Aspen | Malibu |
| South America | Maldives | Cancún | Cartagena |
| Europe | Santorini | Amalfi | Monaco |
| Africa | Seychelles | Zanzibar | Mauritius |
| Asia | Bali | Phuket | Maldives |
| Middle East | Dubai | Ras Al Khaimah | Oman |
| Oceania | Fiji | Bora Bora | Queenstown |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Beach Shack Rental | $0 | +0% | Rent a shack on the beach |
| 2 | Beachfront Bungalow | $40K | +10% | 2 rooms, ocean view |
| 3 | Small Beach Resort | $200K | +25% | 15 bungalows, restaurant |
| 4 | Tropical Resort | $1M | +50% | 50 rooms, pool, dive center |
| 5 | Luxury Beach Resort | $4M | +100% | 100 rooms, spa, golf |
| 6 | Ultra-Luxury Island | $15M | +200% | Private island, all-inclusive |
| 7 | Resort Chain (3 locations) | $50M | +400% | Branded resorts in 3 regions |
| 8 | Global Resort Empire | $200M | +800% | Worldwide luxury brand |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Tourism Resort License | $20K | +10% income | Buy business |
| 2 | Environmental Protection License | $80K | +15% income | 3 hubs owned |
| 3 | Marine Activity License | $250K | +25% income | 10 hubs owned |
| 4 | Casino & Entertainment License | $1M | +30% income | 3 regions active |
| 5 | International Resort License | $8M | +50% income | All 7 regions active |

---

### 29. 💊 Pharmaceutical Company
**Description:** Cure the world. Cash the checks.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | New Jersey | Boston | San Francisco |
| South America | São Paulo | Buenos Aires | Mexico City |
| Europe | Basel | London | Dublin |
| Africa | Cape Town | Lagos | Nairobi |
| Asia | Mumbai | Shanghai | Tokyo |
| Middle East | Dubai | Istanbul | Riyadh |
| Oceania | Sydney | Melbourne | Auckland |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Home Lab Setup | $0 | +0% | Basic chemistry set, research notes |
| 2 | Small Research Lab | $60K | +10% | Microscopes, centrifuge, fume hood |
| 3 | Pharmaceutical Lab | $350K | +25% | Clean room, HPLC, testing equipment |
| 4 | Production Facility | $1.5M | +50% | Manufacturing line, QC lab |
| 5 | R&D Center + Factory | $6M | +100% | Full pipeline: research → production |
| 6 | Pharma Campus | $25M | +200% | Clinical trials, multiple drugs |
| 7 | Multi-Site Pharma (3) | $80M | +400% | Research, production, distribution |
| 8 | Global Pharma Giant | $350M | +800% | Hundreds of drugs, worldwide |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Research Lab License | $30K | +10% income | Buy business |
| 2 | Drug Manufacturing License | $150K | +15% income | 3 hubs owned |
| 3 | FDA/EMA Approval | $500K | +25% income | 10 hubs owned |
| 4 | Clinical Trials License | $2M | +30% income | 3 regions active |
| 5 | Global Pharmaceutical License | $15M | +50% income | All 7 regions active |

---

### 30. 💰 Private Equity Fund
**Description:** Other people's money. Your profit.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | New York | Chicago | San Francisco |
| South America | São Paulo | Mexico City | Bogotá |
| Europe | London | Zurich | Luxembourg |
| Africa | Lagos | Johannesburg | Nairobi |
| Asia | Hong Kong | Singapore | Tokyo |
| Middle East | Dubai | Abu Dhabi | Riyadh |
| Oceania | Sydney | Melbourne | Auckland |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Personal Stock Portfolio | $0 | +0% | Trading your own savings |
| 2 | Angel Investing Fund | $50K | +10% | Investing in 3 startups |
| 3 | Small PE Fund ($5M AUM) | $300K | +25% | 10 portfolio companies |
| 4 | Mid-Size PE Fund ($50M AUM) | $1.5M | +50% | Leveraged buyouts |
| 5 | Major PE Fund ($500M AUM) | $6M | +1000% | Mega deals, board seats |
| 6 | Billion-Dollar Fund | $25M | +200% | Multiple funds, global deals |
| 7 | Multi-Fund Platform (3 regions) | $80M | +400% | Three regional funds |
| 8 | Global PE Empire | $350M | +800% | Trillion-dollar AUM |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Investment Advisor License | $25K | +10% income | Buy business |
| 2 | Fund Manager License | $120K | +15% income | 3 hubs owned |
| 3 | SEC/FCA Registration | $500K | +25% income | 10 hubs owned |
| 4 | Cross-Border Investment License | $2M | +30% income | 3 regions active |
| 5 | Global Financial License | $15M | +50% income | All 7 regions active |

---

## TIER 6 — Tycoon ($500M net worth)

---

### 31. 🚀 Space Agency
**Description:** The final frontier is the final profit center.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Cape Canaveral | Houston | Mojave |
| South America | Kourou (French Guiana) | Alcântara | Plesetsk |
| Europe | Baikonur | Kourou | Esrange |
| Africa | Hammaguir | San Marco | South Africa Space |
| Asia | Uchinoura | Jiuquan | Sriharikota |
| Middle East | Mohammed bin Rashid (UAE) | Tanegashima | Wadi Al-Jadid |
| Oceania | Woomera | Mahia | Christmas Island |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Weather Balloon | $0 | +0% | High-altitude balloon experiments |
| 2 | Sounding Rocket | $500K | +10% | Small suborbital rocket |
| 3 | Small Launch Vehicle | $5M | +25% | Can reach low Earth orbit |
| 4 | Medium Launch Vehicle | $30M | +50% | 1-ton payload to LEO |
| 5 | Heavy Launch Vehicle | $150M | +100% | 10-ton payload, reusable |
| 6 | Super Heavy Rocket | $500M | +200% | 100-ton payload, Moon capable |
| 7 | Orbital Station | $2B | +400% | Permanent space station |
| 8 | Mars Colony Ship | $10B | +800% | Interplanetary transport |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Launch Facility License | $100K | +10% income | Buy business |
| 2 | Orbital Operations License | $1M | +15% income | 3 hubs owned |
| 3 | Satellite Deployment License | $5M | +25% income | 10 hubs owned |
| 4 | International Space Treaty License | $25M | +30% income | 3 regions active |
| 5 | Global Space License | $200M | +50% income | All 7 regions active |

---

### 32. 🏝️ Private Island Resort
**Description:** Own the island. Name your price.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Bahamas | US Virgin Islands | Turks & Caicos |
| South America | Galápagos | Fernando de Noronha | San Andrés |
| Europe | Sardinia | Cyclades | Canary Islands |
| Africa | Seychelles | Zanzibar | Cape Verde |
| Asia | Maldives | Palawan | Komodo Islands |
| Middle East | Qatar (artificial islands) | Sir Bu Nair | Daymaniyat |
| Oceania | Fiji | Bora Bora | Cook Islands |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Tiny Sandbar | $0 | +0% | Just sand and palm trees |
| 2 | Beach Hut | $100K | +10% | Basic hut, generator, rainwater |
| 3 | Island Cottage | $800K | +25% | 3 villas, solar power, dock |
| 4 | Island Lodge | $4M | +50% | 10 rooms, restaurant, dive shop |
| 5 | Private Island Resort | $15M | +100% | 30 rooms, spa, helipad |
| 6 | Ultra-Luxury Island | $60M | +200% | 50 villas, butler, submarine |
| 7 | Island Chain (3 islands) | $200M | +400% | Three islands, yacht service |
| 8 | Global Island Empire | $800M | +800% | Private island brand worldwide |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Island Lease License | $50K | +10% income | Buy business |
| 2 | Marine Conservation License | $250K | +15% income | 3 hubs owned |
| 3 | International Maritime License | $1M | +25% income | 10 hubs owned |
| 4 | Casino Resort License | $5M | +30% income | 3 regions active |
| 5 | Global Luxury Resort License | $30M | +50% income | All 7 regions active |

---

### 33. 🎬 Movie Studio
**Description:** Lights. Camera. Profits.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Hollywood | Vancouver | Atlanta |
| South America | Rio de Janeiro | Buenos Aires | Mexico City |
| Europe | London | Paris | Rome |
| Africa | Lagos (Nollywood) | Cape Town | Nairobi |
| Asia | Mumbai (Bollywood) | Seoul | Tokyo |
| Middle East | Dubai | Istanbul | Riyadh |
| Oceania | Sydney | Auckland | Melbourne |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Smartphone Film Setup | $0 | +0% | Phone + tripod + free editing app |
| 2 | Indie Film Kit | $30K | +10% | DSLR, lighting, sound |
| 3 | Small Production House | $200K | +25% | 2 cameras, editing suite |
| 4 | Sound Stage Rental | $1M | +50% | Green screen, lighting grid |
| 5 | Production Studio | $4M | +100% | Full sound stages, post-production |
| 6 | Major Studio Lot | $15M | +200% | Multiple stages, backlot, screening room |
| 7 | Studio Complex (3 cities) | $50M | +400% | Production in 3 regions |
| 8 | Global Media Empire | $200M | +800% | Streaming platform, theme parks |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Film Production License | $20K | +10% income | Buy business |
| 2 | Distribution License | $100K | +15% income | 3 hubs owned |
| 3 | Union Contract License | $500K | +25% income | 10 hubs owned |
| 4 | Broadcasting License | $2M | +30% income | 3 regions active |
| 5 | Global Media License | $15M | +50% income | All 7 regions active |

---

### 34. 🛡️ Defense Contractor
**Description:** War is business. Business is war.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | Washington D.C. | Dallas | Huntsville |
| South America | Brasília | Bogotá | Santiago |
| Europe | London | Paris | Stockholm |
| Africa | Pretoria | Cairo | Abuja |
| Asia | Tokyo | Seoul | New Delhi |
| Middle East | Abu Dhabi | Riyadh | Tel Aviv |
| Oceania | Canberra | Wellington | Darwin |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Security Consulting Solo | $0 | +0% | Freelance security consultant |
| 2 | Small Defense Firm | $80K | +10% | 10 engineers, drone prototypes |
| 3 | Defense Contractor (100 staff) | $500K | +25% | Vehicles, surveillance systems |
| 4 | Defense Manufacturer | $2.5M | +50% | Factory, testing range |
| 5 | Major Defense Corp | $10M | +100% | Aircraft, naval systems, cyber |
| 6 | Defense Conglomerate | $40M | +200% | Multiple divisions, R&D lab |
| 7 | Multi-Nation Defense (3 HQ) | $150M | +400% | Operations in 3 regions |
| 8 | Global Defense Giant | $600M | +800% | Worldwide, classified contracts |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Defense Contractor License | $50K | +10% income | Buy business |
| 2 | Arms Manufacturing License | $300K | +15% income | 3 hubs owned |
| 3 | Classified Access License | $1.5M | +25% income | 10 hubs owned |
| 4 | International Arms License | $5M | +30% income | 3 regions active |
| 5 | Global Defense License | $25M | +50% income | All 7 regions active |

---

### 35. 🏦 Global Bank
**Description:** Lend money. Make money. Be the money.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | New York | Chicago | San Francisco |
| South America | São Paulo | Mexico City | Buenos Aires |
| Europe | London | Frankfurt | Zurich |
| Africa | Lagos | Johannesburg | Cairo |
| Asia | Hong Kong | Singapore | Tokyo |
| Middle East | Dubai | Riyadh | Bahrain |
| Oceania | Sydney | Auckland | Melbourne |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Personal Loan Business | $0 | +0% | Lending to friends (with interest) |
| 2 | Small Money Lender | $60K | +10% | Licensed money lender, 5 clients |
| 3 | Credit Union | $400K | +25% | Member-owned, basic services |
| 4 | Community Bank | $2M | +50% | 500 accounts, mortgage lending |
| 5 | Commercial Bank | $8M | +100% | Business loans, credit cards |
| 6 | Investment Bank | $30M | +200% | IPOs, M&A, trading desk |
| 7 | Banking Group (3 regions) | $100M | +400% | Banks in 3 regions |
| 8 | Global Bank | $400M | +800% | Worldwide, too big to fail |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Money Lender License | $30K | +10% income | Buy business |
| 2 | Banking Charter | $200K | +15% income | 3 hubs owned |
| 3 | Investment Banking License | $1M | +25% income | 10 hubs owned |
| 4 | International Banking License | $5M | +30% income | 3 regions active |
| 5 | Global Banking License | $30M | +50% income | All 7 regions active |

---

### 36. 🌐 Mega Corporation
**Description:** Conglomerate of conglomerates. The final boss.

#### Hubs
| Region | Hub 1 | Hub 2 | Hub 3 |
|--------|-------|-------|-------|
| North America | New York | San Francisco | Washington D.C. |
| South America | São Paulo | Mexico City | Bogotá |
| Europe | London | Paris | Berlin |
| Africa | Lagos | Johannesburg | Nairobi |
| Asia | Tokyo | Shanghai | Singapore |
| Middle East | Dubai | Riyadh | Doha |
| Oceania | Sydney | Melbourne | Auckland |

#### Assets
| # | Name | Cost | Income Bonus | Description |
|---|------|------|-------------|-------------|
| 1 | Sole Proprietorship | $0 | +0% | Freelancer doing everything |
| 2 | Small Conglomerate | $100K | +10% | 2 divisions, 50 employees |
| 3 | Medium Corp | $600K | +25% | 5 divisions, 500 employees |
| 4 | Large Corporation | $3M | +50% | 10 divisions, 5000 employees |
| 5 | Mega Corp | $12M | +100% | 20 divisions, 50,000 employees |
| 6 | Global Conglomerate | $50M | +200% | 50 divisions, 200,000 employees |
| 7 | Multi-Regional Empire (3 HQ) | $200M | +400% | Operations in all regions |
| 8 | World Domination Corp | $1B | +800% | Everything. Everywhere. Forever. |

#### Licenses
| # | Name | Cost | Bonus | Unlock Requirement |
|---|------|------|-------|-------------------|
| 1 | Corporation License | $50K | +10% income | Buy business |
| 2 | Multi-Industry License | $300K | +15% income | 3 hubs owned |
| 3 | International Trade License | $2M | +25% income | 10 hubs owned |
| 4 | Global Conglomerate License | $10M | +30% income | 3 regions active |
| 5 | World Domination License | $50M | +50% income | All 7 regions active |

---

## Implementation Priority

### Phase 1 (MVP — Week 1-2)
- ✅ Core buy/upgrade/earn loop (ALREADY BUILT)
- ✅ 36 businesses across 6 tiers (ALREADY BUILT)
- ✅ Safe area fixes (ALREADY BUILT)
- 🔲 Clicker screen with tap-to-earn + floating "+$X"
- 🔲 Region system (unlock 7 regions per business)
- 🔲 Hub system (buy locations within regions)
- 🔲 Asset system (physical upgrades per business)
- 🔲 Coverage % per region

### Phase 2 (Week 3-4)
- 🔲 License system
- 🔲 Business slots (3 → 15 max)
- 🔲 Route system (for Airline)
- 🔲 Business mergers
- 🔲 Holding companies

### Phase 3 (Week 5+)
- 🔲 Monopoly board mini-game
- 🔲 Daily rewards
- 🔲 Achievements integration
- 🔲 Sound effects & music
- 🔲 Cloud save (Firebase)
- 🔲 Premium currency & IAP

---

## TypeScript Types for New Systems

```typescript
// Each business now has sub-systems
interface BusinessState {
  id: string;
  owned: boolean;
  level: number;
  totalInvested: number;
  
  // Sub-systems
  regions: Record<string, RegionState>;
  assets: string[];  // owned asset IDs
  licenses: string[];  // owned license IDs
}

interface RegionState {
  unlocked: boolean;
  hubs: Record<string, boolean>;  // hub name → owned
  coverage: number;  // 0-100%
}

// Region definitions per business
interface RegionDef {
  id: string;
  name: string;
  unlockRequirement: number;  // investment needed to unlock
  hubs: HubDef[];
}

interface HubDef {
  id: string;
  name: string;
  subtitle: string;  // e.g. "San Jose International Airport"
  cost: number;
  incomeBonus: number;  // percentage
}

interface AssetDef {
  id: string;
  name: string;
  cost: number;
  incomeBonus: number;  // percentage
  description: string;
  tier: number;  // 1-8, unlock order
}

interface LicenseDef {
  id: string;
  name: string;
  cost: number;
  incomeBonus: number;  // percentage
  unlockRequirement: string;  // e.g. "3 hubs owned"
}

// Full business definition now includes sub-systems
interface BusinessDefV2 {
  id: string;
  name: string;
  description: string;
  category: BusinessCategory;
  tier: number;
  icon: string;
  
  // Core economics
  baseCost: number;
  baseIncome: number;  // per hour
  costMultiplier: number;
  maxLevel: number;
  
  // Sub-systems
  regions: RegionDef[];
  assets: AssetDef[];
  licenses: LicenseDef[];
}
```
