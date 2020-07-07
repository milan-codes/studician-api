/**
 * @class     Subject
 * @classdesc This class defines the structure of a Subject object.
 */
class Subject {
  /**
   * @param {string}  name - Name of the subject (mandatory)
   * @param {string}  teacher - Name of the subject's teacher (mandatory)
   * @param {number}  colorCode - Subject will be marked with this color (mandatory)
   * @param {string}  id - Unique ID, automatically set
   */
  constructor(name, teacher, colorCode, id = "") {
    /**
     * @name  Subject#name
     * @type  {string}
     */
    this.name = name;
    /**
     * @name  Subject#teacher
     * @type  {string}
     */
    this.teacher = teacher;
    /**
     * @name  Subject#colorCode
     * @type  {number}
     */
    this.colorCode = colorCode;
    /**
     * @name    Subject#id
     * @type    {string}
     * @default ""
     */
    this.id = id;
  }
}

module.exports = Subject;
