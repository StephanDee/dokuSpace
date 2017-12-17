
/**
 * This class represents a profile of a user.
 */
export class Profile {

  public static readonly ROLE_STUDENT = 'Student';
  public static readonly ROLE_TEACHER = 'Teacher';
  public static readonly ROLE_ADMIN = 'Admin';

  // Attributes
  public key: string;
  public name: string;
  public email: string;
  public role: string; // ['student', 'teacher', 'admin']
  // public accountKey: string;

  // User Image
  // public profileFileKey: string;

  /**
   *
   * @param {string} key
   * @param {string} name
   * @param {string} email
   * @param {string} role
   */
  constructor(key: string = null,
              name: string = null,
              email: string = null,
              role: string = null) {
    this.key = key;
    this.name = name;
    this.email = email;
    this.role = role;
    // this.accountKey = accountKey;
  }

}
