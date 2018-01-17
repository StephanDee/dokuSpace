/**
 * This class represents a Company Account.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
export class Account {

  // Attributes
  public key: string;
  public name: string;

  // Logo Image
  public logoId: string;
  public logoName: string;
  public logoUrl: string;

  /**
   * The Constructor of Accounts.
   *
   * @param {string} key The Account Key of a Company
   * @param {string} name The Account Name of a Company
   * @param {string} logoId The Account Logo ID, the unique Reference of the Logo File
   * @param {string} logoName The Account Logo Name, File Name
   * @param {string} logoUrl The Account Logo Url, Reference to the Logo File
   */
  public constructor(key: string = null,
                     name: string = null,
                     logoId: string = null,
                     logoName: string = null,
                     logoUrl: string = null) {
    this.key = key;
    this.name = name;
    this.logoId = logoId;
    this.logoName = logoName;
    this. logoUrl = logoUrl;
  }

}
