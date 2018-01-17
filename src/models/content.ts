/**
 * This class represents a content.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
export class Content {

  // Attributes
  public contentId: string;
  public title: string;
  public description: string;

  public creatorUid: string;

  // Video File
  public videoId: string;
  public videoName: string;
  public videoUrl: string;

  // PDF File
  // public pdfId: string;
  // public pdfName: string;
  // public pdfUrl: string;

  // optional Attributes (the ? defines that the Attribute is optional.)
  // to get the DatabaseReference of .child(`/contents/${courseId}`);.
  public $key?: string;

  /**
   *
   * @param {string} contentId
   * @param {string} title
   * @param {string} description
   * @param {string} creatorUid
   * @param {string} videoId
   * @param {string} videoName
   * @param {string} videoUrl
   */
  public constructor(contentId: string = null,
                     title: string = null,
                     description: string = null,
                     creatorUid: string = null,
                     videoId: string = null,
                     videoName: string = null,
                     videoUrl: string = null) {
    this.contentId = contentId;
    this.title = title;
    this.description = description;
    this.creatorUid = creatorUid;
    this.videoId = videoId;
    this.videoName = videoName;
    this.videoUrl = videoUrl;
  }

}
