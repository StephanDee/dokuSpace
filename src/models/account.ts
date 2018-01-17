/**
 * This class represents a company account.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
export class Account {

  // Attributes
  public key: string;
  public name: string;

  // Logo Image
  public logoName: string;
  public logoUrl: string;

  /**
   *
   * @param {string} key
   * @param {string} name
   * @param {string} logoName
   * @param {string} logoUrl
   */
  public constructor(key: string = null,
                     name: string = null,
                     logoName: string = null,
                     logoUrl: string = null) {
    this.key = key;
    this.name = name;
    this.logoName = logoName;
    this. logoUrl = logoUrl;
  }

}
