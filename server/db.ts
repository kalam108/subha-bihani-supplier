import fs from 'fs';
import path from 'path';
import {
  Product,
  Category,
  ServiceItem,
  ServiceRequest,
  Technician,
  Order,
  User,
  AuditLog,
  AdminStats,
} from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  services: ServiceItem[];
  serviceRequests: ServiceRequest[];
  technicians: Technician[];
  orders: Order[];
  users: User[];
  auditLogs: AuditLog[];
}

const initialCategories: Category[] = [
  { id: 'cat-elec', name: 'Electrical', slug: 'electrical', description: 'Wires, cables, circuit breakers, switches, and industrial distribution components.', itemCount: 8 },
  { id: 'cat-plumb', name: 'Plumbing', slug: 'plumbing', description: 'High-pressure CPVC/PPR pipes, fittings, valves, water tanks, and sanitary supplies.', itemCount: 8 },
  { id: 'cat-hard', name: 'Hardware', slug: 'hardware', description: 'Heavy-duty fasteners, door locks, structural brackets, abrasives, and building materials.', itemCount: 6 },
  { id: 'cat-elec-acc', name: 'Electrical Accessories', slug: 'electrical-accessories', description: 'Modular plates, cable ties, extension cords, insulation tapes, and conduits.', itemCount: 5 },
  { id: 'cat-plumb-acc', name: 'Plumbing Accessories', slug: 'plumbing-accessories', description: 'Teflon tapes, sealants, pipe clips, washers, and brass nipples.', itemCount: 5 },
  { id: 'cat-tools', name: 'Tools', slug: 'tools', description: 'Professional power drills, pipe wrenches, insulated screwdrivers, and precision measuring tools.', itemCount: 6 },
  { id: 'cat-other', name: 'Other Supplies', slug: 'other-supplies', description: 'Safety goggles, protective workwear, lubricants, and adhesive caulking.', itemCount: 4 },
];

const initialServices: ServiceItem[] = [
  {
    id: 'srv-elec-1',
    name: 'Electrical Installation',
    category: 'Electrical',
    description: 'Complete commercial or residential main distribution board, MCB/RCCB panels, and structured load balancing setup.',
    standardRate: '$45 / hr',
    estimatedDuration: '2 - 4 hours',
    commonIssues: ['New subpanel additions', '3-phase power line setup', 'Industrial machinery hookup'],
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    popular: true,
  },
  {
    id: 'srv-elec-2',
    name: 'Electrical Repair & Troubleshooting',
    category: 'Electrical',
    description: 'Rapid diagnostic tracing for short circuits, tripped breakers, voltage fluctuations, and damaged conduits.',
    standardRate: '$35 base inspection',
    estimatedDuration: '1 - 2 hours',
    commonIssues: ['Frequent circuit tripping', 'Sparks or burning smell', 'Dead wall outlets'],
    imageUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=600&q=80',
    popular: true,
  },
  {
    id: 'srv-elec-3',
    name: 'Complete House & Office Wiring',
    category: 'Electrical',
    description: 'Concealed or surface PVC conduit wiring with fire-retardant copper cables, grounding rods, and earthing compliance.',
    standardRate: '$0.85 / linear foot',
    estimatedDuration: '1 - 3 days',
    commonIssues: ['Old wiring replacement', 'Renovation rewire', 'High-current appliance circuits'],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-elec-4',
    name: 'Switch & Socket Installation',
    category: 'Electrical',
    description: 'Precision mounting of modular switch plates, smart home automation relays, GFCI waterproof outlets, and dimmers.',
    standardRate: '$15 / point',
    estimatedDuration: '30 - 60 mins',
    commonIssues: ['Loose socket contacts', 'Smart switch upgrades', 'Weatherproof outdoor boxes'],
    imageUrl: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-elec-5',
    name: 'Fan & Lighting Installation',
    category: 'Electrical',
    description: 'Assembly and secure ceiling mounting of heavy chandeliers, high-speed ceiling fans, LED downlights, and security floodlights.',
    standardRate: '$25 / fixture',
    estimatedDuration: '45 mins',
    commonIssues: ['Wobbly ceiling fan', 'High ceiling chandelier mounting', 'Recessed LED driver wiring'],
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-elec-6',
    name: 'Other Electrical Services',
    category: 'Electrical',
    description: 'Inverter/UPS battery backup installation, generator changeover switchgear, and earth resistance ohm testing.',
    standardRate: 'Custom Quotation',
    estimatedDuration: 'Varies',
    commonIssues: ['Emergency power backup integration', 'Lightning arrester grounding', 'Energy audit'],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-plumb-1',
    name: 'Pipe Installation & Pipeline Layout',
    category: 'Plumbing',
    description: 'Design and installation of high-durability CPVC hot water lines, PPR lines, drainage stacks, and underground water supply pipes.',
    standardRate: '$40 / hr',
    estimatedDuration: '2 - 6 hours',
    commonIssues: ['New plumbing lines', 'Overhead tank down-pipes', 'Kitchen remodel supply lines'],
    imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
    popular: true,
  },
  {
    id: 'srv-plumb-2',
    name: 'Pipe Repair & Joint Replacement',
    category: 'Plumbing',
    description: 'Fix cracked pipes, pressurized joint failures, freeze bursts, and rusted metal galvanized fittings with permanent seals.',
    standardRate: '$30 base + parts',
    estimatedDuration: '1 - 2 hours',
    commonIssues: ['Burst garden pipe', 'Dripping concealed joint', 'Low water pressure due to blockage'],
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
    popular: true,
  },
  {
    id: 'srv-plumb-3',
    name: 'Water Leakage & Seepage Repair',
    category: 'Plumbing',
    description: 'Advanced non-invasive acoustic leak detection, ceiling seepage investigation, and bathroom waterproofing fixes.',
    standardRate: '$50 diagnostic inspection',
    estimatedDuration: '2 - 3 hours',
    commonIssues: ['Damp wall plaster', 'Hidden slab water seepage', 'Unexplained high water meter bills'],
    imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80',
    popular: true,
  },
  {
    id: 'srv-plumb-4',
    name: 'Tap & Faucet Repair/Installation',
    category: 'Plumbing',
    description: 'Overhaul dripping sink mixers, replace ceramic cartridges, install high-flow showerheads and kitchen sensor taps.',
    standardRate: '$20 / fixture',
    estimatedDuration: '30 mins',
    commonIssues: ['Persistent faucet drip', 'Stiff mixer handle', 'Corroded valve stem'],
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-plumb-5',
    name: 'Bathroom Plumbing & Sanitary Fitting',
    category: 'Plumbing',
    description: 'End-to-end installation of wall-hung commodes, concealed cisterns, bath vanities, bottle traps, and glass shower enclosures.',
    standardRate: '$75 / bathroom suite',
    estimatedDuration: '3 - 5 hours',
    commonIssues: ['Slow drain floor waste', 'Toilet bowl flush valve leak', 'New vanity cabinet plumbing'],
    imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'srv-plumb-6',
    name: 'Other Plumbing Services',
    category: 'Plumbing',
    description: 'Deep cleaning and disinfection of overhead water tanks, booster pump pressure switch repair, and automatic float sensor installation.',
    standardRate: '$40 fixed base',
    estimatedDuration: '1 - 2 hours',
    commonIssues: ['Water pump air lock', 'Tank overflow float failure', 'Pressure booster failure'],
    imageUrl: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80',
  },
];

