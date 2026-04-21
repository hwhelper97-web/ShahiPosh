import { notFound } from "next/navigation";
import ProductClient from "./product-client";
import prisma from "@/lib/prisma";

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) return notFound();

  return <ProductClient product={product} />;
}