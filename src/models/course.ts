
/**
 * This class represents a course.
 */
export class Course {

  // Attributes
  public key: string;
  public title: string;
  public description: string;

  // Title Image
  // public videoFileKey: string;

  /**
   *
   * @param {string} title
   * @param {string} description
   */
  public constructor(title: string = null,
                     description: string = null) {
    this.title = title;
    this.description = description;
  }

}