const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Schneider Electric Acti9 32A Double Pole MCB',
    slug: 'schneider-electric-32a-dp-mcb',
    category: 'Electrical',
    categoryId: 'cat-elec',
    sku: 'SCH-MCB-32DP',
    description: 'High breaking capacity (10kA) miniature circuit breaker engineered for reliable short-circuit and overload protection in residential and commercial distribution boards.',
    price: 24.50,
    originalPrice: 28.00,
    stock: 45,
    minStockAlert: 10,
    unit: 'piece',
    isFeatured: true,
    isActive: true,
    rating: 4.9,
    reviewsCount: 38,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    specifications: { 'Current Rating': '32 Amp', 'Number of Poles': '2 (Double Pole)', 'Breaking Capacity': '10kA', 'Operating Voltage': '240/415V AC', 'Mounting': 'DIN Rail' },
    createdAt: new Date('2026-01-10').toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Havells 2.5 sq mm FR Flame Retardant Copper Cable (90m)',
    slug: 'havells-2-5-fr-cable-90m',
    category: 'Electrical',
    categoryId: 'cat-elec',
    sku: 'HAV-CAB-25FR',
    description: '100% pure electrolytic high-conductivity copper conductor insulated with flame retardant PVC compound. Ideal for heavy home appliances like ACs, heaters, and geysers.',
    price: 68.00,
    originalPrice: 74.00,
    stock: 28,
    minStockAlert: 8,
    unit: 'roll (90m)',
    isFeatured: true,
    isActive: true,
    rating: 4.8,
    reviewsCount: 52,
    imageUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=600&q=80',
    specifications: { 'Cross Section': '2.5 sq mm', 'Length': '90 Meters', 'Conductor Material': 'Electrolytic Bare Copper', 'Insulation': 'Flame Retardant (FR) PVC', 'Voltage Grade': '1100V' },
    createdAt: new Date('2026-01-12').toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Philips 18W Slim Recessed LED Panel Light',
    slug: 'philips-18w-slim-led-panel',
    category: 'Electrical',
    categoryId: 'cat-elec',
    sku: 'PHI-LED-18W-CDL',
    description: 'Ultra-thin round recessed downlight providing uniform, glare-free daylight illumination (6500K). Energy saving up to 85% compared to incandescent fittings.',
    price: 14.20,
    originalPrice: 17.50,
    stock: 80,
    minStockAlert: 15,
    unit: 'piece',
    isFeatured: true,
    isActive: true,
    rating: 4.7,
    reviewsCount: 64,
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
    specifications: { 'Wattage': '18 Watts', 'Color Temperature': '6500K (Cool Daylight)', 'Luminous Flux': '1550 Lumens', 'Cutout Diameter': '185mm', 'Lifespan': '25,000 Hours' },
    createdAt: new Date('2026-01-15').toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Astral CPVC Pro High Pressure Pipe 1" SDR 11 (3m)',
    slug: 'astral-cpvc-pro-pipe-1-inch',
    category: 'Plumbing',
    categoryId: 'cat-plumb',
    sku: 'AST-CPVC-1IN-3M',
    description: 'Premium Chlorinated Polyvinyl Chloride piping suitable for hot and cold potable water applications up to 93°C. Non-toxic, corrosion-free, and scale-resistant.',
    price: 18.75,
    originalPrice: 21.00,
    stock: 65,
    minStockAlert: 12,
    unit: 'length (3m)',
    isFeatured: true,
    isActive: true,
    rating: 4.9,
    reviewsCount: 41,
    imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
    specifications: { 'Nominal Diameter': '1 inch (25mm)', 'Class': 'SDR 11', 'Working Temp': 'Up to 93°C', 'Standard': 'ASTM D2846', 'Jointing': 'Solvent Cement Weld' },
    createdAt: new Date('2026-01-16').toISOString(),
  },
  {
    id: 'prod-5',
    name: 'Jaquar Queen Monobloc Chrome Basin Mixer Tap',
    slug: 'jaquar-queen-basin-mixer-chrome',
    category: 'Plumbing',
    categoryId: 'cat-plumb',
    sku: 'JAQ-MIX-Q01',
    description: 'High quality solid brass body with multi-layer mirror chrome finish. Incorporates smooth ceramic disc cartridge for precise temperature and water volume blending.',
    price: 62.50,
    originalPrice: 72.00,
    stock: 19,
    minStockAlert: 5,
    unit: 'piece',
    isFeatured: true,
    isActive: true,
    rating: 4.8,
    reviewsCount: 29,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    specifications: { 'Body Material': 'Virgin Solid Brass', 'Finish': 'Electroless Mirror Chrome', 'Cartridge': '35mm Ceramic Disc', 'Aerator': 'Neoperl Honeycomb Water-saving', 'Warranty': '10 Years' },
    createdAt: new Date('2026-01-18').toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Supreme 110mm PVC SWR Drainage Pipe (3m)',
    slug: 'supreme-110mm-swr-pipe',
    category: 'Plumbing',
    categoryId: 'cat-plumb',
    sku: 'SUP-SWR-110MM',
    description: 'High impact soil, waste, and rainwater drainage pipe featuring factory-fitted rubber seal socket for fast, 100% leak-proof jointing without cement mess.',
    price: 22.00,
    originalPrice: 25.00,
    stock: 35,
    minStockAlert: 10,
    unit: 'length (3m)',
    isFeatured: false,
    isActive: true,
    rating: 4.6,
    reviewsCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
    specifications: { 'Diameter': '110 mm', 'Wall Thickness': '3.2 mm Type B', 'Joint Type': 'Ring-Fit Socket', 'Material': 'Unplasticized PVC', 'Standard': 'IS 13592' },
    createdAt: new Date('2026-01-20').toISOString(),
  },
  {
    id: 'prod-7',
    name: 'Bosch GSB 500W Professional Impact Drill Kit',
    slug: 'bosch-gsb-500w-impact-drill-kit',
    category: 'Tools',
    categoryId: 'cat-tools',
    sku: 'BOS-GSB-500KIT',
    description: 'Powerful 500W impact drill packaged with a rugged carry case and 100-piece accessory kit including masonry, metal, and wood bits, wall plugs, and hand tools.',
    price: 89.00,
    originalPrice: 99.00,
    stock: 14,
    minStockAlert: 4,
    unit: 'kit',
    isFeatured: true,
    isActive: true,
    rating: 4.9,
    reviewsCount: 77,
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
    specifications: { 'Rated Power': '500 Watts', 'No-load Speed': '0 - 2,600 RPM', 'Impact Rate': '0 - 41,600 BPM', 'Chuck Capacity': '10mm Keyed', 'Drilling Dia Masonry': '10mm' },
    createdAt: new Date('2026-01-22').toISOString(),
  },
  {
    id: 'prod-8',
    name: 'Stanley 14-inch Heavy Duty Cast Iron Pipe Wrench',
    slug: 'stanley-14-inch-heavy-duty-pipe-wrench',
    category: 'Tools',
    categoryId: 'cat-tools',
    sku: 'STA-PW-14IN',
    description: 'Ductile iron housing with drop-forged alloy steel hook and heel jaws. Full floating forged hook jaw with self-cleaning threads and replaceable spring assembly.',
    price: 29.50,
    originalPrice: 34.00,
    stock: 22,
    minStockAlert: 6,
    unit: 'piece',
    isFeatured: false,
    isActive: true,
    rating: 4.8,
    reviewsCount: 35,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    specifications: { 'Overall Length': '350 mm (14 Inch)', 'Max Pipe Capacity': '50 mm (2 Inch)', 'Jaw Material': 'Induction Hardened Alloy Steel', 'Handle Material': 'Malleable Cast Iron' },
    createdAt: new Date('2026-01-25').toISOString(),
  },
  {
    id: 'prod-9',
    name: 'Godrej Ultra Tribolt High-Security Rim Door Lock',
    slug: 'godrej-ultra-tribolt-rim-lock',
    category: 'Hardware',
    categoryId: 'cat-hard',
    sku: 'GOD-LCK-TRI01',
    description: 'Triple-deadbolt reinforced rim lock with brass cylinder and computer-dimpled non-duplicable keys. High resistance against crowbar attacks and drilling.',
    price: 49.00,
    originalPrice: 55.00,
    stock: 16,
    minStockAlert: 5,
    unit: 'set',
    isFeatured: true,
    isActive: true,
    rating: 4.8,
    reviewsCount: 43,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    specifications: { 'Lock Type': 'Surface Rim Deadbolt', 'Bolts': '3 Solid Brass Bolts', 'Finish': 'Satin Nickel / Matt', 'Door Thickness': '30 - 60 mm', 'Keys Provided': '4 Computer Dimple Keys' },
    createdAt: new Date('2026-01-28').toISOString(),
  },
  {
    id: 'prod-10',
    name: 'Legrand Arteor 6-Module Modular Switch Plate with Sockets',
    slug: 'legrand-arteor-6m-plate-sockets',
    category: 'Electrical Accessories',
    categoryId: 'cat-elec-acc',
    sku: 'LEG-ART-6M',
    description: 'High-gloss white poly-carbonate modular wall plate equipped with two 16A universal shuttered sockets and dual indicator rocker switches.',
    price: 19.90,
    originalPrice: 23.00,
    stock: 50,
    minStockAlert: 12,
    unit: 'set',
    isFeatured: false,
    isActive: true,
    rating: 4.7,
    reviewsCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80',
    specifications: { 'Modules': '6 Module Horizontal', 'Plate Material': 'Flame-Retardant Polycarbonate', 'Sockets': '2 x 6/16A Combined Universal', 'Safety': 'Child-Safe Safety Shutters' },
    createdAt: new Date('2026-02-01').toISOString(),
  },
  {
    id: 'prod-11',
    name: 'Professional Grade Teflon PTFE Thread Seal Tape (Box of 10)',
    slug: 'teflon-ptfe-thread-seal-tape-10pk',
    category: 'Plumbing Accessories',
    categoryId: 'cat-plumb-acc',
    sku: 'TEF-TAPE-10BX',
    description: 'Heavy density 0.1mm PTFE sealing tape for threaded pipe joints. Provides clean, watertight lubrication resistant to chemical corrosion and extreme temperatures.',
    price: 8.50,
    originalPrice: 10.00,
    stock: 120,
    minStockAlert: 25,
    unit: 'box (10 rolls)',
    isFeatured: false,
    isActive: true,
    rating: 4.9,
    reviewsCount: 88,
    imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80',
    specifications: { 'Width': '19 mm', 'Length Per Roll': '15 Meters', 'Thickness': '0.1 mm Heavy Density', 'Temperature Range': '-190°C to +260°C' },
    createdAt: new Date('2026-02-05').toISOString(),
  },
  {
    id: 'prod-12',
    name: 'Taparia 8-Piece Insulated Electrician Screwdriver Set',
    slug: 'taparia-8pc-insulated-screwdriver-set',
    category: 'Tools',
    categoryId: 'cat-tools',
    sku: 'TAP-SD-8PC',
    description: 'VDE certified 1000V AC insulated ergonomic screwdrivers with magnetic black-oxide tips. Includes flathead, phillips, and neon voltage testing probe.',
    price: 22.50,
    originalPrice: 26.00,
    stock: 31,
    minStockAlert: 8,
    unit: 'set',
    isFeatured: false,
    isActive: true,
    rating: 4.8,
    reviewsCount: 49,
    imageUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=600&q=80',
    specifications: { 'Insulation Rating': '1000V AC / 1500V DC', 'Certifications': 'IEC 60900 / VDE GS', 'Shaft Material': 'Chrome Vanadium Molybdenum Steel', 'Tester': '100 - 500V Line Detector' },
    createdAt: new Date('2026-02-10').toISOString(),
  },
  {
    id: 'prod-13',
    name: 'Polycab 25mm Heavy Duty PVC Flexible Corrugated Conduit (50m)',
    slug: 'polycab-25mm-pvc-conduit-50m',
    category: 'Electrical Accessories',
    categoryId: 'cat-elec-acc',
    sku: 'POL-CON-25MM-50M',
    description: 'High impact and compression resistant corrugated conduit coil designed for embedded ceiling slabs and concealed hollow brick wall routing.',
    price: 32.00,
    originalPrice: 38.00,
    stock: 40,
    minStockAlert: 10,
    unit: 'roll (50m)',
    isFeatured: false,
    isActive: true,
    rating: 4.6,
    reviewsCount: 19,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    specifications: { 'Outer Diameter': '25 mm', 'Length': '50 Meters', 'Color': 'Industrial Grey', 'Flame Retardant': 'Self-extinguishing UL94-V0' },
    createdAt: new Date('2026-02-12').toISOString(),
  },
  {
    id: 'prod-14',
    name: 'Galvanized Grade 8.8 Structural Hex Bolts & Nuts Assortment (150pcs)',
    slug: 'hex-bolts-nuts-assortment-150pcs',
    category: 'Hardware',
    categoryId: 'cat-hard',
    sku: 'FAS-HEX-150KIT',
    description: 'Hot-dip galvanized high-tensile steel metric bolt kit (M6, M8, M10) complete with matching spring washers and nylon locking nuts in a heavy compartment case.',
    price: 27.00,
    originalPrice: 31.00,
    stock: 25,
    minStockAlert: 5,
    unit: 'box (150pcs)',
    isFeatured: false,
    isActive: true,
    rating: 4.7,
    reviewsCount: 31,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    specifications: { 'Grade': '8.8 High Tensile', 'Coating': 'Hot Dip Galvanized Zinc', 'Sizes Included': 'M6x20, M6x40, M8x30, M8x50, M10x40, M10x60', 'Pieces': '150 Total' },
    createdAt: new Date('2026-02-14').toISOString(),
  },
  {
    id: 'prod-15',
    name: 'Industrial High-Bond Silicone Waterproof Sealant (Clear 300ml)',
    slug: 'industrial-silicone-sealant-clear-300ml',
    category: 'Plumbing Accessories',
    categoryId: 'cat-plumb-acc',
    sku: 'SEA-SIL-300CLR',
    description: '100% neutral cure silicone sealant with anti-fungal mildew inhibitors. Perfect for sealing sink basins, granite countertops, commode flanges, and glass panels.',
    price: 6.90,
    originalPrice: 8.50,
    stock: 95,
    minStockAlert: 20,
    unit: 'cartridge (300ml)',
    isFeatured: false,
    isActive: true,
    rating: 4.8,
    reviewsCount: 57,
    imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80',
    specifications: { 'Volume': '300 ml Cartridge', 'Color': 'Crystal Clear', 'Skin Over Time': '10 - 15 mins', 'Cure Type': 'Neutral RTV Silicone', 'Mildew Resistance': 'Class A Anti-mold' },
    createdAt: new Date('2026-02-18').toISOString(),
  },
];

