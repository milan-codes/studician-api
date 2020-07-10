/**
 * @class     Task
 * @classdesc This class defines the structure of a Task object.
 */
class Task {
  /**
   * @param {string}  name - Name of the task
   * @param {number}  type - Type of the task, either assignment or revision
   * @param {string}  subjectId - ID of the task's subject, a [Subject] ID
   * @param {Date}    dueDate - Due date of the task
   * @param {string}  description - Description of the task (optional)
   * @param {Date}    reminder - Date of reminder (optional)
   * @param {string}  id - Unique ID, automatically set
   */
  constructor(name, type, subjectId, dueDate, description = null, reminder = null, id = '') {
    /**
     * @name    Task#name
     * @type    {string}
     */
    this.name = name;
    /**
     * @name    Task#type
     * @type    {number}
     */
    this.type = type;
    /**
     * @name    Task#subjectId
     * @type    {string}
     */
    this.subjectId = subjectId;
    /**
     * @name    Task#dueDate
     * @type    {Date}
     */
    this.dueDate = dueDate;
    /**
     * @name    Task#description
     * @type    {string}
     */
    this.description = description;
    /**
     * @name    Task#reminder
     * @type    {Date}
     * @default null
     */
    this.reminder = reminder;
    /**
     * @name    Task#id
     * @type    {string}
     * @default ""
     */
    this.id = id;
  }
}

module.exports = Task;
