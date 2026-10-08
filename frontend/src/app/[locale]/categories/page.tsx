import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import { getCategories } from "@/lib/api";

interface CategoriesPageProps {
  params: { locale: string };
}

export default async function CategoriesPage({ params: { locale } }: CategoriesPageProps) {
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const categories = await getCategories(locale);

  return (
    <>
      <Header />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-wood-walnut">
            Wood Carvo Workshop
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-wood-dark mt-2">
            {tNav("categories")}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-wood-dark/70">
            Explore our handcrafted collections organized by living spaces, from solid dining setups to master bedroom suites.
          </p>
          <div className="w-16 h-1 bg-wood-warm mx-auto mt-4 rounded-full" />
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-wood-walnut/15">
            <span className="text-4xl block mb-2">🪵</span>
            <p className="text-wood-dark/70 text-sm">No categories available at the moment.</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