const initialTechnicians: Technician[] = [
  {
    id: 'tech-1',
    name: 'Ramesh Shrestha',
    trade: 'Electrical',
    phone: '+977 984-1234567',
    email: 'ramesh.shrestha@subbhabihani.com',
    experienceYears: 12,
    status: 'AVAILABLE',
    rating: 4.9,
    completedJobs: 142,
  },
  {
    id: 'tech-2',
    name: 'Bikash Thapa',
    trade: 'Plumbing',
    phone: '+977 985-2345678',
    email: 'bikash.thapa@subbhabihani.com',
    experienceYears: 9,
    status: 'BUSY',
    rating: 4.8,
    completedJobs: 98,
  },
  {
    id: 'tech-3',
    name: 'Sunita Gurung',
    trade: 'Electrical',
    phone: '+977 986-3456789',
    email: 'sunita.gurung@subbhabihani.com',
    experienceYears: 6,
    status: 'AVAILABLE',
    rating: 4.9,
    completedJobs: 76,
  },
  {
    id: 'tech-4',
    name: 'Anil Maharjan',
    trade: 'Plumbing',
    phone: '+977 981-4567890',
    email: 'anil.maharjan@subbhabihani.com',
    experienceYears: 10,
    status: 'AVAILABLE',
    rating: 4.7,
    completedJobs: 115,
  },
  {
    id: 'tech-5',
    name: 'Deepak Rai',
    trade: 'Multi-craft',
    phone: '+977 980-5678901',
    email: 'deepak.rai@subbhabihani.com',
    experienceYears: 8,
    status: 'OFFLINE',
    rating: 4.6,
    completedJobs: 64,
  },
];

