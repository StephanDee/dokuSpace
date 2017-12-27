
/**
 * This class represents a profile of a user.
 */
export class Profile {

  // Role Attributes
  public static readonly ROLE_STUDENT = 'Student';
  public static readonly ROLE_TEACHER = 'Teacher';
  public static readonly ROLE_ADMIN = 'Admin';

  // Default PhotoURL
  public static readonly DEFAULT_PHOTOURL = 'https://firebasestorage.googleapis.com/v0/b/dokuspace-67e76.appspot.com/o/defaultprofile_430x300.jpg?alt=media&token=a06a7924-cca4-4995-bee5-c8be08aa3815';

  // Attributes
  public name: string;
  public email: string;
  public emailVerified: boolean;
  public role: string; // ['student', 'teacher', 'admin']
  // public accountKey: string;

  // User Image
  public photoURL: string;

  /**
   *
   * @param {string} name
   * @param {string} email
   * @param {boolean} emailVerified
   * @param {string} role
   * @param {string} photoURL
   */
  constructor(name: string = null,
              email: string = null,
              emailVerified: boolean = null,
              role: string = null,
              photoURL: string = null) {
    this.name = name;
    this.email = email;
    this.emailVerified = emailVerified;
    this.role = role;
    this.photoURL = photoURL;
    // this.accountKey = accountKey;
  }

}
