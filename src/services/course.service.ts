import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable
} from 'angularfire2/database-deprecated';
import { Subscription } from 'rxjs/Subscription';
import { Course } from '../models/course';
import { File } from '../models/file';
import { BasePage } from '../pages/base/base';
import { Profile } from '../models/profile';

/**
 * This class represents the Course Service.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Injectable()
export class CourseService {

  // Attributes
  private getCourseSubSubscription: Subscription;
  private getCoursesSubSubscription: Subscription;

  /**
   * The Constructor of Course Service.
   *
   * @param {AngularFireDatabase} afDb The AngularFire Database
   */
  constructor(private afDb: AngularFireDatabase) {
  }

  /**
   * Get Course to display Course information.
   *
   * @param {string} courseId The Course ID
   * @returns {FirebaseObjectObservable<Course>}
   */
  public getCourse(courseId: string): FirebaseObjectObservable<Course> {
    return this.afDb.object(`/courses/${courseId}`) as FirebaseObjectObservable<Course>;
  }

  /**
   * Get Course Subscription to get access to Course data to work with.
   * Do not forget to unsubscribe with unsubscribeGetCourseSubscription() method.
   *
   * @param {string} courseId The Course ID
   * @returns {Promise<Course>}
   */
  public getCourseSubscription(courseId: string): Promise<Course> {
    return new Promise(resolve => {
      this.getCourseSubSubscription = this.afDb.object(`/courses/${courseId}`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  /**
   * This method unsubscribe the getCourseSubscription().
   */
  public unsubscribeGetCourseSubscription() {
    this.getCourseSubSubscription.unsubscribe();
  }

  /**
   * Get Courses to display Course information.
   *
   * @returns {FirebaseListObservable<Course[]>}
   */
  public getCourses(): FirebaseListObservable<Course[]> {
    return this.afDb.list(`/courses/`) as FirebaseListObservable<any[]>;
  }

  /**
   * Get My Courses to display Course information.
   *
   * @param {string} authUid The authenticated User ID
   * @returns {FirebaseListObservable<Course[]>}
   */
  public getMyCourses(authUid: string): FirebaseListObservable<Course[]> {
    return this.afDb.list(`/courses/`, {
      query: {
        orderByChild: 'creatorUid',
        equalTo: authUid
      }
    }) as FirebaseListObservable<any[]>;
  }

  /**
   * Get Courses Subscription to get access to Course data to work with.
   * Do not forget to unsubscribe with unsubscribeGetCourseSubscription() method.
   *
   * @returns {Promise<Course[]>}
   */
  public getCoursesSubscription(): Promise<Course[]> {
    return new Promise(resolve => {
      this.getCoursesSubSubscription = this.afDb.list(`/courses/`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  /**
   * This method unsubscribe the getCoursesSubscription().
   */
  public unsubscribeGetCoursesSubscription() {
    this.getCoursesSubSubscription.unsubscribe();
  }

  /**
   * Creates a Course ID.
   *
   * @returns {string}
   */
  public createCourseId(): string {
    return this.afDb.list(`/courses`).push({}).key as string;
  }

  /**
   * Set Course Creator Name.
   *
   * @param {string} courseId The Course ID
   * @param {string} creatorName The Creator Name
   * @returns {Promise<void>}
   */
  public setCourseCreatorName(courseId: string, creatorName: string): Promise<void> {
    if (courseId === null) {
      return Promise.reject(new Error('Die Course ID darf nicht null sein.'));
    }
    if (creatorName.length < 1 || creatorName.length > 25 || !creatorName.match(BasePage.REGEX_START_NOBLANK)) {
      return Promise.reject(new Error('Name muss mind. 1 und max. 25 Zeichen lang und nicht leer sein.'));
    }
    return this.afDb.object(`/courses/${courseId}/creatorName`).set(creatorName) as Promise<void>;
  }

  /**
   * Set a Course to favourite.
   * added only for dummy purposes.
   *
   * @param {string} courseId The Course ID
   * @param {boolean} favourite The Favourite Course
   * @returns {Promise<void>}
   */
  public setFavourite(courseId: string, favourite: boolean): Promise<void> {
    if (favourite === null || courseId === null) {
      return Promise.reject(new Error('Favourite oder Course ID darf nicht null sein.'));
    }
    return this.afDb.object(`/courses/${courseId}/favourite`).set(favourite) as Promise<void>;
  }

  /**
   * Update Course Photo Url to Default.
   * Only used when photoURL is set to default -> creatorPhotoURL === thumbCreatorPhotoURL.
   *
   * @param {string} courseId The Course ID
   * @returns {Promise<void>}
   */
  public updateCoursePhotoURLToDefault(courseId: string): Promise<void> {
    const photoURL = Profile.DEFAULT_PHOTOURL;

    if (courseId === null) {
      return Promise.reject(new Error('Die Kurs ID darf nicht null sein.'));
    }
    return this.afDb.object(`/courses/${courseId}`).update({
      creatorPhotoURL: photoURL,
      thumbCreatorPhotoURL: photoURL
    }) as Promise<void>;
  }

  /**
   * Update Course Title And Description.
   *
   * @param {string} courseId The Course ID
   * @param {string} title The Course Title
   * @param {string} description The Course Decription
   * @returns {Promise<void>}
   */
  public updateCourseTitleAndDescription(courseId: string, title: string, description: string): Promise<void> {
    if (courseId === null) {
      return Promise.reject(new Error('Die Kurs ID darf nicht null sein.'));
    }
    if (title.length < 1 || title.length > 25 || !title.match(BasePage.REGEX_START_NOBLANK)) {
      return Promise.reject(new Error('Titel muss mind. 1 und max. 25 Zeichen lang und nicht leer sein.'));
    }
    if (description.length < 1 || description.length > 255 || !description.match(BasePage.REGEX_START_NOBLANK)) {
      return Promise.reject(new Error('Beschreibung muss mind. 1 und max. 255 Zeichen lang und nicht leer sein.'));
    }
    return this.afDb.object(`/courses/${courseId}/`).update({title, description}) as Promise<void>;
  }

  // used in file.service.ts
  /**
   * Create Course.
   *
   * @param {string} courseId The Course ID
   * @param {string} title The Course Title
   * @param {string} description The Description
   * @param {string} creatorName The Creator Name
   * @param {string} creatorUid The CreatorUid
   * @param {string} creatorPhotoURL The Creator Photo Url
   * @returns {Promise<void>}
   */
  public createCourse(courseId: string, title: string, description: string, creatorName: string, creatorUid: string, creatorPhotoURL: string): Promise<void> {
    if (courseId === null) {
      return Promise.reject(new Error('Die Kurs ID darf nicht null sein.'));
    }
    if (title.length < 1 || title.length > 25 || !title.match(BasePage.REGEX_START_NOBLANK)) {
      return Promise.reject(new Error('Titel muss mind. 1 und max. 25 Zeichen lang und nicht leer sein.'));
    }
    if (description.length < 1 || description.length > 255 || !description.match(BasePage.REGEX_START_NOBLANK)) {
      return Promise.reject(new Error('Beschreibung muss mind. 1 und max. 255 Zeichen lang und nicht leer sein.'));
    }
    if (creatorName.length < 1 || creatorName.length > 25 || !creatorName.match(BasePage.REGEX_START_NOBLANK)) {
      return Promise.reject(new Error('Name muss mind. 1 und max. 25 Zeichen lang und nicht leer sein.'));
    }
    if (!creatorPhotoURL.includes(File.DEFAULT_FILE_URL) && !creatorPhotoURL.includes(File.DEFAULT_FILE_URL_DIRECT)) {
      return Promise.reject(new Error('Daten dürfen nur auf die dokuSpace Cloud hochgeladen werden.'));
    }
    const course = new Course();
    course.courseId = courseId;
    course.title = title;
    course.description = description;
    course.creatorName = creatorName;
    course.creatorUid = creatorUid;
    course.creatorPhotoURL = creatorPhotoURL;

    return this.afDb.object(`/courses/${courseId}`).set(course) as Promise<void>;
  }

  // only used in test spec
  public deleteCourse(courseId: string): Promise<void> {
    if (courseId === null) {
      return Promise.reject(new Error('Die Kurs ID darf nicht null sein.'));
    }
    return this.afDb.list(`courses/${courseId}`).remove() as Promise<void>;
  }

  // not needed anymore, outsourced to Cloud Functions
  // public updateCreatorPhotoURL(courseId: string, creatorPhotoURL: string, thumbCreatorPhotoURL: string): Promise<void> {
  //   if (courseId === null) {
  //     return Promise.reject(new Error('Die Kurs ID darf nicht null sein.'));
  //   }
  //   if (!creatorPhotoURL.includes(File.DEFAULT_FILE_URL) && !creatorPhotoURL.includes(File.DEFAULT_FILE_URL_DIRECT)) {
  //     return Promise.reject(new Error('Daten dürfen nur auf die dokuSpace Cloud hochgeladen werden.'));
  //   }
  //   if (!thumbCreatorPhotoURL.includes(File.DEFAULT_FILE_URL) && !thumbCreatorPhotoURL.includes(File.DEFAULT_FILE_URL_DIRECT)) {
  //     return Promise.reject(new Error('Daten dürfen nur auf die dokuSpace Cloud hochgeladen werden.'));
  //   }
  //   return this.afDb.object(`/courses/${courseId}`).update({
  //     creatorPhotoURL: creatorPhotoURL,
  //     thumbCreatorPhotoURL: thumbCreatorPhotoURL
  //   }) as Promise<void>;
  // }

}
