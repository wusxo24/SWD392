export interface Child {
  _id: string;
  memberID: number;
  fname: string;
  lname: string;
  birthdate?: string;
  gender: "male" | "female" | "other";
  picture: string;
  bloodType: "A" | "B" | "AB" | "O";
  allergies: string[];
  notes: string;
}
