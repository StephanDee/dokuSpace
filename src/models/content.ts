
/**
 * This class represents a content.
 */
export class Content {

  // Attributes
  public key: string;
  public title: string;
  public description: string;

  // Video File
  // public videoFileKey: string;

  // PDF File
  // public pdfFileKey: string;

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
