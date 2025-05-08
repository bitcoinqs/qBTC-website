import type { TeamMember } from '../types/team';
import chris from '../assets/team/chris.jpg';
import axel from '../assets/team/axel.png';
import joe from '../assets/team/joe.png';
import rick from '../assets/team/rick.jpg';
import jameson from '../assets/team/jameson.jpg';
import gmoney from '../assets/team/gmoney.jpg';
import scott from '../assets/team/scott.jpg';
import ronit from '../assets/team/ronit.png';


export const coreTeam: TeamMember[] = [
  {
    name: "Jameson Lopp",
    role: "Technical Advisor",
    bio: "Jameson has been building multisig wallets since 2015. In addition to Casa he also founded Mensa's Bitcoin Special Interest Group, the Triangle Bitcoin & Business meetup, and several open source Bitcoin projects. He enjoys researching various aspects of the ecosystem and giving presentations about what he has learned the hard way while trying to write robust software that can withstand both adversaries and unsophisticated users.",
    image: jameson,
    linkedin: "#"
  },
   { 
    name: "Ronit Ghose",
    role: "Technical Advisor",
    bio: "Ronit runs the Future of Finance team at Citibank and prior to this, he was Citi's Global Head of Banks Research and Co-Head of Fintech Research. He is the lead author of Citi's cutting-edge GPS Fintech report series. He is also an Advisory Board member at the Centre for Financial Technology at Imperial College Business School and sits on the advisory board of various technology startups and venture capital firms in the UK, Middle East and Africa. He is based in Dubai, the UAE",
    image: ronit,
    linkedin: "https://ae.linkedin.com/in/ronit-ghose-86033610"
  },
  { 
    name: "Dr. Axel York Poschmann",
    role: "Technical Advisor",
    bio: "VP Product at PQShild the leading Post Quantum company",
    image: axel,
    linkedin: "https://www.linkedin.com/in/dr-axel-york-poschmann/"
  },
  {
    name: "Garrett aka 'GMONEY'",
    role: "Strategic Advisor",
    bio: "GMONEY Host of Rugpull Radio the largest Bitcoin podcast on Rumble is a Bitcoin Freedom Cyberpunk committed to the ideals of privacy, sovereignty, and economic freedom. A digital revolutionary advocating for the use of Bitcoin as CYBERPOWER to disrupt institutions, traditional financial systems and empower individuals.",
    image: gmoney,
    linkedin: "https://www.linkedin.com/in/garrettpaymon/"
  },{
    name: "Joe Ross",
    role: "Strategic Advisor",
    bio: "Joe Ross is a technologist and strategic advisor at the forefront of Web3 innovation. Drawing on over a decade of hands-on experience in distributed systems, cryptography, and on-chain governance, he translates deep technical insight and rigorous game-theoretic thinking into practical guidance for founders. Joe has partnered with dozens of early-stage teams, shaping token-economic frameworks, product architectures, and go-to-market strategies that scale from idea to global impact. Whether refining an incentive mechanism, stress-testing a protocol's security model, or mentoring executives on disciplined operating rhythms, Joe is known for turning complex challenges into decisive advantages, empowering ventures to build with confidence and clarity.",
    image: joe,
    linkedin: "https://www.linkedin.com/in/jross87/"
  },
  {
    name: "Rick Schlesinger",
    role: "Strategic Advisor",
    bio: "Rick is a seasoned entrepreneur, founder, investor, and strategic advisor. He has established multiple web3 technology companies, invested in numerous startups, advised over 30 web3 companies, and provided board-level strategic guidance to innovative companies in the technology and fintech sectors. Rick currently serves as Venture Partner with DNA where he spearheads transformative deal advisory for its portfolio of cutting-edge investments. With a sharp focus on AI innovation, tokenomic design, and validating/mining opportunities, Rick leads strategic initiatives that position DNA at the forefront of technological advancement and market disruption. Rick began his fulltime web3 journey by participating in the decentralized global launch of the EOS blockchain. Rick founded EOS New York in 2017, an independent validator node which would become the leading validator node on the delegated-proof-of-stake blockchain. Under Rick's leadership, EOS New York became recognized for its role in running critical technology infrastructure across North America, Europe, and Africa, as well as actively leading governance and crypto-economic initiatives across the network. Rick's team would go on to be leading validator nodes across 6 different blockchains. The business was acquired in 2020. In addition to successfully running validator nodes, Rick was the co-editor of the original Chintai whitepaper, early investor, and is an ongoing advisor. Chintai is a leader in the Real World Asset (RWA) tokenization space, offering blockchain-as-a-service solutions for regulated digital assets like real estate, funds, equities, and commodities. Chintai provides a fully compliant tokenization issuance and secondary marketplace experience bringing billions of RWA's onto the blockchain. Before Rick's entrepreneurial ventures, Rick advised Fortune 500 companies on multi-billion dollar M&A deals as a strategy consultant with global consulting firm Ernst & Young. Rick holds a Bachelor of Science in Economics and Finance from Drexel University.",
    image: rick,
    linkedin: "https://www.linkedin.com/in/rschlesinger"
  },

];

export const advisors: TeamMember[] = [
  {
    name: "Christian Papathanasiou",
    role: "Chief Scientist",
    bio: "20 years cybersecurity experience for leading worldwide companies.",
    image: chris,
    linkedin: "http://linkedin.com/in/papathanasiou"
  },
  { 
    name: "Scott Walker",
    role: "Chief Advisor",
    bio: "An Investor and Serial Entrepreneur. In 2012 he fell in love with Bitcoin. With early Investments in ETH, BTC, and dozens of successful launches Walker is one of the most experienced and successful investors in the space.",
    image: scott,
    linkedin: "https://www.linkedin.com/in/scott-walker-8128817/"
  }
  
];