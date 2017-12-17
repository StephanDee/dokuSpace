
/**
 * This class represents a profile of a user.
 */
export class Profile {

  public static readonly ROLE_STUDENT = 'Student';
  public static readonly ROLE_TEACHER = 'Teacher';
  public static readonly ROLE_ADMIN = 'Admin';

  // Attributes
  public name: string;
  public email: string;
  public emailVerified: string;
  public role: string; // ['student', 'teacher', 'admin']
  // public accountKey: string;

  // User Image
  public photoURL: string;

  /**
   *
   * @param {string} name
   * @param {string} email
   * @param {string} emailVerified
   * @param {string} role
   * @param {string} photoURL
   */
  constructor(name: string = null,
              email: string = null,
              emailVerified: string = null,
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
