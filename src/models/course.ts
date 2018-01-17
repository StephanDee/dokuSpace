/**
 * This class represents a course.
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
  // public favourite: boolean;

  // Company Key
  // public accountKey: string;

  // optional Attributes (the ? defines that the Attribute is optional.)
  // to get the DatabaseReference of .child(`/courses/${courseId}`);.
  public $key?: string;

  /**
   *
   * @param {string} courseId
   * @param {string} title
   * @param {string} description
   * @param {string} creatorName
   * @param {string} creatorUid
   * @param {string} creatorPhotoURL
   * @param {string} thumbCreatorPhotoURL
   * @param {string} titleImageId
   * @param {string} titleImageName
   * @param {string} titleImageUrl
   * @param {string} thumbTitleImageUrl
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
                     thumbTitleImageUrl: string = null) {
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
  }

}
