/**
 * @class     Lesson
 * @classdesc This class defines the structure of a Lesson object.
 */
class Lesson {
  /**
   * @param {string}  subjectId - ID of a [Subject] object (mandatory)
   * @param {string}  week - Represents whether the lesson is on Week A or B (defaults to A)
   * @param {number}  day - Day of the lesson stored as an integer, 1: Sunday - 7: Saturday (mandatory)
   * @param {string}  starts - Time when the lesson starts (mandatory)
   * @param {string}  ends - Time when the lesson ends (mandatory)
   * @param {string}  location - Location of the lesson (mandatory)
   * @param {string}  id - Unique ID, automatically set
   */
  constructor(subjectId, week, day, starts, ends, location, id = "") {
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
