"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="w-full max-w-sm overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative h-48 bg-gradient-to-b from-amber-100 to-amber-200">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          unoptimized
          className="object-contain p-8"
        />
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-center">{product.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <CardDescription className="text-center text-sm text-muted-foreground min-h-[4rem]">
          {product.description}
        </CardDescription>
        <p className="text-center font-semibold mt-3">Price: ${product.price}</p>
      </CardContent>
      <CardFooter className="flex justify-center gap-3 pb-6">
        <Button variant="outline" size="sm">Edit</Button>
        <Button variant="destructive" size="sm">Delete</Button>
        <Button variant="secondary" size="sm">View Details</Button>
      </CardFooter>
    </Card>
  );
}