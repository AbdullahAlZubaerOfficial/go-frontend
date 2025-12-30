import { AddProductDialog } from "@/components/AddProductDialog";
import { ProductCard } from "@/components/ProductCard";

async function getProducts() {
  const res = await fetch("http://localhost:8080/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function Page() {
  const products = await getProducts();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Product Management</h1>
      <AddProductDialog />

      <div className="max-w-7xl mx-auto mt-10">
        <h1 className="text-4xl font-bold text-center mb-12">
          Product Management
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
