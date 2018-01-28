/**
 * This class represents a Course.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */

export class Course {

  // Attributes
  public courseId: string;
  public title: string;
  public description: string;

  public creatorName: string;
  public creatorUid: string;
  public creatorPhotoURL: string;
  public thumbCreatorPhotoURL: string;

  // Title Image
  public titleImageId: string;
  public titleImageName: string;
  public titleImageUrl: string;

  // thumbnail
  public thumbTitleImageUrl: string;

  // For users who choose this course to their favourites.
  // public favouriteId: string;
  // public favouriteUserId: string;

  // added for dummy purposes
  public favourite: boolean;

  // Company Key
  // public accountKey: string;

  // optional Attributes (the ? defines that the Attribute is optional.)
  // to get the DatabaseReference of .child(`/courses/${courseId}`);.
  public $key?: string;

  /**
   * The Constructor of Courses.
   *
   * @param {string} courseId The Course ID, unique Reference
   * @param {string} title The Course Title
   * @param {string} description The Course Description
   * @param {string} creatorName The Course Creator Name
   * @param {string} creatorUid The Course CreatorUid, unique Reference
   * @param {string} creatorPhotoURL The Course Creator Photo URL, Reference to the File
   * @param {string} thumbCreatorPhotoURL The Course Thumbnail Photo URL, Reference to the thumbnail File
   * @param {string} titleImageId The Course Title Image ID, unique Reference of the File
   * @param {string} titleImageName The Course Title Image Name, File Name
   * @param {string} titleImageUrl The Course Title Image URL, Reference to the File
   * @param {string} thumbTitleImageUrl The Course Thumbnail Title Image URL, Regerence to the Thumbnail File
   * @param {boolean} favourite The Favourite Course.
   */
  public constructor(courseId: string = null,
                     title: string = null,
                     description: string = null,
                     creatorName: string = null,
                     creatorUid: string = null,
                     creatorPhotoURL: string = null,
                     thumbCreatorPhotoURL: string = null,
                     titleImageId: string = null,
                     titleImageName: string = null,
                     titleImageUrl: string = null,
                     thumbTitleImageUrl: string = null,
                     favourite: boolean = null) {
    this.courseId = courseId;
    this.title = title;
    this.description = description;
    this.creatorName = creatorName;
    this.creatorUid = creatorUid;
    this.creatorPhotoURL = creatorPhotoURL;
    this.thumbCreatorPhotoURL = thumbCreatorPhotoURL;
    this.titleImageId = titleImageId;
    this.titleImageName = titleImageName;
    this.titleImageUrl = titleImageUrl;
    this.thumbTitleImageUrl = thumbTitleImageUrl;
    this.favourite = favourite;
  }

}
