/**
 * This class represents a Profile of a User.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
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

  // thumbnail
  public thumbPhotoURL: string;

  // Company admin
  // public admin: boolean;
  // Company Key
  // public accountKey: string;

  // optional Attributes (the ? defines that the Attribute is optional.)
  // to get the DatabaseReference of .child(`/courses/${courseId}`);.
  $key?: string;

  /**
   * The Constructor of Profiles.
   *
   * @param {string} name The Profile User Name
   * @param {string} email The Profile User Email, also used for authentication
   * @param {boolean} emailVerified The Profile User emailVerification, also used for authentication
   * @param {boolean} superAdmin The Profile User superAdmin, can only be changed in the Database
   * @param {string} role The Profile User Role, can only have the Values of 'Student' or 'Teacher'
   * @param {string} photoId The Profile User ID, The ID of the Image
   * @param {string} photoName The Profile User PhotoName, The Filename of the Image
   * @param {string} photoURL The Profile User PhotoURL, the File URL of the Image
   * @param {string} thumbPhotoURL The Profile User ThumbPhotoURL, the File URL of the Thumbnail
   */
  constructor(name: string = null,
              email: string = null,
              emailVerified: boolean = null,
              superAdmin: boolean = null,
              role: string = null,
              photoId: string = null,
              photoName: string = null,
              photoURL: string = null,
              thumbPhotoURL: string = null) {
    this.name = name;
    this.email = email;
    this.emailVerified = emailVerified;
    this.superAdmin = superAdmin;
    this.role = role;
    this.photoId = photoId;
    this.photoName = photoName;
    this.photoURL = photoURL;
    this.thumbPhotoURL = thumbPhotoURL;
  }

}
