export type ProductCategory = "Carbon" | "Graphite";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  summary: string;
  description: string;
  specifications: {
    label: string;
    value: string;
  }[];
  applications: string[];
}

export const products: Product[] = [
  {
    id: "carbon-block-cb100",
    name: "Carbon Block CB-100",
    category: "Carbon",
    summary:
      "High-density carbon block for industrial furnace applications with excellent thermal stability.",
    description:
      "The Carbon Block CB-100 is a premium-grade carbon material designed for demanding industrial furnace applications. Manufactured using advanced isostatic pressing technology, this product offers exceptional thermal stability up to 3000°C in non-oxidizing environments. Its uniform density distribution ensures consistent performance across the entire block, making it ideal for applications where dimensional accuracy and reliability are critical.",
    specifications: [
      { label: "Density", value: "1.75 g/cm³" },
      { label: "Porosity", value: "12%" },
      { label: "Flexural Strength", value: "45 MPa" },
      { label: "Thermal Conductivity", value: "120 W/m·K" },
      { label: "Max Temperature", value: "3000°C (inert)" },
    ],
    applications: [
      "Industrial furnace linings",
      "Semiconductor processing equipment",
      "Heat treatment fixtures",
      "Metal casting molds",
    ],
  },
  {
    id: "graphite-electrode-ge200",
    name: "Graphite Electrode GE-200",
    category: "Graphite",
    summary:
      "Ultra-high power graphite electrode for electric arc furnace steelmaking.",
    description:
      "The Graphite Electrode GE-200 is engineered for ultra-high power (UHP) electric arc furnace operations. Made from premium petroleum needle coke and coal tar pitch, this electrode delivers superior electrical conductivity and thermal shock resistance. The advanced graphitization process ensures consistent quality and extended service life, reducing electrode consumption and operational costs.",
    specifications: [
      { label: "Diameter Range", value: "350-700 mm" },
      { label: "Electrical Resistivity", value: "4.5-5.5 μΩ·m" },
      { label: "Bulk Density", value: "1.65-1.72 g/cm³" },
      { label: "Flexural Strength", value: "≥10 MPa" },
      { label: "CTE", value: "1.2-1.4 × 10⁻⁶/°C" },
    ],
    applications: [
      "Electric arc furnace steelmaking",
      "Ladle furnace refining",
      "Submerged arc furnaces",
      "Specialty alloy production",
    ],
  },
  {
    id: "carbon-brush-br50",
    name: "Carbon Brush BR-50",
    category: "Carbon",
    summary:
      "Precision-grade carbon brush for industrial motors and generators.",
    description:
      "The Carbon Brush BR-50 series offers exceptional commutation performance for industrial motors and generators. Manufactured from electrographite materials, these brushes provide low contact drop, minimal sparking, and extended commutator life. Available in various grades to match specific motor requirements and operating conditions.",
    specifications: [
      { label: "Material", value: "Electrographite" },
      { label: "Hardness", value: "40-50 Shore" },
      { label: "Current Density", value: "10-15 A/cm²" },
      { label: "Contact Drop", value: "1.5-2.0 V" },
      { label: "Friction Coefficient", value: "0.15-0.25" },
    ],
    applications: [
      "DC motors and generators",
      "AC slip ring motors",
      "Wind turbine generators",
      "Industrial cranes",
    ],
  },
  {
    id: "graphite-crucible-gc300",
    name: "Graphite Crucible GC-300",
    category: "Graphite",
    summary:
      "High-purity graphite crucible for precious metal melting and casting.",
    description:
      "The Graphite Crucible GC-300 is designed for melting and casting of precious metals, including gold, silver, and platinum group metals. Its high-purity graphite composition ensures minimal contamination, while the optimized wall thickness provides excellent thermal shock resistance. The smooth inner surface facilitates easy metal release and cleaning.",
    specifications: [
      { label: "Purity", value: "99.9%" },
      { label: "Capacity Range", value: "100-5000 ml" },
      { label: "Max Temperature", value: "2000°C" },
      { label: "Ash Content", value: "<0.1%" },
      { label: "Wall Thickness", value: "8-15 mm" },
    ],
    applications: [
      "Gold and silver refining",
      "Jewelry manufacturing",
      "Laboratory analysis",
      "Precious metal recovery",
    ],
  },
  {
    id: "carbon-fiber-plate-cfp400",
    name: "Carbon Fiber Plate CFP-400",
    category: "Carbon",
    summary:
      "Lightweight carbon fiber reinforced plate for structural applications.",
    description:
      "The Carbon Fiber Plate CFP-400 combines exceptional strength-to-weight ratio with dimensional stability. Manufactured using advanced autoclave curing technology, these plates offer consistent mechanical properties and excellent fatigue resistance. The surface finish options include matte, glossy, or custom textures to meet specific application requirements.",
    specifications: [
      { label: "Fiber Type", value: "T700 Carbon" },
      { label: "Resin System", value: "Epoxy" },
      { label: "Tensile Strength", value: "600 MPa" },
      { label: "Modulus", value: "70 GPa" },
      { label: "Thickness Range", value: "0.5-25 mm" },
    ],
    applications: [
      "Aerospace structures",
      "Automotive components",
      "Industrial automation",
      "Sports equipment",
    ],
  },
  {
    id: "graphite-sheet-gs500",
    name: "Flexible Graphite Sheet GS-500",
    category: "Graphite",
    summary:
      "High-temperature flexible graphite sheet for sealing and thermal management.",
    description:
      "The Flexible Graphite Sheet GS-500 is manufactured from natural flake graphite through an expansion and calendering process. This product offers excellent conformability, chemical resistance, and thermal stability. It serves as an effective sealing material for flanges, valves, and high-temperature equipment, while also providing superior thermal conductivity for heat dissipation applications.",
    specifications: [
      { label: "Carbon Content", value: "≥99%" },
      { label: "Density", value: "1.0-1.2 g/cm³" },
      { label: "Thickness Range", value: "0.25-3.0 mm" },
      { label: "Temperature Range", value: "-200 to 450°C (air)" },
      { label: "Thermal Conductivity", value: "150 W/m·K (in-plane)" },
    ],
    applications: [
      "Gasket and sealing",
      "Heat spreaders",
      "EMI shielding",
      "Fuel cell components",
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(
  category: ProductCategory
): Product[] {
  return products.filter((p) => p.category === category);
}
