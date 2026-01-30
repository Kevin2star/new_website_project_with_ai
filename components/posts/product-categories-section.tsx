import { CategoryCard } from "./category-card";

const productTypes = [
  {
    href: "/products",
    title: "Molded Products",
    description:
      "상형 제품 - 고온 소성 공정을 통해 제조된 카본/그래파이트 제품으로 다양한 산업 분야에 활용됩니다.",
  },
  {
    href: "/products",
    title: "Extruded Products",
    description:
      "압출 제품 - 압출 공정을 통해 제조된 카본/그래파이트 제품으로 일정한 단면 형상을 가집니다.",
  },
  {
    href: "/products",
    title: "CIP (Isotropic)",
    description:
      "등방성 제품 - Cold Isostatic Pressing 공정을 통해 제조된 균일한 밀도 분포를 가진 고품질 제품입니다.",
  },
];

export function ProductCategoriesSection() {
  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Product Types
          </h2>
          <p className="mt-3 text-muted-foreground">
            제조 방식에 따른 다양한 카본/그래파이트 제품
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {productTypes.map((type) => (
            <CategoryCard
              key={type.title}
              href={type.href}
              title={type.title}
              description={type.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
