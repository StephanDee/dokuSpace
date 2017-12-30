/**
 * This class represents a course.
 */
export class Course {

  // Attributes
  public title: string;
  public description: string;

  public creatorName: string;
  public creatorUid: string;

  // Title Image
  public titleImageName: string;
  public titleImageUrl: string;

  // Video File
  public videoName: string;
  public videoUrl: string;

  // Company Key
  // public accountKey: string;

  /**
   *
   * @param {string} title
   * @param {string} description
   * @param {string} creatorName
   * @param {string} creatorUid
   * @param {string} titleImageName
   * @param {string} titleImageUrl
   * @param {string} videoName
   * @param {string} videoUrl
   */
  public constructor(title: string = null,
                     description: string = null,
                     creatorName: string = null,
                     creatorUid: string = null,
                     titleImageName: string = null,
                     titleImageUrl: string = null,
                     videoName: string = null,
                     videoUrl: string = null) {
    this.title = title;
    this.description = description;
    this.creatorName = creatorName;
    this.creatorUid = creatorUid;
    this.titleImageName = titleImageName;
    this.titleImageUrl = titleImageUrl;
    this.videoName = videoName;
    this.videoUrl = videoUrl;
  }

}
