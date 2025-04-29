import dnaImage from '../assets/dna.jpg';
export type Company = {
  name: string;
  logo: string;
  website: string;
};


export const investors: Company[] = [
  {
    name: "DNA",
    logo: dnaImage,
    website: "https://dna.fund"
  },
];

export const partners: Company[] = [
];