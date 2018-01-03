/**
 * This class represents a course.
 */

export class Course {

  // Attributes
  public courseId: string;
  public title: string;
  public description: string;

  public creatorName: string;
  public creatorUid: string;
  public creatorPhotoURL: string;

  // Title Image
  public titleImageId: string;
  public titleImageName: string;
  public titleImageUrl: string;

  // Company Key
  // public accountKey: string;

  /**
   *
   * @param {string} courseId
   * @param {string} title
   * @param {string} description
   * @param {string} creatorName
   * @param {string} creatorUid
   * @param {string} creatorPhotoURL
   * @param {string} titleImageId
   * @param {string} titleImageName
   * @param {string} titleImageUrl
   */
  public constructor(courseId: string = null,
                     title: string = null,
                     description: string = null,
                     creatorName: string = null,
                     creatorUid: string = null,
                     creatorPhotoURL: string = null,
                     titleImageId: string = null,
                     titleImageName: string = null,
                     titleImageUrl: string = null) {
    this.courseId = courseId;
    this.title = title;
    this.description = description;
    this.creatorName = creatorName;
    this.creatorUid = creatorUid;
    this.creatorPhotoURL = creatorPhotoURL;
    this.titleImageId = titleImageId;
    this.titleImageName = titleImageName;
    this.titleImageUrl = titleImageUrl;
  }

}