const initialUsers: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Bikram Subbha (Admin)',
    email: 'admin@subbhabihani.com',
    role: 'SUPER_ADMIN',
    phone: '+977 980-1112233',
    address: 'Subbha Bihani Commercial Complex, Main Road, Biratnagar',
    createdAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'usr-cust-1',
    name: 'Pooja Karki',
    email: 'customer@gmail.com',
    role: 'USER',
    phone: '+977 984-9988776',
    address: 'House #42, Baneshwor Heights, Kathmandu',
    createdAt: new Date('2026-01-15').toISOString(),
  },
  {
    id: 'usr-cust-2',
    name: 'Nabin Adhikari',
    email: 'nabin.adhikari@gmail.com',
    role: 'USER',
    phone: '+977 981-2233445',
    address: 'Sector 4, Lakeside, Pokhara',
    createdAt: new Date('2026-02-01').toISOString(),
  },
];

const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'SBS-ORD-1001',
    customerId: 'usr-cust-1',
    customerName: 'Pooja Karki',
    customerEmail: 'customer@gmail.com',
    customerPhone: '+977 984-9988776',
    deliveryAddress: 'House #42, Baneshwor Heights, Kathmandu',
    city: 'Kathmandu',
    items: [
      {
        productId: 'prod-1',
        productName: 'Schneider Electric Acti9 32A Double Pole MCB',
        sku: 'SCH-MCB-32DP',
        price: 24.50,
        quantity: 2,
        total: 49.00,
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
      },
      {
        productId: 'prod-3',
        productName: 'Philips 18W Slim Recessed LED Panel Light',
        sku: 'PHI-LED-18W-CDL',
        price: 14.20,
        quantity: 4,
        total: 56.80,
        imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
      },
    ],
    subtotal: 105.80,
    tax: 13.75,
    shipping: 5.00,
    totalAmount: 124.55,
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED' as any,
    notes: 'Please call before delivery',
    createdAt: new Date('2026-02-25T10:30:00Z').toISOString(),
    updatedAt: new Date('2026-02-26T14:20:00Z').toISOString(),
  },
  {
    id: 'ord-1002',
    orderNumber: 'SBS-ORD-1002',
    customerId: 'usr-cust-2',
    customerName: 'Nabin Adhikari',
    customerEmail: 'nabin.adhikari@gmail.com',
    customerPhone: '+977 981-2233445',
    deliveryAddress: 'Sector 4, Lakeside, Pokhara',
    city: 'Pokhara',
    items: [
      {
        productId: 'prod-5',
        productName: 'Jaquar Queen Monobloc Chrome Basin Mixer Tap',
        sku: 'JAQ-MIX-Q01',
        price: 62.50,
        quantity: 1,
        total: 62.50,
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      },
      {
        productId: 'prod-11',
        productName: 'Professional Grade Teflon PTFE Thread Seal Tape (Box of 10)',
        sku: 'TEF-TAPE-10BX',
        price: 8.50,
        quantity: 2,
        total: 17.00,
        imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80',
      },
    ],
    subtotal: 79.50,
    tax: 10.33,
    shipping: 5.00,
    totalAmount: 94.83,
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'PAID',
    orderStatus: 'PROCESSING',
    notes: 'Fragile packing requested',
    createdAt: new Date('2026-03-01T08:15:00Z').toISOString(),
    updatedAt: new Date('2026-03-01T09:00:00Z').toISOString(),
  },
  {
    id: 'ord-1003',
    orderNumber: 'SBS-ORD-1003',
    customerId: 'usr-cust-1',
    customerName: 'Pooja Karki',
    customerEmail: 'customer@gmail.com',
    customerPhone: '+977 984-9988776',
    deliveryAddress: 'House #42, Baneshwor Heights, Kathmandu',
    city: 'Kathmandu',
    items: [
      {
        productId: 'prod-7',
        productName: 'Bosch GSB 500W Professional Impact Drill Kit',
        sku: 'BOS-GSB-500KIT',
        price: 89.00,
        quantity: 1,
        total: 89.00,
        imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
      },
    ],
    subtotal: 89.00,
    tax: 11.57,
    shipping: 0.00,
    totalAmount: 100.57,
    paymentMethod: 'DIGITAL_WALLET',
    paymentStatus: 'PAID',
    orderStatus: 'PENDING',
    notes: 'Store pickup requested if possible',
    createdAt: new Date('2026-03-02T11:45:00Z').toISOString(),
    updatedAt: new Date('2026-03-02T11:45:00Z').toISOString(),
  },
];

