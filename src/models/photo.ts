
/**
 * This class represents a Photo of a user.
 */
export class Photo {

  // Attributes

  // User Image
  public photoId: string;
  public photoName: string;
  public photoURL: string;

  /**
   *
   * @param {string} photoId
   * @param {string} photoName
   * @param {string} photoURL
   */
  constructor(photoId: string = null,
              photoName: string = null,
              photoURL: string = null) {
    this.photoId = photoId;
    this.photoName = photoName;
    this.photoURL = photoURL;
  }

}
