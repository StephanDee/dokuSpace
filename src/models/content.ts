/**
 * This class represents a content.
 */
export class Content {

  // Attributes
  public title: string;
  public description: string;

  // Video File
  public videoName: string;
  public videoUrl: string;

  // PDF File
  public pdfName: string;
  public pdfUrl: string;

  /**
   *
   * @param {string} title
   * @param {string} description
   * @param {string} videoName
   * @param {string} videoUrl
   * @param {string} pdfName
   * @param {string} pdfUrl
   */
  public constructor(title: string = null,
                     description: string = null,
                     videoName: string = null,
                     videoUrl: string = null,
                     pdfName: string = null,
                     pdfUrl: string = null) {
    this.title = title;
    this.description = description;
    this.videoName = videoName;
    this.videoUrl = videoUrl;
    this.pdfName = pdfName;
    this.pdfUrl = pdfUrl;
  }

}
