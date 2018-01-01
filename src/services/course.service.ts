import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable
} from 'angularfire2/database-deprecated';
import { Subscription } from 'rxjs/Subscription';
import { Course } from "../models/course";

@Injectable()
export class CourseService {

  private getCourseSubSubscription: Subscription;
  private getCoursesSubSubscription: Subscription;

  constructor(private afDb: AngularFireDatabase) {
  }

  /**
   * Get Course to display Course information.
   *
   * @param {string} courseId The Course ID.
   * @returns {FirebaseObjectObservable<Course>} The FirebaseObjectObservable of a Course.
   */
  public getCourse(courseId: string): FirebaseObjectObservable<Course> {
    return this.afDb.object(`/courses/${courseId}`) as FirebaseObjectObservable<Course>;
  }

  /**
   * Get Course Subscription to get access to Course data to work with.
   * Do not forget to unsubscribe with unsubscribeGetCourseSubscription() method.
   *
   * @param {string} courseId The Course ID.
   * @returns {Promise<Course>} The promised Course.
   */
  public getCourseSubscription(courseId: string): Promise<Course> {
    return new Promise(resolve => {
      this.getCourseSubSubscription = this.afDb.object(`/courses/${courseId}`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  /**
   * This method unsubscribe the getCourseSubscription(key).
   */
  public unsubscribeGetCourseSubscription() {
    this.getCourseSubSubscription.unsubscribe();
  }

  public getCourses(): FirebaseListObservable<any> {
    return this.afDb.list(`/courses/`) as FirebaseListObservable<any>;
  }

  public getCoursesSubscription(): Promise<any> {
    return new Promise(resolve => {
      this.getCoursesSubSubscription = this.afDb.list(`/courses/`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  public unsubscribeGetCoursesSubscription() {
    this.getCoursesSubSubscription.unsubscribe();
  }

  public createCourse(title: string, description: string, creatorName: string, creatorUid: string): Promise<void> {
    const key = this.afDb.list(`/courses`).push({}).key;
    return this.setCourse(key, title, description, creatorName, creatorUid) as Promise<void>
  }

  private setCourse(courseId: string, title: string, description: string, creatorName: string, creatorUid: string): Promise<void> {
    const course = new Course();
    course.courseId = courseId;
    course.title = title;
    course.description = description;
    course.creatorName = creatorName;
    course.creatorUid = creatorUid;
    return this.afDb.object(`/courses/${courseId}`).set(course) as Promise<void>;
  }

  public updateCourse(courseId: string, title: string, description: string, creatorName: string, creatorUid: string, titleImageName: string, titleImageUrl: string): Promise<void> {
    const course = new Course();
    course.courseId = courseId;
    course.title = title;
    course.description = description;
    course.creatorName = creatorName;
    course.creatorUid = creatorUid;
    course.titleImageName = titleImageName;
    course.titleImageUrl = titleImageUrl;
    return this.afDb.object(`/courses/${courseId}`).update(course) as Promise<void>;
  }

}
