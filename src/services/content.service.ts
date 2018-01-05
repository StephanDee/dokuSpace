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

  public createContent(courseId: string, contentId: string, title: string, description: string): Promise<void> {
    const content = new Content();
    content.contentId = contentId;
    content.title = title;
    content.description = description;

    return this.afDb.object(`/contents/${courseId}/${contentId}`).set(content) as Promise<void>
  }

  public updateContentTitleAndDescription(courseId: string, contentId: string, title: string, description: string): Promise<void> {
    return this.afDb.object(`/contents/${courseId}/${contentId}/`).update({title, description}) as Promise<void>;
  }

}
