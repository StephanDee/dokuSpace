import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable
} from 'angularfire2/database-deprecated';
import { Subscription } from 'rxjs/Subscription';
import { Content } from '../models/content';
import { BasePage } from '../pages/base/base';
import { File } from '../models/file';

/**
 * This class represents the Content Service.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Injectable()
export class ContentService {

  // Attributes
  private SubscriptionGetContent: Subscription;
  private SubscriptionGetContents: Subscription;

  /**
   * The Constructor of Content Service.
   *
   * @param {AngularFireDatabase} afDb The AngularFire Database
   */
  constructor(private afDb: AngularFireDatabase) {
  }

  /**
   * Get Content to display Content information.
   *
   * @param {string} courseId The Course ID
   * @param {string} contentId The Content ID
   * @returns {FirebaseObjectObservable<Content>}
   */
  public getContent(courseId: string, contentId: string): FirebaseObjectObservable<Content> {
    return this.afDb.object(`/contents/${courseId}/${contentId}`) as FirebaseObjectObservable<Content>;
  }

  /**
   * Get Content Subscription to get access to Content data to work with.
   * Do not forget to unsubscribe with unsubscribeGetContentSubscription() method.
   *
   * @param {string} courseId The Course ID
   * @param {string} contentId The Content ID
   * @returns {Promise<Content>}
   */
  public getContentSubscription(courseId: string, contentId: string): Promise<Content> {
    return new Promise(resolve => {
      this.SubscriptionGetContent = this.afDb.object(`/contents/${courseId}/${contentId}`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  /**
   * This method unsubscribe the getContentSubscription().
   */
  public unsubscribeGetContentSubscription() {
    this.SubscriptionGetContent.unsubscribe();
  }

  /**
   * Get Contents to display Content Information.
   *
   * @param {string} courseId The Course ID
   * @returns {FirebaseListObservable<Content[]>}
   */
  public getContents(courseId: string): FirebaseListObservable<Content[]> {
    return this.afDb.list(`/contents/${courseId}/`) as FirebaseListObservable<any[]>;
  }

  /**
   * Get Contents Subscription to get access to Content data to work with.
   *
   * @param {string} courseId The Course ID
   * @returns {Promise<Content[]>}
   */
  public getContentsSubscription(courseId: string): Promise<Content[]> {
    return new Promise(resolve => {
      this.SubscriptionGetContents = this.afDb.list(`/contents/${courseId}`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  /**
   * This method unsubscribe the getContentsSubscription().
   */
  public unsubscribeGetContentsSubscription() {
    this.SubscriptionGetContents.unsubscribe();
  }

  /**
   * Creates an Content ID.
   *
   * @returns {string}
   */
  public createContentId(): string {
    return this.afDb.list(`/contents`).push({}).key as string;
  }

  /**
   * Update Content Video Name and Url.
   *
   * @param {string} courseId The Course ID
   * @param {string} contentId The Content ID
   * @param {string} videoUrl The Video Url
   * @param {string} videoName The Video Name
   * @returns {Promise<void>}
   */
  public updateContentVideoNameAndUrl(courseId: string, contentId: string, videoUrl: string, videoName: string): Promise<void> {
    if (courseId === null || contentId === null) {
      return Promise.reject(new Error('Die Kurs ID und Content ID darf nicht null sein.'));
    }
    if (!videoUrl.includes(File.DEFAULT_FILE_URL) && !videoUrl.includes(File.DEFAULT_FILE_URL_DIRECT)) {
      return Promise.reject(new Error('Daten dürfen nur auf die dokuSpace Cloud hochgeladen werden.'));
    }
    if (!videoName.includes('.mp4' || '.MP4')) {
      return Promise.reject(new Error('Daten dürfen nur im mp4 Format hochgeladen werden.'));
    }
    return this.afDb.object(`/contents/${courseId}/${contentId}/`).update({videoUrl: videoUrl, videoName: videoName}) as Promise<void>;
  }

  /**
   * Updates Content Title and Description.
   *
   * @param {string} courseId The Course ID
   * @param {string} contentId The Content ID
   * @param {string} title The Content Title
   * @param {string} description The Content Description
   * @returns {Promise<void>}
   */
  public updateContentTitleAndDescription(courseId: string, contentId: string, title: string, description: string): Promise<void> {
    if (courseId === null || contentId === null) {
      return Promise.reject(new Error('Die Kurs ID und Content ID darf nicht null sein.'));
    }
    if (title.length < 1 || title.length > 25 || !title.match(BasePage.REGEX_START_NOBLANK)) {
      return Promise.reject(new Error('Titel muss mind. 1 und max. 25 Zeichen lang und nicht leer sein.'));
    }
    if (description.length < 1 || description.length > 255 || !description.match(BasePage.REGEX_START_NOBLANK)) {
      return Promise.reject(new Error('Beschreibung muss mind. 1 und max. 255 Zeichen lang und nicht leer sein.'));
    }
    return this.afDb.object(`/contents/${courseId}/${contentId}/`).update({title, description}) as Promise<void>;
  }

  /**
   * Deletes the Content.
   *
   * @param {string} courseId The Course ID
   * @returns {Promise<void>}
   */
  public deleteContent(courseId: string): Promise<void> {
    if (courseId === null) {
      return Promise.reject(new Error('Die Kurs ID darf nicht null sein.'));
    }
    return this.afDb.object(`contents/${courseId}`).remove() as Promise<void>;
  }

  /**
   * Creates a Content.
   *
   * @param {string} authUid The AuthUid
   * @param {string} courseId The Course ID
   * @param {string} contentId The Content ID
   * @param {string} title The Content Title
   * @param {string} description The Content Description
   * @param {string} videoName The Video Name
   * @param {string} videoUrl The Video Url
   * @returns {Promise<void>}
   */
  public createContent(authUid: string, courseId: string, contentId: string, title: string, description: string, videoName: string, videoUrl: string): Promise<void> {
    if (authUid === null || courseId === null || contentId === null) {
      return Promise.reject(new Error('authUid, KursId und Titelbild dürfen nicht null sein.'));
    }
    if (title.length < 1 || title.length > 25 || !title.match(BasePage.REGEX_START_NOBLANK)) {
      return Promise.reject(new Error('Titel muss mind. 1 und max. 25 Zeichen lang und nicht leer sein.'));
    }
    if (description.length < 1 || description.length > 255 || !description.match(BasePage.REGEX_START_NOBLANK)) {
      return Promise.reject(new Error('Beschreibung muss mind. 1 und max. 255 Zeichen lang und nicht leer sein.'));
    }
    if (!videoName.includes('.mp4' || '.MP4')) {
      return Promise.reject(new Error('Daten dürfen nur im mp4 Format hochgeladen werden.'));
    }

    const videoId = this.afDb.list(`/contents`).push({}).key;
    const content = new Content();
    content.contentId = contentId;
    content.title = title;
    content.description = description;
    content.creatorUid = authUid;
    content.videoId = videoId;
    content.videoName = videoName;
    content.videoUrl = videoUrl;

    return this.afDb.object(`/contents/${courseId}/${contentId}`).set(content) as Promise<void>
  }

}
