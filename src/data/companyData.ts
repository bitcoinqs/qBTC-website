import dnaImage from '../assets/dna.jpg';
export type Company = {
  name: string;
  logo: string;
  website: string;
};





export const investors: Company[] = [
  {
    name: "Sequoia Capital",
    logo: dnaImage,
    website: "#"
  },
  {
    name: "Andreessen Horowitz",
    logo: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=200&h=100&fit=crop&q=80",
    website: "#"
  },
  {
    name: "Paradigm",
    logo: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=200&h=100&fit=crop&q=80",
    website: "#"
  },
  {
    name: "Polychain Capital",
    logo: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=200&h=100&fit=crop&q=80",
    website: "#"
  }
];

export const partners: Company[] = [
];