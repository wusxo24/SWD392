export interface Child {
  id: number;
  memberID: number;
  fname: string;
  lname: string;
  birthDate?: Date;
  gender: "male" | "female" | "other";
  picture: string;
  bloodType: "A" | "B" | "AB" | "O";
  allergies: string[];
  notes: string;
}
