
/**
 * This class represents a profile of a user.
 */
export class Profile {

  // Role Attribute Values
  public static readonly ROLE_STUDENT = 'Student';
  public static readonly ROLE_TEACHER = 'Teacher';

  // Default PhotoURL
  public static readonly DEFAULT_PHOTOURL = 'https://firebasestorage.googleapis.com/v0/b/dokuspace-67e76.appspot.com/o/defaultprofile_430x300.jpg?alt=media&token=a06a7924-cca4-4995-bee5-c8be08aa3815';

  // Attributes
  public name: string;
  public email: string;
  public emailVerified: boolean;
  public superAdmin: boolean;
  public role: string;

  // User Image
  public photoId: string;
  public photoName: string;
  public photoURL: string;

  // Company admin
  // public admin: boolean;
  // Company Key
  // public accountKey: string;

  $key?: string;

  /**
   *
   * @param {string} name
   * @param {string} email
   * @param {boolean} emailVerified
   * @param {boolean} superAdmin
   * @param {string} role
   * @param {string} photoId
   * @param {string} photoName
   * @param {string} photoURL
   */
  constructor(name: string = null,
              email: string = null,
              emailVerified: boolean = null,
              superAdmin: boolean = null,
              role: string = null,
              photoId: string = null,
              photoName: string = null,
              photoURL: string = null) {
    this.name = name;
    this.email = email;
    this.emailVerified = emailVerified;
    this.superAdmin = superAdmin;
    this.role = role;
    this.photoId = photoId;
    this.photoName = photoName;
    this.photoURL = photoURL;
  }

}
