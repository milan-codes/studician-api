/**
 * @class     Exam
 * @classdesc This class defines the structure of an Exam object.
 */
class Exam {
  /**
   * @param {string}  name - Name of the exam (mandatory)
   * @param {string}  subjectId - ID of a [Subject] object (mandatory)
   * @param {Date}    dueDate - The date of the exam (mandatory)
   * @param {string}  description - A short description, notes (optional)
   * @param {Date}    reminder - Date of reminder (optional)
   * @param {string}  id - Unique ID, automatically set
   */
  constructor(name, subjectId, dueDate, description = null, reminder = null, id = "") {
    /**
     * @name  Exam#name
     * @type  {string}
     */
    this.name = name;
    /**
     * @name    Exam#subjectId
     * @type    {string}
     */
    this.subjectId = subjectId;
    /**
     * @name    Exam#dueDate
     * @type    {Date}
     */
    this.dueDate = dueDate;
    /**
     * @name    Exam#description
     * @type    {string}
     */
    this.description = description;
    /**
     * @name    Exam#reminder
     * @type    {Date}
     * @default null
     */
    this.reminder = reminder;
    /**
     * @name    Exam#id
     * @type    {string}
     * @default ""
     */
    this.id = id;
  }
}

module.exports = Exam;
