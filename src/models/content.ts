/**
 * This class represents a content.
 */
export class Content {

  // Attributes
  public contentId: string;
  public title: string;
  public description: string;

  // Video File
  public videoId: string;
  public videoName: string;
  public videoUrl: string;

  // PDF File
  public pdfId: string;
  public pdfName: string;
  public pdfUrl: string;

  // optional Attributes (the ? defines that the Attribute is optional.)
  // to get the DatabaseReference of .child(`/contents/${courseId}`);.
  public $key?: string;

  /**
   *
   * @param {string} contentId
   * @param {string} title
   * @param {string} description
   * @param {string} videoId
   * @param {string} videoName
   * @param {string} videoUrl
   * @param {string} pdfId
   * @param {string} pdfName
   * @param {string} pdfUrl
   */
  public constructor(contentId: string = null,
                     title: string = null,
                     description: string = null,
                     videoId: string = null,
                     videoName: string = null,
                     videoUrl: string = null,
                     pdfId: string = null,
                     pdfName: string = null,
                     pdfUrl: string = null) {
    this.contentId = contentId;
    this.title = title;
    this.description = description;
    this.videoId = videoId;
    this.videoName = videoName;
    this.videoUrl = videoUrl;
    this.pdfId = pdfId;
    this.pdfName = pdfName;
    this.pdfUrl = pdfUrl;
  }

}
