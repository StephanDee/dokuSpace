/**
 * This class represents a Content of a Course.
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
   * The Constructor of Contents.
   *
   * @param {string} contentId The Content ID, unique Reference
   * @param {string} title The Content Title
   * @param {string} description The Content Description
   * @param {string} creatorUid The Content CreatorUid, unique Reference of the Creator
   * @param {string} videoId The Content Video ID, unique Reference to the VideoFile
   * @param {string} videoName The Content Video Name, File Name
   * @param {string} videoUrl The Content Video Url, Reference to the File
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