const initialServiceRequests: ServiceRequest[] = [
  {
    id: 'req-2001',
    ticketNumber: 'SBS-SRV-2001',
    customerId: 'usr-cust-1',
    customerName: 'Pooja Karki',
    customerPhone: '+977 984-9988776',
    customerEmail: 'customer@gmail.com',
    serviceId: 'srv-plumb-3',
    serviceName: 'Water Leakage & Seepage Repair',
    category: 'Plumbing',
    description: 'Noticeable water dampness behind master bathroom shared wall with living room. Water meter needle rotates even when all taps are closed.',
    address: 'House #42, Baneshwor Heights, Kathmandu',
    city: 'Kathmandu',
    preferredDate: '2026-03-05',
    preferredTimeSlot: '10:00 AM - 1:00 PM',
    status: 'TECHNICIAN_ASSIGNED',
    technicianId: 'tech-2',
    technicianName: 'Bikash Thapa',
    technicianPhone: '+977 985-2345678',
    estimatedCost: 65,
    adminNotes: 'Acoustic leak detector equipment needed. Technician dispatched for Thursday inspection.',
    createdAt: new Date('2026-02-28T09:10:00Z').toISOString(),
    updatedAt: new Date('2026-02-28T10:30:00Z').toISOString(),
  },
  {
    id: 'req-2002',
    ticketNumber: 'SBS-SRV-2002',
    customerId: 'usr-cust-2',
    customerName: 'Nabin Adhikari',
    customerPhone: '+977 981-2233445',
    customerEmail: 'nabin.adhikari@gmail.com',
    serviceId: 'srv-elec-1',
    serviceName: 'Electrical Installation',
    category: 'Electrical',
    description: 'Upgrading main breaker board from 16A single phase to 32A three-phase distribution box with surge protection for commercial bakery ovens.',
    address: 'Sector 4, Lakeside Commercial Lane, Pokhara',
    city: 'Pokhara',
    preferredDate: '2026-03-08',
    preferredTimeSlot: '2:00 PM - 5:00 PM',
    status: 'ACCEPTED',
    technicianId: 'tech-1',
    technicianName: 'Ramesh Shrestha',
    technicianPhone: '+977 984-1234567',
    estimatedCost: 120,
    adminNotes: 'Assigned to senior electrician Ramesh. Verified 3-phase meter approval with electricity board.',
    createdAt: new Date('2026-03-01T14:20:00Z').toISOString(),
    updatedAt: new Date('2026-03-01T15:00:00Z').toISOString(),
  },
  {
    id: 'req-2003',
    ticketNumber: 'SBS-SRV-2003',
    customerId: 'usr-cust-1',
    customerName: 'Pooja Karki',
    customerPhone: '+977 984-9988776',
    customerEmail: 'customer@gmail.com',
    serviceId: 'srv-elec-5',
    serviceName: 'Fan & Lighting Installation',
    category: 'Electrical',
    description: 'Mounting 3 new high-speed ceiling fans and 6 recessed warm LED downlights in remodeled dining hall.',
    address: 'House #42, Baneshwor Heights, Kathmandu',
    city: 'Kathmandu',
    preferredDate: '2026-03-10',
    preferredTimeSlot: '9:00 AM - 12:00 PM',
    status: 'PENDING',
    adminNotes: 'Awaiting customer confirmation on ceiling height scaffolding availability.',
    createdAt: new Date('2026-03-02T16:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-02T16:00:00Z').toISOString(),
  },
];

