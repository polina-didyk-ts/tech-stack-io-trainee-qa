export class UserDTO {
  gender: string;
  userName: string;
  yearOfBirth: string;

  constructor(gender: string, userName: string, yearOfBirth: string) {
    this.gender = gender;
    this.userName = userName;
    this.yearOfBirth = yearOfBirth;
  }
}
