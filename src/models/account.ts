
/**
 * This class represents a company account.
 */
export class Account {

  // Attributes
  public key: string;
  public title: string;

  // Logo Image
  // public logoFileKey: string;

  /**
   *
   * @param {string} title
   */
  public constructor(title: string = null) {
    this.title = title;
  }

}
