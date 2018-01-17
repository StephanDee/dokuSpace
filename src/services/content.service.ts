import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable
} from 'angularfire2/database-deprecated';
import { Subscription } from 'rxjs/Subscription';
import { Content } from '../models/content';
import { BasePage } from "../pages/base/base";
import { File } from "../models/file";

@Injectable()
export class ContentService {

  private SubscriptionGetContent: Subscription;
  private SubscriptionGetContents: Subscription;

  constructor(private afDb: AngularFireDatabase) {
  }

  /**
   * Get Content to display Content information.
   *
   * @param {string} courseId The Course ID.
   * @param {string} contentId The Content ID.
   * @returns {FirebaseObjectObservable<Content>} The FirebaseObjectObservable of a Content.
   */
  public getContent(courseId: string, contentId: string): FirebaseObjectObservable<Content> {
    return this.afDb.object(`/contents/${courseId}/${contentId}`) as FirebaseObjectObservable<Content>;
  }

  /**
   * Get Content Subscription to get access to Content data to work with.
   * Do not forget to unsubscribe with unsubscribeGetContentSubscription() method.
   *
   * @param {string} courseId The Course ID.
   * @param {string} contentId The Content ID.
   * @returns {Promise<Content>} The promised Content.
   */
  public getContentSubscription(courseId: string, contentId: string): Promise<Content> {
    return new Promise(resolve => {
      this.SubscriptionGetContent = this.afDb.object(`/contents/${courseId}/${contentId}`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  /**
   * This method unsubscribe the getContentSubscription(key).
   */
  public unsubscribeGetContentSubscription() {
    this.SubscriptionGetContent.unsubscribe();
  }

  public getContents(courseId: string): FirebaseListObservable<Content[]> {
    return this.afDb.list(`/contents/${courseId}/`) as FirebaseListObservable<any[]>;
  }

  public getContentsSubscription(courseId: string): Promise<Content[]> {
    return new Promise(resolve => {
      this.SubscriptionGetContents = this.afDb.list(`/contents/${courseId}`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  public unsubscribeGetContentsSubscription() {
    this.SubscriptionGetContents.unsubscribe();
  }

  public createContentId(): string {
    return this.afDb.list(`/contents`).push({}).key as string;
  }

  public updateContentTitleAndDescription(courseId: string, contentId: string, title: string, description: string): Promise<void> {
    if (title.length < 1 || title.length > 25 || !title.match(BasePage.REGEX_START_NOBLANK)) {
      return Promise.reject(new Error('Titel muss mind. 1 und max. 25 Zeichen lang und nicht leer sein.'));
    }
    if (description.length < 1 || description.length > 255 || !description.match(BasePage.REGEX_START_NOBLANK)) {
      return Promise.reject(new Error('Beschreibung muss mind. 1 und max. 255 Zeichen lang und nicht leer sein.'));
    }
    return this.afDb.object(`/contents/${courseId}/${contentId}/`).update({title, description}) as Promise<void>;
  }

  public deleteContent(courseId: string): Promise<void> {
    return this.afDb.object(`contents/${courseId}`).remove() as Promise<void>;
  }

  // used in file.service.ts
  public createContent(authUid: string, courseId: string, contentId: string, title: string, description: string, videoName: string, videoUrl: string): Promise<void> {
    if (courseId === null || contentId === null) {
      return Promise.reject(new Error('KursId und Titelbild dürfen nicht null sein.'));
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
