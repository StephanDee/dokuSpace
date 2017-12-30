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

  public getCourses(): FirebaseListObservable<any> {
    return this.afDb.list(`/courses/`) as FirebaseListObservable<any>;
  }

  /**
   * Get Course to display Course information.
   *
   * @param {string} key The Course Key.
   * @returns {FirebaseObjectObservable<Course>} The FirebaseObjectObservable of a Course.
   */
  public getCourse(key: string): FirebaseObjectObservable<Course> {
    return this.afDb.object(`/courses/${key}`) as FirebaseObjectObservable<Course>;
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

  /**
   * Get Course Subscription to get access to Course data to work with.
   * Do not forget to unsubscribe with unsubscribeGetCourseSubscription() method.
   *
   * @param {string} key The Course Key.
   * @returns {Promise<Course>} The promised Course.
   */
  public getCourseSubscription(key: string): Promise<Course> {
    return new Promise(resolve => {
      this.getCourseSubSubscription = this.afDb.object(`/courses/${key}`).subscribe((data) => {
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

  public setCourse(key: string, courseTitle: string): Promise<void> {
    const course = new Course();
    course.title = courseTitle;
    return this.afDb.object(`/courses/${key}`).set(course) as Promise<void>;
  }

}