const initialAuditLogs: AuditLog[] = [
  {
    id: 'aud-1',
    userId: 'usr-admin-1',
    userName: 'Bikram Subbha (Admin)',
    action: 'UPDATE_STOCK',
    entity: 'Product',
    entityId: 'prod-1',
    details: 'Restocked Schneider Electric 32A MCB by +20 units',
    timestamp: new Date('2026-02-20T11:00:00Z').toISOString(),
  },
  {
    id: 'aud-2',
    userId: 'usr-admin-1',
    userName: 'Bikram Subbha (Admin)',
    action: 'ASSIGN_TECHNICIAN',
    entity: 'ServiceRequest',
    entityId: 'req-2001',
    details: 'Assigned technician Bikash Thapa to water leakage repair ticket',
    timestamp: new Date('2026-02-28T10:30:00Z').toISOString(),
  },
  {
    id: 'aud-3',
    userId: 'usr-admin-1',
    userName: 'Bikram Subbha (Admin)',
    action: 'ORDER_STATUS_UPDATE',
    entity: 'Order',
    entityId: 'ord-1001',
    details: 'Changed status of order SBS-ORD-1001 to COMPLETED',
    timestamp: new Date('2026-02-26T14:20:00Z').toISOString(),
  },
];

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.warn('Could not read existing database file, initializing defaults:', err);
    }

    const defaultData: DatabaseSchema = {
      categories: initialCategories,
      products: initialProducts,
      services: initialServices,
      serviceRequests: initialServiceRequests,
      technicians: initialTechnicians,
      orders: initialOrders,
      users: initialUsers,
      auditLogs: initialAuditLogs,
    };
    this.persist(defaultData);
    return defaultData;
  }

  private persist(dataToSave: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public save() {
    this.persist(this.data);
  }

  // Categories
  public getCategories(): Category[] {
    return this.data.categories;
  }

  // Products
  public getProducts(options?: { category?: string; search?: string; featured?: boolean }): Product[] {
    let list = this.data.products.filter((p) => p.isActive);
    const targetCat = options?.category;
    if (targetCat && targetCat !== 'all') {
      const lowerCat = targetCat.toLowerCase();
      list = list.filter((p) => p.categoryId === targetCat || p.category.toLowerCase() === lowerCat);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (options?.featured) {
      list = list.filter((p) => p.isFeatured);
    }
    return list;
  }

  public getAllProductsAdmin(): Product[] {
    return this.data.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  public createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.products.unshift(newProduct);
    this.logAudit('usr-admin-1', 'Bikram Subbha (Admin)', 'CREATE_PRODUCT', 'Product', newProduct.id, `Created product ${newProduct.name} (${newProduct.sku})`);
    this.save();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = { ...this.data.products[index], ...updates };
    this.logAudit('usr-admin-1', 'Bikram Subbha (Admin)', 'UPDATE_PRODUCT', 'Product', id, `Updated product details for ${this.data.products[index].name}`);
    this.save();
    return this.data.products[index];
  }

  public deleteProduct(id: string, softDelete = true): boolean {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    const name = this.data.products[index].name;
    if (softDelete) {
      this.data.products[index].isActive = false;
      this.logAudit('usr-admin-1', 'Bikram Subbha (Admin)', 'ARCHIVE_PRODUCT', 'Product', id, `Soft-deleted/archived product ${name}`);
    } else {
      this.data.products.splice(index, 1);
      this.logAudit('usr-admin-1', 'Bikram Subbha (Admin)', 'DELETE_PRODUCT', 'Product', id, `Permanently deleted product ${name}`);
    }
    this.save();
    return true;
  }

  // Services
  public getServices(category?: string): ServiceItem[] {
    if (category && category !== 'all') {
      return this.data.services.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }
    return this.data.services;
  }

  // Service Requests
  public getServiceRequests(userId?: string): ServiceRequest[] {
    if (userId) {
      return this.data.serviceRequests.filter((r) => r.customerId === userId);
    }
    return this.data.serviceRequests;
  }

  public getServiceRequestById(id: string): ServiceRequest | undefined {
    return this.data.serviceRequests.find((r) => r.id === id || r.ticketNumber === id);
  }

  public createServiceRequest(requestData: Omit<ServiceRequest, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'status'>): ServiceRequest {
    const count = this.data.serviceRequests.length + 1;
    const newReq: ServiceRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      ticketNumber: `SBS-SRV-${2000 + count}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.serviceRequests.unshift(newReq);
    this.logAudit(requestData.customerId || 'anon', requestData.customerName, 'CREATE_SERVICE_REQUEST', 'ServiceRequest', newReq.id, `Submitted request ${newReq.ticketNumber} for ${newReq.serviceName}`);
    this.save();
    return newReq;
  }

  public updateServiceRequest(id: string, updates: Partial<ServiceRequest>): ServiceRequest | null {
    const index = this.data.serviceRequests.findIndex((r) => r.id === id);
    if (index === -1) return null;
    this.data.serviceRequests[index] = {
      ...this.data.serviceRequests[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.logAudit('usr-admin-1', 'Bikram Subbha (Admin)', 'UPDATE_SERVICE_REQUEST', 'ServiceRequest', id, `Updated service request ${this.data.serviceRequests[index].ticketNumber}`);
    this.save();
    return this.data.serviceRequests[index];
  }

  // Technicians
  public getTechnicians(): Technician[] {
    return this.data.technicians;
  }

  public updateTechnicianStatus(id: string, status: Technician['status']): Technician | null {
    const tech = this.data.technicians.find((t) => t.id === id);
    if (!tech) return null;
    tech.status = status;
    this.save();
    return tech;
  }

  // Orders
  public getOrders(userId?: string): Order[] {
    if (userId) {
      return this.data.orders.filter((o) => o.customerId === userId);
    }
    return this.data.orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'orderStatus'>): Order {
    const count = this.data.orders.length + 1;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `SBS-ORD-${1000 + count}`,
      orderStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Deduct stock
    for (const item of newOrder.items) {
      const prod = this.data.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }
    this.data.orders.unshift(newOrder);
    this.logAudit(orderData.customerId || 'anon', orderData.customerName, 'CREATE_ORDER', 'Order', newOrder.id, `Created order ${newOrder.orderNumber} ($${newOrder.totalAmount.toFixed(2)})`);
    this.save();
    return newOrder;
  }

  public updateOrderStatus(id: string, status: Order['orderStatus']): Order | null {
    const index = this.data.orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    this.data.orders[index].orderStatus = status;
    this.data.orders[index].updatedAt = new Date().toISOString();
    this.logAudit('usr-admin-1', 'Bikram Subbha (Admin)', 'UPDATE_ORDER_STATUS', 'Order', id, `Updated order status to ${status}`);
    this.save();
    return this.data.orders[index];
  }

  // Users & Auth
  public getUsers(): User[] {
    return this.data.users;
  }

  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(userData: { name: string; email: string; phone?: string; address?: string; role?: User['role'] }): User {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'USER',
      phone: userData.phone,
      address: userData.address,
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs.slice(0, 50);
  }

  public logAudit(userId: string, userName: string, action: string, entity: string, entityId: string, details: string) {
    const log: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      userName,
      action,
      entity,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 200);
    }
  }

  // Stats
  public getAdminStats(): AdminStats {
    const totalCustomers = this.data.users.filter((u) => u.role === 'USER').length;
    const totalProducts = this.data.products.filter((p) => p.isActive).length;
    const totalOrders = this.data.orders.length;
    const pendingOrders = this.data.orders.filter((o) => o.orderStatus === 'PENDING' || o.orderStatus === 'PROCESSING').length;
    const activeServiceRequests = this.data.serviceRequests.filter((r) => r.status !== 'COMPLETED' && r.status !== 'CANCELLED').length;
    const totalRevenue = this.data.orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.totalAmount : 0), 0);
    const lowStockCount = this.data.products.filter((p) => p.isActive && p.stock <= p.minStockAlert).length;
    const availableTechnicians = this.data.technicians.filter((t) => t.status === 'AVAILABLE').length;

    return {
      totalCustomers,
      totalProducts,
      totalOrders,
      pendingOrders,
      activeServiceRequests,
      totalRevenue,
      lowStockCount,
      availableTechnicians,
    };
  }
}

export const db = new DatabaseManager();
