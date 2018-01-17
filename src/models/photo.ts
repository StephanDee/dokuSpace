/**
 * This class represents a Photo of a User.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
export class Photo {

  // Attributes

  // User Image
  public photoId: string;
  public photoName: string;
  public photoURL: string;

  // thumbnail
  public thumbPhotoURL: string;

  /**
   * The Constructor of Photos.
   *
   * @param {string} photoId The Photo ID, unique Reference to the Photo
   * @param {string} photoName The Photo Name, File Name
   * @param {string} photoURL The Photo URL, Reference to the File
   * @param {string} thumbPhotoURL, The Photo Thumbnail Photo URL, Reference to the Thumbnail of the File
   */
  constructor(photoId: string = null,
              photoName: string = null,
              photoURL: string = null,
              thumbPhotoURL: string = null) {
    this.photoId = photoId;
    this.photoName = photoName;
    this.photoURL = photoURL;
    this.thumbPhotoURL = thumbPhotoURL;
  }

}
