const PasswordProtected = ({ password, enabled }: { password: string; enabled: boolean }) => {
  function setCookie(name: string, value: string, days: number) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  }

  function getCookie(name: string) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let c of ca) {
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  return enabled && getCookie('password') !== password ? (
    <div className="password-protected">
      <div className="password-protected__container">
        <h1 className="password-protected__title">Password Protected</h1>
        <p className="password-protected__description">
          This page is password protected. Please enter the password to view the page.
        </p>
        <form
          className="password-protected__form"
          onSubmit={(e) => {
            e.preventDefault();
            setCookie('password', password, 1);
            window.location.reload();
          }}
        >
          <input className="password-protected__input" type="password" placeholder="Password" />
          <button className="password-protected__button" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default PasswordProtected;
