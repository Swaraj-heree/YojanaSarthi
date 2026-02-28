import { Scheme, UserProfile } from "@shared/schema";

export interface IStorage {
  getSchemes(): Promise<Scheme[]>;
  matchSchemes(profile: UserProfile): Promise<Scheme[]>;
}

export class MemStorage implements IStorage {
  private schemes: Scheme[];

  constructor() {
    this.schemes = [
      {
        id: "1",
        name: "PM-Kisan Samman Nidhi",
        description: "Financial support for landholding farmers providing 6000 INR per year.",
        occupation: "Farmer",
        incomeRange: "Low",
        category: "All",
        eligibilityCriteria: "Must be a landholding farmer with cultivable land.",
        state: "All",
        minAge: 18,
        maxAge: 100,
        maxIncome: 300000,
        requiredOccupation: "Farmer",
        benefits: ["₹6,000 per year in three installments", "Direct benefit transfer to bank accounts"],
        documents: ["Aadhar Card", "Land Ownership Papers", "Bank Account Details"],
        officialUrl: "https://pmkisan.gov.in/"
      },
      {
        id: "2",
        name: "Post Matric Scholarship",
        description: "Financial assistance for post-matriculation studies for marginalized groups.",
        occupation: "Student",
        incomeRange: "Low",
        category: "SC/ST/OBC",
        eligibilityCriteria: "Income below 2.5 LPA, studying in recognized institution.",
        state: "Maharashtra",
        minAge: 16,
        maxAge: 35,
        maxIncome: 250000,
        requiredCategory: "SC/ST/OBC",
        requiredOccupation: "Student",
        benefits: ["Maintenance allowance", "Reimbursement of non-refundable fees"],
        documents: ["Caste Certificate", "Income Certificate", "Mark sheets"],
        officialUrl: "https://mahadbt.maharashtra.gov.in/"
      },
      {
        id: "3",
        name: "Mudra Yojana",
        description: "Loans for micro-enterprises to start or expand business.",
        occupation: "Business",
        incomeRange: "Any",
        category: "All",
        eligibilityCriteria: "Must have a viable business plan.",
        state: "All",
        minAge: 18,
        maxAge: 65,
        maxIncome: 10000000,
        benefits: ["Loans up to ₹10 Lakhs", "No collateral required", "Low interest rates"],
        documents: ["Business Plan", "ID Proof", "Address Proof"],
        officialUrl: "https://www.mudra.org.in/"
      },
      {
        id: "4",
        name: "Mahatma Jyotirao Phule Jan Arogya Yojana",
        description: "Health insurance scheme providing cashless medical facilities.",
        occupation: "Any",
        incomeRange: "Low",
        category: "All",
        eligibilityCriteria: "Must hold an Annapurna, Antyodaya, or Priority Household ration card.",
        state: "Maharashtra",
        minAge: 0,
        maxAge: 100,
        maxIncome: 120000,
        benefits: ["Cashless treatment up to ₹1.5 Lakh per year", "Covers 996 medical procedures"],
        documents: ["Ration Card", "Aadhar Card"],
        officialUrl: "https://www.jeevandayee.gov.in/"
      },
      {
        id: "5",
        name: "Stand-Up India Scheme",
        description: "Facilitates bank loans to SC/ST and women entrepreneurs.",
        occupation: "Business",
        incomeRange: "Any",
        category: "SC/ST",
        eligibilityCriteria: "Must be a woman or SC/ST entrepreneur setting up a greenfield enterprise.",
        state: "All",
        minAge: 18,
        maxAge: 100,
        maxIncome: 100000000,
        requiredCategory: "SC/ST",
        benefits: ["Bank loans between ₹10 lakh and ₹1 Crore", "Refinance window through SIDBI"],
        documents: ["Project Report", "Caste Certificate", "Bank Statements"],
        officialUrl: "https://www.standupmitra.in/"
      }
    ];
  }

  async getSchemes(): Promise<Scheme[]> {
    return this.schemes;
  }

  async matchSchemes(profile: UserProfile): Promise<Scheme[]> {
    return this.schemes.filter(scheme => {
      // Basic matching logic for Phase 1
      const occMatch = scheme.occupation === "Any" || scheme.occupation.toLowerCase() === profile.occupation.toLowerCase();
      
      let incMatch = true;
      if (scheme.incomeRange === "Low" && profile.income > 300000) incMatch = false;

      const catMatch = scheme.category === "All" || scheme.category.includes(profile.category);
      const stateMatch = scheme.state === "All" || scheme.state === profile.state;

      return occMatch && incMatch && catMatch && stateMatch;
    });
  }
}

export const storage = new MemStorage();
