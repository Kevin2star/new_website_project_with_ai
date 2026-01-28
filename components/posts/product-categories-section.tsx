import { CategoryCard } from "./category-card";

const categories = [
  {
    href: "/products?category=Carbon",
    title: "Carbon Products",
    description:
      "High-performance carbon materials including blocks, brushes, and fiber-reinforced composites for industrial applications.",
  },
  {
    href: "/products?category=Graphite",
    title: "Graphite Products",
    description:
      "Premium graphite electrodes, crucibles, and flexible sheets for metallurgical and thermal management applications.",
  },
];

export function ProductCategoriesSection() {
  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Product Categories
          </h2>
          <p className="mt-3 text-muted-foreground">
            Industrial-grade materials for demanding applications
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.href}
              href={category.href}
              title={category.title}
              description={category.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
