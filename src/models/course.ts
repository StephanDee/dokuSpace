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

  // Title Image
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
   */
  public constructor(courseId: string = null,
                     title: string = null,
                     description: string = null,
                     creatorName: string = null,
                     creatorUid: string = null) {
    this.courseId = courseId;
    this.title = title;
    this.description = description;
    this.creatorName = creatorName;
    this.creatorUid = creatorUid;
  }

}
