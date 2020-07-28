/**
 * @class     Lesson
 * @classdesc This class defines the structure of a Lesson object.
 */
class Lesson {
  /**
   * @param {string}  subjectId - ID of a [Subject] object
   * @param {string}  week - Represents whether the lesson is on Week A or B
   * @param {number}  day - Day of the lesson stored as an int, 1: Sun - 7: Sat
   * @param {string}  starts - Time when the lesson starts
   * @param {string}  ends - Time when the lesson ends
   * @param {string}  location - Location of the lesson
   * @param {string}  id - Unique ID, automatically set
   */
  constructor(subjectId, week, day, starts, ends, location, id = '') {
    /**
     * @name  Lesson#subjectId
     * @type  {string}
     */
    this.subjectId = subjectId;
    /**
     * @name    Lesson#week
     * @type    {string}
     */
    this.week = week;
    /**
     * @name    Lesson#day
     * @type    {number}
     */
    this.day = day;
    /**
     * @name    Lesson#starts
     * @type    {string}
     */
    this.starts = starts;
    /**
     * @name    Lesson#ends
     * @type    {string}
     */
    this.ends = ends;
    /**
     * @name    Lesson#location
     * @type    {string}
     */
    this.location = location;
    /**
     * @name    Lesson#id
     * @type    {string}
     * @default ""
     */
    this.id = id;
  }
}

module.exports = Lesson;
