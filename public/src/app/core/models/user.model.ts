export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  /** Personal address users forward payment emails to. */
  receiptsAddress: string;
}

