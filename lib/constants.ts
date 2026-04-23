import type { CategorySlug } from "@/types/product";

export const brand = {
  name: "El Closet de Aleja",
  phrase: "Moda que vende estilo",
  supportLine: "Moda que vende estilo: ropa femenina, juvenil y cómoda",
  heroBadge: "Nueva colección disponible",
  heroTitle: "Descubre tu mejor versión con El Closet de Aleja",
  heroDescription:
    "Encuentra prendas femeninas, modernas y llenas de estilo para que te sientas segura, hermosa y lista para destacar en cualquier ocasión. Aquí no solo compras ropa: transformas tu look con piezas que enamoran a primera vista.",
  city: "Pijao,Quindio",
  instagramUrl: "https://www.instagram.com/closetdealeja?igsh=MW16cmF0dDd3em54aA==",
};

export const navLinks = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#coleccion", label: "Colección" },
  { href: "/promociones", label: "Promociones" },
  { href: "/#por-que", label: "¿Por qué comprar aquí?" },
  { href: "/#contacto", label: "Contacto" },
];

export const categoryArtwork: Record<CategorySlug, string> = {
  sacos:
    "linear-gradient(180deg, rgba(85, 62, 79, 0.08), rgba(85, 62, 79, 0.08)), url('/images/categories/sacos.png') center/cover",
  "crop-tops":
    "linear-gradient(180deg, rgba(85, 62, 79, 0.08), rgba(85, 62, 79, 0.08)), url('/images/categories/croptops.png') center/cover",
  jean:
    "linear-gradient(180deg, rgba(85, 62, 79, 0.08), rgba(85, 62, 79, 0.08)), url('/images/categories/jean.png') center/cover",
  deportivo:
    "linear-gradient(180deg, rgba(85, 62, 79, 0.08), rgba(85, 62, 79, 0.08)), url('/images/categories/deportivo.png') center/cover",
};

export const whyBuyItems = [
  {
    title: "Calidad que enamora",
    description:
      "Prendas hermosas, cuidadas y seleccionadas para que cada compra se sienta especial.",
  },
  {
    title: "Asesoría personalizada",
    description:
      "Te ayudamos a elegir prendas según tu estilo, ocasión y lo que más te favorece.",
  },
  {
    title: "Compra consciente",
    description:
      "Compras de forma consciente y amigable con el planeta al dar una nueva vida a prendas únicas.",
  },
  {
    title: "Ahorras",
    description: "Encuentras prendas hermosas a precios que valen la pena.",
  },
];
