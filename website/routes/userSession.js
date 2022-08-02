class UserSession {
  constructor () {
    this.started = false;
    this.resourceId = null;
    this.resourceName = null;
    this.starts = null;
    this.ends = null;
    this.userEmail = null;
    this.userName = null;
  }
}

module.exports = UserSession;
