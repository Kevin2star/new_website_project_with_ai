// 제품 표준 스펙 필드 정의
// 원본 사이트의 제품 정보 표를 기반으로 정의

export interface StandardSpecification {
  label: string;
  key: string;
  unit: string;
  placeholder?: string;
  description?: string;
}

export const STANDARD_SPECIFICATIONS: StandardSpecification[] = [
  {
    label: "Bulk Density",
    key: "bulk_density",
    unit: "g/cm³",
    description: "밀도",
  },
  {
    label: "Bending Strength",
    key: "bending_strength",
    unit: "MPa",
    description: "굴곡강도",
  },
  {
    label: "Tensile Strength",
    key: "tensile_strength",
    unit: "MPa",
    description: "인장강도",
  },
  {
    label: "Specific Resistance",
    key: "specific_resistance",
    unit: "μΩ-m",
    description: "고유저항",
  },
  {
    label: "Shore Hardness",
    key: "shore_hardness",
    unit: "",
    description: "경도",
  },
  {
    label: "Coefficient of Thermal Expansion",
    key: "thermal_expansion",
    unit: "x10⁻⁶/k",
    description: "열팽창계수",
  },
  {
    label: "Thermal Conductivity",
    key: "thermal_conductivity",
    unit: "W/m·K",
    description: "열전도율",
  },
  {
    label: "Ash",
    key: "ash",
    unit: "%",
    description: "탄분",
  },
  {
    label: "Maximum Grain Size",
    key: "max_grain_size",
    unit: "mm",
    description: "입자크기",
  },
];

// Molded/Extruded 제품용 추가 스펙 (필요시)
export const ADDITIONAL_SPECIFICATIONS: StandardSpecification[] = [
  {
    label: "Porosity",
    key: "porosity",
    unit: "%",
    description: "기공률",
  },
  {
    label: "Flexural Strength",
    key: "flexural_strength",
    unit: "MPa",
    description: "굴곡강도",
  },
  {
    label: "Max Temperature",
    key: "max_temperature",
    unit: "°C",
    description: "최대 온도",
  },
];
